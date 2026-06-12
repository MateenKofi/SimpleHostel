"use client"

import { useState, useEffect, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Loader2,
  Save,
  Shield,
  AlertCircle,
  CheckCircle2,
  X,
  User,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { getUserPermissions, assignUserPermissions } from "@/api/permissions"
import { PermissionCategory, PermissionSearch } from "@/components/permissions"
import { CATEGORIES, type PermissionCategory as PermissionCategoryType } from "@/lib/permissions"
import { PermissionsLoader } from "@/components/loaders/PermissionsLoader"

interface StaffInfo {
  id: string
  userId: string
  user?: {
    id: string
    name: string
    email: string
    role: string
  }
  role?: string | null
}

interface StaffPermissionDialogProps {
  staff: StaffInfo | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface PermissionItem {
  key: string
  label: string
  enabled: boolean
  description?: string
}

export function StaffPermissionDialog({ staff, open, onOpenChange }: StaffPermissionDialogProps) {
  const queryClient = useQueryClient()
  const [localPermissions, setLocalPermissions] = useState<Record<string, boolean>>({})
  const [hasChanges, setHasChanges] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const { data: permissions, isLoading } = useQuery({
    queryKey: ["user-permissions", staff?.userId],
    queryFn: () => getUserPermissions(staff!.userId),
    enabled: !!staff?.userId && open,
  })

  useEffect(() => {
    if (permissions) {
      setLocalPermissions(permissions as Record<string, boolean>)
      setHasChanges(false)
    }
  }, [permissions])

  const updateMutation = useMutation({
    mutationFn: (enabledPerms: string[]) =>
      assignUserPermissions(staff!.userId, enabledPerms),
    onSuccess: () => {
      toast.success("Staff permissions updated successfully")
      queryClient.invalidateQueries({ queryKey: ["user-permissions"] })
      setHasChanges(false)
      onOpenChange(false)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update permissions")
    },
  })

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setLocalPermissions((prev) => ({
      ...prev,
      [permission]: checked,
    }))
    setHasChanges(true)
  }

  const handleSelectAllInCategory = (category: string) => {
    const categoryPerms = Object.keys(localPermissions)
      .filter((p) => p.startsWith(category))

    setLocalPermissions((prev) => ({
      ...prev,
      ...categoryPerms.reduce((acc, perm) => ({ ...acc, [perm]: true }), {}),
    }))
    setHasChanges(true)
  }

  const handleClearAllInCategory = (category: string) => {
    const categoryPerms = Object.keys(localPermissions)
      .filter((p) => p.startsWith(category))

    setLocalPermissions((prev) => ({
      ...prev,
      ...categoryPerms.reduce((acc, perm) => ({ ...acc, [perm]: false }), {}),
    }))
    setHasChanges(true)
  }

  const handleSave = () => {
    const enabledPermissions = Object.entries(localPermissions)
      .filter(([, enabled]) => enabled)
      .map(([perm]) => perm)

    updateMutation.mutate(enabledPermissions)
  }

  const categories = Object.keys(CATEGORIES) as PermissionCategoryType[]

  const filteredCategories = useMemo(() => {
    return categories
      .map((category) => {
        const categoryPerms = Object.keys(localPermissions)
          .filter((p) => p.startsWith(category))
          .filter((p) => {
            if (!searchQuery) return true
            const label = p.split(".")[1].replace(/_/g, " ")
            return label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   CATEGORIES[category].label.toLowerCase().includes(searchQuery.toLowerCase())
          })
          .map((perm) => ({
            key: perm,
            label: perm.split(".")[1].replace(/_/g, " "),
            enabled: localPermissions[perm] || false,
          }))

        return {
          category,
          label: CATEGORIES[category].label,
          permissions: categoryPerms,
        }
      })
      .filter((cat) => cat.permissions.length > 0)
  }, [categories, localPermissions, searchQuery])

  const totalPermissions = Object.keys(localPermissions).length
  const enabledCount = Object.values(localPermissions).filter(Boolean).length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-forest-green-100 text-forest-green-600">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle>Staff Permissions</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <User className="w-3.5 h-3.5" />
                <span className="font-medium text-foreground">
                  {staff?.user?.name || "Unknown Staff"}
                </span>
                {staff?.role && (
                  <Badge variant="secondary" className="text-xs">
                    {staff.role}
                  </Badge>
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center py-12">
            <PermissionsLoader />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-1">
              <PermissionSearch
                onSearch={setSearchQuery}
                resultCount={filteredCategories.reduce((acc, cat) => acc + cat.permissions.length, 0)}
              />
              <div className="flex items-center gap-2 text-sm ml-4">
                <div className="flex items-center gap-1 px-3 py-1 bg-card border rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest-green-500" />
                  <span className="font-medium">{enabledCount}</span>
                  <span className="text-muted-foreground">/ {totalPermissions}</span>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => (
                    <PermissionCategory
                      key={cat.category}
                      category={cat.category}
                      label={cat.label}
                      permissions={cat.permissions}
                      onPermissionChange={handlePermissionChange}
                      onSelectAll={() => handleSelectAllInCategory(cat.category)}
                      onClearAll={() => handleClearAllInCategory(cat.category)}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No permissions found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery
                        ? "Try adjusting your search query"
                        : "No permissions available"}
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </>
        )}

        <DialogFooter className="border-t pt-4 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
