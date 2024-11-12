import React, { useState } from 'react'
import { Users, Search, Filter, Download } from 'lucide-react'
import AssignRoomModal from './AssignRoomModal'
import { useModal } from '../../../components/Modal';

interface Resident {
    id: string;
    name: string;
    room: string;
    status: 'Active' | 'Pending' | 'Inactive';
    checkInDate: string;
    checkOutDate: string;
}

const ResidentManagement = () => {
    const {open:openAssignModal,close:closeAssignModal} = useModal('assign_room_modal')
    const [residents] = useState<Resident[]>([
        {
            id: '1',
            name: 'John Doe',
            room: 'A-101',
            status: 'Active',
            checkInDate: '2024-09-01',
            checkOutDate: '2024-12-20'
        },
        {
            id: '2',
            name: 'Jane Smith',
            room: 'B-203',
            status: 'Pending',
            checkInDate: '2024-09-01',
            checkOutDate: '2024-12-20'
        },
        // Add more mock data as needed
    ])

    const [selectedResidentId, setSelectedResidentId] = useState<string | null>(null);

    const handleAssignRoom = (residentId: string) => {
        setSelectedResidentId(residentId);
        openAssignModal()
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    <h1 className="text-2xl font-bold">Resident Management</h1>
                </div>
                <div className="flex gap-2">
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

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Room
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Check In
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Check Out
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {residents.map((resident) => (
                                <tr key={resident.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {resident.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {resident.room}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            resident.status === 'Active' ? 'bg-green-100 text-green-800' :
                                            resident.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {resident.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(resident.checkInDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(resident.checkOutDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button 
                                            onClick={() => handleAssignRoom(resident.id)}
                                            className="px-4 py-2 bg-primary text-white rounded-md"
                                        >
                                            Assign Room
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-gray-500">
                        Showing {residents.length} residents
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 border rounded-md">Previous</button>
                        <button className="px-4 py-2 border rounded-md">Next</button>
                    </div>
                </div>
            </div>

            <AssignRoomModal
                residentId={selectedResidentId!}
                onClose={closeAssignModal}
            />
        </div>
    )
}

export default ResidentManagement 