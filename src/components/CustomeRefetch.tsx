import { RefreshCcw } from 'lucide-react'
import React from 'react'

type CustomeRefetchProps = {
    refetch?: () => void
}
const CustomeRefetch = ({ refetch }: CustomeRefetchProps) => {
  return (
    <div className='w-full h-[70dvh] grid place-items-center text-red-500'>
      <div className=' flex flex-col items-center'>
        <h2 className='text-xl font-serif italic'>Error loading data</h2>
        <p className='text-xs'>Try reloading data</p>
        <button
          className='btn btn-sm btn-black mt-4'
          onClick={refetch}
          disabled={!refetch}
        >
          <RefreshCcw />
          Try Again
        </button>
      </div>
    </div>
  )
}

export default CustomeRefetch