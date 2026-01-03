import React, { useState } from 'react';
import RoomManagement from './RoomManagement';
import Amenities from './amenities/Amenities';
import StatusAlert from '@/components/StatusAlert';
import { useQuery } from '@tanstack/react-query';
import { getHostelById } from '@/api/hostels';
import SEOHelmet from '@/components/SEOHelmet';

interface TabData {
  id: string;
  title: string;
  content: React.ReactNode;
}

const RoomManagementTab = () => {
  const { data: hostel } = useQuery({
    queryKey: ["hostel"],
    queryFn: async () => {
      const hostelId = localStorage.getItem("hostelId");
      if (!hostelId) return null;
      const responseData = await getHostelById(hostelId);
      return responseData?.data;
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
    <main className="flex-1 p-4 overflow-y-auto bg-gray-100">
      <SEOHelmet
        title='Room Management - Fuse'
        description='Manage your hostel rooms and amenities efficiently with our user-friendly interface.'
        keywords='room management, hostel, amenities, Fuse'
      />
      <StatusAlert status={hostel?.state as 'PUBLISHED' | 'UNPUBLISHED'} />
      <div className="flex items-center justify-between w-full mb-6">
        <div className='w-full p-3 border rounded-md shadow-md'>
          <h1 className="text-2xl font-bold text-gray-800">Room Management</h1>
          <p className="text-xs text-gray-400">Manage and plan your room for the semesters</p>
          <p className="text-xs text-gray-400">Add and Edit Rooms</p>
          <p className="mt-1 text-xs text-gray-500">
            Start by adding rooms, specifying their details and amenities. You can edit or remove rooms as needed. Use the tabs below to switch between managing rooms and amenities.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex w-full gap-2">
          {tabData.map((tab) => (
            <button
              key={tab.id}
              className={`text-nowrap font-semibold text-base focus:outline-none rounded-md px-3 py-1.5 ${activeTab === tab.id
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