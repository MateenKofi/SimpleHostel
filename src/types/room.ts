export type Room = {
    id: string
    number: string
    block: string
    type: string
    status: 'Available' | 'Occupied' | 'Maintenance'
    maxOccupancy: number
    basePrice: number
} 