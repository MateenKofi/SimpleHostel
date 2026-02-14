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
import { HousePlus, Edit, Trash2, MoreHorizontal, User, MapPin, Eye, RotateCcw } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAddedResidentStore } from "@/stores/useAddedResidentStore"
import type { ResidentDto } from "@/types/dtos"
import type { ApiError } from "@/types/dtos"
import { useState } from "react"

const ResidentTable = () => {
  const navigate = useNavigate()
  const setResident = useAddedResidentStore((state) => state.setResident)
  const hostelId = localStorage.getItem("hostelId")

  // State for dialogs
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
      console.log("Fetching residents for hostelId:", hostelId)
      const responseData = await getHostelResidents(hostelId!)
      console.log("API Response:", responseData)
      console.log("Residents data:", responseData?.data)
      const residentsData = responseData?.data ?? []
      console.log("Final residents array:", residentsData)
      console.log("Residents array length:", residentsData.length)
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
      name: "Student ID",
      selector: (row: ResidentDto) => row.studentId || "N/A",
      sortable: true,
      grow: 0,
    },
    {
      name: "Phone",
      selector: (row: ResidentDto) => row.user?.phone || row.phone || "N/A",
      sortable: true,
      grow: 0,
    },
    {
      name: "Room",
      sortable: true,
      grow: 0,
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
      grow: 0,
      selector: (row: ResidentDto) => row.status,
      cell: (row: ResidentDto) => getStatusBadge(row.status),
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

  console.log("Rendering ResidentTable with residents:", residents, "length:", residents?.length)
  return (
    <>
      <CustomDataTable
        title="Resident Table"
        columns={columns}
        data={residents || []}
        isLoading={isLoading}
        isError={isError}
        refetch={refetch}
        searchable
        emptyStateMessage="No residents found. Add residents to get started."
        exportFilename="residents.csv"
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
