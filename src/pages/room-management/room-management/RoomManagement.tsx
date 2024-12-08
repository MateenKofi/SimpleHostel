import { Building, Search, Filter, Download, Plus } from 'lucide-react'
import { useModal } from '../../../components/Modal';
import AddRoomModal from './AddRoomModal';
import AmenitiesModal from './AmenitiesModal';
import { useRoomStore } from '../../../stores/roomStore'
import { Room } from '../../../types/room'

const RoomManagement = () => {
    const {open:openAddRoomModal,close:closeAddRoomModal} = useModal('add_room_modal')
    const {open: openAmenitiesModal, close: closeAmenitiesModal} = useModal('amenities_modal')
    const rooms = useRoomStore(state => state.rooms)

    // Dummy data
    const dummyRooms: Room[] = [
        {
            id: '1',
            roomNumber: '101',
            block: 'A',
            type: 'Single',
            status: 'Available',
            maxOccupancy: 1,
            basePrice: 500,
            price: 500,
            capacity: 1,
            amenities: [],
            isAvailable: true
        },
        {
            id: '2', 
            roomNumber: '102',
            block: 'A',
            type: 'Double',
            status: 'Occupied',
            maxOccupancy: 2,
            basePrice: 800,
            price: 800,
            capacity: 2,
            amenities: [],
            isAvailable: false
        },
        {
            id: '3',
            roomNumber: '201',
            block: 'B', 
            type: 'Single',
            status: 'Maintenance',
            maxOccupancy: 1,
            basePrice: 600,
            price: 600,
            capacity: 1,
            amenities: [],
            isAvailable: false
        }
    ]

    // Combine dummy data with rooms from store
    const allRooms = [...dummyRooms, ...rooms]

    const getStatusColor = (status: Room['status']) => {
        switch (status) {
            case 'Occupied':
                return 'bg-blue-100 text-blue-800'
            case 'Available':
                return 'bg-green-100 text-green-800'
            case 'Maintenance':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const calculateTotalPrice = (room: Room) => {
        const totalPrice = room.basePrice;
        return totalPrice;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <Building className="w-6 h-6" />
                    <h1 className="text-2xl font-bold">Room Management</h1>
                </div>
                <div className="flex gap-2">
                    <button className="flex gap-2 px-4 py-2 bg-black text-white rounded-md"
                    onClick={()=>openAddRoomModal()}
                        >
                            <Plus/>
                            <span>
                        Room
                            </span>
                    </button>
                    <button className="flex gap-2 px-4 py-2 bg-black text-white rounded-md"
                    onClick={()=>openAmenitiesModal()}
                        >
                            <Plus/>
                            <span>
                         Amenities
                            </span>
                    </button>
                    <AddRoomModal onClose={closeAddRoomModal}/>
                    <AmenitiesModal onClose={closeAmenitiesModal}/>
                    <button className="px-4 py-2 bg-black text-white rounded-md flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Total Rooms', value: allRooms.length.toString(), color: 'bg-blue-100' },
                    { label: 'Occupied', value: allRooms.filter(r => r.status === 'Occupied').length.toString(), color: 'bg-green-100' },
                    { label: 'Available', value: allRooms.filter(r => r.status === 'Available').length.toString(), color: 'bg-yellow-100' },
                    { label: 'Maintenance', value: allRooms.filter(r => r.status === 'Maintenance').length.toString(), color: 'bg-red-100' },
                ].map((stat, index) => (
                    <div key={index} className={`${stat.color} p-4 rounded-lg`}>
                        <h3 className="text-lg font-semibold">{stat.label}</h3>
                        <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-4">
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search rooms..."
                            className="pl-10 pr-4 py-2 border rounded-md w-[300px]"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 border rounded-md flex items-center gap-2">
                            <Filter className="w-4 h-4" />
                            Filter
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Room Number
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Block
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Occupancy
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price/Month
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {allRooms.map((room) => (
                                <tr key={room.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {room.roomNumber}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        Block {room.block}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {room.type}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(room.status)}`}>
                                            {room.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        0/{room.maxOccupancy}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        ${calculateTotalPrice(room)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button className="text-blue-600 hover:text-blue-900">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-gray-500">
                        Showing {allRooms.length} rooms
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 border rounded-md">Previous</button>
                        <button className="px-4 py-2 border rounded-md">Next</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RoomManagement 