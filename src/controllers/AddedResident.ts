import { Resident } from "@/helper/types/types";
import {create} from "zustand";
import { persist } from "zustand/middleware";

type AddedResidentStore ={
    resident: Resident | null;
    setResident: (resident: Resident) => void;
}

export const useAddedResidentStore = create<AddedResidentStore>()(
    persist(
        (set) => ({
            resident: null,
            setResident: (resident: Resident) => set({ resident }),
        }),
        {
            name: "added-resident-store",
            partialize: (state) => state.resident,
        }
    )
)