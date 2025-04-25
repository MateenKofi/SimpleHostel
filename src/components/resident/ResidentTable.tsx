import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import CustomDataTable from '../CustomDataTable';
import { Resident } from '@/helper/types/types';
import { HousePlus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const ResidentTable = () => {
    const hostelId = localStorage.getItem('hostelId')
     const { data:resident, isLoading, isError,refetch:refetchResident } = useQuery({
    queryKey: ["resident"],
    queryFn: async () => {
      const response = await axios.get(`/api/residents/hostel/${hostelId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response?.data?.data;
    },
    enabled: !!hostelId
  });

    const DeleteResidentMutation = useMutation({
        mutationFn: async (id: string) => {
          try {
            const response = await axios.delete(`/api/residents/delete/${id}`, {
                params:{
                    hostelId:hostelId
                },
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            toast.success("Resident deleted successfully");
            refetchResident();
            return response.data;
          } catch (error: any) {
            const errorMessage = error?.response?.data?.message || "Failed to delete Resident";
            toast.error(errorMessage);
            throw error;
          }
        },
      });
  
  const handleAssignRoom = (resident: Resident) => {console.log("Assign room for", resident);};

   // Confirm and delete a room
    const handleDelete = async (id: string) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to delete this Resident?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete!",
      });
  
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleting...",
          text: "Please wait while we delete the Resident.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        try {
          await DeleteResidentMutation.mutateAsync(id);
          Swal.fire({
            title: "Deleted!",
            text: "The Resident has been deleted successfully.",
            icon: "success",
          });
        } catch (error) {
            let errorMessage = "Failed to delete the room. Please try again.";
            if (error && typeof error === "object" && "response" in error && error.response && typeof error.response === "object" && "data" in error.response && error.response.data && typeof error.response.data === "object" && "message" in error.response.data) {
              errorMessage = (error.response.data as { message?: string }).message || errorMessage;
            }
          Swal.fire({
            title: "Error!",
            text: errorMessage,
            icon: "error",
          });
        } 
      }
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
      cell: (row: Resident) => <span>{row?.room ? row.room.number : "N/A"}</span>,
    },
    {
      name: "Action",
      cell: (row: Resident) => (
        <div className="flex gap-2">
          {!row.roomId && (
            <button
              title="Assign Room"
              className="text-blue-600 hover:text-blue-800"
              onClick={() => handleAssignRoom(row)}
            >
              <HousePlus className="w-4 h-4" />
            </button>
          )}
          <button
            title="Edit"
            className="text-blue-600 hover:text-blue-800"
            onClick={() => console.log(`Edit resident ${row.id}`)}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            title="Delete"
            className="text-red-600 hover:text-red-800"
            onClick={() => handleDelete(row.id)}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
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
  )
}

export default ResidentTable