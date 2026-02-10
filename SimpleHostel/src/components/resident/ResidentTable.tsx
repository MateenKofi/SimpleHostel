import { useMutation, useQuery } from "@tanstack/react-query"
import { getHostelResidents, deleteResident } from "@/api/residents"
import CustomDataTable from "@/components/CustomDataTable"
import type { TableColumn } from "react-data-table-component"
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
import { HousePlus, Edit, Trash2, MoreHorizontal, User, Mail, Phone, MapPin, Eye } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAddedResidentStore } from "@/stores/useAddedResidentStore"
import type { ResidentDto } from "@/types/dtos"
import type { ApiError } from "@/types/dtos"
import { useState } from "react"

const ResidentTable = () => {
  const navigate = useNavigate()
  const setResident = useAddedResidentStore((state) => state.setResident)
  const hostelId = localStorage.getItem("hostelId")

  // State for delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [residentToDelete, setResidentToDelete] = useState<ResidentDto | null>(null)

  const {
    data: residents,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["residents", hostelId],
    queryFn: async () => {
      const responseData = await getHostelResidents(hostelId!)
      return responseData?.data ?? []
    },
    enabled: !!hostelId,
  })

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

  const handleDeleteConfirm = () => {
    if (residentToDelete) {
      deleteMutation.mutate(residentToDelete.id)
    }
  }

  const handleDelete = (resident: ResidentDto) => {
    handleDeleteClick(resident)
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
        : status.toLowerCase() === "pending"
        ? "Pending"
        : status

    return <Badge variant={variant}>{label}</Badge>
  }

  const columns: TableColumn<ResidentDto>[] = [
    {
      name: "Resident",
      sortable: true,
      grow: 2,
      cell: (row) => (
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
      selector: (row) => row.studentId || "N/A",
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row) => row.user?.phone || row.phone || "N/A",
      sortable: true,
    },
    {
      name: "Room",
      sortable: true,
      cell: (row) =>
        row.room ? (
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">
              {row.room.block && `Block ${row.room.block}, `}
              {row.room.roomNumber || row.roomNumber || "N/A"}
            </span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground italic">Not assigned</span>
        ),
    },
    {
      name: "Status",
      sortable: true,
      cell: (row) => getStatusBadge(row.status),
    },
    {
      name: "Actions",
      width: "80px",
      cell: (row) => (
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
                handleDelete(row)
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
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Resident</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive "{residentToDelete?.user?.name || "this resident"}"?
              Their data will be retained but they will no longer be visible in the system.
              This action can be reversed by an administrator.
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
    </>
  )
}

export default ResidentTable
