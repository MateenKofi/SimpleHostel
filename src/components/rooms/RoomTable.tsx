import { Room } from "@/helper/types/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getHostelRooms, deleteRoom } from "@/api/rooms";
import { getReservationsByHostel } from "@/api/reservations";
import { Eye, Edit, Trash2, Ellipsis, Ticket } from "lucide-react";
import React, { useState, useMemo } from "react";
import CustomDataTable from "../CustomDataTable";
import { toast } from "sonner";
import EditRoomModal from "@/components/rooms/EditRoomModal";
import { ReserveRoomModal } from "@/components/reservations/ReserveRoomModal";
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
import type { ApiError, ReservationDto } from "@/types/dtos";
import { backendRoomTypeToDisplay } from "@/utils";

const RoomTable = () => {
  const navigate = useNavigate()
  const { open: openEditRoomModal, close: closeEditRoomModal } =
    useModal("editroom_modal");
  const [selectedRoom, setSelectedRoom] = useState<Room>({} as Room);
  const [openReserveModal, setOpenReserveModal] = useState(false);
  const [selectedReserveRoom, setSelectedReserveRoom] = useState<Room | null>(null);


  const hostelId = localStorage.getItem("hostelId") || "";

  const {
    data: rooms,
    isLoading,
    isError,
    refetch: refetchRooms,
  } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      if (!hostelId) return { rooms: [] };
      return await getHostelRooms(hostelId);
    },
    enabled: !!hostelId,
  });

  const { data: reservationsData, refetch: refetchReservations } = useQuery({
    queryKey: ["reservations", hostelId],
    queryFn: async () => {
      if (!hostelId) return [];
      const response = await getReservationsByHostel(hostelId);
      return response.data || [];
    },
    enabled: !!hostelId,
  });

  // Get reservations for a specific room
  const getRoomReservations = useMemo(() => {
    return (roomId: string): ReservationDto[] => {
      if (!reservationsData) return [];
      return reservationsData.filter((r: ReservationDto) => r.roomId === roomId);
    };
  }, [reservationsData]);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await deleteRoom(id);
        refetchRooms();
        toast.success("Room deleted successfully");
      } catch (error: unknown) {
        const err = error as ApiError;
        const errorMessage = err.response?.data?.message || "Failed to delete room";
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

  // Open reserve room modal
  const handleReserveRoom = (room: Room) => {
    setSelectedReserveRoom(room);
    setOpenReserveModal(true);
  };

  // Handle reserve modal success
  const handleReserveSuccess = () => {
    refetchReservations();
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

      selector: (row: Room) => backendRoomTypeToDisplay(row.type),
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
      cell: (row: Room) => {
        // Use effectiveStatus (calculated from actual occupancy) or fall back to status
        const effectiveStatus = (row as any).effectiveStatus || row.status;
        return (
          <span
            className={`w-full px-1 py-1 rounded text-xs text-center text-nowrap ${effectiveStatus === "available"
              ? "bg-green-200 text-green-800"
              : effectiveStatus === "occupied"
                ? "bg-red-200 text-red-800"
                : "bg-yellow-200 text-yellow-800"
              }`}
          >
            {effectiveStatus}
          </span>
        );
      },
    },
    {
      name: "Capacity",
      selector: (row: Room) =>
        `${row.currentResidentCount || 0} / ${row.maxCap || 0}`,
      sortable: true,
    },
    {
      name: "Reservations",
      sortable: true,
      center: true,
      cell: (row: Room) => {
        const roomReservations = getRoomReservations(row.id);
        const confirmedCount = roomReservations.filter((r) => r.status === "confirmed").length;
        const pendingCount = roomReservations.filter((r) => r.status === "pending").length;
        const fulfilledCount = roomReservations.filter((r) => r.status === "fulfilled").length;

        return (
          <div className="flex flex-col items-center gap-1">
            <div className="flex gap-2 text-xs">
              {confirmedCount > 0 && (
                <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded">
                  {confirmedCount} confirmed
                </span>
              )}
              {pendingCount > 0 && (
                <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded">
                  {pendingCount} pending
                </span>
              )}
              {fulfilledCount > 0 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded">
                  {fulfilledCount} fulfilled
                </span>
              )}
              {roomReservations.length === 0 && (
                <span className="text-muted-foreground">-</span>
              )}
            </div>
          </div>
        );
      },
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
                className="flex items-center justify-center w-full gap-1 p-2 text-xs text-white bg-primary rounded "
                onClick={() => navigate(`/dashboard/view-room/:${row.id}`)}
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                className="flex items-center justify-center w-full gap-1 p-2 text-xs text-white bg-emerald-600 rounded"
                onClick={() => handleReserveRoom(row)}
              >
                <Ticket className="w-4 h-4" />
                <span>Reserve Room</span>
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
      {openReserveModal && selectedReserveRoom && (
        <ReserveRoomModal
          hostelId={hostelId}
          rooms={rooms?.rooms || []}
          open={openReserveModal}
          onOpenChange={setOpenReserveModal}
          onSuccess={handleReserveSuccess}
        />
      )}
    </div>
  );
};
export default RoomTable;
