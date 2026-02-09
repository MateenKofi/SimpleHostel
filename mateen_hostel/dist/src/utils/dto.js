"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBookingDto = exports.toServiceDto = exports.toFeedbackDto = exports.toMaintenanceRequestDto = exports.toPaymentDto = exports.toAdminDto = exports.toStaffDto = exports.toResidentDto = exports.toRoomDto = exports.toHostelDto = exports.toUserDto = exports.toInternalUserDto = void 0;
// --- Base User DTO ---
// --- Internal User DTO (Includes sensitive fields for AUTH ONLY) ---
const toInternalUserDto = (user) => {
    var _a, _b, _c;
    return Object.assign(Object.assign({}, user), { hostel: user.hostel || ((_a = user.adminProfile) === null || _a === void 0 ? void 0 : _a.hostel) || ((_b = user.staffProfile) === null || _b === void 0 ? void 0 : _b.hostel) || ((_c = user.residentProfile) === null || _c === void 0 ? void 0 : _c.hostel) || null, adminProfile: user.adminProfile ? {
            id: user.adminProfile.id,
            hostelId: user.adminProfile.hostelId,
            position: user.adminProfile.position,
            hostel: user.adminProfile.hostel,
        } : null, staffProfile: user.staffProfile ? {
            id: user.staffProfile.id,
            hostelId: user.staffProfile.hostelId,
            hostel: user.staffProfile.hostel,
        } : null, residentProfile: user.residentProfile ? {
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
        } : null, superAdminProfile: user.superAdminProfile ? {
            id: user.superAdminProfile.id,
            phoneNumber: user.superAdminProfile.phoneNumber,
        } : null });
};
exports.toInternalUserDto = toInternalUserDto;
// --- Base User DTO (Sanitized) ---
const toUserDto = (user) => {
    var _a, _b, _c;
    const { password, refreshToken } = user, safeUser = __rest(user, ["password", "refreshToken"]);
    return Object.assign(Object.assign({}, safeUser), { hostel: user.hostel || ((_a = user.adminProfile) === null || _a === void 0 ? void 0 : _a.hostel) || ((_b = user.staffProfile) === null || _b === void 0 ? void 0 : _b.hostel) || ((_c = user.residentProfile) === null || _c === void 0 ? void 0 : _c.hostel) || null, adminProfile: user.adminProfile ? {
            id: user.adminProfile.id,
            hostelId: user.adminProfile.hostelId,
            position: user.adminProfile.position,
            hostel: user.adminProfile.hostel,
        } : null, staffProfile: user.staffProfile ? {
            id: user.staffProfile.id,
            hostelId: user.staffProfile.hostelId,
            hostel: user.staffProfile.hostel,
        } : null, residentProfile: user.residentProfile ? {
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
        } : null, superAdminProfile: user.superAdminProfile ? {
            id: user.superAdminProfile.id,
            phoneNumber: user.superAdminProfile.phoneNumber,
        } : null });
};
exports.toUserDto = toUserDto;
// --- Hostel DTO ---
const toHostelDto = (hostel) => {
    var _a;
    return Object.assign(Object.assign({}, hostel), { images: ((_a = hostel.hostelImages) === null || _a === void 0 ? void 0 : _a.map((img) => img.imageUrl)) || [] });
};
exports.toHostelDto = toHostelDto;
// --- Room DTO ---
const toRoomDto = (room) => {
    var _a, _b;
    return Object.assign(Object.assign({}, room), { amenities: room.amenities || [], images: ((_a = room.roomImages) === null || _a === void 0 ? void 0 : _a.map((img) => img.imageUrl)) || [], hostel: room.hostel ? (0, exports.toHostelDto)(room.hostel) : undefined, residents: ((_b = room.residents) === null || _b === void 0 ? void 0 : _b.map(resident => {
            var _a, _b, _c, _d, _e, _f;
            return (Object.assign(Object.assign({}, resident), { name: (_a = resident.user) === null || _a === void 0 ? void 0 : _a.name, email: (_b = resident.user) === null || _b === void 0 ? void 0 : _b.email, phone: (_c = resident.user) === null || _c === void 0 ? void 0 : _c.phone, gender: (_d = resident.user) === null || _d === void 0 ? void 0 : _d.gender, avatar: (_e = resident.user) === null || _e === void 0 ? void 0 : _e.avatar, imageUrl: (_f = resident.user) === null || _f === void 0 ? void 0 : _f.imageUrl }));
        })) || [] });
};
exports.toRoomDto = toRoomDto;
// --- Resident DTO ---
const toResidentDto = (resident) => {
    var _a;
    return Object.assign(Object.assign({}, resident), { user: resident.user ? (0, exports.toUserDto)(resident.user) : undefined, room: resident.room ? (0, exports.toRoomDto)(resident.room) : undefined, roomNumber: ((_a = resident.room) === null || _a === void 0 ? void 0 : _a.number) || resident.roomNumber });
};
exports.toResidentDto = toResidentDto;
// --- Staff DTO ---
const toStaffDto = (staff) => {
    return Object.assign(Object.assign({}, staff), { user: staff.user ? (0, exports.toUserDto)(staff.user) : undefined, hostel: staff.hostel ? (0, exports.toHostelDto)(staff.hostel) : undefined });
};
exports.toStaffDto = toStaffDto;
// --- Admin DTO ---
const toAdminDto = (admin) => {
    return Object.assign(Object.assign({}, admin), { user: admin.user ? (0, exports.toUserDto)(admin.user) : undefined, hostel: admin.hostel ? (0, exports.toHostelDto)(admin.hostel) : undefined });
};
exports.toAdminDto = toAdminDto;
// --- Payment DTO ---
const toPaymentDto = (payment) => {
    var _a, _b;
    return Object.assign(Object.assign({}, payment), { roomNumber: (_a = payment.room) === null || _a === void 0 ? void 0 : _a.number, period: (_b = payment.calendarYear) === null || _b === void 0 ? void 0 : _b.name });
};
exports.toPaymentDto = toPaymentDto;
// --- Maintenance Request DTO ---
const toMaintenanceRequestDto = (request) => {
    var _a, _b, _c, _d, _e;
    return Object.assign(Object.assign({}, request), { resident: request.resident ? (0, exports.toResidentDto)(request.resident) : undefined, residentName: (_b = (_a = request.resident) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.name, roomNumber: ((_d = (_c = request.resident) === null || _c === void 0 ? void 0 : _c.room) === null || _d === void 0 ? void 0 : _d.number) || ((_e = request.resident) === null || _e === void 0 ? void 0 : _e.roomNumber) });
};
exports.toMaintenanceRequestDto = toMaintenanceRequestDto;
// --- Feedback DTO ---
const toFeedbackDto = (feedback) => {
    var _a, _b;
    return Object.assign(Object.assign({}, feedback), { residentName: (_b = (_a = feedback.resident) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.name });
};
exports.toFeedbackDto = toFeedbackDto;
// --- Service DTO ---
const toServiceDto = (service) => {
    var _a;
    return Object.assign(Object.assign({}, service), { bookingCount: ((_a = service.bookings) === null || _a === void 0 ? void 0 : _a.length) || 0 });
};
exports.toServiceDto = toServiceDto;
const toBookingDto = (booking) => {
    var _a, _b, _c, _d;
    return Object.assign(Object.assign({}, booking), { residentName: (_b = (_a = booking.resident) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.name, serviceName: (_c = booking.service) === null || _c === void 0 ? void 0 : _c.name, servicePrice: (_d = booking.service) === null || _d === void 0 ? void 0 : _d.price });
};
exports.toBookingDto = toBookingDto;
