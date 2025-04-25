import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import CustomDataTable from '../CustomDataTable';
import { Resident } from '@/helper/types/types';
import { HousePlus, Edit, Trash2 } from 'lucide-react';

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

  
  const handleAssignRoom = (resident: Resident) => {console.log("Assign room for", resident);};

  const handleDeleteResident = (id: string) => {
    console.log(`Resident with ID ${id} deleted successfully`);
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
            onClick={() => handleDeleteResident(row.id)}
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