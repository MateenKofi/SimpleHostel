import SEOHelmet from '@/components/SEOHelmet';
import StaffTable from '@/components/staff/StaffTable';
import React from 'react';
import { UserCog } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const StaffManagement: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHelmet
        title='Staff Management - Fuse'
        description='Manage staff effectively with Fuse.'
        keywords='staff management, Fuse, hostel'
      />
      <PageHeader
        title="Staff Management"
        subtitle="Manage all hostel staff information, roles, and statuses"
        icon={UserCog}
        actions={
          <Button onClick={() => navigate('/dashboard/staff-management/add')}>
            Add Staff
          </Button>
        }
      />
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card border border-border rounded-lg shadow-sm p-4">
            <StaffTable />
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffManagement;
