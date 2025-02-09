import React, { useState, useMemo } from 'react'
import { Users, Search, Filter, Clock, UserPlus } from 'lucide-react'
import DataTable from 'react-data-table-component'
import { useModal } from '../../../components/Modal'
import AddVisitorModal from './AddVisitorModal'
import { format } from 'date-fns'

const VisitorManagement = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active')
  const { open: openAddVisitorModal, close: closeAddVisitorModal } = useModal('add_visitor_modal')
  
  const visitorStore = useVisitorStore()
  const visitors = useMemo(() => 
    activeTab === 'active' ? visitorStore.getActiveVisitors() : visitorStore.getVisitorHistory()
  , [activeTab, visitorStore])
  const checkOutVisitor = useVisitorStore((state) => state.checkOutVisitor)
  const residents = useResidentStore((state) => state.residents)

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
      name: 'Resident',
      selector: (row: Visitor) => {
        const resident = residents.find(r => r.id === row.residentId)
        return resident?.fullName || 'Unknown'
      },
    },
    {
      name: 'Room',
      selector: (row: Visitor) => {
        const resident = residents.find(r => r.id === row.residentId)
        return resident?.roomNumber || 'Not Assigned'
      },
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
    {
      name: 'Action',
      cell: (row: Visitor) => (
        row.status === 'checked-in' && (
          <button
            onClick={() => checkOutVisitor(row.id)}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md"
          >
            Check Out
          </button>
        )
      ),
    },
  ]

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Visitor Management</h1>
        </div>
        <button
          className="px-4 py-2 bg-primary text-white rounded-md flex items-center gap-2"
          onClick={openAddVisitorModal}
        >
          <UserPlus className="w-4 h-4" />
          New Visitor
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-md flex items-center gap-2 ${
              activeTab === 'active' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
            onClick={() => setActiveTab('active')}
          >
            <Clock className="w-4 h-4" />
            Active Visitors
          </button>
          <button
            className={`px-4 py-2 rounded-md flex items-center gap-2 ${
              activeTab === 'history' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
            onClick={() => setActiveTab('history')}
          >
            <Clock className="w-4 h-4" />
            Visitor History
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex justify-between items-center mb-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search visitors..."
              className="pl-10 pr-4 py-2 border rounded-md w-[300px]"
            />
          </div>
          <button className="px-4 py-2 border rounded-md flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Visitor Table */}
        <DataTable
          columns={columns}
          data={visitors}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 30]}
          highlightOnHover
          pointerOnHover
          responsive
        />
      </div>

      <AddVisitorModal onClose={closeAddVisitorModal} />
    </div>
  )
}

export default VisitorManagement 