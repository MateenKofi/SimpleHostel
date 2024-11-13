export interface Room {
    id: string
    roomNumber: string
    price: number
    capacity: number
    block: string
    type: string
    status: string
    maxOccupancy: number
    basePrice: number
    amenities: string[]
    isAvailable: boolean
    resident?: {
        id: string
    }
} 