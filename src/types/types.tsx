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
    verificationCode?: string;
} 

export type Room = {
    id: string
    roomNumber: string
    price: number
    floor: number
    capacity: number
    block: string
    roomType: 'Single'|'Double'|'Suite'|'Quad'
    status: 'Available' | 'Maintenance' | 'Occupied';
    maxOccupancy: number
    basePrice: number
    amenities: string[]
    isAvailable: boolean
    resident?: Resident
    description?: string
} 

export type Amenity = {
    name: string;
    price: number;
}

export type Staff = {
    id: string
    firstName: string;
    middleName?: string;
    lastName: string;
    dateOfBirth: string;
    nationality: string;
    gender: string;
    religion: string;
    maritalStatus: string;
    ghanaCardNumber: string;
    phoneNumber: string;
    email: string;
    residence: string;
    qualification: string;
    staffType: string;
    block: string;
    dateOfAppointment: string;
    staffStatus: "Active" | "Inactive";
  }