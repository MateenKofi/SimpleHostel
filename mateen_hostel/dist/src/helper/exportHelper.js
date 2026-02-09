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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffCsv = exports.paymentCsv = exports.visitorCsv = exports.roomCsv = exports.residentCsv = exports.amenitiesCsv = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const json2csv_1 = require("json2csv");
const formatPrisma_1 = require("../utils/formatPrisma");
const amenitiesCsv = (hostelId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const amenities = yield prisma_1.default.amenities.findMany({
            where: {
                hostelId,
                hostel: { deletedAt: null },
            },
            include: {
                hostel: true,
                rooms: true,
            },
        });
        const modifiedAmenities = amenities.map((amenity) => {
            var _a;
            return (Object.assign(Object.assign({}, amenity), { rooms: (_a = amenity.rooms) !== null && _a !== void 0 ? _a : [], deletedAt: undefined }));
        });
        // Convert the modified data into CSV
        const csv = (0, json2csv_1.parse)(modifiedAmenities);
        return csv;
    }
    catch (error) {
        console.error("error getting amenities csv:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.amenitiesCsv = amenitiesCsv;
const residentCsv = (hostelId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const residents = yield prisma_1.default.residentProfile.findMany({
            where: {
                OR: [{ hostelId }, { room: { hostelId } }],
            },
            include: {
                room: true,
                user: true,
            },
        });
        const modifiedAmenities = residents.map((resident) => {
            var _a, _b;
            return (Object.assign(Object.assign({}, resident), { room: (_a = resident.room) !== null && _a !== void 0 ? _a : null, user: (_b = resident.user) !== null && _b !== void 0 ? _b : null, deletedAt: undefined }));
        });
        // Convert the modified data into CSV
        const csv = (0, json2csv_1.parse)(modifiedAmenities);
        return csv;
    }
    catch (error) {
        console.error("error generating resident csv:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.residentCsv = residentCsv;
const roomCsv = (hostelId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rooms = yield prisma_1.default.room.findMany({
            where: {
                hostelId,
                deletedAt: null,
                hostel: { deletedAt: null },
            },
            include: {
                hostel: true,
            },
        });
        const modifiedRooms = rooms.map((room) => {
            var _a;
            return (Object.assign(Object.assign({}, room), { hostel: (_a = room.hostel) !== null && _a !== void 0 ? _a : null, deletedAt: undefined }));
        });
        // Convert the modified data into CSV
        const csv = (0, json2csv_1.parse)(modifiedRooms);
        return csv;
    }
    catch (error) {
        console.error("error generating room csv:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.roomCsv = roomCsv;
const visitorCsv = (hostelId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const visitors = yield prisma_1.default.visitor.findMany({
            where: {
                resident: {
                    OR: [{ hostelId }, { room: { hostelId } }],
                },
            },
            include: {
                resident: {
                    include: {
                        user: true,
                        room: true,
                    },
                },
            },
        });
        const modifiedVisitors = visitors.map((visitor) => {
            var _a;
            return (Object.assign(Object.assign({}, visitor), { resident: (_a = visitor.resident) !== null && _a !== void 0 ? _a : null, deletedAt: undefined }));
        });
        // Convert the modified data into CSV
        const csv = (0, json2csv_1.parse)(modifiedVisitors);
        return csv;
    }
    catch (error) {
        console.error("error generating visitors csv:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.visitorCsv = visitorCsv;
const paymentCsv = (hostelId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payments = yield prisma_1.default.payment.findMany({
            where: {
                deletedAt: null,
                OR: [
                    { residentProfile: { hostelId } },
                    { room: { hostelId } },
                    { calendarYear: { hostelId } },
                    { historicalResident: { room: { hostelId } } },
                ],
            },
            include: {
                residentProfile: {
                    include: {
                        user: true,
                        room: true,
                    },
                },
                room: true,
                calendarYear: true,
                historicalResident: {
                    include: {
                        room: true,
                    },
                },
            },
        });
        const modifiedPayments = payments.map((payment) => {
            var _a;
            return (Object.assign(Object.assign({}, payment), { residentProfile: (_a = payment.residentProfile) !== null && _a !== void 0 ? _a : null, deletedAt: undefined }));
        });
        // Convert the modified data into CSV
        const csv = (0, json2csv_1.parse)(modifiedPayments);
        return csv;
    }
    catch (error) {
        console.error("error generating payments csv:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.paymentCsv = paymentCsv;
const StaffCsv = (hostelId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const staffProfiles = yield prisma_1.default.staffProfile.findMany({
            where: {
                OR: [{ hostelId }, { hostel: { id: hostelId } }],
            },
            include: {
                hostel: true,
                user: true,
            },
        });
        const modifiedStaffs = staffProfiles.map((staff) => {
            var _a, _b;
            return (Object.assign(Object.assign({}, staff), { hostel: (_a = staff.hostel) !== null && _a !== void 0 ? _a : null, user: (_b = staff.user) !== null && _b !== void 0 ? _b : null, deletedAt: undefined }));
        });
        // Convert the modified data into CSV
        const csv = (0, json2csv_1.parse)(modifiedStaffs);
        return csv;
    }
    catch (error) {
        console.error("error generating staff csv:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.StaffCsv = StaffCsv;
