import React from 'react'
import CustomDataTable from '../CustomDataTable';
import { format } from 'date-fns';

interface Visitor {
  id: string;
  name: string;
  phone: string;
  residentId: string;
  purpose: string;
  checkInTime: string;
  checkOutTime?: string;
  status: 'checked-in' | 'checked-out';
}

const VisitorHistory = () => {
     const columns = [
        {
          name: 'Visitor Name',
          selector: (row: Visitor) => row.name,
          sortable: true,
        },
        {
          name: 'Phone',
          selector: (row: Visitor) => row.phone,
        },
       
        {
          name: 'Purpose',
          selector: (row: Visitor) => row.purpose,
        },
        {
          name: 'Check-in Time',
          selector: (row: Visitor) => format(new Date(row.checkInTime), 'MMM dd, yyyy HH:mm'),
          sortable: true,
        },
        {
          name: 'Check-out Time',
          selector: (row: Visitor) => row.checkOutTime 
            ? format(new Date(row.checkOutTime), 'MMM dd, yyyy HH:mm')
            : '-',
          sortable: true,
        },
        {
          name: 'Status',
          cell: (row: Visitor) => (
            <span className={`px-2 py-1 rounded-full text-xs ${
              row.status === 'checked-in' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {row.status === 'checked-in' ? 'Checked In' : 'Checked Out'}
            </span>
          ),
        },
      ]
    return (
    <div className='p-4 bg-white rounded-lg shadow-sm border'>
        <CustomDataTable
            title="Visitor History Table"
          columns={columns}
          data={[]}
        />
    </div>
  )
}

export default VisitorHistory