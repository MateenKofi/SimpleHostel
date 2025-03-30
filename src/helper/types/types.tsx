export type Resident = {
  id: string;
  name: string;
  studentId: string;
  course: string;
  phone: string;
  email: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  relationship: string;
  roomId: string;
  gender: string;
  roomAssigned: boolean;
  createdAt: string;
  updatedAt: string;
  amountPaid: number | null;
  balanceOwed: number | null;
  roomPrice: number;
  delFlag: boolean;
  calendarYearId: string;
  hostelId: string | null;
  room?: Omit<Room, "resident">;
};

export type Room = {
  id: string;
  hostelId: string;
  gender: string;
  roomNumber: string;
  floor?: number | string;
  block?: string;
  roomType: "single" | "double" | "suit" | "quard";
  status: "AVAILABLE" | "MANTENANCE" | "OCCUPIED";
  maxCap: number;
  currentResidentCount: number;
  maxOccupancy: number;
  currentCapacity: number;
  price: number;
  basePrice: number;
  amenities: string[];
  isAvailable: boolean;
  resident?: Resident;
  description?: string;
  number: string;
  type: string;
  RoomImage?: images[] | undefined | null;
  images?:images[] | undefined | null;
  Amenities?: Amenity[];
};

export type images = {
  id:string;
  roomId?: string;
  imageUrl: string;
  imageKey: string;
  createdAt?: string;
  updatedAt?: string;
  delFlag?: boolean;
};

export type Amenity = {
  id: string;
  name: string;
  price: number;
};

export type Staff = {
  id: string;
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
  role: string;
};

export type CalendarYearT = {
  id: string;
  name: string;
  hostelId: string;
  startDate: Date;
  endDate?: Date | null;
  isActive: boolean;
  financialReport?: {
    totalRevenue: number;
    totalExpenses: number;
  };
  HistoricalResident?: Resident[];
  Residents?: Resident[];
};
