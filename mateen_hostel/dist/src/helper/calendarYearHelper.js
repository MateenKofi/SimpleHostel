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
exports.endCalendarYear = exports.deleteCalendarYear = exports.updateCalendarYear = exports.getCalendarYearFinancialReport = exports.getHistoricalCalendarYears = exports.getCurrentCalendarYear = exports.startNewCalendar = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const http_error_1 = __importDefault(require("../utils/http-error"));
const http_status_1 = require("../utils/http-status");
const client_1 = require("@prisma/client");
const formatPrisma_1 = require("../utils/formatPrisma");
const startNewCalendar = (hostelId, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            yield tx.calendarYear.updateMany({
                where: { hostelId, isActive: true },
                data: { isActive: false, endDate: new Date() },
            });
            const newCalendarYear = yield tx.calendarYear.create({
                data: {
                    name,
                    startDate: new Date(),
                    endDate: null,
                    isActive: true,
                    hostelId,
                },
            });
            const residents = yield tx.residentProfile.findMany({
                where: {
                    roomId: { not: null },
                    room: { hostelId },
                },
                include: {
                    room: true,
                    payments: {
                        where: {
                            deletedAt: null,
                            status: { in: [client_1.PaymentStatus.confirmed] },
                        },
                    },
                },
            });
            for (const resident of residents) {
                if (!resident.roomId)
                    continue;
                const totalPaid = resident.payments.reduce((sum, payment) => {
                    var _a, _b;
                    const value = (_b = (_a = payment.amountPaid) !== null && _a !== void 0 ? _a : payment.amount) !== null && _b !== void 0 ? _b : 0;
                    return sum + value;
                }, 0);
                const historicalResident = yield tx.historicalResident.create({
                    data: {
                        residentId: resident.id,
                        roomId: resident.roomId,
                        calendarYearId: newCalendarYear.id,
                        amountPaid: totalPaid,
                        roomPrice: (_b = (_a = resident.room) === null || _a === void 0 ? void 0 : _a.price) !== null && _b !== void 0 ? _b : 0,
                    },
                });
                yield tx.payment.updateMany({
                    where: { residentProfileId: resident.id },
                    data: {
                        residentProfileId: null,
                        historicalResidentId: historicalResident.id,
                    },
                });
                yield tx.residentProfile.update({
                    where: { id: resident.id },
                    data: {
                        roomId: null,
                        status: client_1.ResidentStatus.checked_out,
                    },
                });
            }
            yield tx.room.updateMany({
                where: { hostelId },
                data: { status: client_1.RoomStatus.available, currentResidentCount: 0 },
            });
        }));
    }
    catch (error) {
        console.error("Transaction failed with error:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.startNewCalendar = startNewCalendar;
// Get current calendar year
const getCurrentCalendarYear = (hostelId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentYear = yield prisma_1.default.calendarYear.findFirst({
            where: {
                hostelId,
                isActive: true,
            },
            include: {
                residents: {
                    include: {
                        room: true,
                        payments: true,
                    },
                },
            },
        });
        if (!currentYear) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "No active calendar year found");
        }
        return currentYear;
    }
    catch (error) {
        console.error("Error getting current calendar year:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getCurrentCalendarYear = getCurrentCalendarYear;
// Get historical calendar years
const getHistoricalCalendarYears = (hostelId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const historicalYears = yield prisma_1.default.calendarYear.findMany({
            where: {
                hostelId,
                isActive: false,
            },
            include: {
                historicalResidents: {
                    include: {
                        room: true,
                    },
                },
            },
            orderBy: {
                startDate: "desc",
            },
        });
        return historicalYears;
    }
    catch (error) {
        console.error("Error getting historical calendar year:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getHistoricalCalendarYears = getHistoricalCalendarYears;
// Get calendar year financial report
const getCalendarYearFinancialReport = (calendarYearId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const report = yield prisma_1.default.calendarYear.findUnique({
            where: { id: calendarYearId },
            include: {
                historicalResidents: true,
            },
        });
        if (!report) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Calendar year not found");
        }
        const totalRevenue = report.historicalResidents.reduce((sum, hist) => sum + hist.amountPaid, 0);
        return {
            totalRevenue,
            historicalResidents: report.historicalResidents.length,
            averageRevenuePerResident: report.historicalResidents.length > 0
                ? totalRevenue / report.historicalResidents.length
                : 0,
        };
    }
    catch (error) {
        console.error("Error getting  calendar financial year report:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getCalendarYearFinancialReport = getCalendarYearFinancialReport;
// Update calendar year
const updateCalendarYear = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedYear = yield prisma_1.default.calendarYear.update({
            where: { id },
            data,
            include: {
                residents: true,
                historicalResidents: true,
            },
        });
        return updatedYear;
    }
    catch (error) {
        console.error("Error updating  calendar year:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.updateCalendarYear = updateCalendarYear;
const deleteCalendarYear = (calendarYearId, hostelId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find the calendar year to delete
        const calendarYear = yield prisma_1.default.calendarYear.findUnique({
            where: { id: calendarYearId },
            include: {
                residents: true,
            },
        });
        if (!calendarYear) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Calendar year not found");
        }
        if (calendarYear.isActive) {
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, "Cannot delete an active calendar year");
        }
        // Begin transaction to handle the deletion
        yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // Optionally, you can reset room statuses to AVAILABLE if needed
            yield tx.room.updateMany({
                where: { hostelId },
                data: { status: client_1.RoomStatus.available },
            });
            // Delete the calendar year
            yield tx.calendarYear.delete({
                where: { id: calendarYearId },
            });
            // Optionally, delete associated historical records (if necessary)
            yield tx.historicalResident.deleteMany({
                where: { calendarYearId },
            });
        }));
        return { message: "Calendar year deleted successfully" };
    }
    catch (error) {
        throw new http_error_1.default(http_status_1.HttpStatus.INTERNAL_SERVER_ERROR, "Error deleting calendar year");
    }
});
exports.deleteCalendarYear = deleteCalendarYear;
// End calendar year
const endCalendarYear = (calendarYearId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const calendarYear = yield prisma_1.default.calendarYear.findUnique({
            where: { id: calendarYearId },
        });
        if (!calendarYear) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Calendar year not found");
        }
        if (!calendarYear.isActive) {
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, "Cannot end an already ended calendar year");
        }
        const endedYear = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            // Move all active residents to historical residents
            const residents = yield tx.residentProfile.findMany({
                where: {
                    roomId: { not: null },
                    room: { hostelId: calendarYear.hostelId },
                },
                include: {
                    room: true,
                    payments: {
                        where: {
                            deletedAt: null,
                            status: { in: [client_1.PaymentStatus.confirmed] },
                            calendarYearId: calendarYearId,
                        },
                    },
                },
            });
            for (const resident of residents) {
                if (!resident.roomId)
                    continue;
                const totalPaid = resident.payments.reduce((sum, payment) => {
                    var _a, _b;
                    const value = (_b = (_a = payment.amountPaid) !== null && _a !== void 0 ? _a : payment.amount) !== null && _b !== void 0 ? _b : 0;
                    return sum + value;
                }, 0);
                const historicalResident = yield tx.historicalResident.create({
                    data: {
                        residentId: resident.id,
                        roomId: resident.roomId,
                        calendarYearId: calendarYearId,
                        amountPaid: totalPaid,
                        roomPrice: (_b = (_a = resident.room) === null || _a === void 0 ? void 0 : _a.price) !== null && _b !== void 0 ? _b : 0,
                    },
                });
                yield tx.payment.updateMany({
                    where: { residentProfileId: resident.id },
                    data: {
                        residentProfileId: null,
                        historicalResidentId: historicalResident.id,
                    },
                });
                yield tx.residentProfile.update({
                    where: { id: resident.id },
                    data: {
                        roomId: null,
                        status: client_1.ResidentStatus.checked_out,
                    },
                });
            }
            // Reset all rooms in the hostel to available
            yield tx.room.updateMany({
                where: {
                    hostelId: calendarYear.hostelId,
                },
                data: { status: client_1.RoomStatus.available, currentResidentCount: 0 },
            });
            // End the calendar year
            return yield tx.calendarYear.update({
                where: { id: calendarYearId },
                data: {
                    isActive: false,
                    endDate: new Date(),
                },
                include: {
                    historicalResidents: true,
                },
            });
        }));
        return endedYear;
    }
    catch (error) {
        console.error("Error ending calendar year:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.endCalendarYear = endCalendarYear;
