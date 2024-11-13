import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

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
    status: 'pending' | 'active' | 'inactive';
    roomNumber?: string;
    paymentMethod?: 'cash' | 'momo';
}

interface ResidentStore {
    residents: Resident[];
    addResident: (resident: Resident) => void;
    updateResidentStatus: (id: string, status: 'pending' | 'active' | 'inactive', roomNumber?: string) => void;
    deleteResident: (id: string) => void;
}

export const useResidentStore = create<ResidentStore>()(
    devtools(
        persist(
            (set) => ({
                residents: [],
                addResident: (resident) => 
                    set(
                        (state) => ({ 
                            residents: [...state.residents, {
                                ...resident,
                                status: 'pending',
                                roomNumber: undefined
                            }] 
                        }),
                        false,
                        'residents/add'
                    ),
                updateResidentStatus: (id, status, roomNumber) =>
                    set(
                        (state) => ({
                            residents: state.residents.map(resident =>
                                resident.id === id
                                    ? { ...resident, status, roomNumber }
                                    : resident
                            )
                        }),
                        false,
                        'residents/updateStatus'
                    ),
                deleteResident: (id) => set((state) => ({
                    residents: state.residents.filter(resident => resident.id !== id)
                })),
            }),
            {
                name: 'resident-storage',
            }
        )
    )
)