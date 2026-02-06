import { ResidentDto, UserDto } from "@/types/dtos";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AddedResidentStore = {
    resident: UserDto | ResidentDto | null;
    setResident: (resident: UserDto | ResidentDto | null) => void;
}

export const useAddedResidentStore = create<AddedResidentStore>()(
    persist(
        (set) => ({
            resident: null,
            setResident: (resident: UserDto | ResidentDto | null) => set({ resident }),
        }),
        {
            name: "added-resident-store",
            partialize: (state) => ({ resident: state.resident }),
        }
    )
)
