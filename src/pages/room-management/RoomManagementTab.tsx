import React, { useState, useEffect } from 'react';
import RoomManagement from './room-management/RoomManagement';
import Amenities from './amenitie/Amenities';
import StatusAlert from '../../components/StatusAlert';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface TabData {
  id: string;
  title: string;
  content: React.ReactNode;
}

const RoomManagementTab = () => {
  const { data: userProfile, isLoading, isError } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await axios.get('/api/users/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response?.data;
    },
  });

  const [hostelState, setHostelState] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (userProfile?.restofUser?.hostel?.state) {
      setHostelState(userProfile.restofUser.hostel.state);
    }
  }, [userProfile]);


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
      <StatusAlert status={hostelState} />
      <div className="mb-6 w-full flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Room Management</h1>
          <p className="text-gray-600">Manage and plan your room for the semesters</p>
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