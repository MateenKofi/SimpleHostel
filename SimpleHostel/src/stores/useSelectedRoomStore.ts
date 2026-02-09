import { create } from "zustand";
import { Room } from "@/helper/types/types";
import { persist } from "zustand/middleware";

type SelectedRoomStore = {
    room: Room | null;
    setRoom: (room: Room) => void;
};

export const useSelectedRoomStore = create<SelectedRoomStore>()(
    persist(
        (set) => ({
            room: null,
            setRoom: (room: Room) => set({ room }),
        }),
        {
            name: "selected-room-store",
            partialize: (state) => state.room,
        }
    )
);
