import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Resident } from '../types/types';
import { useRoomStore } from './roomStore';

interface Debtor {
  residentId: string;
  originalAmount: number;
  partialPayment: number;
}

interface ResidentStore {
  residents: Resident[];
  debtorsList: Debtor[];
  
  addResident: (resident: Resident) => void;
  updateResidentStatus: (
    id: string,
    status: 'pending' | 'active' | 'inactive',
    roomNumber?: string,
    paymentMethod?: 'cash' | 'momo',
    verificationCode?: string
  ) => void;
  deleteResident: (id: string) => void;
  processPayment: (residentId: string, paymentMethod: 'cash' | 'momo', verificationCode: string, paymentAmount: number) => Promise<void>;
  addToDebtorsList: (residentId: string, originalAmount: number, partialPayment: number) => void;
}

export const useResidentStore = create<ResidentStore>()(
  devtools(
    persist(
      (set) => ({
        residents: [],
        debtorsList: [],
        addResident: (resident) =>
          set(
            (state) => ({
              residents: [
                ...state.residents,
                {
                  ...resident,
                  status: 'pending',
                  roomNumber: undefined,
                  verificationCode: undefined,
                },
              ],
            }),
            false,
            'residents/add'
          ),
        updateResidentStatus: (id, status, roomNumber, paymentMethod, verificationCode) =>
          set(
            (state) => ({
              residents: state.residents.map((resident) =>
                resident.id === id
                  ? { ...resident, status, roomNumber, paymentMethod, verificationCode }
                  : resident
              ),
            }),
            false,
            'residents/updateStatus'
          ),
        processPayment: async (residentId, paymentMethod, verificationCode, paymentAmount) => {
          const { selectedRoom, updateRoomCapacity } = useRoomStore.getState();
          if (!selectedRoom) return;

          // Update resident status and verification code
          set((state) => ({
            residents: state.residents.map((resident) =>
              resident.id === residentId
                ? { ...resident, status: 'active', roomNumber: selectedRoom.roomNumber, paymentMethod, verificationCode }
                : resident
            ),
          }));

          // Update room capacity
          updateRoomCapacity(selectedRoom.id, selectedRoom.currentCapacity + 1);
        },
        addToDebtorsList: (residentId, originalAmount, partialPayment) => {
          set((state) => ({
            debtorsList: [...state.debtorsList, { residentId, originalAmount, partialPayment }],
          }));
        },
        deleteResident: (id) =>
          set((state) => ({
            residents: state.residents.filter((resident) => resident.id !== id),
          })),
      }),
      {
        name: 'resident-storage',
      }
    )
  )
);