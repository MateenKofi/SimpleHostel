import { create } from "zustand";
import { Room } from "@/helper/types/types";

type SelectedRoomStore = {
  room: Room | null;
  setRoom: (room: Room) => void;
}

export const useSelectedRoomStore = create<SelectedRoomStore>((set) => ({
  room: null,
  setRoom: (room: Room) => set({ room }),
}));
