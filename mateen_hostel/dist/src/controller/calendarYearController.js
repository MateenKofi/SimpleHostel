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
Object.defineProperty(exports, "__esModule", { value: true });
exports.endCalendarYearController = exports.deleteCalendarYearController = exports.updateCalendarYearController = exports.getCalendarYearFinancialReportController = exports.getHistoricalCalendarYearsController = exports.getCurrentCalendarYearController = exports.startNewCalendarController = void 0;
const CalendarYearHelper = __importStar(require("../helper/calendarYearHelper")); // Import helper functions for calendar
const http_status_1 = require("../utils/http-status");
const formatPrisma_1 = require("../utils/formatPrisma");
// Start New Calendar Year
const startNewCalendarController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { hostelId, name } = req.body;
    try {
        yield CalendarYearHelper.startNewCalendar(hostelId, name);
        res.status(http_status_1.HttpStatus.CREATED).json({
            message: "New calendar year started successfully",
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.startNewCalendarController = startNewCalendarController;
// Get current calendar year
const getCurrentCalendarYearController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { hostelId } = req.params;
    try {
        const currentYear = yield CalendarYearHelper.getCurrentCalendarYear(hostelId);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Current calendar year fetched successfully",
            data: currentYear,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.getCurrentCalendarYearController = getCurrentCalendarYearController;
// Get historical calendar years
const getHistoricalCalendarYearsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { hostelId } = req.params;
    try {
        const historicalYears = yield CalendarYearHelper.getHistoricalCalendarYears(hostelId);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Historical calendar years fetched successfully",
            data: historicalYears,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.getHistoricalCalendarYearsController = getHistoricalCalendarYearsController;
// Get calendar year financial report
const getCalendarYearFinancialReportController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { calendarYearId } = req.params;
    try {
        const report = yield CalendarYearHelper.getCalendarYearFinancialReport(calendarYearId);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Calendar year financial report fetched successfully",
            data: report,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.getCalendarYearFinancialReportController = getCalendarYearFinancialReportController;
// Update calendar year
const updateCalendarYearController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { calendarYearId } = req.params;
    const { name } = req.body;
    try {
        const updatedYear = yield CalendarYearHelper.updateCalendarYear(calendarYearId, { name });
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Calendar year updated successfully",
            data: updatedYear,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.updateCalendarYearController = updateCalendarYearController;
const deleteCalendarYearController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { calendarYearId } = req.params; // Get calendar year ID from the URL
    const { hostelId } = req.body; // Get hostel ID from the request body (optional, can be part of the request params)
    try {
        const response = yield CalendarYearHelper.deleteCalendarYear(calendarYearId, hostelId);
        res.status(http_status_1.HttpStatus.OK).json({
            message: response.message,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.deleteCalendarYearController = deleteCalendarYearController;
// End calendar year
const endCalendarYearController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { calendarYearId } = req.params;
    try {
        const endedYear = yield CalendarYearHelper.endCalendarYear(calendarYearId);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Calendar year ended successfully",
            data: endedYear,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.endCalendarYearController = endCalendarYearController;
