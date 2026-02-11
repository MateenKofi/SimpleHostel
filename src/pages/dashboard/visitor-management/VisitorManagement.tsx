import React, { useState } from 'react'
import { Users, Clock, UserPlus } from 'lucide-react'
import { useModal } from '../../../components/Modal'
import AddVisitorModal from '../../../components/visitor/AddVisitorModal'
import ActiveVisitor from '@/components/visitor/ActiveVisitor'
import VisitorHistory from '@/components/visitor/VisitorHistory'
import SEOHelmet from '@/components/SEOHelmet'
import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"

type TabData = {
  id: string;
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}

const VisitorManagement = () => {
  const tabData: TabData[] = [
    {
      id: 'active',
      icon: <Clock className='w-4 h-4' />,
      title: 'Active Visitors',
      content: <ActiveVisitor />,
    },
    {
      id: 'history',
      icon: <Clock className='w-4 h-4' />,
      title: 'Visitor History',
      content: <VisitorHistory />,
    },
  ]

  const [activeTab, setActiveTab] = useState<string>(tabData[0].id);
  const { open: openAddVisitorModal, close: closeAddVisitorModal } = useModal('add_visitor_modal');

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHelmet
        title="Visitor Management - Fuse"
        description="Manage visitors effectively with Fuse."
        keywords="visitor management, Fuse, hostel"
      />
      <PageHeader
        title="Visitor Management"
        subtitle="Track and manage all visitor check-ins and check-outs"
        icon={Users}
        actions={
          <Button size="sm" onClick={openAddVisitorModal}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Visitor
          </Button>
        }
      />
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <AddVisitorModal onClose={closeAddVisitorModal} />
          {/* Tabs */}
          <div className="flex gap-2 border-b border-border mb-6">
            {tabData.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-foreground border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.icon}
                {tab.title}
              </button>
            ))}
          </div>
          {/* Active Tab Content */}
          <div>
            {tabData.find((tab) => tab.id === activeTab)?.content}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VisitorManagement;
