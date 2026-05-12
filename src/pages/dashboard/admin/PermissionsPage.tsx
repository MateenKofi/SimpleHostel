"use client"

import { useState, useEffect, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { 
  Loader2, 
  Save, 
  RefreshCw, 
  Shield,
  Building2,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PageHeader } from "@/components/layout/PageHeader"
import SEOHelmet from "@/components/SEOHelmet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useAuthStore } from "@/stores/useAuthStore"
import {
  getAllRolesPermissions,
  assignPermissionsToRole,
  getAvailableHostels,
} from "@/api/permissions"
import { CATEGORIES, PermissionCategory } from "@/lib/permissions"
import { PermissionRoleSelector, PermissionCategory as PermissionCategoryComponent, PermissionSearch } from "@/components/permissions"
import { PermissionsLoader } from "@/components/loaders/PermissionsLoader"

interface Hostel {
  id: string
  name: string
}

interface RolePermissions {
  [permission: string]: boolean
}

interface AllRolesPermissions {
  [role: string]: RolePermissions
}

interface PermissionItem {
  key: string
  label: string
  enabled: boolean
  description?: string
}

export default function PermissionsPage() {
  const queryClient = useQueryClient()
  const userRole = useAuthStore((state) => state.role)
  const userHostelId = useAuthStore((state) => state.hostelId)
  
  const [selectedRole, setSelectedRole] = useState<string>("staff")
  const [selectedHostelId, setSelectedHostelId] = useState<string>("")
  const [localPermissions, setLocalPermissions] = useState<AllRolesPermissions>({})
  const [hasChanges, setHasChanges] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const { data: hostels = [] } = useQuery({
    queryKey: ["available-hostels"],
    queryFn: getAvailableHostels,
    enabled: userRole === "super_admin",
  })

  const { data: permissionsData, isLoading, refetch } = useQuery({
    queryKey: ["roles-permissions", selectedHostelId, userRole],
    queryFn: () => getAllRolesPermissions(selectedHostelId || undefined),
    enabled: !!selectedHostelId || userRole === "admin",
  })

  useEffect(() => {
    if (userRole === "super_admin") {
      if (hostels.length > 0 && !selectedHostelId) {
        setSelectedHostelId(hostels[0].id)
      }
    } else if (userRole === "admin" && userHostelId) {
      setSelectedHostelId(userHostelId)
    }
  }, [userRole, userHostelId, hostels])

  useEffect(() => {
    if (permissionsData) {
      setLocalPermissions(permissionsData as AllRolesPermissions)
    }
  }, [permissionsData])

  const getAccessibleRoles = (): string[] => {
    if (userRole === "super_admin") {
      return ["super_admin", "admin", "staff", "resident"]
    }
    return ["staff", "resident"]
  }

  const accessibleRoles = getAccessibleRoles()

  useEffect(() => {
    if (accessibleRoles.length > 0 && !accessibleRoles.includes(selectedRole)) {
      setSelectedRole(accessibleRoles[0])
    }
  }, [accessibleRoles])

  const updateMutation = useMutation({
    mutationFn: ({ role, permissions }: { role: string; permissions: string[] }) =>
      assignPermissionsToRole(role, permissions, selectedHostelId || undefined),
    onSuccess: (data) => {
      toast.success(data.message || "Permissions updated successfully")
      queryClient.invalidateQueries({ queryKey: ["roles-permissions"] })
      setHasChanges(false)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update permissions")
    },
  })

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setLocalPermissions((prev) => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        [permission]: checked,
      },
    }))
    setHasChanges(true)
  }

  const handleSelectAllInCategory = (category: string) => {
    const categoryPerms = Object.keys(localPermissions[selectedRole] || {})
      .filter((p) => p.startsWith(category))
    
    setLocalPermissions((prev) => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        ...categoryPerms.reduce((acc, perm) => ({ ...acc, [perm]: true }), {})
      }
    }))
    setHasChanges(true)
  }

  const handleClearAllInCategory = (category: string) => {
    const categoryPerms = Object.keys(localPermissions[selectedRole] || {})
      .filter((p) => p.startsWith(category))
    
    setLocalPermissions((prev) => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        ...categoryPerms.reduce((acc, perm) => ({ ...acc, [perm]: false }), {})
      }
    }))
    setHasChanges(true)
  }

  const handleSave = () => {
    const enabledPermissions = Object.entries(localPermissions[selectedRole] || {})
      .filter(([, enabled]) => enabled)
      .map(([perm]) => perm)

    updateMutation.mutate({
      role: selectedRole,
      permissions: enabledPermissions,
    })
  }

  const handleReset = () => {
    refetch()
    setHasChanges(false)
    setSearchQuery("")
    toast.info("Changes reset")
  }

  const handleHostelChange = (hostelId: string) => {
    setSelectedHostelId(hostelId)
    setHasChanges(false)
    setSearchQuery("")
  }

  const getHostelName = () => {
    if (userRole === "admin") return "Your Hostel"
    const hostel = hostels.find((h: Hostel) => h.id === selectedHostelId)
    return hostel?.name || "Select Hostel"
  }

  const categories = Object.keys(CATEGORIES) as PermissionCategory[]

  const filteredCategories = useMemo(() => {
    const rolePerms = localPermissions[selectedRole] || {}
    
    return categories
      .map((category) => {
        const categoryPerms = Object.keys(rolePerms)
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
            enabled: rolePerms[perm] || false
          }))

        return {
          category,
          label: CATEGORIES[category].label,
          permissions: categoryPerms
        }
      })
      .filter((cat) => cat.permissions.length > 0)
  }, [categories, localPermissions, selectedRole, searchQuery])

  const totalPermissions = useMemo(() => {
    return Object.keys(localPermissions[selectedRole] || {}).length
  }, [localPermissions, selectedRole])

  const enabledPermissions = useMemo(() => {
    return Object.values(localPermissions[selectedRole] || {}).filter(Boolean).length
  }, [localPermissions, selectedRole])

  if (isLoading && !permissionsData) {
    return <PermissionsLoader />
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHelmet
        title="Permission Management - Fuse"
        description="Configure system permissions and role-based access control"
      />
      <PageHeader
        title="Permission Management"
        subtitle={userRole === "super_admin" 
          ? "Configure system-wide and per-hostel permissions" 
          : "Configure staff and resident permissions for your hostel"}
        icon={Shield}
        sticky={true}
        actions={
          <div className="flex gap-2">
            {hasChanges && (
              <Button variant="outline" onClick={handleReset}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            )}
            <Button onClick={handleSave} disabled={!hasChanges || updateMutation.isPending}>
              {updateMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        }
      />
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Card className="bg-gradient-to-r from-forest-green-50 to-teal-green-50 dark:from-forest-green-950/20 dark:to-teal-green-950/20 border-forest-green-200/60">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-forest-green-600" />
                  <Label className="text-sm font-medium">
                    {userRole === "super_admin" ? "Managing permissions for:" : "Managing:"}
                  </Label>
                </div>
                {userRole === "super_admin" && hostels.length > 0 ? (
                  <Select value={selectedHostelId} onValueChange={handleHostelChange}>
                    <SelectTrigger className="w-[250px] bg-white dark:bg-background">
                      <SelectValue placeholder="Select hostel" />
                    </SelectTrigger>
                    <SelectContent>
                      {hostels.map((hostel: Hostel) => (
                        <SelectItem key={hostel.id} value={hostel.id}>
                          {hostel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="font-semibold text-forest-green-700 dark:text-forest-green-300">
                    {getHostelName()}
                  </span>
                )}
                <div className="sm:ml-auto flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1 px-3 py-1 bg-white dark:bg-background rounded-full">
                    <CheckCircle2 className="w-4 h-4 text-forest-green-500" />
                    <span className="font-medium">{enabledPermissions}</span>
                    <span className="text-muted-foreground">enabled</span>
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1 bg-white dark:bg-background rounded-full">
                    <AlertCircle className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{totalPermissions - enabledPermissions}</span>
                    <span className="text-muted-foreground">disabled</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-72 lg:sticky lg:top-20 lg:h-[calc(100vh-8rem)] lg:overflow-y-auto flex-shrink-0 pb-4">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Roles</CardTitle>
                  <CardDescription className="text-xs">
                    Select a role to configure its permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PermissionRoleSelector
                    roles={accessibleRoles}
                    selectedRole={selectedRole}
                    onRoleChange={(role) => {
                      setSelectedRole(role)
                      setSearchQuery("")
                    }}
                    userRole={userRole || undefined}
                    hostelName={userRole === "admin" ? getHostelName() : undefined}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="flex-1 lg:overflow-y-auto lg:h-[calc(100vh-8rem)] space-y-6 pb-4">
              <PermissionSearch
                onSearch={setSearchQuery}
                resultCount={filteredCategories.reduce((acc, cat) => acc + cat.permissions.length, 0)}
              />

              {filteredCategories.length > 0 ? (
                <div className="space-y-4">
                  {filteredCategories.map((cat, index) => (
                    <div
                      key={cat.category}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <PermissionCategoryComponent
                        category={cat.category}
                        label={cat.label}
                        permissions={cat.permissions}
                        onPermissionChange={handlePermissionChange}
                        onSelectAll={() => handleSelectAllInCategory(cat.category)}
                        onClearAll={() => handleClearAllInCategory(cat.category)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No permissions found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery 
                      ? "Try adjusting your search query" 
                      : "No permissions available for this role"}
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}