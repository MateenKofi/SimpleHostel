'use client'
import DataTable from 'react-data-table-component';
import { Building, Search, Filter, Download, Plus, Edit, Trash2 } from 'lucide-react';
import { useModal } from '../../../components/Modal';
import AmenitiesModal from './AmenitiesModal';
import { useQuery } from "@tanstack/react-query";
import axios from 'axios';

const Amenities = () => {
    const { open: openAmenitiesModal, close: closeAmenitiesModal } = useModal('amenities_modal');

    const { data, isLoading, isError } = useQuery({
        queryKey: ["amenities"],
        queryFn: async () => {
          const response = await axios.get(`/api/amenities`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          return response?.data;
        },
    });

    const columns = [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Price',
            selector: row => row.price,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <div className="flex gap-2">
                    <button className="text-white bg-black p-1 rounded flex items-center gap-1">
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                    </button>
                    <button className="text-white bg-black p-1 rounded flex items-center gap-1">
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
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
                    <h1 className="text-2xl font-bold">Amenities Management</h1>
                </div>
                <div className="flex gap-2">
                    <button className="flex gap-2 px-4 py-2 bg-black text-white rounded-md"
                        onClick={() => openAmenitiesModal()}
                    >
                        <Plus />
                        <span>Amenities</span>
                    </button>
                    <AmenitiesModal onClose={closeAmenitiesModal} />
                    <button className="px-4 py-2 bg-black text-white rounded-md flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Import
                    </button>
                </div>
            </div>

            {data?.data?.length === 0 ? (
                <div className="w-full flex justify-center flex-col items-center gap-4 text-center py-4 mt-20">
                    <p>No amenities found. Please add some amenities.</p>
                    <div>
                        <button className="flex gap-2 px-4 py-2 bg-black text-white rounded-md"
                            onClick={() => openAmenitiesModal()}
                        >
                            <Plus />
                            <span>Amenities</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm p-4 ">
                    <div className="flex justify-between items-center mb-4">
                        <div className="relative">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search Amenities..."
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
                        data={data?.data}
                        pagination
                    />
                </div>
            )}
        </div>
    )
}

export default Amenities;