import {
    User,
    Hostel,
    Room,
    ResidentProfile,
    AdminProfile,
    StaffProfile,
    Payment,
    MaintenanceRequest,
    Amenities,
    RoomImage,
    HostelImage,
    Feedback,
    HostelService,
    ServiceBooking,
} from "@prisma/client";

// --- Base User DTO ---
// --- Internal User DTO (Includes sensitive fields for AUTH ONLY) ---
export const toInternalUserDto = (user: User & {
    hostel?: Hostel | null;
    adminProfile?: any;
    staffProfile?: any;
    residentProfile?: any;
    superAdminProfile?: any;
}) => {
    return {
        ...user,
        hostel: user.hostel || user.adminProfile?.hostel || user.staffProfile?.hostel || user.residentProfile?.hostel || null,
        adminProfile: user.adminProfile ? {
            id: user.adminProfile.id,
            hostelId: user.adminProfile.hostelId,
            position: user.adminProfile.position,
            hostel: user.adminProfile.hostel,
        } : null,
        staffProfile: user.staffProfile ? {
            id: user.staffProfile.id,
            hostelId: user.staffProfile.hostelId,
            hostel: user.staffProfile.hostel,
        } : null,
        residentProfile: user.residentProfile ? {
            id: user.residentProfile.id,
            hostelId: user.residentProfile.hostelId,
            roomId: user.residentProfile.roomId,
            studentId: user.residentProfile.studentId,
            course: user.residentProfile.course,
            roomNumber: user.residentProfile.roomNumber,
            status: user.residentProfile.status,
            checkInDate: user.residentProfile.checkInDate,
            checkOutDate: user.residentProfile.checkOutDate,
            hostel: user.residentProfile.hostel,
            room: user.residentProfile.room,
        } : null,
        superAdminProfile: user.superAdminProfile ? {
            id: user.superAdminProfile.id,
            phoneNumber: user.superAdminProfile.phoneNumber,
        } : null,
    };
};

// --- Base User DTO (Sanitized) ---
export const toUserDto = (user: User & {
    hostel?: Hostel | null;
    adminProfile?: any;
    staffProfile?: any;
    residentProfile?: any;
    superAdminProfile?: any;
}) => {
    const { password, refreshToken, ...safeUser } = user;
    return {
        ...safeUser,
        hostel: user.hostel || user.adminProfile?.hostel || user.staffProfile?.hostel || user.residentProfile?.hostel || null,
        adminProfile: user.adminProfile ? {
            id: user.adminProfile.id,
            hostelId: user.adminProfile.hostelId,
            position: user.adminProfile.position,
            hostel: user.adminProfile.hostel,
        } : null,
        staffProfile: user.staffProfile ? {
            id: user.staffProfile.id,
            hostelId: user.staffProfile.hostelId,
            hostel: user.staffProfile.hostel,
        } : null,
        residentProfile: user.residentProfile ? {
            id: user.residentProfile.id,
            hostelId: user.residentProfile.hostelId,
            roomId: user.residentProfile.roomId,
            studentId: user.residentProfile.studentId,
            course: user.residentProfile.course,
            roomNumber: user.residentProfile.roomNumber,
            status: user.residentProfile.status,
            checkInDate: user.residentProfile.checkInDate,
            checkOutDate: user.residentProfile.checkOutDate,
            hostel: user.residentProfile.hostel,
            room: user.residentProfile.room,
        } : null,
        superAdminProfile: user.superAdminProfile ? {
            id: user.superAdminProfile.id,
            phoneNumber: user.superAdminProfile.phoneNumber,
        } : null,
    };
};

// --- Hostel DTO ---
export const toHostelDto = (hostel: Hostel & { hostelImages?: HostelImage[] }) => {
    return {
        ...hostel,
        images: hostel.hostelImages?.map((img) => img.imageUrl) || [],
    };
};

// --- Room DTO ---
export const toRoomDto = (
    room: Room & {
        amenities?: Amenities[];
        roomImages?: RoomImage[];
        hostel?: Hostel;
        residents?: (ResidentProfile & { user?: User })[];
    }
) => {
    return {
        ...room,
        amenities: room.amenities || [],
        images: room.roomImages?.map((img) => img.imageUrl) || [],
        hostel: room.hostel ? toHostelDto(room.hostel) : undefined,
        residents: room.residents?.map(resident => ({
            ...resident,
            name: resident.user?.name,
            email: resident.user?.email,
            phone: resident.user?.phone,
            gender: resident.user?.gender,
            avatar: resident.user?.avatar,
            imageUrl: resident.user?.imageUrl,
        })) || [],
    };
};

// --- Resident DTO ---
export const toResidentDto = (
    resident: ResidentProfile & { user?: User; room?: Room & { hostel?: Hostel; amenities?: Amenities[]; roomImages?: RoomImage[] } }
) => {
    return {
        ...resident,
        user: resident.user ? toUserDto(resident.user) : undefined,
        room: resident.room ? toRoomDto(resident.room) : undefined,
        roomNumber: resident.room?.number || resident.roomNumber,
    };
};

// --- Staff DTO ---
export const toStaffDto = (
    staff: StaffProfile & { user?: User; hostel?: Hostel }
) => {
    return {
        ...staff,
        user: staff.user ? toUserDto(staff.user) : undefined,
        hostel: staff.hostel ? toHostelDto(staff.hostel) : undefined,
    };
};

// --- Admin DTO ---
export const toAdminDto = (
    admin: AdminProfile & { user?: User; hostel?: Hostel }
) => {
    return {
        ...admin,
        user: admin.user ? toUserDto(admin.user) : undefined,
        hostel: admin.hostel ? toHostelDto(admin.hostel) : undefined,
    };
};

// --- Payment DTO ---
export const toPaymentDto = (
    payment: Payment & { room?: Room; calendarYear?: { name: string } }
) => {
    return {
        ...payment,
        roomNumber: payment.room?.number,
        period: payment.calendarYear?.name,
    };
};

// --- Maintenance Request DTO ---
export const toMaintenanceRequestDto = (
    request: MaintenanceRequest & { resident?: ResidentProfile & { user?: User; room?: Room } }
) => {
    return {
        ...request,
        resident: request.resident ? toResidentDto(request.resident as any) : undefined,
        residentName: request.resident?.user?.name,
        roomNumber: request.resident?.room?.number || request.resident?.roomNumber,
    };
};

// --- Feedback DTO ---
export const toFeedbackDto = (
    feedback: Feedback & { resident?: ResidentProfile & { user?: User } }
) => {
    return {
        ...feedback,
        residentName: feedback.resident?.user?.name,
    };
};

// --- Service DTO ---
export const toServiceDto = (
    service: HostelService & { bookings?: ServiceBooking[] }
) => {
    return {
        ...service,
        bookingCount: service.bookings?.length || 0,
    };
};

export const toBookingDto = (
    booking: ServiceBooking & { resident?: ResidentProfile & { user?: User }; service?: HostelService }
) => {
    return {
        ...booking,
        residentName: booking.resident?.user?.name,
        serviceName: booking.service?.name,
        servicePrice: booking.service?.price,
    };
};
