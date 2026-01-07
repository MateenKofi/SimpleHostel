import { ResidentDto } from "@/types/dtos";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AddedResidentStore = {
    resident: ResidentDto | null;
    setResident: (resident: ResidentDto | null) => void;
}

export const useAddedResidentStore = create<AddedResidentStore>()(
    persist(
        (set) => ({
            resident: null,
            setResident: (resident: ResidentDto | null) => set({ resident }),
        }),
        {
            name: "added-resident-store",
            partialize: (state) => ({ resident: state.resident }),
        }
    )
)
