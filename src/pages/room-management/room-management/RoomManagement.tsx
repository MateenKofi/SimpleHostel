import { Building, Search, Filter, Download, Plus, EyeClosed, Edit, Trash2 } from 'lucide-react';
import { useModal } from '../../../components/Modal';
import AddRoomModal from './AddRoomModal';
import AmenitiesModal from './AmenitiesModal';
import { useRoomStore } from '../../../stores/roomStore';
import { Room } from '../../../types/types';
import DataTable from 'react-data-table-component';

const RoomManagement = () => {
    const { open: openAddRoomModal, close: closeAddRoomModal } = useModal('add_room_modal');
    const { open: openAmenitiesModal, close: closeAmenitiesModal } = useModal('amenities_modal');
    const rooms = useRoomStore(state => state.rooms);

    // Dummy data
    const dummyRooms: Room[] = [
        {
            id: '1',
            gender: 'male',
            roomNumber: 'A101',
            block: 'A',
            roomType: 'Single',
            floor: 1,
            status: 'Available',
            maxOccupancy: 1,
            basePrice: 500,
            currentCapacity: 1,
            amenities: [],
            isAvailable: false,
        },
        {
            id: '2',
            roomNumber: 'A102',
            gender: 'male',
            block: 'A',
            roomType: 'Double',
            floor: 2,
            status: 'Occupied',
            maxOccupancy: 2,
            basePrice: 800,
            currentCapacity: 1,
            amenities: [],
            isAvailable: false
        },
        {
            id: '3',
            roomNumber: 'B201',
            block: 'B',
            roomType: 'Single',
            floor: 3,
            status: 'Maintenance',
            maxOccupancy: 1,
            basePrice: 600,
            currentCapacity: 0,
            gender: 'female',
            amenities: [],
            isAvailable: false
        }
    ];

    // Combine dummy data with rooms from store
    const allRooms = [...dummyRooms, ...rooms];

    const getStatusColor = (status: Room['status']) => {
        switch (status) {
            case 'Occupied':
                return 'bg-blue-100 text-blue-800';
            case 'Available':
                return 'bg-green-100 text-green-800';
            case 'Maintenance':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const calculateTotalPrice = (room: Room) => {
        const totalPrice = room.basePrice;
        return totalPrice;
    };

    const columns = [
        {
            name: 'Room',
            selector: (row: Room) => row.roomNumber,
            sortable: true,
        },
        {
            name: 'Block',
            selector: (row: Room) => `Block ${row.block}`,
            sortable: true,
        },
        {
            name: 'Type',
            selector: (row: Room) => row.roomType,
            sortable: true,
        },
        {
            name:'Gender',
            cell: (row: Room) => (
                <span className={`px-2 py-1 rounded-full text-xs capitalize`}>
                    {row.gender}
                </span>
            ),
            sortable: true,
        },
        {
            name: 'Status',
            cell: (row: Room) => (
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(row.status)}`}>
                    {row.status}
                </span>
            ),
            sortable: true,
        },
        {
            name: 'Occupancy',
            selector: (row: Room) => `${row.currentCapacity}/${row.maxOccupancy}`,
            sortable: true,
        },
        {
            name: 'Price',
            selector: (row: Room) => `₵${calculateTotalPrice(row)}`,
            sortable: true,
        },
        {
            name: 'Actions',
            grow:2,
            cell: (row: Room) => (
             <div className=' flex gap-2'>
                   <button className="text-white bg-primary p-1 rounded-sm">
                  <EyeClosed size={18} />
                </button>
                <button className="text-white bg-primary p-1 rounded-sm">
                  <Edit size={18}/>
                </button>
                <button className="text-white bg-primary p-1 rounded-sm">
                  <Trash2 size={18}/>
                </button>
             </div>

            ),
        },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <Building className="w-6 h-6" />
                    <h1 className="text-2xl font-bold">Room Management</h1>
                </div>
                <div className="flex gap-2">
                    <button className="flex gap-2 px-4 py-2 bg-black text-white rounded-md"
                        onClick={() => openAddRoomModal()}
                    >
                        <Plus />
                        <span>Room</span>
                    </button>
                    <button className="flex gap-2 px-4 py-2 bg-black text-white rounded-md"
                        onClick={() => openAmenitiesModal()}
                    >
                        <Plus />
                        <span>Amenities</span>
                    </button>
                    <AddRoomModal onClose={closeAddRoomModal} />
                    <AmenitiesModal onClose={closeAmenitiesModal} />
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

                <DataTable
                    columns={columns}
                    data={allRooms}
                    pagination
                />
            </div>
        </div>
    );
};

export default RoomManagement;