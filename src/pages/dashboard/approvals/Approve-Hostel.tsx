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
            backgroundImage="https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?auto=format&fit=crop&w=1200&q=80"
        />
        <ApproveHostelTable/>
       </div>
    );
};

export default ApproveHostel;