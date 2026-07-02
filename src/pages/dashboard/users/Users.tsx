import { useState } from 'react'
import UserTable from '@/components/UserTable'
import { UserDetailDrawer } from '@/components/UserDetailDrawer'
import { AuditLogs } from '@/components/AuditLogs'
import { useModal } from '@/components/Modal'
import AddUser from '@/components/AddUser';
import SEOHelmet from '@/components/SEOHelmet';
import { PageHeader } from "@/components/layout/PageHeader";
import { UserCog, Shield, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Users } from "@/helper/types/types";
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const navigate = useNavigate();
  const { open: openUserModal, close: closeUserModal } = useModal('add_user');
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleViewUser = (user: Users) => {
    setSelectedUser(user);
    setDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHelmet
        title='User Management - Fuse'
        description='Manage users effectively with Fuse.'
        keywords='user management, Fuse, hostel'
      />
      <PageHeader
        title="User Management"
        subtitle="Manage user accounts and permissions"
        icon={UserCog}
        sticky={true}
        backgroundImage="https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?auto=format&fit=crop&w=1200&q=80"
      />
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <UserCog className="h-4 w-4" /> Users
              </TabsTrigger>
              <TabsTrigger value="roles" className="flex items-center gap-2">
                <Shield className="h-4 w-4" /> Roles
              </TabsTrigger>
              <TabsTrigger value="audit" className="flex items-center gap-2">
                <FileText className="h-4 w-4" /> Audit Logs
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="users">
              <div className="flex justify-end mb-4">
                <Button size="sm" onClick={openUserModal}>
                  Add User
                </Button>
              </div>
              <UserTable onViewUser={handleViewUser} />
            </TabsContent>
            
            <TabsContent value="roles">
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <Shield className="w-12 h-12 text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-semibold">Manage Roles & Permissions</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Role and permission management has moved to the dedicated Permissions page.
                  </p>
                </div>
                <Button onClick={() => navigate('/dashboard/permissions')}>
                  Go to Permissions <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="audit">
              <AuditLogs />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <AddUser onClose={closeUserModal} />
      <UserDetailDrawer 
        user={selectedUser} 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
      />
    </div>
  )
}

export default Users