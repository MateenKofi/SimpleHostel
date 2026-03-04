import { useMutation, useQuery } from "@tanstack/react-query"
import { getHostelResidents, deleteResident, restoreResident } from "@/api/residents"
import CustomDataTable from "@/components/CustomDataTable"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { HousePlus, Edit, Trash2, MoreHorizontal, User, MapPin, Eye, RotateCcw, CheckCircle2, Clock } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAddedResidentStore } from "@/stores/useAddedResidentStore"
import type { ResidentDto } from "@/types/dtos"
import type { ApiError } from "@/types/dtos"
import { useState, useMemo } from "react"
import { isResidentVerified, getVerificationBadge } from "@/utils"

type VerificationTab = "all" | "verified" | "unverified"

const ResidentTable = () => {
  const navigate = useNavigate()
  const setResident = useAddedResidentStore((state) => state.setResident)
  const hostelId = localStorage.getItem("hostelId")

  // State for verification tabs and dialogs
  const [activeTab, setActiveTab] = useState<VerificationTab>("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false)
  const [residentToDelete, setResidentToDelete] = useState<ResidentDto | null>(null)
  const [residentToRestore, setResidentToRestore] = useState<ResidentDto | null>(null)

  // Helper function to check if resident is deleted
  const isResidentDeleted = (resident: ResidentDto) => !!resident.deletedAt

  // Restore mutation
  const restoreMutation = useMutation({
    mutationFn: async (id: string) => {
      await restoreResident(id, hostelId!)
    },
    onSuccess: () => {
      refetch()
      setRestoreDialogOpen(false)
      setResidentToRestore(null)
    },
    onError: (err: ApiError) => {
      console.error("Failed to restore resident:", err)
    },
  })

  // Query for residents
  const {
    data: residents,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["residents", hostelId],
    queryFn: async () => {
      const responseData = await getHostelResidents(hostelId!)
      const residentsData = responseData?.data ?? []
      return residentsData
    },
    enabled: !!hostelId,
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteResident(id, hostelId!)
    },
    onSuccess: () => {
      refetch()
      setDeleteDialogOpen(false)
      setResidentToDelete(null)
    },
    onError: (err: ApiError) => {
      console.error("Failed to delete resident:", err)
    },
  })

  const handleAssignRoom = (resident: ResidentDto) => {
    setResident(resident)
    navigate("/dashboard/room-assignment")
  }

  const handleView = (resident: ResidentDto) => {
    setResident(resident)
    navigate("/dashboard/view-resident")
  }

  const handleEdit = (resident: ResidentDto) => {
    setResident(resident)
    navigate("/dashboard/edit-resident")
  }

  const handleDeleteClick = (resident: ResidentDto) => {
    setResidentToDelete(resident)
    setDeleteDialogOpen(true)
  }

  const handleRestoreClick = (resident: ResidentDto) => {
    setResidentToRestore(resident)
    setRestoreDialogOpen(true)
  }

  const handleRestoreConfirm = () => {
    if (residentToRestore) {
      restoreMutation.mutate(residentToRestore.id)
    }
  }

  const handleDeleteConfirm = () => {
    if (residentToDelete) {
      deleteMutation.mutate(residentToDelete.id)
    }
  }

  const getStatusBadge = (status: string) => {
    const variant: "default" | "secondary" | "outline" | "destructive" =
      status.toLowerCase() === "active" || status.toLowerCase() === "checked_in"
        ? "default"
        : status.toLowerCase() === "inactive" || status.toLowerCase() === "checked_out"
          ? "secondary"
          : "outline"

    const label =
      status.toLowerCase() === "active" || status.toLowerCase() === "checked_in"
        ? "Active"
        : status.toLowerCase() === "inactive" || status.toLowerCase() === "checked_out"
          ? "Inactive"
          : "Pending"

    return <Badge variant={variant}>{label}</Badge>
  }

  const columns = [
    {
      name: "Resident",
      sortable: true,
      grow: 2,
      selector: (row: ResidentDto) => row.user?.name || row.name || "N/A",
      cell: (row: ResidentDto) => (
        <div className="flex items-center gap-3 py-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            {row.user?.imageUrl ? (
              <img
                src={row.user.imageUrl}
                alt={row.user.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-primary" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground truncate">
              {row.user?.name || row.name || "N/A"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {row.user?.email || row.email || ""}
            </p>
          </div>
        </div>
      ),
    },
    {
      name: "Phone",
      selector: (row: ResidentDto) => row.user?.phone || row.phone || "N/A",
      sortable: true,
    },
    {
      name: "Room",
      sortable: true,
      selector: (row: ResidentDto) => row.room?.roomNumber || row.room?.number || row.roomNumber || "N/A",
      cell: (row: ResidentDto) =>
        row.room ? (
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">
              {row.room.block && `Block ${row.room.block}, `}
              {row.room.roomNumber || row.room.number || row.roomNumber || "N/A"}
            </span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground italic">Not assigned</span>
        ),
    },
    {
      name: "Status",
      sortable: true,
      selector: (row: ResidentDto) => row.status,
      cell: (row: ResidentDto) => getStatusBadge(row.status),
    },
    {
      name: "Verification",
      sortable: true,
      selector: (row: ResidentDto) => (isResidentVerified(row) ? "verified" : "unverified"),
      cell: (row: ResidentDto) => {
        const { variant, label } = getVerificationBadge(row)
        return (
          <div className="flex items-center gap-1.5">
            {isResidentVerified(row) ? (
              <CheckCircle2 className="w-4 h-4 text-primary" />
            ) : (
              <Clock className="w-4 h-4 text-muted-foreground" />
            )}
            <Badge variant={variant as any}>{label}</Badge>
          </div>
        )
      },
    },
    {
      name: "Actions",
      width: "80px",
      cell: (row: ResidentDto) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleView(row)}
              className="cursor-pointer"
            >
              <Eye className="w-4 h-4 mr-2" />
              View
            </DropdownMenuItem>
            {!row.roomId && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  handleAssignRoom(row)
                }}
                className="cursor-pointer"
              >
                <HousePlus className="w-4 h-4 mr-2" />
                Assign Room
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                handleEdit(row)
              }}
              className="cursor-pointer"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                handleRestoreClick(row)
              }}
              className="cursor-pointer"
              disabled={!isResidentDeleted(row)}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Restore
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteClick(row)
              }}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]


  // Filter residents based on verification status
  const filteredResidents = useMemo(() => {
    if (!residents) return []

    return residents.filter((resident: any) => {
      if (activeTab === "all") return true
      if (activeTab === "verified") return isResidentVerified(resident)
      if (activeTab === "unverified") return !isResidentVerified(resident)
      return true
    })
  }, [residents, activeTab])

  // Get counts for each tab
  const tabCounts = useMemo(() => {
    if (!residents) return { all: 0, verified: 0, unverified: 0 }
    return {
      all: residents.length,
      verified: residents.filter((r: any) => isResidentVerified(r)).length,
      unverified: residents.filter((r: any) => !isResidentVerified(r)).length,
    }
  }, [residents])

  return (
    <>
      {/* Verification Tabs */}
      <div className="mb-4">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as VerificationTab)}>
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="all" className="flex items-center gap-2">
              All Residents
              <Badge variant="secondary" className="text-xs">
                {tabCounts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="verified" className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Verified
              <Badge variant="secondary" className="text-xs">
                {tabCounts.verified}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="unverified" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Unverified
              <Badge variant="secondary" className="text-xs">
                {tabCounts.unverified}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <CustomDataTable
        title={`Resident Table - ${activeTab === "all" ? "All Residents" : activeTab === "verified" ? "Verified" : "Unverified"}`}
        columns={columns}
        data={filteredResidents}
        isLoading={isLoading}
        isError={isError}
        refetch={refetch}
        searchable
        emptyStateMessage={
          activeTab === "all"
            ? "No residents found. Add residents to get started."
            : activeTab === "verified"
              ? "No verified residents found."
              : "No unverified residents found."
        }
        exportFilename={`residents-${activeTab}.csv`}
      />

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Resident</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive "{residentToDelete?.user?.name || "this resident"}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Archiving..." : "Archive"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Restore Dialog */}
      <AlertDialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Resident</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore "{residentToRestore?.user?.name || "this resident"}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={restoreMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRestoreConfirm}
              disabled={restoreMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {restoreMutation.isPending ? "Restoring..." : "Restore"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default ResidentTable
