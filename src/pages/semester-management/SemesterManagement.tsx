import React, { useState } from 'react';
import Planning from './Planning';
import ResidentManagement from './resident-management/ResidentManagement';
import RoomManagement from './room-management/RoomManagement';
import ReportAnalysis from './reports/ReportAnalysis';

interface TabData {
  id: string;
  title: string;
  content: React.ReactNode;
}

const SemesterManagement = () => {
  const tabData: TabData[] = [
    {
      id: 'planning',
      title: 'Semester Planning',
      content: <Planning />,
    },
    {
      id: 'residents',
      title: 'Resident Management',
      content: <ResidentManagement />,
    },
    {
      id: 'rooms',
      title: 'Room Management',
      content: <RoomManagement />,
    },
    {
      id: 'reports',
      title: 'Reports & Analysis',
      content: <ReportAnalysis />,
    },
  ];

  const [activeTab, setActiveTab] = useState(tabData[0].id);

  return (
    <main className="flex-1 bg-gray-100 p-4 overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Semester Management</h1>
        <p className="text-gray-600">Manage and plan your academic semesters</p>
      </div>

      <div className="space-y-4">
        <div className="w-full flex gap-2">
          {tabData.map((tab) => (
            <button
              key={tab.id}
              className={`text-nowrap font-semibold text-base focus:outline-none rounded-md px-3 py-1.5 ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(tab.id)}>
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

export default SemesterManagement;