import React from 'react'
import DebtorListTable from './DeptorListTable'
import { ChevronLeft,Printer,FolderUp } from 'lucide-react'

const DeptorsList = () => {
  return (
    <div className='p-6'>
      <div className='bg-white p-6 rounded-md w-full flex justify-between items-center my-4'>
        <h1 className='text-4xl font-bold'>Debtor's List</h1>
        <div className='flex gap-2'>
            <button className='px-3 py-2 bg-primary text-white rounded-md flex gap-2'>
            <ChevronLeft className='w-6 h-6' />
            <span>
                Back
            </span>
            </button>
          <button className='px-4 py-2 bg-primary text-white rounded-md flex gap-2'>
            <Printer className='w-6 h-6' />
            <span>print</span>
          </button>
          <button className='px-4 py-2 bg-primary text-white rounded-md flex gap-2'>
            <FolderUp className='w-6 h-6' />
            <span>Export</span>
          </button>
          </div>
      </div>
        <div>
            <DebtorListTable />
            </div>
    </div>
  )
}

export default DeptorsList
