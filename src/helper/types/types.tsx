export type Resident = {
  id: string | null;
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

export type Visitor = {
  id: string;
  name: string;
  phone: string;
  residentId: string;
  purpose: string;
  checkInTime: string;
  checkOutTime?: string;
  timeIn: string;
  timeOut: string;
  status: "ACTIVE" | "CHECKED_OUT";
  resident?: Resident;
};

export type Room = {
  id: string;
  hallId: string;
  hostelId:string;
  gender: string;
  name: string;
  roomNumber: string;
  floor?: number | string;
  block?: string;
  roomType: "single" | "double" | "suit" | "quard";
  status: "AVAILABLE" | "MANTENANCE" | "OCCUPIED";
  capacity: number;
  currentStudentsCount: number;
  maxOccupancy: number;
  maxCap: number;
  currentResidentCount: number;
  price: number;
  basePrice: number;
  amenities: string[];
  isAvailable: boolean;
  resident?: Resident;
  description?: string;
  number: string;
  type: string;
  updatedAt?: string;
  createdAt?: string;
  RoomImages?: images[] | undefined | null;
  RoomImage?: images[] | undefined | null;
  images?: images[] | undefined | null;
  Amenities?: Amenity[];
};

export type images = {
  id: string;
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

export type Users = {
  id: string;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  imageUrl: string | null;
  imageKey: string | null;
  delFlag: boolean;
  hostelId: string | null;
  hostel: Hostel;
};

export type Hostel = {
  id: string;
  name:string;
  description: string | null;
  address: string;
  location:string;
  manager:string;
  email: string;
  gender:string;
  phone: string;
  imageKey:string;
  imageUrl:string;
  ghCard:string;
  createdAt: string;
  updatedAt: string;
  isVerifeid: boolean;
  delFlag: boolean;
  HostelImages: images [];
  state: "PUBLISHED" | "UNPULISHED";
  Rooms: Room [];
  Staffs?: Staff [];
  User?:Users [];
  CalendarYear?: CalendarYearT[];
};
