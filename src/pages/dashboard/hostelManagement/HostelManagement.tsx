import HostelManagementTable from '@/components/HostelManagementTable'
import SEOHelmet from '@/components/SEOHelmet'
import { PageHeader } from "@/components/layout/PageHeader"
import { Building2 } from "lucide-react"

const HostelManagement = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHelmet
        title='Hostel Management - Fuse'
        description='Manage your hostel efficiently with our user-friendly interface.'
        keywords='hostel management, hostel, Fuse'
      />
      <PageHeader
        title="Hostel Management"
        subtitle="Manage and configure hostel properties"
        icon={Building2}
      />
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <HostelManagementTable />
        </div>
      </main>
    </div>
  )
}

export default HostelManagement
