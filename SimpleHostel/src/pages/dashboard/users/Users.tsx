import UserTable from '@/components/UserTable'
import { useModal } from '@/components/Modal'
import AddUser from '@/components/AddUser';
import SEOHelmet from '@/components/SEOHelmet';

const Users = () => {
  const { open: openUserModal, close: closeUserModal } = useModal('add_user');
  return (
    <div className='p-6'>
      <SEOHelmet
        title='User Management - Fuse'
        description='Manage users effectively with Fuse.'
        keywords='user management, Fuse, hostel'
      />
        <div className='flex  justify-between items-center  p-6 border shadow-md rounded-lg bg-white mb-3'>
           <div> <h1 className='text-2xl font-bold'>User Managment</h1>
            <p className='text-gray-500'>Manage hostels here</p>
            <p className='text-gray-700'>Hostel management functionality will be implemented here.</p></div>
           <div>
            <button className='px-4 py-2 bg-black text-white rounded-md flex items-center gap-2'
            onClick={openUserModal}
            >
                <span>Add User</span>
            </button>
           </div>
        </div>
      <UserTable/>
      <AddUser onClose={closeUserModal}/>
    </div>
  )
}

export default Users
