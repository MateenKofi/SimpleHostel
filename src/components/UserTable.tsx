import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, deleteUser } from "@/api/users";
import { triggerUserPasswordReset, type PasswordResetMethod } from "@/api/adminPasswordReset";
import { Users } from "@/helper/types/types";
import { TableColumn } from "react-data-table-component";
import CustomDataTable from "./CustomDataTable";
import { Trash2, Key, MoreHorizontal, Link, Copy } from "lucide-react";
import { toast } from "sonner";
import { handleSwalMutation } from "./swal/SwalMutationHelper";
import { AvatarFallback, AvatarImage } from "./ui/avatar";
import { Avatar } from "@radix-ui/react-avatar";
import type { ApiError } from "@/types/dtos";
import { formatDistanceToNow, parseISO } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const UserTable = () => {
  const queryClient = useQueryClient();
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);

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
      } catch (error: unknown) {
        const err = error as ApiError;
        const errorMessage = err.response?.data?.message || "Failed to delete user";
        toast.error(errorMessage);
        throw error;
      }
    },
  });

  const ResetPasswordMutation = useMutation({
    mutationFn: async ({ userId, method }: { userId: string; method: PasswordResetMethod }) => {
      return await triggerUserPasswordReset(userId, method);
    },
    onSuccess: (_, variables) => {
      const methodText = variables.method === "reset_link" ? "reset link" : "temporary password";
      toast.success(`Password reset ${methodText} sent successfully`);
      setResetDialogOpen(false);
      setSelectedUser(null);
      queryClient.invalidateQueries({ queryKey: ["AllUsers"] });
    },
    onError: (error: unknown) => {
      const err = error as ApiError;
      const errorMessage = err.response?.data?.message || "Failed to reset password";
      toast.error(errorMessage);
    },
  });

  const handleDeleteUser = (id: string) => {
    handleSwalMutation({
      mutation: () => DeleteUserMutation.mutateAsync(id),
      title: "delete user",
    });
  };

  const handleResetPassword = (user: Users) => {
    setSelectedUser(user);
    setResetDialogOpen(true);
  };

  const handleConfirmReset = (method: PasswordResetMethod) => {
    if (selectedUser) {
      ResetPasswordMutation.mutate({ userId: selectedUser.id, method });
    }
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
      name: "Last Login",
      cell: (row) => (
        <span className="text-xs text-gray-500">
          {row.lastLoginAt
            ? formatDistanceToNow(parseISO(row.lastLoginAt), {
              addSuffix: true,
            })
            : "Never"}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Action",
      center: true,
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleResetPassword(row)}
              className="cursor-pointer"
            >
              <Key className="mr-2 h-4 w-4" />
              Reset Password
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDeleteUser(row.id)}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              {selectedUser && (
                <>
                  Choose how to reset the password for{" "}
                  <span className="font-semibold">{selectedUser.name}</span>.
                  The user will be notified via email.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {ResetPasswordMutation.isPending ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <p className="text-sm text-muted-foreground">Sending password reset...</p>
                </div>
              </div>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="h-auto py-4 justify-start text-left"
                  onClick={() => handleConfirmReset("reset_link")}
                  disabled={ResetPasswordMutation.isPending}
                >
                  <Link className="mr-3 h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Send Reset Link</div>
                    <div className="text-xs text-muted-foreground">
                      Email a secure link for the user to set a new password
                    </div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 justify-start text-left"
                  onClick={() => handleConfirmReset("temp_password")}
                  disabled={ResetPasswordMutation.isPending}
                >
                  <Copy className="mr-3 h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Generate Temporary Password</div>
                    <div className="text-xs text-muted-foreground">
                      Create a temporary password and send it via email
                    </div>
                  </div>
                </Button>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setResetDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserTable;
