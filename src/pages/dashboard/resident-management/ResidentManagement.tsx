import { Users, Search, Filter, Download, Plus, Edit } from 'lucide-react'
import { useModal } from '../../../components/Modal'
import DataTable from 'react-data-table-component'
import AddResidentModal from './AddResidentModal'
import { useResidentStore } from '../../../stores/residentStore'
import { HousePlus, Trash2 } from 'lucide-react'
import { Resident } from '../../../types/types'
import { useNavigate } from 'react-router-dom'

const ResidentManagement = () => {
    const navigate = useNavigate()
    const { open: openAddResidentModal, close: closeAddResidentModal } = useModal('add_resident_modal')
    const residents = useResidentStore((state) => state.residents)
    const deleteResident = useResidentStore((state) => state.deleteResident)

    const columns = [
        {
            name: 'Name',
            selector: (row: Resident) => row.fullName,
            sortable: true,
            grow:1,
        },
        {
            name:'Verification',
            selector:(row:Resident)=>row.verificationCode ?? 
            '',
            sortable:true,
            grow:3,
        },
        {
            name: 'Student ID',
            selector: (row: Resident) => row.studentId,
            sortable: true,
        },
        {
            name: 'Phone',
            selector: (row: Resident) => row.phone,
            sortable: true,
        },
        {
            name: 'Room',
            selector: (row: Resident) => row?.roomNumber ? row?.roomNumber : 'Not Assigned',
        },
        {
            name: 'Status',
            selector: (row: Resident) => row.status,
            sortable: true,
            cell: (row: Resident) => (
                <span className={`px-2 py-1 rounded-full text-xs ${
                    row.status === 'active' ? 'bg-green-100 text-green-800' :
                    row.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                }`}>
                    {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                </span>
            ),
        },
        {
            name: 'Action',
            cell: (row: Resident) => (
                <div className="flex gap-2">
                    {!row.roomNumber && (
                        <button
                            title='Assign Room'
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => handleAssignRoom(row)}
                        >
                            <HousePlus className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        title='Edit'
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleDeleteResident(row.id)}
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        title='Delete'
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteResident(row.id)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ]

    const handleAssignRoom = (resident: Resident) => {
        navigate(`/room-assignment/${resident.id}`)
    }

    const handleDeleteResident = (id: string) => {
        if (window.confirm('Are you sure you want to delete this resident?')) {
            deleteResident(id)
        }
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    <h1 className="text-2xl font-bold">Resident Management</h1>
                </div>
                <div className="flex gap-2">
                    <button
                    onClick={()=>{
                        navigate('/room-verification')
                    }}
                    className='px-4 py-2 bg-primary text-white rounded-md'
                    >
                        Verify Resident
                    </button>
                    <button 
                        className="px-4 py-2 bg-primary text-white rounded-md flex items-center gap-2" 
                        onClick={openAddResidentModal}
                    >
                        <Plus className="w-4 h-4" />
                        <span>Resident</span>
                    </button>
                    <button className="px-4 py-2 bg-primary text-white rounded-md flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-4">
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search residents..."
                            className="pl-10 pr-4 py-2 border rounded-md w-[300px]"
                        />
                    </div>
                    <button className="px-4 py-2 border rounded-md flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                </div>

                <DataTable
                    columns={columns}
                    data={residents}
                    pagination
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[10, 20, 30]}
                    highlightOnHover
                    pointerOnHover
                    responsive
                />
            </div>
            <AddResidentModal onClose={closeAddResidentModal} />
        </div>
    )
}

export default ResidentManagement 