import { Room } from "@/helper/types/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getHostelRooms, deleteRoom } from "@/api/rooms";
import { Eye, Edit, Trash2, Ellipsis } from "lucide-react";
import React, { useState } from "react";
import CustomDataTable from "../CustomDataTable";
import toast from "react-hot-toast";
import EditRoomModal from "@/components/rooms/EditRoomModal";
import { useModal } from "../Modal";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { handleSwalMutation } from "../swal/SwalMutationHelper";

const RoomTable = () => {
  const navigate = useNavigate()
  const { open: openEditRoomModal, close: closeEditRoomModal } =
    useModal("editroom_modal");
  const [selectedRoom, setSelectedRoom] = useState<Room>({} as Room);


  const hostelId = localStorage.getItem("hostelId") || "";

  const {
    data: rooms,
    isLoading,
    isError,
    refetch: refetchRooms,
  } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      if (!hostelId) return [];
      return await getHostelRooms(hostelId);
    },
    enabled: !!hostelId,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await deleteRoom(id);
        refetchRooms();
        toast.success("Room deleted successfully");
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Failed to delete room";
        toast.error(errorMessage);
        throw error;
      }
    },
  });

  // Open edit modal for selected room
  const handleEditRoom = (room: Room) => {
    setSelectedRoom(room);
    openEditRoomModal();
  };

  // Confirm and delete a room
  const handleDelete = async (id: string) => {
    handleSwalMutation({
      mutation: () => deleteMutation.mutateAsync(id),
      title: "Delete Room",
    });
  };

  const columns = [
    {
      name: "Room ",

      selector: (row: Room) => row.number || "N/A",
      sortable: true,
    },
    {
      name: "Block",

      selector: (row: Room) => row.block || "N/A",
      sortable: true,
    },
    {
      name: "Floor",

      selector: (row: Room) => row.floor || "N/A",
      sortable: true,
    },
    {
      name: "Type",

      selector: (row: Room) => row.type || "",
      sortable: true,
    },
    {
      name: "Gender",

      selector: (row: Room) => row.gender || "",
      sortable: true,
    },
    {
      name: "Price",

      selector: (row: Room) => row.price || 0,
      sortable: true,
    },
    {
      name: "Status",
      sortable: true,
      center: true,

      grow: 2,
      cell: (row: Room) => (
        <span
          className={`w-full px-1 py-1 rounded text-xs text-center text-nowrap ${row.status === "available"
            ? "bg-green-200 text-green-800"
            : row.status === "occupied"
              ? "bg-red-200 text-red-800"
              : "bg-yellow-200 text-yellow-800"
            }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "Capacity",
      selector: (row: Room) =>
        `${row.currentResidentCount || 0} / ${row.maxCap || 0}`,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row: Room) => (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Action</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <button
                className="flex items-center justify-center w-full gap-1 p-2 text-xs text-white bg-black rounded "
                onClick={() => navigate(`/dashboard/view-room/:${row.id}`)}
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                className="flex items-center justify-center w-full gap-1 p-2 text-xs text-white bg-blue-600 rounded"
                onClick={() => handleEditRoom(row)}
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                className="flex items-center justify-center w-full gap-1 p-2 text-xs text-white bg-red-600 rounded"
                onClick={() => handleDelete(row.id)}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },

  ];

  return (
    <div className="p-6 mt-2 bg-white border rounded-md shadow-md">
      <CustomDataTable
        title="Room table"
        columns={columns}
        data={rooms?.rooms || []}
        isError={isError}
        isLoading={isLoading}
        refetch={refetchRooms}
      />
      <EditRoomModal onClose={closeEditRoomModal} formdata={selectedRoom} />
    </div>
  );
};
export default RoomTable;
