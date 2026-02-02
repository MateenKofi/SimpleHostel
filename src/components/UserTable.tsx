import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getAllUsers, deleteUser } from "@/api/users";
import { Users } from "@/helper/types/types";
import { TableColumn } from "react-data-table-component";
import CustomDataTable from "./CustomDataTable";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { handleSwalMutation } from "./swal/SwalMutationHelper";
import { AvatarFallback, AvatarImage } from "./ui/avatar";
import { Avatar } from "@radix-ui/react-avatar";

const UserTable = () => {
  const {
    data: AllUsers,
    isLoading,
    isError,
    refetch: refetchAllUsers,
  } = useQuery({
    queryKey: ["AllUsers"],
    queryFn: async () => {
      return await getAllUsers();
    },
  });

  const DeleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await deleteUser(id);
        toast.success("User deleted successfully");
        refetchAllUsers();
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Failed to delete user";
        toast.error(errorMessage);
        throw error;
      }
    },
  });

  const handleDeleteUser = (id: string) => {
    handleSwalMutation({
      mutation: () => DeleteUserMutation.mutateAsync(id),
      title: "delete user",
    });
  };

  const columns: TableColumn<Users>[] = [
    {
      name: "Name",
      cell: (row) => (
        <div className="flex flex-col items-start justify-center gap-2 py-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8 *:rounded-full">
              <AvatarImage
                src={row.imageUrl || "/placeholder.svg"}
                alt={row.name}
              />
              <AvatarFallback>
                {row.name
                  ? row.name.trim().split(" ")[0][0].toUpperCase()
                  : ""}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{row.name}</div>
            </div>
          </div>
          <span className="text-xs">{row.phoneNumber}</span>
        </div>
      ),
      sortable: true,
      wrap: true,
    },
    {
      name: "Hostel",
      cell: (row) => <span>{(row.hostel && row.hostel?.name) || "N/A"}</span>,
      sortable: true,
    },
    { name: "Email", wrap: true, selector: (row) => row.email, sortable: true },

    {
      name: "Role",
      center: true,
      cell: (row) => (
        <span
          className={` rounded-md text-center text-[10px] px-2 py-1 capitalize text-white ${row.role === "super_admin"
              ? "bg-green-400 "
              : row.role === "admin"
                ? "bg-blue-400 "
                : "bg-yellow-400"
            }`}
        >
          {row.role}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Action",
      center: true,
      cell: (row) => (
        <span>
          <button
            className="px-2 py-1 ml-2 text-white bg-red-500 rounded-md"
            onClick={() => handleDeleteUser(row.id)}
          >
            <Trash2 />
          </button>
        </span>
      ),
      sortable: true,
    },
  ];
  return (
    <div className="p-6 border rounded-md shadow-sm">
      <CustomDataTable
        title="User Management"
        data={AllUsers}
        columns={columns}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
};

export default UserTable;
