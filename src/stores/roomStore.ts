import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Room } from '../types/room'
import { useResidentStore } from './residentStore'
import { toast } from 'react-hot-toast'

interface RoomStore {
  rooms: Room[]
  setRooms: (rooms: Room[]) => void
  selectedRoom: Room | null
  setSelectedRoom: (room: Room | null) => void
  paymentMethod: 'cash' | 'momo' | ''
  setPaymentMethod: (method: 'cash' | 'momo' | '') => void
  removeSelectedRoom: () => void
  processPayment: (residentId: string) => Promise<void>
}

const dummyRooms: Room[] = [
  {
    id: '1',
    roomNumber: '101',
    price: 5000,
    capacity: 1,
    block: 'A',
    type: 'Single',
    status: 'Available',
    maxOccupancy: 1,
    basePrice: 5000,
    amenities: ['Air Conditioning', 'WiFi', 'Study Table'],
    isAvailable: true,
  },
  {
    id: '2',
    roomNumber: '102', 
    price: 4500,
    capacity: 2,
    block: 'A',
    type: 'Double',
    status: 'Occupied',
    maxOccupancy: 2,
    basePrice: 4500,
    amenities: ['Fan', 'WiFi', 'Private Bathroom'],
    isAvailable: false,
  },
  {
    id: '3',
    roomNumber: '201',
    price: 6000,
    capacity: 3,
    block: 'B',
    type: 'Suite',
    status: 'Available',
    maxOccupancy: 3,
    basePrice: 6000,
    amenities: ['Air Conditioning', 'WiFi', 'Balcony'],
    isAvailable: true,
  },
  {
    id: '4',
    roomNumber: '202',
    price: 5500,
    capacity: 4,
    block: 'B',
    type: 'Suite',
    status: 'Available', 
    maxOccupancy: 4,
    basePrice: 5500,
    amenities: ['Air Conditioning', 'WiFi', 'Study Area'],
    isAvailable: true,
  },
  {
    id: '5',
    roomNumber: '301',
    price: 4000,
    capacity: 2,
    block: 'C',
    type: 'Double',
    status: 'Available',
    maxOccupancy: 2,
    basePrice: 4000,
    amenities: ['Fan', 'Study Table'],
    isAvailable: true,
  },
  {
    id: '6',
    roomNumber: '302',
    price: 7000,
    capacity: 2,
    block: 'C',
    type: 'Double',
    status: 'Occupied',
    maxOccupancy: 2,
    basePrice: 7000,
    amenities: ['Air Conditioning', 'WiFi', 'Private Bathroom', 'Balcony'],
    isAvailable: false,
  },
]

export const useRoomStore = create<RoomStore>()(
  persist(
    (set, get) => ({
      rooms: dummyRooms,
      setRooms: (rooms) => set({ rooms }),
      selectedRoom: null,
      setSelectedRoom: (room) => set({ selectedRoom: room }),
      paymentMethod: '',
      setPaymentMethod: (method) => set({ paymentMethod: method }),
      removeSelectedRoom: () => set({ 
        selectedRoom: null, 
        paymentMethod: '' 
      }),
      processPayment: async (residentId: string) => {
        const { selectedRoom, paymentMethod } = get()
        if (!selectedRoom) return

        try {
          // Update resident status to active and add room number
          const updateResident = useResidentStore.getState().updateResidentStatus
          updateResident(residentId, 'active', selectedRoom.roomNumber)

          // Update room availability
          set((state) => ({
            rooms: state.rooms.map(room =>
              room.id === selectedRoom.id
                ? { 
                    ...room, 
                    isAvailable: false,
                    status: 'Occupied',
                    resident: {
                      id: residentId
                    }
                  }
                : room
            ),
            selectedRoom: null,
            paymentMethod: ''
          }))

          toast.success('Room assigned and payment processed successfully!')
        } catch (error) {
          console.error('Payment processing failed:', error)
          toast.error('Payment processing failed. Please try again.')
          throw error
        }
      }
    }),
    {
      name: 'room-storage',
    }
  )
)
