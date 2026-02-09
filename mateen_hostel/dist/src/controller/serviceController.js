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
exports.getResidentBookingsController = exports.bookServiceController = exports.getHostelServicesController = exports.createHostelServiceController = void 0;
const serviceHelper = __importStar(require("../helper/serviceHelper"));
const formatPrisma_1 = require("../utils/formatPrisma");
const http_status_1 = require("../utils/http-status");
const http_error_1 = __importDefault(require("../utils/http-error"));
const jwt_decode_1 = require("jwt-decode");
const createHostelServiceController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader)
            throw new http_error_1.default(http_status_1.HttpStatus.UNAUTHORIZED, "No token provided");
        const token = authHeader.split(" ")[1];
        const decoded = (0, jwt_decode_1.jwtDecode)(token);
        const data = req.body;
        const service = yield serviceHelper.createHostelService(decoded.id, data);
        res.status(http_status_1.HttpStatus.CREATED).json({
            message: "Hostel service created successfully",
            data: service,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.createHostelServiceController = createHostelServiceController;
const getHostelServicesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { hostelId } = req.params;
        const user = req.user;
        // If user is a resident, always force their hostelId
        if ((user === null || user === void 0 ? void 0 : user.role) === "resident" && user.hostelId) {
            hostelId = user.hostelId;
        }
        else if (!hostelId && (user === null || user === void 0 ? void 0 : user.hostelId)) {
            hostelId = user.hostelId;
        }
        if (!hostelId) {
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, "Hostel ID is required");
        }
        const services = yield serviceHelper.getHostelServices(hostelId);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Services fetched successfully",
            data: services,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.getHostelServicesController = getHostelServicesController;
const bookServiceController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader)
            throw new http_error_1.default(http_status_1.HttpStatus.UNAUTHORIZED, "No token provided");
        const token = authHeader.split(" ")[1];
        const decoded = (0, jwt_decode_1.jwtDecode)(token);
        const data = req.body;
        const booking = yield serviceHelper.bookService(decoded.id, data);
        res.status(http_status_1.HttpStatus.CREATED).json({
            message: "Service booked successfully",
            data: booking,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.bookServiceController = bookServiceController;
const getResidentBookingsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader)
            throw new http_error_1.default(http_status_1.HttpStatus.UNAUTHORIZED, "No token provided");
        const token = authHeader.split(" ")[1];
        const decoded = (0, jwt_decode_1.jwtDecode)(token);
        const bookings = yield serviceHelper.getResidentBookings(decoded.id);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Bookings fetched successfully",
            data: bookings,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.getResidentBookingsController = getResidentBookingsController;
