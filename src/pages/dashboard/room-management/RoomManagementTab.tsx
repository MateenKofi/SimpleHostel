import React, { useState } from 'react';
import RoomManagement from './RoomManagement';
import Amenities from './amenities/Amenities';
import StatusAlert from '@/components/StatusAlert';
import { useQuery } from '@tanstack/react-query';
import { getHostelById } from '@/api/hostels';
import SEOHelmet from '@/components/SEOHelmet';
import { PageHeader } from '@/components/layout/PageHeader';
import { Building } from 'lucide-react';

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
      title: 'Rooms',
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
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHelmet
        title='Room Management - Fuse'
        description='Manage your hostel rooms and amenities efficiently with our user-friendly interface.'
        keywords='room management, hostel, amenities, Fuse'
      />
      <StatusAlert status={hostel?.state as 'PUBLISHED' | 'UNPUBLISHED'} />

      <PageHeader
        title="Room Management"
        subtitle="Manage and plan your rooms for the semester. Add, edit, and organize rooms with amenities."
        icon={Building}
      />

      {/* Tabs */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1">
            {tabData.map((tab) => (
              <button
                key={tab.id}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {tabData.find((tab) => tab.id === activeTab)?.content}
        </div>
      </main>
    </div>
  );
};

export default RoomManagementTab;
