import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import CustomDataTable from "../CustomDataTable";
import { Resident } from "@/helper/types/types";
import { HousePlus, Edit, Trash2, Ellipsis } from "lucide-react";
import toast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { handleSwalMutation } from "../swal/SwalMutationHelper";
import { useNavigate } from "react-router-dom";
import { useAddedResidentStore } from "@/controllers/AddedResident";

const ResidentTable = () => {
  const navigate = useNavigate();
  const setResident = useAddedResidentStore((state) => state.setResident)
  const hostelId = localStorage.getItem("hostelId");
  const {
    data: resident,
    isLoading,
    isError,
    refetch: refetchResident,
  } = useQuery({
    queryKey: ["resident"],
    queryFn: async () => {
      const response = await axios.get(`/api/residents/hostel/${hostelId}`);
      return response?.data?.data;
    },
    enabled: !!hostelId,
  });

  const DeleteResidentMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await axios.delete(`/api/residents/delete/${id}`, {
          params: {
            hostelId: hostelId,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success("Resident deleted successfully");
        refetchResident();
        return response.data;
      } catch (error) {
        if(axios.isAxiosError(error)){
          const errorMessage =
            error?.response?.data?.error || "An unexpected error occured";
          toast.error(errorMessage);
        }
        else{
          toast.error('An unexpected error occured')
        }
      }
    },
  });

  const handleAssignRoom = (resident: Resident) => {
    setResident(resident)
    setTimeout(()=>{
      navigate('/dashboard/room-assignment')
    },50)
  };

  // Confirm and delete a room
  const handleDelete = async (id: string) => {
    handleSwalMutation({
      mutation: ()=>  DeleteResidentMutation.mutateAsync(id),
      title:'delete resident',
    })
  };

  const columns = [
    {
      name: "Name",
      selector: (row: Resident) => row.name,
      sortable: true,
    },
    {
      name: "Student ID",
      selector: (row: Resident) => row.studentId,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row: Resident) => row.phone,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row: Resident) => row.email,
      sortable: true,
      wrap: true,
    },
    {
      name: "Room",
      cell: (row: Resident) => (
        <span>{row?.room ? row.room.number : "N/A"}</span>
      ),
    },
    {
        name:'Action',
        width:'fit',
      cell: (row: Resident) => (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-0 m-0">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {!row.roomId && (
              <DropdownMenuItem>
                {" "}
                <button
                  title="Assign Room"
                  className="flex items-center w-full gap-1 p-1 text-white bg-blue-600 rounded-md hover:bg-blue-800"
                  onClick={() => handleAssignRoom(row)}
                >
                  <HousePlus className="w-4 h-4" />
                  Assign Room
                </button>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <button
                title="Edit"
                className="flex items-center w-full gap-1 p-1 text-white bg-blue-600 rounded-md  hover:bg-blue-800"
                onClick={() => console.log(`Edit resident ${row.id}`)}
              >
                <Edit className="w-4 h-4" />
                Edit 
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                title="Delete"
                className="flex items-center w-full gap-1 p-1 text-white bg-red-600 rounded-md  hover:bg-red-800"
                onClick={() => row.id !== null && handleDelete(row.id)}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div>
      <CustomDataTable
        title="Resident Table"
        columns={columns}
        data={resident || []}
        isError={isError}
        isLoading={isLoading}
        refetch={refetchResident}
      />
    </div>
  );
};

export default ResidentTable;
