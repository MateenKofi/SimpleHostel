import React from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Users } from '@/helper/types/types'
import { TableColumn } from 'react-data-table-component'
import CustomDataTable from './CustomDataTable'

const columns: TableColumn<Users>[] =[
    {name: 'Name', selector:(row)=> row.name, sortable:true},
    {name: 'Email', selector:(row)=> row.email, sortable:true},
    {name: 'Phone', selector: (row)=> row.phoneNumber,},
    {name: 'Role',center:true, cell: (row) => (
        <span className={`w-full rounded-md text-center px-2 py-1 ${row.role === 'SUPER_ADMIN' ? 'bg-green-400 text-white' : row.role === 'user' ? 'bg-blue-500 text-white' : 'bg-yellow-400 text-white'}`}>
            {row.role}
        </span>
    ), sortable: true},

]

const UserTable = () => {
    const {data:AllUsers} = useQuery({
        queryKey:['AllUsers'],
        queryFn: async () => {
            const response = await axios.get(`/api/users/get`,{
                headers :{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            return response.data
        }
    })
  return (
    <div className='p-6 border shadow-sm rounded-md'>
        <CustomDataTable
        title='User Management'
        data={AllUsers}
        columns={columns}
        />
    </div>
  )
}

export default UserTable