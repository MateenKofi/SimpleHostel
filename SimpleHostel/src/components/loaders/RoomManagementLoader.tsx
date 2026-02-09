import React from 'react'
import TableLoader from './TableLoader'

const RoomManagementLoader = () => {
  return (
    <div className="p-6">
           {/* Loading skeleton UI */}
           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-3">
             {[0, 1, 2, 3].map((_, index) => (
               <div key={index} className="bg-gray-200 rounded-lg shadow-sm p-4">
                 <div className="flex items-center gap-2 mb-4">
                   <div className="w-6 h-6 bg-gray-300 rounded-full animate-pulse"></div>
                   <div className="h-6 bg-gray-300 rounded-md w-32 animate-pulse"></div>
                 </div>
                 <div className="h-14 w-14 bg-gray-300 rounded-md animate-pulse"></div>
                 <div className="h-6 w-full bg-gray-300 rounded-md animate-pulse mt-1"></div>
               </div>
             ))}
           </div>
           <div className="flex justify-between items-center mb-6">
             <div className="px-4 py-2 bg-gray-300 rounded-md w-24 animate-pulse"></div>
             <div className="flex gap-2">
               <div className="px-4 py-2 bg-gray-300 rounded-md w-24 animate-pulse"></div>
               <div className="px-4 py-2 bg-gray-300 rounded-md w-24 animate-pulse"></div>
               <div className="px-4 py-2 bg-gray-300 rounded-md w-24 animate-pulse"></div>
             </div>
           </div>
           <TableLoader />
         </div>
  )
}

export default RoomManagementLoader