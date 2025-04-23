import UserTable from '@/components/UserTable'
import React from 'react'

const Users = () => {
  return (
    <div className='p-6'>
      <div className='mt-4'>
      <h1 className='text-2xl font-bold'>Users</h1>
      <p className='text-gray-500'>Manage users here</p>
        <p className='text-gray-700'>User management functionality will be implemented here.</p>
        </div>
      <UserTable/>
    </div>
  )
}

export default Users
