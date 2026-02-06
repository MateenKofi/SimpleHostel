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
    roomNumber: string; // Added for legacy compatibility
    floor: string | null;
    block: string | null; // Changed to allow null
    type: string; // Added
    maxCap: number;
    currentResidentCount: number;
    price: number;
    status: "available" | "occupied" | "maintenance";
    hostelId: string;
    amenities: Amenity[];
    images: string[]; // Array of image URLs
    RoomImage?: { id: string; imageUrl: string }[]; // Added for legacy compatibility
    description: string | null; // Added
    createdAt: string; // Added
    updatedAt: string; // Added
    gender: string | null; // Added
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
    name?: string; // Legacy compatibility
    email?: string; // Legacy compatibility
    phone?: string; // Legacy compatibility
    accessCode?: string | null; // Legacy compatibility
    roomPrice?: number; // Legacy compatibility
    amountPaid?: number | null; // Legacy compatibility
    balanceOwed?: number | null; // Legacy compatibility
    calendarYearId?: string; // Legacy compatibility
    user?: UserDto;
    room?: RoomDto;
    roommates?: ResidentDto[]; // Added
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

export interface AnnouncementDto {
    id: string;
    hostelId: string;
    title: string;
    content: string;
    category: "general" | "policy" | "event" | "emergency";
    priority: "low" | "high" | "urgent";
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface ApiError {
    response?: {
        data?: {
            message?: string;
            error?: string;
        };
    };
    message?: string;
}

// === API Request Types ===

export interface RegisterResidentRequest {
    name: string;
    email: string;
    phone: string;
    password?: string | null;
    gender: string;
    studentId?: string | null;
    course?: string | null;
    emergencyContactName: string;
    emergencyContactPhone: string;
    emergencyContactRelationship?: string | null;
    roomId?: string | null;
    hostelId?: string | null;
    calendarYearId?: string | null;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AddStaffRequest {
    name: string;
    email: string;
    phone: string;
    password?: string | null;
    role: string;
    hostelId?: string | null;
}

export interface UpdateHostelRequest {
    name?: string | null;
    location?: string | null;
    description?: string | null;
    manager?: string | null;
    email?: string | null;
    phone?: string | null;
    images?: string[] | null;
}

export interface CreateServiceRequest {
    name: string;
    description?: string | null;
    price: number;
    hostelId: string;
}

export interface UpdateUserRequest {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    role?: string | null;
    password?: string | null;
}

export interface TopupPaymentRequest {
    residentId?: string;
    roomId?: string | null;
    amount?: number;
    initialPayment?: number;
    paymentMethod?: string | null;
}

export interface FeedbackRequest {
    rating: number;
    comment?: string | null;
}

export interface CreateAnnouncementRequest {
    hostelId: string;
    title: string;
    content: string;
    category: "general" | "policy" | "event" | "emergency";
    priority: "low" | "high" | "urgent";
    startDate: string;
    endDate: string;
}

export interface AddAmenityRequest {
    name: string;
}

export interface UpdateAmenityRequest {
    name: string;
}

export interface AddResidentRequest {
    name: string;
    email: string;
    phone: string;
    password?: string | null;
    gender: string;
    studentId?: string | null;
    course?: string | null;
    emergencyContactName: string;
    emergencyContactPhone: string;
    emergencyContactRelationship?: string | null;
    roomId?: string | null;
    hostelId?: string | null;
    calendarYearId?: string | null;
}

export interface CreateResidentRequestRequest {
    title: string;
    description: string;
    type: string;
    priority?: "low" | "medium" | "high" | "critical" | null;
    images?: string[] | null;
}

export interface CreateVisitorRequest {
    name: string;
    phone: string;
    relationship: string;
    purpose: string;
    residentProfileId: string;
}

export interface ForgetPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}

export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}
