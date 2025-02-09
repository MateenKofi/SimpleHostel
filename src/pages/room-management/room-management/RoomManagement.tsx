import { useState } from 'react';
import { StatCard } from "../../../components/stat-card";
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
} from "lucide-react";
import { useModal } from "../../../components/Modal";
import AddRoomModal from "./AddRoomModal";
import EditRoomModal from './EditRoomModal';
import AmenitiesModal from "../amenitie/AmenitiesModal";
import axios from "axios";
import { Room } from "../../../types/types";
import DataTable from "react-data-table-component";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const RoomManagement = () => {
  const { open: openAddRoomModal, close: closeAddRoomModal } = useModal("add_room_modal");
  const { open: openAmenitiesModal, close: closeAmenitiesModal } = useModal("amenities_modal");
  const { open: openEditRoomModal, close: closeEditRoomModal } = useModal("editroom_modal");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const hostelId = localStorage.getItem("hostelId") || "";
  if (!hostelId) {
    console.error("Hostel ID is not defined");
    return <div>Error: Hostel ID is not defined</div>;
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const response = await axios.get(`/api/rooms/hostel/${hostelId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response?.data.data;
    },
  });

  const handleEditRoom = (rooms: Room) => {
    setSelectedRoom(rooms);
    openEditRoomModal();
  };

  const columns = [
    {
      name: "Room No.",
      selector: (row: Room) => row.number,
      sortable: true,
    },
    {
      name: "Block",
      selector: (row: Room) => row.block,
      sortable: true,
    },
    {
      name: "Floor",
      selector: (row: Room) => row.floor,
      sortable: true,
    },
    {
      name: "Type",
      selector: (row: Room) => row.type,
      sortable: true,
    },
    {
      name: "Price",
      selector: (row: Room) => row.price,
      sortable: true,
    },
    {
      name: "Status",
      sortable: true,
      grow:2,
      cell: (row: Room) => (
        <span
          className={`w-full px-2 py-1 rounded text-sm text-capitalize text-center ${
            row.status === "AVAILABLE"
              ? "bg-green-200 text-green-800 "
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
      selector: (row: Room) => row.maxCap,
      sortable: true,
    },
    {
      name: "Actions",
      grow: 2,
      cell: (row: Room) => (
        <div className="flex gap-2">
          <button
            className="text-white flex bg-black p-2 rounded text-nowrap"
            onClick={() => handleEditRoom(row)}
          >
            <Edit className="w-4 h-4" />
            <span> Edit</span>
          </button>
          <button className="text-white flex bg-black p-2 rounded text-nowrap">
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-3">
          {[0, 1, 2, 3].map((_, index) => (
            <div key={index} className="bg-gray-200 rounded-lg shadow-sm p-4">
             <div className="flex items-center gap-2 mb-4">
             <div className="w-6 h-6 bg-gray-300 rounded-full animate-pulse"></div>
             <div className="h-6 bg-gray-300 rounded-md w-32 animate-pulse"></div>
             </div>
             <div className="h-14 w-14 bg-gray-300 rounded-md animate-pulse"></div>
             <div className="h-6 w-full bg-gray-300 rounded-md animate-pulse mt-1"></div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="h-6 bg-gray-300 rounded-md w-32 animate-pulse"></div>
          </div>
          <div className="flex gap-2">
            <div className="px-4 py-2 bg-gray-300 rounded-md w-24 animate-pulse"></div>
            <div className="px-4 py-2 bg-gray-300 rounded-md w-24 animate-pulse"></div>
            <div className="px-4 py-2 bg-gray-300 rounded-md w-24 animate-pulse"></div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-[300px]">
              <div className="w-full h-10 bg-gray-300 rounded-md animate-pulse"></div>
            </div>
            <div className="flex gap-2">
              <div className="px-4 py-2 bg-gray-300 rounded-md w-24 animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="h-10 bg-gray-300 rounded-md animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
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
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Building className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Room Management</h1>
        </div>
        <div className="flex gap-2">
          <button
            className="flex gap-2 px-4 py-2 bg-black text-white rounded-md"
            onClick={() => openAddRoomModal()}
          >
            <Plus />
            <span>Room</span>
          </button>
          <button
            className="flex gap-2 px-4 py-2 bg-black text-white rounded-md"
            onClick={() => openAmenitiesModal()}
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

      {data?.rooms?.length === 0 ? (
        <div className="w-full flex justify-center flex-col items-center gap-4 text-center py-4 mt-20">
          <p>No rooms found. Please add some rooms.</p>
          <div>
            <button
              className="flex gap-2 px-4 py-2 bg-black text-white rounded-md"
              onClick={() => openAddRoomModal()}
            >
              <Plus />
              <span>Room</span>
            </button>
          </div>
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
            <div className="flex gap-2">
              <button className="px-4 py-2 border rounded-md flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
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
      <EditRoomModal onClose={closeEditRoomModal} formdata={selectedRoom} />
    </div>
  );
};

export default RoomManagement;
