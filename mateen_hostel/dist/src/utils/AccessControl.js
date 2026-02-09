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
exports.validateHostelAccess = void 0;
const http_error_1 = __importDefault(require("./http-error")); // Adjust the import path as needed
const http_status_1 = require("./http-status"); // Adjust the import path as needed
const prisma_1 = __importDefault(require("../utils/prisma")); // Import Prisma client
const validateHostelAccess = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    const user = req.user;
    // If the user is a super_admin, allow access to all data
    if (user.role === "super_admin") {
        return next();
    }
    if (user.role === "resident") {
        const { userId } = req.params;
        if (userId && userId === user.id) {
            return next();
        }
    }
    // Extract hostelId from the request (params, body, or query)
    let requestedHostelId = req.params.hostelId || req.body.hostelId || req.query.hostelId;
    // If hostelId is not provided directly, fetch it from the database
    if (!requestedHostelId) {
        const { roomId, residentId, paymentId, visitorId, staffId, amenityId, reference, userId, calendarYearId, } = req.params;
        if (roomId) {
            // Fetch hostelId from the room
            const room = yield prisma_1.default.room.findUnique({
                where: { id: roomId },
                select: { hostelId: true },
            });
            requestedHostelId = room === null || room === void 0 ? void 0 : room.hostelId;
        }
        else if (residentId) {
            // Fetch hostelId from the resident profile's room
            const resident = yield prisma_1.default.residentProfile.findUnique({
                where: { id: residentId },
                include: { room: { select: { hostelId: true } } },
            });
            requestedHostelId = (_a = resident === null || resident === void 0 ? void 0 : resident.room) === null || _a === void 0 ? void 0 : _a.hostelId;
        }
        else if (paymentId) {
            // Fetch hostelId from the payment's resident's room
            const payment = yield prisma_1.default.payment.findUnique({
                where: { id: paymentId },
                include: {
                    historicalResident: {
                        include: { room: { select: { hostelId: true } } },
                    },
                    residentProfile: {
                        include: { room: { select: { hostelId: true } } },
                    },
                },
            });
            requestedHostelId =
                (_d = (_c = (_b = payment === null || payment === void 0 ? void 0 : payment.residentProfile) === null || _b === void 0 ? void 0 : _b.room) === null || _c === void 0 ? void 0 : _c.hostelId) !== null && _d !== void 0 ? _d : (_f = (_e = payment === null || payment === void 0 ? void 0 : payment.historicalResident) === null || _e === void 0 ? void 0 : _e.room) === null || _f === void 0 ? void 0 : _f.hostelId;
        }
        else if (visitorId) {
            // Fetch hostelId from the visitor's resident's room
            const visitor = yield prisma_1.default.visitor.findUnique({
                where: { id: visitorId },
                include: {
                    resident: { include: { room: { select: { hostelId: true } } } },
                },
            });
            requestedHostelId = (_g = visitor === null || visitor === void 0 ? void 0 : visitor.resident.room) === null || _g === void 0 ? void 0 : _g.hostelId;
        }
        else if (staffId) {
            // Fetch hostelId from the staff profile
            const staff = yield prisma_1.default.staffProfile.findUnique({
                where: { id: staffId },
                select: { hostelId: true },
            });
            requestedHostelId = staff === null || staff === void 0 ? void 0 : staff.hostelId;
        }
        else if (amenityId) {
            // Fetch hostelId from the amenities
            const amenities = yield prisma_1.default.amenities.findUnique({
                where: { id: amenityId },
                select: { hostelId: true },
            });
            requestedHostelId = amenities === null || amenities === void 0 ? void 0 : amenities.hostelId;
        }
        else if (userId) {
            // Derive hostelId from user's profile associations
            const user = yield prisma_1.default.user.findUnique({
                where: { id: userId },
                include: {
                    adminProfile: { select: { hostelId: true } },
                    staffProfile: { select: { hostelId: true } },
                    residentProfile: { select: { hostelId: true } },
                },
            });
            requestedHostelId =
                (_l = (_j = (_h = user === null || user === void 0 ? void 0 : user.adminProfile) === null || _h === void 0 ? void 0 : _h.hostelId) !== null && _j !== void 0 ? _j : (_k = user === null || user === void 0 ? void 0 : user.staffProfile) === null || _k === void 0 ? void 0 : _k.hostelId) !== null && _l !== void 0 ? _l : (_m = user === null || user === void 0 ? void 0 : user.residentProfile) === null || _m === void 0 ? void 0 : _m.hostelId;
        }
        else if (calendarYearId) {
            // Fetch hostelId from the amenities
            const calender = yield prisma_1.default.calendarYear.findUnique({
                where: { id: calendarYearId },
                select: { hostelId: true },
            });
            requestedHostelId = calender === null || calender === void 0 ? void 0 : calender.hostelId;
        }
        else if (reference) {
            // Fetch hostelId from the reference
            const payment = yield prisma_1.default.payment.findUnique({
                where: { reference },
                include: {
                    historicalResident: {
                        include: { room: { select: { hostelId: true } } },
                    },
                    residentProfile: {
                        include: {
                            room: {
                                select: {
                                    hostelId: true, // Only selecting hostelId from the room
                                },
                            },
                        },
                    },
                },
            });
            requestedHostelId =
                (_q = (_p = (_o = payment === null || payment === void 0 ? void 0 : payment.residentProfile) === null || _o === void 0 ? void 0 : _o.room) === null || _p === void 0 ? void 0 : _p.hostelId) !== null && _q !== void 0 ? _q : (_s = (_r = payment === null || payment === void 0 ? void 0 : payment.historicalResident) === null || _r === void 0 ? void 0 : _r.room) === null || _s === void 0 ? void 0 : _s.hostelId;
        }
    }
    // If no hostelId is found, deny access
    if (!requestedHostelId) {
        return next(new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, "Hostel ID is required"));
    }
    // Check if the user's hostelId matches the requested hostelId
    if (user.hostelId !== requestedHostelId) {
        return next(new http_error_1.default(http_status_1.HttpStatus.FORBIDDEN, "Access to this hostel is denied"));
    }
    // If everything is fine, proceed to the next middleware or route handler
    next();
});
exports.validateHostelAccess = validateHostelAccess;
