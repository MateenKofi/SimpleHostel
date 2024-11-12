import React, { useEffect } from 'react'
import Modal from '../../../components/Modal'
import { useForm } from 'react-hook-form'
import { useRoomStore } from '../../../stores/roomStore'
import toast from 'react-hot-toast'

interface RoomForm {
    number: string;
    block: string;
    floor: number;
    type: 'Single' | 'Double' | 'Suite';
    maxOccupancy: number;
    basePrice: number;
    amenities: string[];
    status: 'Available' | 'Maintenance' | 'Occupied';
    description?: string;
}

const ROOM_TYPES = ['Single', 'Double', 'Suite'] as const
const ROOM_STATUS = ['Available', 'Maintenance', 'Occupied'] as const
const AMENITIES = [
    'Air Conditioning',
    'Private Bathroom',
    'Study Desk',
    'Wardrobe',
    'Mini Fridge',
    'Balcony',
    'WiFi',
    'TV',
] as const

const BASE_PRICES = {
    Single: 1000,
    Double: 1800,
    Suite: 2500
}

const AMENITY_PRICES = {
    'Air Conditioning': 100,
    'Private Bathroom': 200,
    'Study Desk': 50,
    'Wardrobe': 50,
    'Mini Fridge': 100,
    'Balcony': 150,
    'WiFi': 50,
    'TV': 100
}

const AddRoomModal = ({
    onClose
}: {
    onClose: () => void;
}) => {
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<RoomForm>({
        defaultValues: {
            maxOccupancy: 1,
            amenities: [],
            status: 'Available'
        }
    })

    const roomType = watch('type')
    const selectedAmenities = watch('amenities')

    const addRoom = useRoomStore(state => state.addRoom)

    useEffect(() => {
        // Set maxOccupancy based on room type
        if (roomType === 'Single') setValue('maxOccupancy', 1)
        else if (roomType === 'Double') setValue('maxOccupancy', 2)
        else if (roomType === 'Suite') setValue('maxOccupancy', 3)

        // Calculate base price
        let totalPrice = BASE_PRICES[roomType] || 0
        
        // Add amenity prices
        if (selectedAmenities) {
            totalPrice += selectedAmenities.reduce((sum, amenity) => 
                sum + (AMENITY_PRICES[amenity as keyof typeof AMENITY_PRICES] || 0), 0)
        }

        setValue('basePrice', totalPrice)
    }, [roomType, selectedAmenities, setValue])

    const onSubmit = (data: RoomForm) => {
        try {
            // Generate a random ID for the room
            const newRoom = {
                ...data,
                id: Math.random().toString(36).substr(2, 9),
                currentOccupants: 0
            }
            addRoom(newRoom)
            toast.success('Room added successfully')
            onClose()
        } catch (error) {
            toast.error('Failed to add room')
            console.error(error)
        }
    }

    return (
        <Modal modalId="add_room_modal" onClose={onClose}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Add New Room</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Room Number */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="number" className="text-sm font-medium">
                            Room Number*
                        </label>
                        <input
                            {...register('number', { required: 'Room number is required' })}
                            type="text"
                            id="number"
                            placeholder="e.g., A101"
                            className="border rounded-md p-2"
                        />
                        {errors.number && (
                            <span className="text-red-500 text-sm">{errors.number.message}</span>
                        )}
                    </div>

                    {/* Block */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="block" className="text-sm font-medium">
                            Block*
                        </label>
                        <input
                            {...register('block', { required: 'Block is required' })}
                            type="text"
                            id="block"
                            placeholder="e.g., A"
                            className="border rounded-md p-2"
                        />
                        {errors.block && (
                            <span className="text-red-500 text-sm">{errors.block.message}</span>
                        )}
                    </div>

                    {/* Floor */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="floor" className="text-sm font-medium">
                            Floor*
                        </label>
                        <input
                            {...register('floor', { 
                                required: 'Floor is required',
                                min: { value: 1, message: 'Floor must be at least 1' }
                            })}
                            type="number"
                            id="floor"
                            className="border rounded-md p-2"
                        />
                        {errors.floor && (
                            <span className="text-red-500 text-sm">{errors.floor.message}</span>
                        )}
                    </div>

                    {/* Room Type */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="type" className="text-sm font-medium">
                            Room Type*
                        </label>
                        <select
                            {...register('type', { required: 'Room type is required' })}
                            id="type"
                            className="border rounded-md p-2"
                        >
                            {ROOM_TYPES.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        {errors.type && (
                            <span className="text-red-500 text-sm">{errors.type.message}</span>
                        )}
                    </div>

                    {/* Max Occupancy (Read-only) */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="maxOccupancy" className="text-sm font-medium">
                            Maximum Occupancy
                        </label>
                        <input
                            {...register('maxOccupancy')}
                            type="number"
                            id="maxOccupancy"
                            className="border rounded-md p-2 bg-gray-100"
                            readOnly
                        />
                    </div>

                    {/* Base Price (Read-only) */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="basePrice" className="text-sm font-medium">
                            Base Price
                        </label>
                        <input
                            {...register('basePrice')}
                            type="number"
                            id="basePrice"
                            className="border rounded-md p-2 bg-gray-100"
                            readOnly
                        />
                    </div>
                </div>

                {/* Status */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="status" className="text-sm font-medium">
                        Status*
                    </label>
                    <select
                        {...register('status')}
                        id="status"
                        className="border rounded-md p-2"
                    >
                        {ROOM_STATUS.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>

                {/* Amenities */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Amenities</label>
                    <div className="grid grid-cols-2 gap-2">
                        {AMENITIES.map(amenity => (
                            <label key={amenity} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    value={amenity}
                                    {...register('amenities')}
                                />
                                {amenity} (+${AMENITY_PRICES[amenity]})
                            </label>
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="description" className="text-sm font-medium">
                        Description
                    </label>
                    <textarea
                        {...register('description')}
                        id="description"
                        rows={3}
                        className="border rounded-md p-2"
                        placeholder="Additional details about the room..."
                    />
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-white rounded-md"
                    >
                        Add Room
                    </button>
                </div>
            </form>
        </Modal>
    )
}

export default AddRoomModal
