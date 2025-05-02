import React, { useState } from 'react';
import RoomManagement from './RoomManagement';
import Amenities from './amenities/Amenities';
import StatusAlert from '@/components/StatusAlert';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface TabData {
  id: string;
  title: string;
  content: React.ReactNode;
}

const RoomManagementTab = () => {
   const { data:hostel } = useQuery({
      queryKey: ["hostel"],
      queryFn: async () => {
        const response = await axios.get(
          `/api/hostels/get/${localStorage.getItem("hostelId")}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        return response?.data?.data;
      },
    });


  const tabData: TabData[] = [
    {
      id: 'rooms',
      title: 'Room Management',
      content: <RoomManagement />,
    },
    {
      id: 'amenities',
      title: 'Amenities',
      content: <Amenities />,
    },
  ];

  const [activeTab, setActiveTab] = useState(tabData[0].id);

  return (
    <main className="flex-1 bg-gray-100 p-4 overflow-y-auto">
      <StatusAlert status={hostel?.state as 'published' | 'unpublished'} />
      <div className="mb-6 w-full flex justify-between items-center">
        <div className='border p-3 rounded-md shadow-md w-full'>
          <h1 className="text-2xl font-bold text-gray-800">Room Management</h1>
          <p className="text-gray-400 text-xs">Manage and plan your room for the semesters</p>
            <p className="text-gray-400 text-xs">Add and Edit Rooms</p>
            <p className="text-gray-500 text-xs mt-1">
            Start by adding rooms, specifying their details and amenities. You can edit or remove rooms as needed. Use the tabs below to switch between managing rooms and amenities.
            </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="w-full flex gap-2">
          {tabData.map((tab) => (
            <button
              key={tab.id}
              className={`text-nowrap font-semibold text-base focus:outline-none rounded-md px-3 py-1.5 ${
                activeTab === tab.id
                  ? 'bg-black text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.title}
            </button>
          ))}
        </div>
        <div className="mt-4">
          {tabData.find((tab) => tab.id === activeTab)?.content}
        </div>
      </div>
    </main>
  );
};

export default RoomManagementTab;