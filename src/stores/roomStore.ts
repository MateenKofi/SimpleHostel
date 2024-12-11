import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Room } from '../types/types';

const dummyRooms: Room[] = [
  {
    id: '1',
    roomNumber: 'A101',
    floor: 1,
    currentCapacity: 0,
    gender: 'female',
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
    currentCapacity: 0,
    gender: 'male',
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
    floor: 2,
    currentCapacity: 1,
    gender: 'male',
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
    roomNumber: 'B202',
    currentCapacity: 2,
    gender: 'female',
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
    roomNumber: 'C301',
    currentCapacity: 0,
    gender: 'female',
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
    roomNumber: 'C302',
    currentCapacity: 2,
    gender: 'male',
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
  updateRoomCapacity: (roomId: string, newCapacity: number) => void;
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
      updateRoomCapacity: (roomId, newCapacity) =>
        set((state) => ({
          rooms: state.rooms.map((room) => {
            if (room.id === roomId) {
              const updatedRoom = {
                ...room,
                currentCapacity: newCapacity,
                status: newCapacity >= room.maxOccupancy ? 'Occupied' : 'Available' as 'Available' | 'Occupied',
                isAvailable: newCapacity < room.maxOccupancy,
              };
              return updatedRoom;
            }
            return room;
          }),
        })),
    }),
    {
      name: 'room-storage',
    }
  )
);