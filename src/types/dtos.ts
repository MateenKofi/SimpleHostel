export interface UserDto {
    id: string;
    email: string;
    name: string;
    role: "resident" | "staff" | "admin" | "super_admin";
    phone: string | null;
    gender: string | null;
    avatar: string | null;
    imageUrl: string | null;
    accountStatus: string;
    hostelId: string | null;
    hostel?: HostelDto | null;
    adminProfile?: {
        id: string;
        hostelId: string | null;
        position: string | null;
        hostel: HostelDto | null;
    } | null;
    staffProfile?: {
        id: string;
        hostelId: string | null;
        hostel: HostelDto | null;
    } | null;
    residentProfile?: {
        id: string;
        hostelId: string | null;
        roomId: string | null;
        studentId: string | null;
        course: string | null;
        roomNumber: string | null;
        status: string;
        checkInDate: string | null; // ISO Date String
        checkOutDate: string | null; // ISO Date String
        hostel: HostelDto | null;
        room: RoomDto | null;
    } | null;
    superAdminProfile?: {
        id: string;
        phoneNumber: string | null;
    } | null;
    createdAt: string;
    updatedAt: string;
}

export interface HostelDto {
    id: string;
    name: string;
    location: string;
    description: string | null;
    manager: string;
    email: string;
    phone: string;
    isVerified: boolean;
    published: boolean;
    images: string[]; // Array of image URLs
    averageRating: number;
}

export interface RoomDto {
    id: string;
    number: string;
    floor: string | null;
    maxCap: number;
    currentResidentCount: number;
    price: number;
    status: "available" | "occupied" | "maintenance";
    hostelId: string;
    amenities: Amenity[];
    images: string[]; // Array of image URLs
    hostel?: HostelDto;
}

export interface Amenity {
    id: string;
    name: string;
}

export interface ResidentDto {
    id: string;
    userId: string;
    hostelId: string | null;
    roomId: string | null;
    studentId: string | null;
    course: string | null;
    roomNumber: string | null;
    status: string;
    checkInDate: string | null;
    checkOutDate: string | null;
    user?: UserDto;
    room?: RoomDto;
}

export interface PaymentDto {
    id: string;
    amount: number;
    amountPaid: number | null;
    balanceOwed: number | null;
    method: string | null;
    status: string;
    reference: string;
    residentProfileId: string | null;
    roomId: string | null;
    calendarYearId: string;
    roomNumber?: string;
    period?: string; // Academic Year Name
    createdAt: string;
}

export interface MaintenanceRequestDto {
    id: string;
    title: string;
    description: string;
    type: string;
    status: "pending" | "in_progress" | "resolved" | "cancelled";
    priority: "low" | "medium" | "high" | "critical";
    images: string[];
    residentProfileId: string;
    createdAt: string;
    residentName?: string;
    roomNumber?: string;
    resident?: ResidentDto;
}

export interface ServiceDto {
    id: string;
    name: string;
    description: string | null;
    price: number;
    hostelId: string;
    bookingCount: number;
}

export interface BookingDto {
    id: string;
    status: string;
    residentProfileId: string;
    hostelServiceId: string;
    residentName?: string;
    serviceName?: string;
    servicePrice?: number;
    createdAt: string;
}
