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

export type Staff = {
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