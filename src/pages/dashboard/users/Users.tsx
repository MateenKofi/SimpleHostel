import UserTable from '@/components/UserTable'
import { useModal } from '@/components/Modal'
import AddUser from '@/components/AddUser';
import SEOHelmet from '@/components/SEOHelmet';
import { PageHeader } from "@/components/layout/PageHeader";
import { UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";

const Users = () => {
  const { open: openUserModal, close: closeUserModal } = useModal('add_user');
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
        actions={
          <Button size="sm" onClick={openUserModal}>
            Add User
          </Button>
        }
      />
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <UserTable />
        </div>
      </main>
      <AddUser onClose={closeUserModal} />
    </div>
  )
}

export default Users
