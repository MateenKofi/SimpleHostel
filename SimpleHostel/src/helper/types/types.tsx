export type Resident = {
  id?: string | null;
  name: string;
  studentId: string | null;
  course: string | null;
  phone: string | null;
  email: string;
  accessCode?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  relationship?: string | null;
  roomId: string | null;
  gender: string | null;
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

export type Deptors = Resident

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

export type RoomResident = {
  id: string;
  userId: string;
  roomId: string | null;
  studentId: string | null;
  course: string | null;
  status: string;
  checkInDate: string | null;
  checkOutDate: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  emergencyContactRelationship: string | null;
  // User fields
  name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  avatar?: string | null;
  imageUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type Room = {
  id: string;
  hallId: string;
  hostelId: string;
  gender: string;
  name: string;
  roomNumber: string;
  number: string;
  floor?: number | string;
  block?: string;
  type: "single" | "double" | "suite" | "quad";
  status: "available" | "maintenance" | "occupied";
  capacity: number;
  currentStudentsCount: number;
  maxOccupancy: number;
  maxCap: number;
  currentResidentCount: number;
  price: number;
  basePrice: number;
  rooms?: Room[]; // This might be used in some contexts? Unlikely for a Room object to have rooms, but let's leave existing structure or just fix Room properties.
  // Aligning with JSON:
  amenities: Amenity[]; // JSON shows amenities as array (likely of objects based on other parts, or strings? user json shows empty array. Amenity type exists).
  // But wait, line 60 was amenities: string[]. Line 71 was Amenities?: Amenity[].
  // I will unify to amenities: Amenity[] if that fits the pattern, or keep both if unsure, but strict mapping is better.
  // The backend seems to use camelCase "amenities".
  // Let's add roomImages.
  roomImages: images[];
  RoomImages?: images[] | undefined | null; // Keeping for backward compat if needed, but prefereably remove. I will keep for now to avoid breaking other files blindly.
  RoomImage?: images[] | undefined | null;
  images?: images[] | undefined | null;
  createdAt?: string;
  updatedAt?: string;
  description?: string | null;
  Amenities?: Amenity[];
  // Residents with full user details
  residents?: RoomResident[];
  // Hostel information (optional, may not always be included)
  hostel?: {
    id: string;
    name: string;
    location: string;
    address: string;
    logoUrl: string | null;
  } | null;
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
  changedPassword: boolean;
};

export type Hostel = {
  id: string;
  name: string;
  description: string | null;
  address: string;
  location: string;
  manager: string;
  email: string;
  phone: string;
  ghCard: string;
  state: "published" | "unpublished";
  isVerified: boolean;
  logoKey: string | null;
  logoUrl: string | null;
  createdAt: string;
  updatedAt: string;
  rulesUrl: string | null;
  rulesKey: string | null;
  deletedAt: string | null;
  allowPartialPayment: boolean;
  partialPaymentPercentage: number;
  rooms: Room[];
  staffProfiles: Staff[];
  adminProfiles: Users[]; // Using Users type for admins based on response
  residentProfiles: Resident[];
  amenities: Amenity[];
  hostelImages: images[];
  calendarYears: CalendarYearT[];
  averageRating?: number;
};

export type Analytics = {
  totalRevenue: number;
  totalDebt: number;
  debtPercentage: number;
  expectedIncome: number;
  totalPayments: number;
  averagePaymentAmount: number;
  occupancyRate: number;
  totalRooms: number;
  activeRooms: number;
  occupiedRooms: number;
  totalResidents: number;
  totalDebtors: number;
  debtorsPercentage: number;
  averageDebtPerResident: number;
  totalStaff: number;
  averageRoomPrice: number;
  currentYearStats: {
    totalPayments: number;
    expectedRevenue: number;
    collectedRevenue: number;
    outstandingAmount: number;
  };
  totalHostels: number;
  verifiedHostels: number;
  unverifiedHostels: number;
  publishedHostels: number;
  averageOccupancyRate: number;
  systemWideDebtPercentage: number;
  activeCalendarYears: number;
  // Resident-specific fields (optional for admin/superadmin)
  residentId?: string;
  userId?: string;
  hostelId?: string | null;
  name?: string;
  email?: string;
  phone?: string;
  room?: {
    roomId: string | null;
    roomNumber: string | null;
    roomType: string | null;
  };
  stay?: {
    checkInDate: string | null;
    checkOutDate: string | null;
  };
  totals?: {
    totalPaid: number;
    outstandingBalance: number;
  };
  recentPayments?: Array<{
    id: string;
    amount: number;
    date: string;
    method: string;
    status: string;
  }>;
  paymentTrend?: Array<{
    label: string;
    value: number;
  }>;
  hostel?: {
    hostelName: string;
  };
};

export type Transaction = {
  id: string;
  amount: number;
  date: string;
  residentId: string;
  status: "PENDING" | "CONFIRMED" | "FAILED" | "success";
  roomId: string;
  reference: string;
  method: string | null;
  updatedAt: string;
  delFlag: boolean;
  calendarYearId: string;
  historicalResidentId: string | null;
}

export type Method = {
  id?: string;
  method: string;
  count: number;
  totalAmount: number;
}

export type ReportData = {
  calendarYearId: string
  calendarYearName: string
  startDate: string
  endDate: string | null
  isActive: boolean
  totalRevenue: number
  totalExpectedRevenue: number
  totalPayments: number
  averagePaymentAmount: number
  collectionRate: number
  totalResidents: number
  averageRevenuePerResident: number
  totalRooms: number
  activeRooms: number
  occupiedRooms: number
  occupancyRate: number
  averageRoomPrice: number
  historicalResidents: number
  historicalRevenue: number
  paymentMethods: Array<{
    method: string
    count: number
    totalAmount: number
  }>
  monthlyStats: Array<{
    month: string
    revenue: number
    payments: number
    newResidents: number
  }>
  revenueGrowth: number
}

export type AllocationDetails = {
  residentName: string;
  studentId: string;
  course: string;
  gender: string;
  academicPeriod: string;
  hostelName: string;
  hostelAddress: string;
  hostelEmail: string;
  hostelPhone: string;
  hostelLogo?: string;
  roomNumber: string;
  roomType: string;
  roomFloor?: string;
  roomBlock?: string;
  roomPrice: number;
  amountPaid: number;
  balanceOwed: number;
  checkInDate: string;
  checkOutDate: string;
  rulesUrl: string;
  issueDate: string;
};

export type PaymentReceipt = {
  receiptNumber: string;
  date: string;
  residentName: string;
  amount: number;
  amountPaid: number;
  balanceOwed: number;
  method: string;
  hostelName: string;
  roomNumber: string;
  status: string;
  reference?: string;
  // Extended fields from rich API response
  studentId?: string;
  academicYear?: string;
  hostelAddress?: string;
  hostelEmail?: string;
  hostelPhone?: string;
  hostelLogo?: string;
  hostelStamp?: string;
  hostelSignature?: string;
  managerName?: string;
};