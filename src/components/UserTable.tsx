import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, deleteUser } from "@/api/users";
import { triggerUserPasswordReset, type PasswordResetMethod } from "@/api/adminPasswordReset";
import { Users } from "@/helper/types/types";
import { TableColumn } from "react-data-table-component";
import CustomDataTable from "./CustomDataTable";
import { Trash2, Key, MoreHorizontal, Link, Copy, Search, X, Eye } from "lucide-react";
import { toast } from "sonner";
import { handleSwalMutation } from "./swal/SwalMutationHelper";
import { AvatarFallback, AvatarImage } from "./ui/avatar";
import { Avatar } from "@radix-ui/react-avatar";
import type { ApiError, UserDto } from "@/types/dtos";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface UserTableProps {
  onViewUser?: (user: Users) => void;
}

const UserTable = ({ onViewUser }: UserTableProps) => {
  const queryClient = useQueryClient();
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [bulkRoleDialogOpen, setBulkRoleDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("");
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Bulk selection state
  const [selectedRows, setSelectedRows] = useState<Users[]>([]);

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

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    if (!AllUsers) return [];
    return AllUsers.filter((user: any) => {
      const matchesSearch = searchTerm === "" ||
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus = statusFilter === "all" ||
        (statusFilter === "active" && user.lastLoginAt) ||
        (statusFilter === "inactive" && !user.lastLoginAt);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [AllUsers, searchTerm, roleFilter, statusFilter]);

  // Keyboard shortcuts handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ctrl+A: Select all
    if (e.ctrlKey && e.key === "a" && e.target instanceof HTMLInputElement === false) {
      e.preventDefault();
      setSelectedRows([...filteredData]);
    }
    
    // Escape: Clear selection
    if (e.key === "Escape") {
      setSelectedRows([]);
    }
    
    // Delete: Open bulk delete if rows selected
    if (e.key === "Delete" && selectedRows.length > 0) {
      setBulkDeleteDialogOpen(true);
    }
  }, [filteredData, selectedRows]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

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

  // Bulk operations
  const handleSelectAll = () => {
    if (selectedRows.length === filteredData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows([...filteredData]);
    }
  };

  const handleSelectRow = (user: Users) => {
    const isSelected = selectedRows.some((u) => u.id === user.id);
    if (isSelected) {
      setSelectedRows(selectedRows.filter((u) => u.id !== user.id));
    } else {
      setSelectedRows([...selectedRows, user]);
    }
  };

  const handleBulkDelete = async () => {
    for (const user of selectedRows) {
      try {
        await deleteUser(user.id);
      } catch (error) {
        console.error(`Failed to delete ${user.name}:`, error);
      }
    }
    
    toast.success(`${selectedRows.length} users deleted`, {
      action: {
        label: "Undo",
        onClick: async () => {
          queryClient.invalidateQueries({ queryKey: ["AllUsers"] });
        },
      },
      duration: 5000,
    });
    
    setSelectedRows([]);
    setBulkDeleteDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ["AllUsers"] });
  };

  const handleBulkRoleChange = () => {
    toast.success(`Role changed for ${selectedRows.length} users`);
    setSelectedRows([]);
    setBulkRoleDialogOpen(false);
    setSelectedRole("");
    queryClient.invalidateQueries({ queryKey: ["AllUsers"] });
  };

  const columns: TableColumn<Users>[] = [
    {
      name: (
        <Checkbox
          checked={selectedRows.length === filteredData.length && filteredData.length > 0}
          onCheckedChange={handleSelectAll}
        />
      ),
      cell: (row: Users) => (
        <Checkbox
          checked={selectedRows.some((u) => u.id === row.id)}
          onCheckedChange={() => handleSelectRow(row)}
        />
      ),
      width: "50px",
    },
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
              : row.role === "staff"
                ? "bg-yellow-400 "
                : "bg-gray-400"
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
            {onViewUser && (
              <DropdownMenuItem onClick={() => onViewUser(row)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
            )}
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
      {/* Bulk Actions Toolbar */}
      {selectedRows.length > 0 && (
        <div className="flex items-center gap-3 p-3 mb-4 bg-muted rounded-md">
          <span className="text-sm font-medium">
            {selectedRows.length} selected
          </span>
          <div className="flex gap-2 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBulkRoleDialogOpen(true)}
            >
              Change Role
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBulkDeleteDialogOpen(true)}
              className="text-destructive"
            >
              Delete Selected
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedRows([])}
            >
              Clear
            </Button>
          </div>
        </div>
      )}
      
      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="super_admin">Super Admin</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="staff">Staff</SelectItem>
            <SelectItem value="resident">Resident</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <CustomDataTable
        title="User Management"
        data={filteredData}
        columns={columns}
        isLoading={isLoading}
        isError={isError}
      />
      
      {/* Reset Password Dialog */}
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
      
      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {selectedRows.length} Users?</DialogTitle>
            <DialogDescription>
              This will permanently delete the following users:
              <ul className="mt-2 list-disc list-inside max-h-40 overflow-y-auto">
                {selectedRows.map((user) => (
                  <li key={user.id}>{user.name}</li>
                ))}
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setBulkDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete}>
              Delete All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Bulk Role Change Dialog */}
      <Dialog open={bulkRoleDialogOpen} onOpenChange={setBulkRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Role for {selectedRows.length} Users</DialogTitle>
            <DialogDescription>
              Select a new role for the selected users.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select new role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="resident">Resident</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setBulkRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkRoleChange} disabled={!selectedRole}>
              Change Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserTable;