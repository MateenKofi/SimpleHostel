import { useState } from "react";
import { Staff } from "@/helper/types/types";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getHostelStaff, deleteStaff } from "@/api/staff";
import { Edit, Trash2, Eye, Shield, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CustomDataTable from "@/components/CustomDataTable";
import { handleSwalMutation } from "@/components/swal/SwalMutationHelper";
import { toast } from "sonner";
import type { ApiError } from "@/types/dtos";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableColumn } from "react-data-table-component";
import { StaffPermissionDialog } from "./StaffPermissionDialog";

const StaffTable = () => {
  const navigate = useNavigate();
  const hostelId = localStorage.getItem("hostelId") || "";
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);

  const {
    data: staffs,
    isLoading,
    isError,
    refetch: refetchStaff,
  } = useQuery({
    queryKey: ["staffs"],
    queryFn: async () => {
      const responseData = await getHostelStaff(hostelId);
      return responseData.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await deleteStaff(id);
        refetchStaff();
      } catch (error: unknown) {
        const err = error as ApiError;
        const errorMessage = err.response?.data?.message || "Failed to delete staff";
        toast.error(errorMessage);
        throw error;
      }
    },
  });

  const handleDelete = async (id: string) => {
    handleSwalMutation({
      mutation: () => deleteMutation.mutateAsync(id),
      title: "delete staff",
    });
  };

  const columns: TableColumn<Staff>[] = [
    {
      name: "Name",
      selector: (row: Staff) =>
        `${row?.user?.name}`,
      sortable: true,
    },
    {
      name: "Gender",
      selector: (row: Staff) => row?.user?.gender || "N/A",
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row: Staff) => row?.user?.phone || "N/A",
      sortable: true,
    },
    { 
      name: "Role",
      selector: (row: Staff) => row.role || "N/A",
      sortable: true,
    },
    {
      name: "Qualification",
      selector: (row: Staff) => row.qualification || "N/A",
      sortable: true,
    },
    {
      name: "Block",
      selector: (row: Staff) => row.block || "N/A",
      sortable: true,
    },
    {
      name: "Actions",
      width: "80px",
      right: true,
      cell: (row: Staff) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate(`/dashboard/staff-management/view/${row.id}`)}
            >
              <Eye className="mr-2 h-4 w-4" />
              <span>View</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate(`/dashboard/staff-management/edit/${row.id}`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedStaff(row);
                setPermissionDialogOpen(true);
              }}
            >
              <Shield className="mr-2 h-4 w-4" />
              <span>Permissions</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleDelete(row.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div>
      <CustomDataTable
        columns={columns}
        data={staffs}
        refetch={refetchStaff}
        isLoading={isLoading}
        isError={isError}
      />
      <StaffPermissionDialog
        staff={selectedStaff}
        open={permissionDialogOpen}
        onOpenChange={(open) => {
          setPermissionDialogOpen(open);
          if (!open) setSelectedStaff(null);
        }}
      />
    </div>
  );
};

export default StaffTable;
