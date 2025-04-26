import { Room } from "@/helper/types/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Eye, Edit, Trash2, Ellipsis } from "lucide-react";
import React, { useState } from "react";
import CustomDataTable from "../CustomDataTable";
import Swal from "sweetalert2";
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
      const response = await axios.get(`/api/rooms/hostel/${hostelId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response?.data?.data;
    },
    enabled: !!hostelId,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios
        .delete(`/api/rooms/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          refetchRooms();
          toast.success("Room deleted successfully");
          return res.data;
        })
        .catch((error) => {
          const errorMessage =
            error.response?.data?.message || "Failed to delete room";
          toast.error(errorMessage);
        });
    },
  });

  // Open edit modal for selected room
  const handleEditRoom = (room: Room) => {
    setSelectedRoom(room);
    openEditRoomModal();
  };

  // Confirm and delete a room
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this room?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleting...",
        text: "Please wait while we delete the room.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      try {
        await deleteMutation.mutateAsync(id);
        Swal.fire({
          title: "Deleted!",
          text: "The room has been deleted successfully.",
          icon: "success",
        });
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          "Failed to delete the room. Please try again.";
        toast.error(errorMessage);
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
          className={`w-full px-1 py-1 rounded text-xs text-center text-nowrap ${
            row.status === "AVAILABLE"
              ? "bg-green-200 text-green-800"
              : row.status === "OCCUPIED"
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
                className="w-full text-xs text-white flex gap-1 items-center justify-center bg-black p-2 rounded "
                onClick={() => navigate(`/dashboard/view-room/:${row.id}`)}
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                className="w-full text-xs text-white flex items-center justify-center gap-1 bg-blue-600 p-2 rounded"
                onClick={() => handleEditRoom(row)}
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                className="w-full text-xs text-white flex items-center justify-center gap-1 bg-red-600 p-2 rounded"
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
    <div className="mt-2 shadow-md border rounded-md p-6 bg-white">
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
