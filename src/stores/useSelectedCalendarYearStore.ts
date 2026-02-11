import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CalendarYearT } from "@/helper/types/types";

interface SelectedCalendarYearStore {
    calendarYear: CalendarYearT | null;
    setCalendarYear: (calendarYear: CalendarYearT | null) => void;
}

export const useSelectedCalendarYearStore = create<SelectedCalendarYearStore>()(
    persist(
        (set) => ({
            calendarYear: null,
            setCalendarYear: (calendarYear: CalendarYearT | null) => set({ calendarYear }),
        }),
        {
            name: 'selected-calendar-year-store',
            partialize: (state) => ({ calendarYear: state.calendarYear }),
        }
    )
)
