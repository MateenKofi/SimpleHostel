import { create } from 'zustand';
import { Staff } from '../types/types';
interface StaffStore {
  staffList: Staff[];
  addStaff: (staff: Staff) => void;
  updateStaff: (id: string, staff: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;
}

export const useStaffStore = create<StaffStore>((set) => ({
  staffList: [],
  addStaff: (staff) =>
    set((state) => ({ staffList: [...state.staffList, staff] })),
  updateStaff: (id, updatedStaff) =>
    set((state) => ({
      staffList: state.staffList.map((staff) =>
        staff.id === id ? { ...staff, ...updatedStaff } : staff
      ),
    })),
  deleteStaff: (id) =>
    set((state) => ({
      staffList: state.staffList.filter((staff) => staff.id !== id),
    })),
})); 