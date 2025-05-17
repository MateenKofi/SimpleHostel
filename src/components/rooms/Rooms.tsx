import React from 'react'

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BedDouble, Hammer, Home, Plus, Users } from 'lucide-react';
import { StatCard } from '../stat-card';
import AmenitiesModal from '@/pages/dashboard/room-management/amenities/AmenitiesModal';
import AddRoomModal from '@/components/rooms/AddRoomModal';
import { useModal } from '../Modal';
import RoomTable from './RoomTable';

const Rooms = () => {
     const { open: openAddRoomModal, close: closeAddRoomModal } =
    useModal("add_room_modal");
  const { open: openAmenitiesModal, close: closeAmenitiesModal } =
    useModal("amenities_modal");
  const hostelId = localStorage.getItem("hostelId") || "";

     const { data:rooms, } = useQuery({
        queryKey: ["rooms"],
        queryFn: async () => {
          const response = await axios.get(`/api/rooms/get/hostel/${hostelId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          return response?.data.data;
        },
        enabled : !!hostelId
      });

  return (
    <div>
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-3">
                <StatCard
                  icon={Home}
                  title="Total Rooms"
                  content={rooms?.totalRooms || 0}
                  description="Total number of rooms in the hostel"
                  backgroundColor="bg-black"
                  titleColor="text-white"
                  contentColor="text-white"
                  descriptionColor="text-white"
                />
                <StatCard
                  icon={BedDouble}
                  title="Available Rooms"
                  content={rooms?.availableRoomsCount || 0}
                  description="Number of rooms currently available"
                  backgroundColor="bg-white"
                  titleColor="text-gray-600"
                  contentColor="text-gray-900"
                  descriptionColor="text-gray-600"
                />
                <StatCard
                  icon={Users}
                  title="Occupied Rooms"
                  content={rooms?.occupiedRoomsCount || 0}
                  description="Number of rooms currently occupied"
                  backgroundColor="bg-white"
                  titleColor="text-gray-600"
                  contentColor="text-gray-900"
                  descriptionColor="text-gray-600"
                />
                <StatCard
                  icon={Hammer}
                  title="Maintenance Rooms"
                  content={rooms?.maintenanceRoomsCount || 0}
                  description="Number of rooms under maintenance"
                  backgroundColor="bg-white"
                  titleColor="text-gray-600"
                  contentColor="text-gray-900"
                  descriptionColor="text-gray-600"
                />
              </div>
          <div className="flex gap-2 justify-end">
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
        </div>
       <div>
        {rooms?.rooms?.length === 0 ? (
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
      ) :(
        <RoomTable/>
      )}
        </div>
    </div>
  )
}

export default Rooms