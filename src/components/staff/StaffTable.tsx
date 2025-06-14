import { Staff } from "@/helper/types/types";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CustomDataTable from "../CustomDataTable";
import { handleSwalMutation } from "../swal/SwalMutationHelper";
import toast from "react-hot-toast";

const StaffTable = () => {
  const navigate = useNavigate();
  const hostelId = localStorage.getItem("hostelId") || "";

  const {
    data: staffs,
    isLoading,
    isError,
    refetch: refetchStaff,
  } = useQuery({
    queryKey: ["staffs"],
    queryFn: async () => {
      const response = await axios.get(`/api/Staffs/get/hostel/${hostelId}`);
      return response?.data.data;
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await axios.delete(`/api/Staffs/delete/${id}`);
        refetchStaff();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message || "Failed to delete user";
          toast.error(errorMessage);
        } else {
          toast.error("An unexpected error occurred");
        }
      }
    },
  });

  const handleDelete = async (id: string) => {
    handleSwalMutation({
      mutation: () => deleteMutation.mutateAsync(id),
      title: "delete staff",
    });
  };
  const columns = [
    {
      name: "Name",

      selector: (row: Staff) =>
        `${row.firstName} ${row.middleName} ${row.lastName}`,
      sortable: true,
    },
    {
      name: "Gender",
      width: "100px",
      selector: (row: Staff) => row.gender,
      sortable: true,
    },
    {
      name: "Phone",

      selector: (row: Staff) => row.phoneNumber,
      sortable: true,
    },
    {
      name: "Role",

      selector: (row: Staff) => row.role,
      sortable: true,
    },
    {
      name: "Qualification",
      selector: (row: Staff) => row.qualification,
      sortable: true,
    },
    {
      name: "Block",
      selector: (row: Staff) => row.block,
      sortable: true,
    },
    {
      name: "Actions",
      width: "100px",

      cell: (row: Staff) => (
        <div className="flex flex-col items-center justify-center my-1 space-y-1 text-nowrap">
          <button
            className="flex items-center w-full gap-2 px-2 py-1 text-white bg-black rounded-md"
            onClick={() =>
              navigate(`/dashboard/staff-management/edit/${row.id}`)
            }
          >
            <Edit size={14} />
            <span>Edit</span>
          </button>
          <button
            className="flex items-center w-full gap-2 px-2 py-1 text-white bg-red-500 rounded-md"
            onClick={() => handleDelete(row.id)}
          >
            <>
              <Trash2 size={14} />
              <span>Delete</span>
            </>
          </button>
        </div>
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
    </div>
  );
};

export default StaffTable;
