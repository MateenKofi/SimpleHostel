import ApproveHostelTable from '@/components/ApproveHostelTable';
import SEOHelmet from '@/components/SEOHelmet';
import React from 'react';


const ApproveHostel: React.FC = () => {
    return (
       <div className='p-6'>
        <SEOHelmet
            title='Approve Hostel - Fuse'
            description='Manage your hostel efficiently with our user-friendly interface.'
            keywords='approve hostel, hostel, Fuse'
        />
        <div className='p-6 border shadow-md rounded-lg bg-white mb-3'>
            <h1 className='text-2xl font-bold'>Approve Hostels</h1>
            <p className='text-gray-500'>Manage hostels here</p>
            <p className='text-gray-700'>Hostel management functionality will be implemented here.</p>
        </div>
        <ApproveHostelTable/>
       </div>
    );
};

export default ApproveHostel;