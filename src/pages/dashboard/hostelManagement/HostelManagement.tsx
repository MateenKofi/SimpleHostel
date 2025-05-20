import HostelManagementTable from '@/components/HostelManagementTable'
import SEOHelmet from '@/components/SEOHelmet'

const HostelManagement = () => {
  return (
    <div className='p-6'>
      <SEOHelmet
        title='Hostel Management - Fuse'
        description='Manage your hostel efficiently with our user-friendly interface.'
        keywords='hostel management, hostel, Fuse'
      />
        <div className='flex  justify-between items-center  p-6 border shadow-md rounded-lg bg-white mb-3'>
           <div> <h1 className='text-2xl font-bold text-gray-500'>Hostel Managment</h1>
            <p className='text-gray-500 italic'>Manage hostels here</p>
            <p className='text-gray-700 italic'>Hostel management functionality will be implemented here.</p></div>
        </div>
      <HostelManagementTable/>
    </div>
  )
}

export default HostelManagement
