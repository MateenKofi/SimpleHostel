"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentReceiptData = exports.getAllocationDetails = exports.createFeedback = exports.getResidentAnnouncements = exports.getResidentBilling = exports.getResidentRequests = exports.createMaintenanceRequest = exports.getResidentRoomDetails = exports.checkInResident = exports.verifyResidentCode = exports.assignRoomToResident = exports.addResidentFromHostel = exports.getAllresidentsForHostel = exports.getDebtorsForHostel = exports.getDebtors = exports.restoreResident = exports.deleteResident = exports.updateResident = exports.getResidentByEmail = exports.getResidentById = exports.getAllResident = exports.register = exports.sendPasswordSetupEmail = exports.generateAccessCode = exports.generateRandomPassword = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const http_error_1 = __importDefault(require("../utils/http-error"));
const http_status_1 = require("../utils/http-status");
const bcrypt_1 = require("../utils/bcrypt");
const residentSchema_1 = require("../zodSchema/residentSchema");
const requestSchema_1 = require("../zodSchema/requestSchema");
const formatPrisma_1 = require("../utils/formatPrisma");
const feedbackSchema_1 = require("../zodSchema/feedbackSchema");
const dto_1 = require("../utils/dto");
const nodeMailer_1 = require("../utils/nodeMailer");
const generatePasswordSetupEmail_1 = require("../services/generatePasswordSetupEmail");
/**
 * Generate a random password with 12 characters
 * Includes uppercase, lowercase, numbers, and special characters
 */
const generateRandomPassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const special = "!@#$%^&*";
    let password = "";
    // Ensure at least one of each type
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];
    // Fill the rest (8 more characters for 12 total)
    const allChars = uppercase + lowercase + numbers + special;
    for (let i = 0; i < 8; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    // Shuffle the password
    return password.split("").sort(() => Math.random() - 0.5).join("");
};
exports.generateRandomPassword = generateRandomPassword;
/**
 * Generate a unique access code for resident verification
 * Uses characters that are not ambiguous (no 0/O, 1/I)
 */
const generateAccessCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No ambiguous chars (0/O, 1/I)
    let code = "";
    for (let i = 0; i < 10; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};
exports.generateAccessCode = generateAccessCode;
/**
 * Send password setup email to a new resident
 */
const sendPasswordSetupEmail = (email, tempPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const htmlContent = (0, generatePasswordSetupEmail_1.generatePasswordSetupEmail)(email, tempPassword);
    yield (0, nodeMailer_1.sendEmail)(email, "Welcome to Fuse - Your Account Credentials", htmlContent);
});
exports.sendPasswordSetupEmail = sendPasswordSetupEmail;
const register = (residentData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    try {
        const validateResident = residentSchema_1.residentSchema.safeParse(residentData);
        if (!validateResident.success) {
            const errors = validateResident.error.issues.map(({ message, path }) => `${path}: ${message}`);
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, errors.join(". "));
        }
        const { roomId } = residentData;
        if (roomId) {
            const existingRoom = yield prisma_1.default.room.findUnique({
                where: { id: roomId },
            });
            if (!existingRoom) {
                throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Room not found.");
            }
            if (existingRoom.gender !== "mix" &&
                existingRoom.gender !== residentData.gender) {
                throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, `Room gender does not match resident's gender.`);
            }
            const currentResidentsCount = yield prisma_1.default.residentProfile.count({
                where: { roomId: residentData.roomId },
            });
            if (currentResidentsCount >= existingRoom.maxCap) {
                throw new http_error_1.default(http_status_1.HttpStatus.CONFLICT, "Room has reached its maximum capacity.");
            }
        }
        const normalizedEmail = residentData.email.trim().toLowerCase();
        const hashed = yield (0, bcrypt_1.hashPassword)(residentData.password);
        const user = yield prisma_1.default.user.create({
            data: {
                email: normalizedEmail,
                password: hashed,
                name: residentData.name,
                gender: residentData.gender.toLowerCase(), // Convert to lowercase for Prisma enum
                phone: residentData.phone,
                role: "resident",
            },
        });
        const newProfile = yield prisma_1.default.residentProfile.create({
            data: {
                userId: user.id,
                hostelId: (_a = residentData.hostelId) !== null && _a !== void 0 ? _a : null,
                roomId,
                studentId: (_b = residentData.studentId) !== null && _b !== void 0 ? _b : null,
                course: (_c = residentData.course) !== null && _c !== void 0 ? _c : null,
                status: "active",
                checkInDate: (_d = residentData.checkInDate) !== null && _d !== void 0 ? _d : null,
                checkOutDate: (_e = residentData.checkOutDate) !== null && _e !== void 0 ? _e : null,
                emergencyContactName: (_f = residentData.emergencyContactName) !== null && _f !== void 0 ? _f : null,
                emergencyContactPhone: (_g = residentData.emergencyContactPhone) !== null && _g !== void 0 ? _g : null,
                emergencyContactRelationship: (_h = residentData.emergencyContactRelationship) !== null && _h !== void 0 ? _h : null,
            },
            include: { room: true, user: true },
        });
        return (0, dto_1.toResidentDto)(newProfile);
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.register = register;
const getAllResident = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const residents = yield prisma_1.default.residentProfile.findMany({
            where: { deletedAt: null },
            include: { room: { include: { hostel: true } }, user: true },
        });
        return residents.map((resident) => (0, dto_1.toResidentDto)(resident));
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getAllResident = getAllResident;
const getResidentById = (residentId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resident = yield prisma_1.default.residentProfile.findUnique({
            where: { id: residentId },
            include: { room: true, user: true },
        });
        if (!resident) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Resident not found.");
        }
        return (0, dto_1.toResidentDto)(resident);
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getResidentById = getResidentById;
const getResidentByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma_1.default.user.findUnique({
            where: { email },
            include: { residentProfile: { include: { room: true } } },
        });
        const resident = user === null || user === void 0 ? void 0 : user.residentProfile;
        if (!resident) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Resident not found.");
        }
        return (0, dto_1.toResidentDto)(resident);
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getResidentByEmail = getResidentByEmail;
const updateResident = (residentId, residentData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateResident = residentSchema_1.updateResidentSchema.safeParse(residentData);
        if (!validateResident.success) {
            const errors = validateResident.error.issues.map(({ message, path }) => `${path}: ${message}`);
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, errors.join(". "));
        }
        const resident = yield prisma_1.default.residentProfile.findUnique({
            where: { id: residentId },
            include: { user: true },
        });
        if (!resident) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "resident not found");
        }
        // Update User fields if provided
        if (residentData.name || residentData.email || residentData.phone || residentData.gender) {
            yield prisma_1.default.user.update({
                where: { id: resident.userId },
                data: Object.assign(Object.assign(Object.assign(Object.assign({}, (residentData.name && { name: residentData.name })), (residentData.email && { email: residentData.email })), (residentData.phone && { phone: residentData.phone })), (residentData.gender && {
                    gender: residentData.gender.toLowerCase()
                })),
            });
        }
        // Update ResidentProfile fields
        const updatedResident = yield prisma_1.default.residentProfile.update({
            where: { id: residentId },
            data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (residentData.hostelId && { hostelId: residentData.hostelId })), (residentData.roomId && { roomId: residentData.roomId })), (residentData.studentId && { studentId: residentData.studentId })), (residentData.course && { course: residentData.course })), (residentData.roomNumber && { roomNumber: residentData.roomNumber })), (residentData.status && { status: residentData.status })), (residentData.checkInDate && { checkInDate: residentData.checkInDate })), (residentData.checkOutDate && { checkOutDate: residentData.checkOutDate })), (residentData.emergencyContactName && { emergencyContactName: residentData.emergencyContactName })), (residentData.emergencyContactPhone && { emergencyContactPhone: residentData.emergencyContactPhone })), (residentData.emergencyContactRelationship !== undefined && { emergencyContactRelationship: residentData.emergencyContactRelationship })),
        });
        const updatedResidentWithDetails = yield prisma_1.default.residentProfile.findUnique({
            where: { id: residentId },
            include: { room: true, user: true },
        });
        return updatedResidentWithDetails ? (0, dto_1.toResidentDto)(updatedResidentWithDetails) : null;
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.updateResident = updateResident;
const deleteResident = (residentId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resident = yield prisma_1.default.residentProfile.findUnique({
            where: { id: residentId },
            include: {
                room: true,
                user: true,
            },
        });
        if (!resident) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Resident not found");
        }
        const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // Soft delete by setting deletedAt timestamp
            yield tx.residentProfile.update({
                where: { id: residentId },
                data: {
                    deletedAt: new Date(),
                    // Clear room assignment if resident has one
                    roomId: resident.roomId ? null : undefined,
                },
            });
            // Update room count if resident was assigned
            if (resident.roomId) {
                const currentCount = yield tx.residentProfile.count({
                    where: { roomId: resident.roomId },
                });
                yield tx.room.update({
                    where: { id: resident.roomId },
                    data: {
                        currentResidentCount: currentCount,
                        status: currentCount >= 1 ? "occupied" : "available",
                    },
                });
            }
            // Archive the associated user record (soft delete user too)
            yield tx.user.update({
                where: { id: resident.userId },
                data: { deletedAt: new Date() },
            });
            return { archived: true };
        }));
        return result;
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.deleteResident = deleteResident;
const restoreResident = (residentId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resident = yield prisma_1.default.residentProfile.findUnique({
            where: { id: residentId },
            include: {
                user: true,
            },
        });
        if (!resident) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Resident not found");
        }
        if (!resident.deletedAt) {
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, "Resident is not archived");
        }
        // Restore resident and user
        yield prisma_1.default.$transaction([
            prisma_1.default.residentProfile.update({
                where: { id: residentId },
                data: { deletedAt: null },
            }),
            prisma_1.default.user.update({
                where: { id: resident.userId },
                data: { deletedAt: null },
            }),
        ]);
        return { restored: true };
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.restoreResident = restoreResident;
const getDebtors = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const debtorRefs = yield prisma_1.default.payment.findMany({
            where: { status: "confirmed", balanceOwed: { gt: 0 } },
            select: { residentProfileId: true },
            distinct: ["residentProfileId"],
        });
        const ids = debtorRefs
            .map((d) => d.residentProfileId)
            .filter((x) => !!x);
        if (ids.length === 0)
            return [];
        const debtors = yield prisma_1.default.residentProfile.findMany({
            where: { id: { in: ids }, deletedAt: null },
            include: { room: true, user: true }
        });
        return debtors.map((d) => (0, dto_1.toResidentDto)(d));
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getDebtors = getDebtors;
const getDebtorsForHostel = (hostelId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const debtorRefs = yield prisma_1.default.payment.findMany({
            where: { status: "confirmed", balanceOwed: { gt: 0 }, residentProfile: { room: { hostelId } } },
            select: { residentProfileId: true },
            distinct: ["residentProfileId"],
        });
        const ids = debtorRefs
            .map((d) => d.residentProfileId)
            .filter((x) => !!x);
        if (ids.length === 0)
            return [];
        const debtors = yield prisma_1.default.residentProfile.findMany({
            where: { id: { in: ids }, deletedAt: null },
            include: { room: true, user: true }
        });
        return debtors.map((d) => (0, dto_1.toResidentDto)(d));
    }
    catch (error) {
        const err = error;
        throw new http_error_1.default(err.status || http_status_1.HttpStatus.INTERNAL_SERVER_ERROR, err.message || "Error fetching debtors");
    }
});
exports.getDebtorsForHostel = getDebtorsForHostel;
const getAllresidentsForHostel = (hostelId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const residents = yield prisma_1.default.residentProfile.findMany({
            where: {
                deletedAt: null,
                OR: [
                    { room: { hostelId } },
                    { hostelId },
                ],
            },
            include: { room: true, user: true },
        });
        return residents.map((r) => (0, dto_1.toResidentDto)(r));
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getAllresidentsForHostel = getAllresidentsForHostel;
const addResidentFromHostel = (residentData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Use adminResidentSchema which allows optional password
        const validateResident = residentSchema_1.adminResidentSchema.safeParse(residentData);
        if (!validateResident.success) {
            const errors = validateResident.error.issues.map(({ message, path }) => `${path}: ${message}`);
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, errors.join(". "));
        }
        // Generate a random password if not provided
        let password = residentData.password || "";
        let shouldSendEmail = false;
        if (!password || password.trim() === "") {
            password = (0, exports.generateRandomPassword)();
            shouldSendEmail = true;
        }
        // Create the resident with the password
        const result = yield (0, exports.register)(Object.assign(Object.assign({}, residentData), { password }));
        // Send password setup email if password was auto-generated
        if (shouldSendEmail) {
            // Send email asynchronously, don't wait for it
            (0, exports.sendPasswordSetupEmail)(residentData.email, password).catch((error) => {
                console.error("Failed to send password setup email:", error);
            });
        }
        return result;
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.addResidentFromHostel = addResidentFromHostel;
const assignRoomToResident = (residentId, roomId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const resident = yield prisma_1.default.residentProfile.findUnique({
            where: { id: residentId },
            include: { user: true },
        });
        if (!resident) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Resident not found.");
        }
        const room = yield prisma_1.default.room.findUnique({ where: { id: roomId } });
        if (!room) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Room not found.");
        }
        if (room.gender !== "mix" && room.gender !== ((_a = resident.user) === null || _a === void 0 ? void 0 : _a.gender)) {
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, `Room gender does not match resident's gender.`);
        }
        if (resident.hostelId !== room.hostelId) {
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, `Resident and room do not belong to the same hostel.`);
        }
        const currentResidentsCount = yield prisma_1.default.residentProfile.count({
            where: { roomId: (_b = resident.roomId) !== null && _b !== void 0 ? _b : undefined },
        });
        if (currentResidentsCount >= room.maxCap) {
            throw new http_error_1.default(http_status_1.HttpStatus.CONFLICT, "Room has reached its maximum capacity.");
        }
        const assignResident = yield prisma_1.default.residentProfile.update({
            where: { id: residentId },
            data: { roomId },
            include: { room: true, user: true },
        });
        return (0, dto_1.toResidentDto)(assignResident);
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.assignRoomToResident = assignRoomToResident;
const verifyResidentCode = (code, hostelId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const normalizedCode = code.trim().toUpperCase();
    const resident = yield prisma_1.default.residentProfile.findFirst({
        where: Object.assign({ accessCode: {
                equals: normalizedCode,
                mode: "insensitive",
            } }, (hostelId ? {
            OR: [
                { hostelId },
                { room: { hostelId } },
            ],
        } : {})),
        include: { room: { include: { hostel: true } }, user: true, hostel: true },
    });
    if (!resident) {
        throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Invalid access code");
    }
    // Check expiry if set
    if (resident.accessCodeExpiry && new Date() > resident.accessCodeExpiry) {
        throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, "Access code has expired");
    }
    // Fetch payments to calculate financial summary
    const payments = yield prisma_1.default.payment.findMany({
        where: { residentProfileId: resident.id },
        orderBy: { createdAt: "desc" },
    });
    // Calculate totals based on the latest confirmed payment
    const confirmedPayments = payments.filter((p) => p.status === "confirmed");
    const latestConfirmed = confirmedPayments[0]; // Ordered by createdAt desc
    const amountPaid = (_a = latestConfirmed === null || latestConfirmed === void 0 ? void 0 : latestConfirmed.amountPaid) !== null && _a !== void 0 ? _a : 0;
    const balanceOwed = (_b = latestConfirmed === null || latestConfirmed === void 0 ? void 0 : latestConfirmed.balanceOwed) !== null && _b !== void 0 ? _b : (((_c = resident.room) === null || _c === void 0 ? void 0 : _c.price) || 0);
    const roomPrice = ((_d = resident.room) === null || _d === void 0 ? void 0 : _d.price) || 0;
    const residentDto = (0, dto_1.toResidentDto)(resident);
    return Object.assign(Object.assign({}, residentDto), { amountPaid,
        roomPrice,
        balanceOwed });
});
exports.verifyResidentCode = verifyResidentCode;
const checkInResident = (residentId) => __awaiter(void 0, void 0, void 0, function* () {
    const resident = yield prisma_1.default.residentProfile.findUnique({
        where: { id: residentId },
        include: { user: true, room: true },
    });
    if (!resident) {
        throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Resident not found");
    }
    if (!resident.roomId) {
        throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, "Resident has no assigned room");
    }
    const updated = yield prisma_1.default.residentProfile.update({
        where: { id: residentId },
        data: {
            status: "active",
            checkInDate: new Date(),
        },
        include: { room: true, user: true },
    });
    // Update room occupancy
    const currentCount = yield prisma_1.default.residentProfile.count({
        where: { roomId: resident.roomId },
    });
    yield prisma_1.default.room.update({
        where: { id: resident.roomId },
        data: {
            currentResidentCount: currentCount,
            status: currentCount > 0 ? "occupied" : "available",
        },
    });
    return (0, dto_1.toResidentDto)(updated);
});
exports.checkInResident = checkInResident;
const getResidentRoomDetails = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resident = yield prisma_1.default.residentProfile.findUnique({
            where: { userId },
            include: {
                room: {
                    include: {
                        amenities: true,
                        hostel: {
                            include: {
                                hostelImages: true,
                            },
                        },
                        roomImages: true,
                    },
                },
            },
        });
        if (!resident) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Resident profile not found");
        }
        if (!resident.roomId) {
            return { resident, room: null, roommates: [] };
        }
        const roommates = yield prisma_1.default.residentProfile.findMany({
            where: {
                roomId: resident.roomId,
                id: { not: resident.id }, // Exclude the resident themselves
                deletedAt: null, // Exclude archived residents
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        avatar: true,
                        imageUrl: true,
                    },
                },
            },
        });
        // Destructure to avoid returning the redundant room object inside resident
        const _a = resident, { room } = _a, residentData = __rest(_a, ["room"]);
        return {
            resident: (0, dto_1.toResidentDto)(residentData),
            room: room ? (0, dto_1.toRoomDto)(room) : null,
            roommates: roommates.map((r) => (0, dto_1.toResidentDto)(r)),
        };
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getResidentRoomDetails = getResidentRoomDetails;
const createMaintenanceRequest = (userId, requestData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = requestSchema_1.createMaintenanceRequestSchema.safeParse(requestData);
        if (!validateRequest.success) {
            const errors = validateRequest.error.issues.map(({ message, path }) => `${path}: ${message}`);
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, errors.join(". "));
        }
        const resident = yield prisma_1.default.residentProfile.findUnique({
            where: { userId },
        });
        if (!resident) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Resident profile not found");
        }
        if (!resident.hostelId) {
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, "Resident is not assigned to any hostel");
        }
        const request = yield prisma_1.default.maintenanceRequest.create({
            data: {
                residentId: resident.id,
                hostelId: resident.hostelId,
                type: requestData.type,
                subject: requestData.subject,
                description: requestData.description,
                priority: requestData.priority,
                images: requestData.images || [],
            },
        });
        const requestWithDetails = yield prisma_1.default.maintenanceRequest.findUnique({
            where: { id: request.id },
            include: { resident: { include: { user: true, room: true } } },
        });
        return requestWithDetails ? (0, dto_1.toMaintenanceRequestDto)(requestWithDetails) : null;
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.createMaintenanceRequest = createMaintenanceRequest;
const getResidentRequests = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resident = yield prisma_1.default.residentProfile.findUnique({
            where: { userId },
        });
        if (!resident) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Resident profile not found");
        }
        const requestsWithDetails = yield prisma_1.default.maintenanceRequest.findMany({
            where: { residentId: resident.id },
            include: { resident: { include: { user: true, room: true } } },
            orderBy: { createdAt: "desc" },
        });
        return requestsWithDetails.map((req) => (0, dto_1.toMaintenanceRequestDto)(req));
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getResidentRequests = getResidentRequests;
const getResidentBilling = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    try {
        const resident = yield prisma_1.default.residentProfile.findUnique({
            where: { userId },
            include: {
                hostel: {
                    include: {
                        hostelImages: true,
                    },
                },
                room: {
                    include: {
                        roomImages: true,
                    },
                },
            },
        });
        if (!resident) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Resident profile not found");
        }
        const payments = yield prisma_1.default.payment.findMany({
            where: { residentProfileId: resident.id },
            orderBy: { createdAt: "desc" },
            include: {
                calendarYear: {
                    select: { name: true }
                },
                room: {
                    select: { number: true, price: true }
                }
            }
        });
        // Calculate totals based on the latest confirmed payment
        const confirmedPayments = payments.filter(p => p.status === "confirmed");
        const latestConfirmed = confirmedPayments[0]; // Ordered by createdAt desc
        const totalAmountPaid = (_a = latestConfirmed === null || latestConfirmed === void 0 ? void 0 : latestConfirmed.amountPaid) !== null && _a !== void 0 ? _a : 0;
        const balanceOwed = (_b = latestConfirmed === null || latestConfirmed === void 0 ? void 0 : latestConfirmed.balanceOwed) !== null && _b !== void 0 ? _b : (((_c = resident.room) === null || _c === void 0 ? void 0 : _c.price) || 0);
        return {
            payments: payments.map((p) => (0, dto_1.toPaymentDto)(p)),
            summary: {
                room: resident.room ? (0, dto_1.toRoomDto)(resident.room) : null,
                roomNumber: ((_d = resident.room) === null || _d === void 0 ? void 0 : _d.number) || "N/A",
                roomPrice: ((_e = resident.room) === null || _e === void 0 ? void 0 : _e.price) || 0,
                totalAmountPaid,
                balanceOwed,
                allowPartialPayment: (_g = (_f = resident.hostel) === null || _f === void 0 ? void 0 : _f.allowPartialPayment) !== null && _g !== void 0 ? _g : false,
                hostelName: ((_h = resident.hostel) === null || _h === void 0 ? void 0 : _h.name) || "N/A",
            }
        };
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getResidentBilling = getResidentBilling;
const getResidentAnnouncements = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const user = yield prisma_1.default.user.findUnique({
            where: { id: userId },
            include: {
                residentProfile: true,
                adminProfile: true,
            },
        });
        if (!user) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "User not found");
        }
        const hostelId = ((_a = user.residentProfile) === null || _a === void 0 ? void 0 : _a.hostelId) || ((_b = user.adminProfile) === null || _b === void 0 ? void 0 : _b.hostelId);
        if (!hostelId) {
            return []; // Return empty if not assigned to a hostel yet
        }
        const announcements = yield prisma_1.default.announcement.findMany({
            where: { hostelId },
            orderBy: { createdAt: "desc" },
        });
        return announcements;
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getResidentAnnouncements = getResidentAnnouncements;
const createFeedback = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validate = feedbackSchema_1.createFeedbackSchema.safeParse(data);
        if (!validate.success) {
            const errors = validate.error.issues.map(({ message, path }) => `${path}: ${message}`);
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, errors.join(". "));
        }
        const resident = yield prisma_1.default.residentProfile.findUnique({
            where: { userId },
        });
        if (!resident || !resident.hostelId) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Resident profile or hostel not found");
        }
        const feedback = yield prisma_1.default.feedback.create({
            data: {
                residentId: resident.id,
                hostelId: resident.hostelId,
                rating: data.rating,
                comment: data.comment,
                category: data.category,
            },
        });
        const feedbackWithDetails = yield prisma_1.default.feedback.findUnique({
            where: { id: feedback.id },
            include: { resident: { include: { user: true } } },
        });
        return feedbackWithDetails ? (0, dto_1.toFeedbackDto)(feedbackWithDetails) : null;
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.createFeedback = createFeedback;
const getAllocationDetails = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const resident = yield prisma_1.default.residentProfile.findUnique({
            where: { userId },
            include: {
                user: true,
                hostel: {
                    include: {
                        hostelImages: true,
                        calendarYears: {
                            where: { isActive: true },
                        },
                    },
                },
                room: {
                    include: {
                        roomImages: true,
                    },
                },
            },
        });
        if (!resident || !resident.hostel || !resident.room) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Resident allocation records not found. Ensure you are assigned to a room.");
        }
        // Get the active academic period name
        const academicPeriod = ((_a = resident.hostel.calendarYears[0]) === null || _a === void 0 ? void 0 : _a.name) || "N/A";
        // Fetch the latest confirmed payment for financial status
        const latestPayment = yield prisma_1.default.payment.findFirst({
            where: {
                residentProfileId: resident.id,
                status: "confirmed",
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return {
            residentName: resident.user.name,
            studentId: resident.studentId,
            course: resident.course,
            gender: resident.user.gender,
            academicPeriod,
            hostelName: resident.hostel.name,
            hostelAddress: resident.hostel.address,
            hostelEmail: resident.hostel.email,
            hostelPhone: resident.hostel.phone,
            hostelLogo: resident.hostel.logoUrl,
            room: resident.room,
            roomNumber: resident.room.number,
            roomType: resident.room.type,
            roomFloor: resident.room.floor,
            roomBlock: resident.room.block,
            roomPrice: resident.room.price,
            amountPaid: (_b = latestPayment === null || latestPayment === void 0 ? void 0 : latestPayment.amountPaid) !== null && _b !== void 0 ? _b : 0,
            balanceOwed: (_c = latestPayment === null || latestPayment === void 0 ? void 0 : latestPayment.balanceOwed) !== null && _c !== void 0 ? _c : resident.room.price,
            checkInDate: resident.checkInDate,
            checkOutDate: resident.checkOutDate,
            rulesUrl: resident.hostel.rulesUrl,
            issueDate: new Date(),
            hostelSignature: resident.hostel.signatureUrl,
            hostelStamp: resident.hostel.stampUrl,
        };
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getAllocationDetails = getAllocationDetails;
const getPaymentReceiptData = (userId, paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        const resident = yield prisma_1.default.residentProfile.findUnique({
            where: { userId },
        });
        if (!resident) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Resident not found");
        }
        const payment = yield prisma_1.default.payment.findUnique({
            where: { id: paymentId },
            include: {
                residentProfile: {
                    include: {
                        user: true,
                        hostel: {
                            include: {
                                hostelImages: true,
                            },
                        },
                        room: {
                            include: {
                                roomImages: true,
                            },
                        },
                    },
                },
            },
        });
        if (!payment || payment.residentProfileId !== resident.id) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Payment record not found or unauthorized");
        }
        return {
            receiptNumber: payment.reference,
            date: payment.createdAt,
            residentName: (_a = payment.residentProfile) === null || _a === void 0 ? void 0 : _a.user.name,
            amount: payment.amount,
            amountPaid: payment.amountPaid,
            balanceOwed: payment.balanceOwed,
            method: payment.method,
            hostelName: (_c = (_b = payment.residentProfile) === null || _b === void 0 ? void 0 : _b.hostel) === null || _c === void 0 ? void 0 : _c.name,
            room: ((_d = payment.residentProfile) === null || _d === void 0 ? void 0 : _d.room) ? (0, dto_1.toRoomDto)(payment.residentProfile.room) : null,
            roomNumber: (_f = (_e = payment.residentProfile) === null || _e === void 0 ? void 0 : _e.room) === null || _f === void 0 ? void 0 : _f.number,
            status: payment.status,
        };
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getPaymentReceiptData = getPaymentReceiptData;
