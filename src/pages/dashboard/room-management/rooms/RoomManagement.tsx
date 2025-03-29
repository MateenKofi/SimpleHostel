import { useState } from "react";
import { StatCard } from "@/components/stat-card";
import {
  Building,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Trash2,
  Home,
  BedDouble,
  Users,
  Hammer,
  Loader,
} from "lucide-react";
import { useModal } from "@/components/Modal";
import AddRoomModal from "./AddRoomModal";
import EditRoomModal from "./EditRoomModal";
import AmenitiesModal from "../amenities/AmenitiesModal";
import axios, { AxiosError } from "axios";
import { Room } from "@/helper/types/types";
import DataTable from "react-data-table-component";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import RoomManagementLoader from "@/components/loaders/RoomManagementLoader";

const RoomManagement = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { open: openAddRoomModal, close: closeAddRoomModal } =
    useModal("add_room_modal");
  const { open: openAmenitiesModal, close: closeAmenitiesModal } =
    useModal("amenities_modal");
  const { open: openEditRoomModal, close: closeEditRoomModal } =
    useModal("editroom_modal");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [deletingRoomId, setDeletingRoomId] = useState<string | null>(null);
  const hostelId = localStorage.getItem("hostelId") || "";

  // Fetch rooms data
  const { data, isLoading } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      if (!hostelId) {
        navigate("/login");
      }
      const response = await axios.get(`/api/rooms/hostel/${hostelId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response?.data.data;
    },
  });

  // Delete room mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/api/rooms/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Room deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errorMessage =
        error.response?.data?.message || "Failed to delete room";
      toast.error(errorMessage);
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
      setDeletingRoomId(id);
      try {
        await deleteMutation.mutateAsync(id);
        Swal.fire({
          title: "Deleted!",
          text: "The room has been deleted successfully.",
          icon: "success",
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete the room. Please try again.",
          icon: "error",
        });
      } finally {
        setDeletingRoomId(null);
      }
    }
  };

  // Define columns for DataTable
  const columns = [
    {
      name: "Room No.",
      selector: (row: Room) => row.number || "",
      sortable: true,
    },
    {
      name: "Block",
      selector: (row: Room) => row.block || "",
      sortable: true,
    },
    {
      name: "Floor",
      selector: (row: Room) => row.floor || "",
      sortable: true,
    },
    {
      name: "Type",
      selector: (row: Room) => row.type || "",
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
          className={`w-full px-2 py-1 rounded text-sm text-center ${
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
      name: "Actions",
      center: true,
      grow: 2,
      cell: (row: Room) => (
        <div className="flex gap-2 w-full text-nowrap">
          <button
            className="w-full text-white flex bg-black p-2 rounded"
            onClick={() => handleEditRoom(row)}
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button
            className="w-full text-white flex items-center justify-center bg-black p-2 rounded"
            onClick={() => handleDelete(row.id)}
          >

                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
     <RoomManagementLoader/>
    );
  }

  return (
    <div className="p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-3">
        <StatCard
          icon={Home}
          title="Total Rooms"
          content={data?.totalRooms}
          description="Total number of rooms in the hostel"
          backgroundColor="bg-black"
          titleColor="text-white"
          contentColor="text-white"
          descriptionColor="text-white"
        />
        <StatCard
          icon={BedDouble}
          title="Available Rooms"
          content={data?.availableRoomsCount}
          description="Number of rooms currently available"
          backgroundColor="bg-white"
          titleColor="text-gray-600"
          contentColor="text-gray-900"
          descriptionColor="text-gray-600"
        />
        <StatCard
          icon={Users}
          title="Occupied Rooms"
          content={data?.occupiedRoomsCount}
          description="Number of rooms currently occupied"
          backgroundColor="bg-white"
          titleColor="text-gray-600"
          contentColor="text-gray-900"
          descriptionColor="text-gray-600"
        />
        <StatCard
          icon={Hammer}
          title="Maintenance Rooms"
          content={data?.maintenanceRoomsCount}
          description="Number of rooms under maintenance"
          backgroundColor="bg-white"
          titleColor="text-gray-600"
          contentColor="text-gray-900"
          descriptionColor="text-gray-600"
        />
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Building className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Room Management</h1>
        </div>
        <div className="flex gap-2">
          <button
            className="flex gap-2 px-4 py-2 bg-black text-white rounded-md"
            onClick={openAddRoomModal}
          >
            <Plus />
            <span>Room</span>
          </button>
          <button
            className="flex gap-2 px-4 py-2 bg-black text-white rounded-md"
            onClick={openAmenitiesModal}
          >
            <Plus />
            <span>Amenities</span>
          </button>
          <AddRoomModal onClose={closeAddRoomModal} />
          <AmenitiesModal onClose={closeAmenitiesModal} />
          <button className="px-4 py-2 bg-black text-white rounded-md flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Rooms List or Empty State */}
      {data?.rooms?.length === 0 ? (
        <div className="w-full flex justify-center flex-col items-center gap-4 text-center py-4 mt-20">
          <p>No rooms found. Please add some rooms.</p>
          <button
            className="flex gap-2 px-4 py-2 bg-black text-white rounded-md"
            onClick={openAddRoomModal}
          >
            <Plus />
            <span>Room</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search rooms..."
                className="pl-10 pr-4 py-2 border rounded-md w-[300px]"
              />
            </div>
            <button className="px-4 py-2 border rounded-md flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
          <DataTable
            columns={columns}
            data={data?.rooms || []}
            pagination
            highlightOnHover
            responsive
          />
        </div>
      )}

      {selectedRoom && (
        <EditRoomModal onClose={closeEditRoomModal} formdata={selectedRoom} />
      )}
    </div>
  );
};

export default RoomManagement;
