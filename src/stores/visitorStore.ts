import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Visitor {
  id: string
  name: string
  phone: string
  purpose: string
  residentId: string
  checkInTime: string
  checkOutTime?: string
  status: 'checked-in' | 'checked-out'
}

interface VisitorStore {
  visitors: Visitor[]
  addVisitor: (visitor: Omit<Visitor, 'id' | 'status' | 'checkInTime'>) => void
  checkOutVisitor: (visitorId: string) => void
  getActiveVisitors: () => Visitor[]
  getVisitorHistory: () => Visitor[]
}

export const useVisitorStore = create<VisitorStore>()(
  persist(
    (set, get) => ({
      visitors: [],
      addVisitor: (visitorData) => {
        const visitor: Visitor = {
          id: crypto.randomUUID(),
          ...visitorData,
          checkInTime: new Date().toISOString(),
          status: 'checked-in'
        }
        set((state) => ({
          visitors: [...state.visitors, visitor]
        }))
      },
      checkOutVisitor: (visitorId) => {
        set((state) => ({
          visitors: state.visitors.map((visitor) =>
            visitor.id === visitorId
              ? {
                  ...visitor,
                  status: 'checked-out',
                  checkOutTime: new Date().toISOString()
                }
              : visitor
          )
        }))
      },
      getActiveVisitors: () => {
        return get().visitors.filter(
          (visitor) => visitor.status === 'checked-in'
        )
      },
      getVisitorHistory: () => {
        return get().visitors.filter(
          (visitor) => visitor.status === 'checked-out'
        )
      }
    }),
    {
      name: 'visitor-storage'
    }
  )
) 