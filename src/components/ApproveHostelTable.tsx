import React from "react";
import { TableColumn } from "react-data-table-component";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUnverifiedHostels, verifyHostel, deleteHostel } from "@/api/hostels";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { Loader } from "lucide-react";
import CustomDataTable from "@/components/CustomDataTable";
import { Hostel } from "@/helper/types/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const ApproveHostelTable = () => {
  const queryClient = useQueryClient();
  const {
    data: UnverifiedHostels,
    isLoading,
    isError,
    refetch: refetchUnverifiedHostels,
  } = useQuery<Hostel[]>({
    queryKey: ["unverifiedHostels"],
    queryFn: async () => {
      const responseData = await getUnverifiedHostels();
      return responseData?.data;
    },
  });

  const AcceptMutation = useMutation({
    mutationFn: async (hostelId: string) => {
      try {
        await verifyHostel(hostelId);
        toast.success("Hostel Approved Successfully");
        queryClient.invalidateQueries({ queryKey: ["hostels"] });
        refetchUnverifiedHostels();
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Failed to Approve Hostel";
        toast.error(errorMessage);
        throw error;
      }
    },
  });

  const DeclineMutation = useMutation({
    mutationFn: async (hostelId: string) => {
      try {
        await deleteHostel(hostelId);
        toast.success("Hostel Declined Successfully");
        queryClient.invalidateQueries({ queryKey: ["hostels"] });
        refetchUnverifiedHostels();
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Failed to Decline Hostel";
        toast.error(errorMessage);
        throw error;
      }
    },
  });

  const handleAccept = (id: string) => {
    Swal.fire({
      title: "Are you sure you want to Approve this hostel?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve it!",
    }).then((result) => {
      if (result.isConfirmed) {
        AcceptMutation.mutate(id);
      }
    });
  };

  const handleDecline = (id: string) => {
    Swal.fire({
      title: "Are you sure you want to Decline this hostel?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, decline it!",
    }).then((result) => {
      if (result.isConfirmed) {
        DeclineMutation.mutate(id);
      }
    });
  };

  const columns: TableColumn<Hostel>[] = [
    {
      name: "Name",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8 *:rounded-full">
            <AvatarImage
              src={row.logoUrl || "/placeholder.svg"}
              alt={row.name}
            />
            <AvatarFallback>
              {row.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{row.name}</div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Address",
      cell: (row) => <span>{row.address}</span>,
      sortable: true,
    },
    {
      name: "Location",
      selector: (row) => row.location,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "Email",
      cell: (row) => <span>{row.email}</span>,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex flex-col w-full gap-2 my-2 lg:flex-row">
          <button
            className="flex items-center justify-center w-full px-2 py-1 text-white bg-black rounded text-nowrap"
            onClick={() => handleAccept(row.id)}
          >
            {AcceptMutation.isPending ? (
              <Loader className="animate-spin" />
            ) : (
              "Approve"
            )}
          </button>
          <button
            className="flex items-center justify-center w-full px-2 py-1 text-white bg-red-400 rounded text-nowrap"
            onClick={() => handleDecline(row.id)}
          >
            {DeclineMutation.isPending ? (
              <Loader className="animate-spin" />
            ) : (
              "Decline"
            )}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white border rounded-lg shadow-md">
      <CustomDataTable
        columns={columns}
        data={UnverifiedHostels || []}
        title="Unverified Hostels Table"
        isError={isError}
        isLoading={isLoading}
        refetch={refetchUnverifiedHostels}
      />
    </div>
  );
};

export default ApproveHostelTable;
