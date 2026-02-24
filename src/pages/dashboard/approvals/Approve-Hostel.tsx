import ApproveHostelTable from '@/components/ApproveHostelTable';
import SEOHelmet from '@/components/SEOHelmet';
import { PageHeader } from '@/components/layout/PageHeader';
import { Building2 } from 'lucide-react';
import React from 'react';


const ApproveHostel: React.FC = () => {
    return (
       <div className='p-6'>
        <SEOHelmet
            title='Approve Hostel - Fuse'
            description='Manage your hostel efficiently with our user-friendly interface.'
            keywords='approve hostel, hostel, Fuse'
        />
        <PageHeader
            title='Approve Hostels'
            subtitle='Review and approve hostel registration requests'
            icon={Building2}
        />
        <ApproveHostelTable/>
       </div>
    );
};

export default ApproveHostel;