import CustomDataTable from "../CustomDataTable";
import { format } from "date-fns";
import { useQuery,useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Visitor } from "@/helper/types/types";



const VisitorHistory = () => {
  const hostelId = localStorage.getItem("hostelId") || "";

  const {
    data: visitors,
    isLoading,
    isError,
    refetch: refetchVisitors,
  } = useQuery({
    queryKey: ["visitors"],
    queryFn: async () => {
      const response = await axios.get(`/api/visitors/hostel/${hostelId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response?.data?.data;
    },
    enabled: !!hostelId,
  });

  const InactiveVisitors = visitors?.filter((active: Visitor) => {
    return active.status === 'CHECKED_OUT';
  });

  const CheckOutVisitor = useMutation({
    mutationFn: async (id: string) => {
      await axios.put(
        `/api/visitors/checkout/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      ).then((res) => {
          refetchVisitors();
          toast.success("Visitor checked out succesfully");
          return res.data;
        })
        .catch((error) => {
          const errorMessage =
            error.response?.data?.message || "Failed to check out visitor";
          toast.error(errorMessage);
        });
    },
  });

  const handleCheckOut = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to check out this visitor?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, check out",
    }).then((result) => {
      if (result.isConfirmed) {
        CheckOutVisitor.mutate(id);
      }
    });
  };

  const columns = [
    {
      name: "Visitor Name",
      selector: (row: Visitor) => row.name,
      sortable: true,
    },
    {
      name: "V Phone",
      selector: (row: Visitor) => row.phone,
    },
    {
      name:'Resident',
      selector: (row:Visitor) => row?.resident?.name ?? ""
    },
    {
      name:'R Phone',
      selector: (row:Visitor) => row?.resident?.phone ?? ""
    },
    {
      name: "Check-in Time",
      selector: (row: Visitor) =>
        row.timeOut && !isNaN(new Date(row.timeOut).getTime())
          ? format(new Date(row.timeOut), "MMM dd, yyyy HH:mm")
          : "-",
      sortable: true,
    },
    {
      name: "Status",
      cell: (row: Visitor) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.status === "ACTIVE"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {row.status === "ACTIVE" ? "Checked In" : "Checked Out"}
        </span>
      ),
    },
    {
      name: "Action",
      cell: (row: Visitor) =>
        row.status === "ACTIVE" ? (
          <button
            onClick={() => handleCheckOut(row.id)}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md"
          >
            Check Out
          </button>
        ) : null,
    },
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border">
      <CustomDataTable
        title="Visitors History Table"
        columns={columns}
        data={InactiveVisitors}
        isError={isError}
        isLoading={isLoading}
        refetch={refetchVisitors}
      />
    </div>
  );
};

export default VisitorHistory;