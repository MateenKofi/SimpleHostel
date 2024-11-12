import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface Resident {
    id: string;
    fullName: string;
    studentId: string;
    email: string;
    phone: string;
    course: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    emergencyContactRelation: string;
    status: 'Pending' | 'Active' | 'Inactive';
    roomNumber?: string;
}

interface ResidentStore {
    residents: Resident[];
    addResident: (resident: Resident) => void;
}

export const useResidentStore = create<ResidentStore>()(
    devtools(
        (set) => ({
            residents: [],
            addResident: (resident) => 
                set(
                    (state) => ({ residents: [...state.residents, resident] }),
                    false,
                    'residents/add'
                ),
        })
    )
) 