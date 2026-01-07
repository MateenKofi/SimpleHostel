import { useMutation, useQuery } from "@tanstack/react-query";
import { getHostelResidents, deleteResident } from "@/api/residents";
import CustomDataTable from "../CustomDataTable";
import { ResidentDto } from "@/types/dtos";
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
import { useAddedResidentStore } from "@/stores/useAddedResidentStore";
import { useS } from "use-s-react";

const ResidentTable = () => {
  const navigate = useNavigate();
  const setResident = useAddedResidentStore((state) => state.setResident);
  const hostelId = localStorage.getItem("hostelId");

  const [selectedResident, setSelectedResident] = useS<
    ResidentDto | Record<string, any>
  >({
    value: {},
    key: "selectedResident",
  });

  const {
    data: resident,
    isLoading,
    isError,
    refetch: refetchResident,
  } = useQuery({
    queryKey: ["resident"],
    queryFn: async () => {
      const responseData = await getHostelResidents(hostelId!);
      return responseData?.data;
    },
    enabled: !!hostelId,
  });

  const DeleteResidentMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await deleteResident(id, hostelId!);
        toast.success("Resident deleted successfully");
        refetchResident();
      } catch (error: any) {
        const errorMessage = error?.response?.data?.error || "An unexpected error occured";
        toast.error(errorMessage);
        throw error;
      }
    },
  });

  const handleAssignRoom = (resident: ResidentDto) => {
    setResident(resident);
    setTimeout(() => {
      navigate("/dashboard/room-assignment");
    }, 50);
  };

  // Confirm and delete a room
  const handleDelete = async (id: string) => {
    handleSwalMutation({
      mutation: () => DeleteResidentMutation.mutateAsync(id),
      title: "delete resident",
    });
  };

  const handleEdit = (resident: ResidentDto) => {
    setSelectedResident(() => resident || {});
    console.log("selected resident", selectedResident);
    navigate("/dashboard/edit-resident");
  };

  const columns = [
    {
      name: "Name",
      selector: (row: ResidentDto) => row.name || "",
      sortable: true,
    },
    {
      name: "Access Code",
      selector: (row: ResidentDto) => row.accessCode || "",
      sortable: true,
      wrap: true,
    },
    {
      name: "Student ID",
      selector: (row: ResidentDto) => row.studentId || "",
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row: ResidentDto) => row.phone || "",
      sortable: true,
    },
    {
      name: "Email",
      selector: (row: ResidentDto) => row.email || "",
      sortable: true,
      wrap: true,
    },
    {
      name: "Room",
      cell: (row: ResidentDto) => (
        <span>{row?.room ? row.room.number : "N/A"}</span>
      ),
    },
    {
      name: "Action",
      width: "fit",
      cell: (row: ResidentDto) => (
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
                className="flex items-center w-full gap-1 p-1 text-white bg-blue-600 rounded-md hover:bg-blue-800"
                onClick={() => handleEdit(row)}
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                title="Delete"
                className="flex items-center w-full gap-1 p-1 text-white bg-red-600 rounded-md hover:bg-red-800"
                onClick={() =>
                  row.id !== null && handleDelete(row.id as string)
                }
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
