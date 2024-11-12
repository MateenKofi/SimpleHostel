import { create } from 'zustand'
import { Room } from '../types/room'

interface RoomStore {
  rooms: Room[]
  addRoom: (room: Room) => void
  // Add other actions as needed (updateRoom, deleteRoom, etc.)
}

export const useRoomStore = create<RoomStore>((set) => ({
  rooms: [],
  addRoom: (room) => set((state) => ({ 
    rooms: [...state.rooms, room] 
  })),
}))
