"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.generateCalendarYearReportController = exports.getHostelDisbursementSummaryController = exports.getResidentDashboardAnalytics = exports.getResidentAnalytics = exports.getSystemAnalytics = exports.getHostelAnalytics = void 0;
const analyticsHelper = __importStar(require("../helper/analyticsHelper"));
const http_status_1 = require("../utils/http-status");
const formatPrisma_1 = require("../utils/formatPrisma");
const http_error_1 = __importDefault(require("../utils/http-error"));
function ensureResidentDashboardAccess({ requester, hostelId, residentUserId, }) {
    const { role, id, hostelId: requesterHostelId } = requester;
    if (role === "super_admin") {
        return;
    }
    if (role === "admin" || role === "staff") {
        if (!hostelId || requesterHostelId !== hostelId) {
            throw new http_error_1.default(http_status_1.HttpStatus.FORBIDDEN, "Access denied for this resident");
        }
        return;
    }
    if (role === "resident") {
        if (residentUserId !== id) {
            throw new http_error_1.default(http_status_1.HttpStatus.FORBIDDEN, "You can only view your own analytics");
        }
        return;
    }
    throw new http_error_1.default(http_status_1.HttpStatus.FORBIDDEN, "Role not permitted");
}
const getHostelAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hostelId } = req.params;
        const analytics = yield analyticsHelper.generateHostelAnalytics(hostelId);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Hostel analytics generated successfully",
            data: analytics,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.getHostelAnalytics = getHostelAnalytics;
const getSystemAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const analytics = yield analyticsHelper.generateSystemAnalytics();
        res.status(http_status_1.HttpStatus.OK).json({
            message: "System analytics generated successfully",
            data: analytics,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.getSystemAnalytics = getSystemAnalytics;
const getResidentAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hostelId } = req.params;
        const analytics = yield analyticsHelper.generateResidentAnalytics(hostelId);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Resident analytics generated successfully",
            data: analytics,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.getResidentAnalytics = getResidentAnalytics;
const getResidentDashboardAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const requester = req.user;
        if (!requester) {
            throw new http_error_1.default(http_status_1.HttpStatus.UNAUTHORIZED, "Authentication required");
        }
        const analytics = yield analyticsHelper.generateResidentDashboardAnalytics(userId);
        ensureResidentDashboardAccess({
            requester,
            hostelId: analytics.hostelId,
            residentUserId: analytics.userId,
        });
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Resident dashboard analytics generated successfully",
            data: analytics,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.getResidentDashboardAnalytics = getResidentDashboardAnalytics;
const getHostelDisbursementSummaryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const summary = yield analyticsHelper.getHostelDisbursementSummary();
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Hostel disbursement summary generated successfully",
            data: summary,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.getHostelDisbursementSummaryController = getHostelDisbursementSummaryController;
// Generate Calendar Year Report
const generateCalendarYearReportController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { hostelId, calendarYearId } = req.params;
    try {
        const report = yield analyticsHelper.generateCalendarYearReport(hostelId, calendarYearId);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Calendar year report generated successfully",
            data: report,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.generateCalendarYearReportController = generateCalendarYearReportController;
