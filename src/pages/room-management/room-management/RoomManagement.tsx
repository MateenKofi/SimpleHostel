import { Building, Search, Filter, Download, Plus, Edit, Trash2 } from 'lucide-react';
import { useModal } from '../../../components/Modal';
import AddRoomModal from './AddRoomModal';
import AmenitiesModal from '../amenitie/AmenitiesModal';
import axios from 'axios';
import { Room } from '../../../types/types';
import DataTable from 'react-data-table-component';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const columns = [
    {
        name: 'Room Number',
        selector: (row: Room) => row.number,
        sortable: true,
    },
    {
        name: 'Block',
        selector: (row: Room) => row.block,
        sortable: true,
    },
    {
        name: 'Floor',
        selector: (row: Room) => row.floor,
        sortable: true,
    },
    {
        name: 'Type',
        selector: (row: Room) => row.type,
        sortable: true,
    },
    {
        name: 'Price',
        selector: (row: Room) => row.price,
        sortable: true,
    },
    {
        name: 'Status',
        selector: (row: Room) => row.status,
        sortable: true,
    },
    {
        name: 'Actions',
        cell: (row: Room) => (
            <div className="flex gap-2">
                <button className="text-blue-500">
                    <Edit className="w-4 h-4" />
                </button>
                <button className="text-red-500">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        ),
    },
];

const RoomManagement = () => {
    const { open: openAddRoomModal, close: closeAddRoomModal } = useModal('add_room_modal');
    const { open: openAmenitiesModal, close: closeAmenitiesModal } = useModal('amenities_modal');
    const hostelId = localStorage.getItem('hostelId') || '';
    if (!hostelId) {
        console.error('Hostel ID is not defined');
        return <div>Error: Hostel ID is not defined</div>;
    }
    const { data, isLoading, isError } = useQuery({
        queryKey: ["rooms"],
        queryFn: async () => {
          const response = await axios.get(`/api/rooms/hostel/${hostelId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          return response?.data.data;
        },
    });
    // const { data: amenitiesData, isLoading: isAmenitiesLoading, isError: isAmenitiesError } = useQuery<{ data: { id: string; name: string; price: number; }[] }>({
    //     queryKey: ["amenities"],
    //     queryFn: async () => {
    //       const response = await axios.get(`/api/amenities/hostel/${hostelId}`, {
    //         headers: {
    //           Authorization: `Bearer ${localStorage.getItem("token")}`,
    //         },
    //       });
    //       return response?.data;
    //     },
    // });

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
         
            {data?.rooms?.length === 0 ? (
                 <div className="w-full flex justify-center flex-col items-center gap-4 text-center py-4 mt-20">
                 <p>No rooms found. Please add some rooms.</p>
                 <div>
                 <button className="flex gap-2 px-4 py-2 bg-black text-white rounded-md"
                        onClick={() => openAddRoomModal()}
                    >
                        <Plus />
                        <span>Room</span>
                    </button>
                 </div>
             </div>
            ):(
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
                    data={data?.rooms || []}
                    pagination 
                    highlightOnHover
                    responsive
                />
            </div>
            )}
           
        </div>
    );
};

export default RoomManagement;