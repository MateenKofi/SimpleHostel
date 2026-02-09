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
exports.fixOrphanedPayments = exports.getPaymentsByReference = exports.getPaymentsById = exports.getPaymentsForHostel = exports.getAllPayments = exports.TopUpPayment = exports.initializeTopUpPayment = exports.confirmPayment = exports.initializePayment = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const http_status_1 = require("../utils/http-status");
const http_error_1 = __importDefault(require("../utils/http-error"));
const formatPrisma_1 = require("../utils/formatPrisma");
const dto_1 = require("../utils/dto");
// Note: Avoid importing generated model types directly to keep this file decoupled from generation timing
const paystack_1 = __importDefault(require("../utils/paystack"));
const emailHelper_1 = require("./emailHelper");
const residentHelper_1 = require("./residentHelper");
// Payment Processing Functions
const initializePayment = (roomId, residentId, initialPayment) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const residentProfile = yield tx.residentProfile.findUnique({
                where: { id: residentId },
                include: { user: true },
            });
            if (!residentProfile || !((_a = residentProfile.user) === null || _a === void 0 ? void 0 : _a.email)) {
                throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, "Resident profile with a valid email is required before initializing payment. Please ensure the resident profile exists and has a valid email address.");
            }
            const room = yield tx.room.findUnique({
                where: { id: roomId },
                include: { hostel: true },
            });
            if (!room) {
                throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Room not found");
            }
            const activeCalendar = yield tx.calendarYear.findFirst({
                where: { isActive: true, hostelId: room.hostelId },
            });
            if (!activeCalendar) {
                throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, "No active calendar year found");
            }
            const paymentResponse = yield paystack_1.default.initializeTransaction(residentProfile.user.email, initialPayment);
            yield tx.payment.create({
                data: {
                    amount: initialPayment,
                    residentProfileId: residentId,
                    roomId,
                    status: "pending",
                    reference: paymentResponse.data.reference,
                    method: paymentResponse.data.payment_method,
                    calendarYearId: activeCalendar.id,
                },
            });
            return {
                authorizationUrl: paymentResponse.data.authorization_url,
                reference: paymentResponse.data.reference,
            };
        }));
    }
    catch (error) {
        console.error("Error initializing payment:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.initializePayment = initializePayment;
const confirmPayment = (reference) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const verificationResponse = yield paystack_1.default.verifyTransaction(reference);
        if (verificationResponse.data.status !== "success") {
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, "Payment verification failed.");
        }
        const paymentRecord = yield prisma_1.default.payment.findUnique({
            where: { reference },
            include: { residentProfile: true, historicalResident: true },
        });
        if (!paymentRecord) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Payment record not found.");
        }
        const { roomId, residentProfileId, historicalResidentId } = paymentRecord;
        if (!roomId) {
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, "Room ID is missing in the payment record.");
        }
        if (!residentProfileId && !historicalResidentId) {
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, "Payment must have either a residentProfileId or historicalResidentId.");
        }
        if (paymentRecord.status === "confirmed") {
            return { message: "Payment already confirmed." };
        }
        if (historicalResidentId) {
            yield prisma_1.default.payment.update({
                where: { id: paymentRecord.id },
                data: {
                    status: "confirmed",
                    method: verificationResponse.data.channel,
                },
            });
            return { message: "Payment confirmed for historical resident." };
        }
        const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const room = yield tx.room.findUnique({
                where: { id: roomId },
                include: { hostel: true },
            });
            if (!room) {
                throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Room not found.");
            }
            const residentProfile = yield tx.residentProfile.findUnique({
                where: { id: residentProfileId },
                include: { room: true, user: true },
            });
            if (!residentProfile) {
                throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Resident profile not found.");
            }
            // Sum previously confirmed payments for this resident profile
            const priorPayments = yield tx.payment.findMany({
                where: {
                    residentProfileId: residentProfileId,
                    status: "confirmed",
                    calendarYearId: paymentRecord.calendarYearId,
                },
                select: { amount: true },
            });
            const prevTotal = priorPayments.reduce((sum, p) => { var _a; return sum + ((_a = p.amount) !== null && _a !== void 0 ? _a : 0); }, 0);
            const totalPaid = Number((prevTotal + paymentRecord.amount).toFixed(2));
            const roomPrice = room.price;
            const debt = roomPrice - totalPaid;
            let balanceOwed = null;
            if (debt > 0) {
                const paymentPercentage = Number(((totalPaid / roomPrice) * 100).toFixed(2));
                const hostelThreshold = (_a = room.hostel.partialPaymentPercentage) !== null && _a !== void 0 ? _a : 70;
                if (paymentPercentage >= hostelThreshold) {
                    balanceOwed = Number(debt.toFixed(2));
                }
            }
            // Assign room and hostel to resident profile
            const accessCode = (0, residentHelper_1.generateAccessCode)();
            yield tx.residentProfile.update({
                where: { id: residentProfileId },
                data: {
                    roomId,
                    hostelId: room.hostelId,
                    accessCode,
                },
            });
            // Update User record with hostelId
            yield tx.user.update({
                where: { id: residentProfile.userId },
                data: { hostelId: room.hostelId },
            });
            const updatedPayment = yield tx.payment.update({
                where: { id: paymentRecord.id },
                data: {
                    status: "confirmed",
                    method: verificationResponse.data.channel,
                    amountPaid: Number(totalPaid.toFixed(2)),
                    balanceOwed: balanceOwed !== null && balanceOwed !== void 0 ? balanceOwed : 0,
                },
            });
            const currentResidentsCount = yield tx.residentProfile.count({ where: { roomId } });
            const updatedRoom = yield tx.room.update({
                where: { id: roomId },
                data: { currentResidentCount: currentResidentsCount },
            });
            if (updatedRoom.currentResidentCount >= updatedRoom.maxCap) {
                yield tx.room.update({
                    where: { id: roomId },
                    data: { status: "occupied" },
                });
            }
            return {
                payment: (0, dto_1.toPaymentDto)(updatedPayment),
                residentEmail: residentProfile.user.email,
                residentName: residentProfile.user.name,
                hostelName: room.hostel.name,
                roomNumber: room.number,
                checkInDate: residentProfile.checkInDate,
                accessCode,
            };
        }));
        if ("payment" in result && result.residentEmail) {
            const data = result;
            (0, emailHelper_1.sendBookingSuccessEmail)(data.residentEmail, {
                residentName: data.residentName,
                studentId: ((_a = paymentRecord.residentProfile) === null || _a === void 0 ? void 0 : _a.studentId) || "",
                hostelName: data.hostelName,
                roomNumber: data.roomNumber,
                amountPaid: data.payment.amountPaid,
                balanceOwed: data.payment.balanceOwed,
                reference: data.payment.reference,
                checkInDate: ((_b = data.checkInDate) === null || _b === void 0 ? void 0 : _b.toISOString()) || new Date().toISOString(),
            });
            // Send access code email
            if (data.accessCode) {
                (0, emailHelper_1.sendAccessCodeEmail)(data.residentEmail, {
                    residentName: data.residentName,
                    accessCode: data.accessCode,
                    roomNumber: data.roomNumber,
                    hostelName: data.hostelName,
                }).catch((error) => {
                    console.error("Failed to send access code email:", error);
                });
            }
        }
        return result;
    }
    catch (error) {
        console.error("Error confirming payment:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.confirmPayment = confirmPayment;
const initializeTopUpPayment = (roomId, residentId, initialPayment) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const room = yield tx.room.findUnique({
                where: { id: roomId },
                include: { hostel: true },
            });
            if (!room) {
                throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Room not found.");
            }
            const activeCalendar = yield tx.calendarYear.findFirst({
                where: { isActive: true, hostelId: room.hostelId },
            });
            if (!activeCalendar) {
                throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, "No active calendar year found.");
            }
            const residentProfile = yield tx.residentProfile.findUnique({
                where: { id: residentId },
                include: { user: true },
            });
            // Compute current debt based on prior confirmed payments
            const priorPayments = yield tx.payment.findMany({
                where: { residentProfileId: residentId, status: "confirmed" },
                select: { amount: true },
            });
            const prevTotal = priorPayments.reduce((sum, p) => { var _a; return sum + ((_a = p.amount) !== null && _a !== void 0 ? _a : 0); }, 0);
            const roomPrice = room.price;
            const debtbal = roomPrice - prevTotal;
            if (initialPayment > debtbal) {
                throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, "Amount you want to pay must be less than or equal to what you owe.");
            }
            if (!residentProfile || !((_a = residentProfile.user) === null || _a === void 0 ? void 0 : _a.email)) {
                throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, "Resident profile with a valid email is required before initializing payment. Please ensure the resident profile exists and has a valid email address.");
            }
            const paymentResponse = yield paystack_1.default.initializeTransaction(residentProfile.user.email, initialPayment);
            yield tx.payment.create({
                data: {
                    amount: initialPayment,
                    residentProfileId: residentId,
                    roomId,
                    status: "pending",
                    reference: paymentResponse.data.reference,
                    method: paymentResponse.data.channel,
                    calendarYearId: activeCalendar.id,
                },
            });
            return paymentResponse.data.authorization_url;
        }));
    }
    catch (error) {
        console.error("error initializing top up payment:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.initializeTopUpPayment = initializeTopUpPayment;
const TopUpPayment = (reference) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Verify transaction with Paystack
        const verificationResponse = yield paystack_1.default.verifyTransaction(reference);
        if (verificationResponse.data.status !== "success") {
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, "Payment verification failed.");
        }
        // Fetch payment record
        const paymentRecord = yield prisma_1.default.payment.findUnique({
            where: { reference },
            include: { residentProfile: true, historicalResident: true },
        });
        if (!paymentRecord) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Payment record not found.");
        }
        const { roomId, residentProfileId, historicalResidentId } = paymentRecord;
        if (!roomId) {
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, "Room ID is missing in the payment record.");
        }
        if (!residentProfileId && !historicalResidentId) {
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, "Payment must have either a residentProfileId or historicalResidentId.");
        }
        if (paymentRecord.status === "confirmed") {
            return { message: "Payment already confirmed." };
        }
        // Handle historical resident separately
        if (historicalResidentId) {
            yield prisma_1.default.payment.update({
                where: { id: paymentRecord.id },
                data: {
                    status: "confirmed",
                    method: verificationResponse.data.channel,
                },
            });
            return { message: "Top-up payment confirmed for historical resident." };
        }
        // Transaction for current resident update
        const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const room = yield tx.room.findUnique({ where: { id: roomId }, include: { hostel: true } });
            if (!room) {
                throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Room not found.");
            }
            const residentProfile = yield tx.residentProfile.findUnique({
                where: { id: residentProfileId },
                include: { user: true },
            });
            const priorPayments = yield tx.payment.findMany({
                where: {
                    residentProfileId: residentProfileId,
                    status: "confirmed",
                    calendarYearId: paymentRecord.calendarYearId,
                },
                select: { amount: true },
            });
            const prevTotal = priorPayments.reduce((sum, p) => { var _a; return sum + ((_a = p.amount) !== null && _a !== void 0 ? _a : 0); }, 0);
            const roomPrice = room.price;
            const totalPaid = Number((prevTotal + paymentRecord.amount).toFixed(2));
            const debt = roomPrice - totalPaid;
            let balanceOwed = null;
            if (debt > 0) {
                const paymentPercentage = Number(((totalPaid / roomPrice) * 100).toFixed(2));
                const hostelThreshold = (_a = room.hostel.partialPaymentPercentage) !== null && _a !== void 0 ? _a : 70;
                if (paymentPercentage >= hostelThreshold) {
                    balanceOwed = Number(debt.toFixed(2));
                }
            }
            // Update payment record
            const updatedPayment = yield tx.payment.update({
                where: { id: paymentRecord.id },
                data: {
                    status: "confirmed",
                    method: verificationResponse.data.channel,
                    amountPaid: Number(totalPaid.toFixed(2)),
                    balanceOwed: balanceOwed !== null && balanceOwed !== void 0 ? balanceOwed : 0,
                },
            });
            return {
                payment: (0, dto_1.toPaymentDto)(updatedPayment),
                residentEmail: residentProfile === null || residentProfile === void 0 ? void 0 : residentProfile.user.email,
                residentName: residentProfile === null || residentProfile === void 0 ? void 0 : residentProfile.user.name,
                hostelName: room.hostel.name,
            };
        }));
        if ("payment" in result && result.residentEmail) {
            const data = result;
            (0, emailHelper_1.sendTopUpSuccessEmail)(data.residentEmail, {
                residentName: data.residentName,
                amountPaid: data.payment.amountPaid,
                balanceOwed: data.payment.balanceOwed,
                reference: data.payment.reference,
                hostelName: data.hostelName,
            });
        }
        return result;
    }
    catch (error) {
        console.error("Update Hostel Error:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.TopUpPayment = TopUpPayment;
const getAllPayments = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payments = yield prisma_1.default.payment.findMany();
        return payments.map((p) => (0, dto_1.toPaymentDto)(p));
    }
    catch (error) {
        console.error("error getting payments:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getAllPayments = getAllPayments;
const getPaymentsForHostel = (hostelId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payments = yield prisma_1.default.payment.findMany({ where: { residentProfile: { room: { hostelId } } } });
        return payments.map((p) => (0, dto_1.toPaymentDto)(p));
    }
    catch (error) {
        console.error("error getting payments for hostel:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getPaymentsForHostel = getPaymentsForHostel;
const getPaymentsById = (paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payment = yield prisma_1.default.payment.findUnique({
            where: { id: paymentId },
            include: {
                room: {
                    include: {
                        hostel: true,
                        roomImages: true,
                    },
                },
                residentProfile: {
                    include: {
                        user: true,
                    },
                },
                calendarYear: true,
            },
        });
        if (!payment) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Payment not found");
        }
        return (0, dto_1.toPaymentDto)(payment);
    }
    catch (error) {
        console.error("error getting payment:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getPaymentsById = getPaymentsById;
const getPaymentsByReference = (reference) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payment = yield prisma_1.default.payment.findUnique({
            where: { reference },
            include: {
                room: {
                    include: {
                        hostel: true,
                    },
                },
                residentProfile: {
                    include: {
                        user: true,
                    },
                },
                calendarYear: true,
            },
        });
        if (!payment) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Payment not found");
        }
        return (0, dto_1.toPaymentDto)(payment);
    }
    catch (error) {
        console.error("error getting payment:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getPaymentsByReference = getPaymentsByReference;
const fixOrphanedPayments = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orphanedPayments = yield prisma_1.default.payment.findMany({
            where: {
                residentProfileId: null,
                historicalResidentId: null,
            },
            include: {
                room: {
                    include: {
                        residents: true,
                        hostel: true,
                        roomImages: true,
                    },
                },
                calendarYear: true,
            },
        });
        const resolutions = [];
        for (const payment of orphanedPayments) {
            try {
                yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
                    var _a, _b, _c;
                    // Case 1: Payment has a room with a current resident
                    if ((_c = (_b = (_a = payment.room) === null || _a === void 0 ? void 0 : _a.residents) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.id) {
                        yield tx.payment.update({
                            where: { id: payment.id },
                            data: { residentProfileId: payment.room.residents[0].id },
                        });
                        resolutions.push({
                            paymentId: payment.id,
                            resolution: "linked_to_resident",
                            details: `Linked to current resident ${payment.room.residents[0].id}`,
                        });
                        return;
                    }
                    // Case 2: Payment has a room and calendar year - try to find historical resident
                    if (payment.roomId && payment.calendarYearId) {
                        const historicalResident = yield tx.historicalResident.findFirst({
                            where: {
                                roomId: payment.roomId,
                                calendarYearId: payment.calendarYearId,
                            },
                        });
                        if (historicalResident) {
                            yield tx.payment.update({
                                where: { id: payment.id },
                                data: { historicalResidentId: historicalResident.id },
                            });
                            resolutions.push({
                                paymentId: payment.id,
                                resolution: "linked_to_historical",
                                details: `Linked to historical resident ${historicalResident.id}`,
                            });
                            return;
                        }
                    }
                    // Case 3: Payment is older than 6 months and unverified
                    const sixMonthsAgo = new Date();
                    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
                    if (payment.createdAt < sixMonthsAgo && payment.status === "pending") {
                        yield tx.payment.update({
                            where: { id: payment.id },
                            data: { status: "cancelled" },
                        });
                        resolutions.push({
                            paymentId: payment.id,
                            resolution: "marked_invalid",
                            details: "Old unverified payment marked as invalid",
                        });
                        return;
                    }
                    // Case 4: Payment is a duplicate (same amount, room, calendar year, within 5 minutes)
                    const possibleDuplicates = yield tx.payment.findMany({
                        where: {
                            id: { not: payment.id },
                            amount: payment.amount,
                            roomId: payment.roomId,
                            calendarYearId: payment.calendarYearId,
                            createdAt: {
                                gte: new Date(payment.createdAt.getTime() - 5 * 60000),
                                lte: new Date(payment.createdAt.getTime() + 5 * 60000),
                            },
                        },
                    });
                    if (possibleDuplicates.length > 0) {
                        yield tx.payment.update({
                            where: { id: payment.id },
                            data: { status: "cancelled" },
                        });
                        resolutions.push({
                            paymentId: payment.id,
                            resolution: "deleted",
                            details: "Identified as duplicate payment and marked as deleted",
                        });
                        return;
                    }
                    // Case 5: Cannot resolve - mark as invalid
                    yield tx.payment.update({
                        where: { id: payment.id },
                        data: { status: "cancelled" },
                    });
                }));
            }
            catch (error) {
                console.error("Error resolving orphaned payment:", error);
                resolutions.push({
                    paymentId: payment.id,
                    resolution: "marked_invalid",
                    details: "Failed to resolve payment automatically",
                });
            }
        }
        return resolutions;
    }
    catch (error) {
        console.error("error fixing orphaned payments:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.fixOrphanedPayments = fixOrphanedPayments;
