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
exports.exportStaffCsv = exports.exportPaymentCsv = exports.exportVisitorCsv = exports.exportRoomCsv = exports.exportAmenitiesCsv = exports.exportResidentsCsv = void 0;
const exportHelper = __importStar(require("../helper/exportHelper")); // Import your export helper functions
const formatPrisma_1 = require("../utils/formatPrisma"); // Ensure the error formatting utility is used
// Controller for exporting residents CSV
const exportResidentsCsv = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hostelId = req.params.hostelId; // Get hostelId from the request parameters
        const csvData = yield exportHelper.residentCsv(hostelId); // Call the helper function for residents CSV
        // Set response headers for file download
        res.header("Content-Type", "text/csv");
        res.attachment("residents.csv"); // Name the file as "residents.csv"
        // Send the CSV data as the response
        res.send(csvData);
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.exportResidentsCsv = exportResidentsCsv;
// Controller for exporting amenities CSV
const exportAmenitiesCsv = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hostelId = req.params.hostelId; // Get hostelId from the request parameters
        const csvData = yield exportHelper.amenitiesCsv(hostelId); // Call the helper function for amenities CSV
        // Set response headers for file download
        res.header("Content-Type", "text/csv");
        res.attachment("amenities.csv"); // Name the file as "amenities.csv"
        // Send the CSV data as the response
        res.send(csvData);
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.exportAmenitiesCsv = exportAmenitiesCsv;
// Controller for exporting room CSV
const exportRoomCsv = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hostelId = req.params.hostelId; // Get hostelId from the request parameters
        const csvData = yield exportHelper.roomCsv(hostelId); // Call the helper function for room CSV
        // Set response headers for file download
        res.header("Content-Type", "text/csv");
        res.attachment("rooms.csv"); // Name the file as "rooms.csv"
        // Send the CSV data as the response
        res.send(csvData);
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.exportRoomCsv = exportRoomCsv;
// Controller for exporting visitor CSV
const exportVisitorCsv = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hostelId = req.params.hostelId; // Get hostelId from the request parameters
        const csvData = yield exportHelper.visitorCsv(hostelId); // Call the helper function for visitor CSV
        // Set response headers for file download
        res.header("Content-Type", "text/csv");
        res.attachment("visitors.csv"); // Name the file as "visitors.csv"
        // Send the CSV data as the response
        res.send(csvData);
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.exportVisitorCsv = exportVisitorCsv;
// Controller for exporting payment CSV
const exportPaymentCsv = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hostelId = req.params.hostelId; // Get hostelId from the request parameters
        const csvData = yield exportHelper.paymentCsv(hostelId); // Call the helper function for payment CSV
        // Set response headers for file download
        res.header("Content-Type", "text/csv");
        res.attachment("payments.csv"); // Name the file as "payments.csv"
        // Send the CSV data as the response
        res.send(csvData);
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.exportPaymentCsv = exportPaymentCsv;
// Controller for exporting staff CSV (same structure as the other controllers)
const exportStaffCsv = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hostelId = req.params.hostelId; // Get hostelId from the request parameters
        const csvData = yield exportHelper.StaffCsv(hostelId); // Call the helper function for staff CSV
        // Set response headers for file download
        res.header("Content-Type", "text/csv");
        res.attachment("staff.csv"); // Name the file as "staff.csv"
        // Send the CSV data as the response
        res.send(csvData);
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.exportStaffCsv = exportStaffCsv;
