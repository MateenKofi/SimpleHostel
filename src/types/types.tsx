export type Resident = {
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

export type Room = {
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
    resident?: Resident
} 

export type Amenity = {
    name: string;
    price: number;
}