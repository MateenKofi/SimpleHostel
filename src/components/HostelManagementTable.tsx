import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Hostel } from "@/helper/types/types";
import { TableColumn } from "react-data-table-component";
import CustomDataTable from "./CustomDataTable";
import { Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { handleSwalMutation } from "./swal/SwalMutationHelper";

const HostelManagementTable = () => {
  const {
    data: AllHostels,
    isLoading,
    isError,
    refetch: refetchAllHostels,
  } = useQuery({
    queryKey: ["AllHostels"],
    queryFn: async () => {
      const response = await axios.get(`/api/hostels/get`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data?.data;
    },
  });

  const DeleteHostelMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await axios.delete(`/api/hostels/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Hostel deleted successfully");
        refetchAllHostels();
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error?.response?.data?.error || "Failed to delete hostel";
          toast.error(errorMessage);
        } else {
          toast.error("An unexpected error occured");
        }
      }
    },
  });

  const handleDeleteHostel = (id: string) => {
    handleSwalMutation({
      mutation: () => DeleteHostelMutation.mutateAsync(id),
      title: "delete hostel",
    });
  };

  const columns: TableColumn<Hostel>[] = [
    { name: "Hostel", selector: (row) => row.name, sortable: true, wrap: true },
    {
      name: "Location",
      cell: (row) => <span>{(row.location) || "N/A"}</span>,
    },
    { name: "Email", wrap: true, selector: (row) => row.email, sortable: true },
    { name: "Phone", selector: (row) => row.phone },
    { name: "State", selector: (row) => row.state },
    {
      name: "Action",
      center: true,
      cell: (row) => (
        <span>
          <button
            className="bg-red-500 text-white rounded-md px-2 py-1 ml-2"
            onClick={() => handleDeleteHostel(row.id)}
          >
            <Trash2 />
          </button>
        </span>
      ),
      sortable: true,
    },
  ];
  return (
    <div className="p-6 border shadow-sm rounded-md">
      <CustomDataTable
        title="Hostel Management Table"
        data={AllHostels}
        columns={columns}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
};

export default HostelManagementTable;
