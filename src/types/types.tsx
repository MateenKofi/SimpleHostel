export type Resident = {
    id: string;
    fullName: string;
    studentId: string;
    gender:string;
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
    hostelId: string
    gender: string
    roomNumber: string
    floor?: number | string
    block?: string
    roomType: 'single'|'double'|'suit'|'quard'
    status: 'AVAILABLE' | 'MANTENANCE' | 'OCCUPIED';
    maxCap: number
    currentResidentCount:number
    maxOccupancy: number
    currentCapacity: number
    price: number
    basePrice: number
    amenities: string[]
    isAvailable: boolean
    resident?: Resident
    description?: string
    number:string
    type:string
    RoomImage:string[]
    Amenities: Amenity[]
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
    role:string;
  }

  export type CalendarYearT = {
    id: string
    name: string
    hostelId: string
    startDate: Date
    endDate?: Date | null
    isActive: boolean
    financialReport?: {
      totalRevenue: number
      totalExpenses: number
    }
    Residents?: Resident[]
  }
  