import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Room } from '../types/types';

const dummyRooms: Room[] = [
  {
    id: '1',
    roomNumber: 'A101',
    price: 5000,
    floor: 1,
    capacity: 1,
    block: 'A',
    roomType: 'Single',
    status: 'Available',
    maxOccupancy: 1,
    basePrice: 5000,
    amenities: ['Air Conditioning', 'WiFi', 'Study Table'],
    isAvailable: true,
  },
  {
    id: '2',
    roomNumber: 'A102',
    price: 4500,
    capacity: 2,
    floor: 1,
    block: 'A',
    roomType: 'Double',
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
    floor: 2,
    capacity: 3,
    block: 'B',
    roomType: 'Suite',
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
    floor: 1,
    block: 'B',
    roomType: 'Suite',
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
    floor: 3,
    block: 'C',
    roomType: 'Double',
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
    roomType: 'Double',
    status: 'Occupied',
    maxOccupancy: 2,
    floor: 3,
    basePrice: 7000,
    amenities: ['Air Conditioning', 'WiFi', 'Private Bathroom', 'Balcony'],
    isAvailable: true,
  },
];

interface RoomStore {
  rooms: Room[];
  setRooms: (rooms: Room[]) => void;
  selectedRoom: Room | null;
  setSelectedRoom: (room: Room) => void;
  removeSelectedRoom: () => void;
  updateRoomAvailability: (roomId: string, isAvailable: boolean) => void;
  addRoom: (room: Room) => void;
}

export const useRoomStore = create<RoomStore>()(
  persist(
    (set) => ({
      rooms: dummyRooms,
      setRooms: (rooms) => set({ rooms }),
      selectedRoom: null,
      setSelectedRoom: (room) => set({ selectedRoom: room }),
      removeSelectedRoom: () => set({ selectedRoom: null }),
      updateRoomAvailability: (roomId, isAvailable) =>
        set((state) => ({
          rooms: state.rooms.map((room) =>
            room.id === roomId ? { ...room, isAvailable } : room
          ),
        })),
      addRoom: (room) =>
        set((state) => ({
          rooms: [...state.rooms, room],
        })),
    }),
    {
      name: 'room-storage',
    }
  )
);