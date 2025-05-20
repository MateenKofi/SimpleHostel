import React, { useState } from 'react'
import { Users,   Clock, UserPlus } from 'lucide-react'
import { useModal } from '../../../components/Modal'
import AddVisitorModal from '../../../components/visitor/AddVisitorModal'
import ActiveVisitor from '@/components/visitor/ActiveVisitor'
import VisitorHistory from '@/components/visitor/VisitorHistory'
import SEOHelmet from '@/components/SEOHelmet'


type TabData = {
  id:string;
  icon: React.ReactNode;
  title:string;
  content: React.ReactNode;
}
const VisitorManagement = () => {
  
  const tabData : TabData[] = [
      {
        id: 'active',
        icon: <Clock className='w-4 h-4'/>,
        title: 'Active Visitors',
        content: <ActiveVisitor/>,
      },
      {
        id: 'history',
        icon: <Clock className='w-4 h-4'/>,
        title: 'Visitor History',
        content: <VisitorHistory/>,
      },
  ]
  const [activeTab, setActiveTab] = useState<string>(tabData[0].id);
  const { open: openAddVisitorModal, close: closeAddVisitorModal } = useModal('add_visitor_modal');

 
  return (
    <div className="p-6">
      <SEOHelmet
        title="Visitor Management - Fuse"
        description="Manage visitors effectively with Fuse."
        keywords="visitor management, Fuse, hostel"
      />
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Visitor Management</h1>
        </div>
        <button
          className="px-4 py-2 bg-black text-white rounded-md flex items-center gap-2"
          onClick={openAddVisitorModal}
        >
          <UserPlus className="w-4 h-4" />
          New Visitor
        </button>
      </div>

      <div >
        {/* Tabs */}
        <div className="flex gap-4 mb-6 bg-white rounded-lg shadow-sm p-4 border">
           {tabData.map((tab) => (
            <button
              key={tab.id}
              className={`text-nowrap font-semibold text-base focus:outline-none rounded-md px-3 py-1.5 flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-black text-white'
                  : 'text-gray-500 hover:text-gray-700 border-b-2 border hover:border-gray-300'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.icon}</span>
              {tab.title}
            </button>
          ))}
        </div>
        {/* tab-content */}
        <div className="mt-4">
          {tabData.find((tab) => tab.id === activeTab)?.content}
        </div>


      </div>

      <AddVisitorModal onClose={closeAddVisitorModal} />
    </div>
  )
}

export default VisitorManagement 