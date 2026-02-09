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
exports.getPaymentReceiptController = exports.getAllocationLetterController = exports.createFeedbackController = exports.getResidentAnnouncementsController = exports.getResidentBillingController = exports.getResidentRequestsController = exports.createMaintenanceRequestController = exports.getResidentRoomDetailsController = exports.checkInResidentController = exports.verifyResidentCodeController = exports.assignRoomToResidentController = exports.addResidentFromHostelController = exports.getAllresidentsForHostel = exports.getDebtorsForHostel = exports.getAlldebtors = exports.deleteResidentController = exports.updateResidentController = exports.getResidentByEmailController = exports.getResidentByIdController = exports.getAllResidentsController = exports.registerResidentController = void 0;
const residentHelper = __importStar(require("../helper/residentHelper")); // Assuming your helper functions are in this file
const http_status_1 = require("../utils/http-status");
const http_error_1 = __importDefault(require("../utils/http-error"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const fs_1 = __importDefault(require("fs"));
const formatPrisma_1 = require("../utils/formatPrisma");
const jwt_decode_1 = require("jwt-decode");
// Register a Resident
const registerResidentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const residentData = req.body; // Get resident data from the request body
    try {
        const newResident = yield residentHelper.register(residentData);
        res.status(http_status_1.HttpStatus.CREATED).json({
            message: "Resident registered successfully",
            data: newResident,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.registerResidentController = registerResidentController;
// Get All Residents
const getAllResidentsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const residents = yield residentHelper.getAllResident();
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Residents fetched successfully",
            data: residents,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.getAllResidentsController = getAllResidentsController;
// Get Resident by ID
const getResidentByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { residentId } = req.params;
    try {
        const resident = yield residentHelper.getResidentById(residentId);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Resident fetched successfully ID",
            data: resident,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.getResidentByIdController = getResidentByIdController;
// Get Resident by Email
const getResidentByEmailController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    try {
        const resident = yield residentHelper.getResidentByEmail(email);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Resident fetched successfully email",
            data: resident,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.getResidentByEmailController = getResidentByEmailController;
// Update a Resident
const updateResidentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { residentId } = req.params;
    const residentData = req.body;
    try {
        const updatedResident = yield residentHelper.updateResident(residentId, residentData);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Resident updated successfully",
            data: updatedResident,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.updateResidentController = updateResidentController;
// Delete a Resident
const deleteResidentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { residentId } = req.params;
    try {
        yield residentHelper.deleteResident(residentId);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Resident deleted successfully",
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.deleteResidentController = deleteResidentController;
const getAlldebtors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const debtors = yield residentHelper.getDebtors();
        if (debtors.length === 0) {
            console.log("No debtors found with balance owed greater than 0");
        }
        res
            .status(http_status_1.HttpStatus.OK)
            .json({ message: "debtors fetched successfully", data: debtors });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.getAlldebtors = getAlldebtors;
const getDebtorsForHostel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { hostelId } = req.params;
    try {
        const debtors = yield residentHelper.getDebtorsForHostel(hostelId);
        res
            .status(http_status_1.HttpStatus.OK)
            .json({ message: "debors fected successfully", data: debtors });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.getDebtorsForHostel = getDebtorsForHostel;
const getAllresidentsForHostel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { hostelId } = req.params;
    try {
        const residents = yield residentHelper.getAllresidentsForHostel(hostelId);
        res
            .status(http_status_1.HttpStatus.OK)
            .json({ message: "residents fecthed successfully", data: residents });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.getAllresidentsForHostel = getAllresidentsForHostel;
const addResidentFromHostelController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const residentData = req.body; // Get resident data from the request body
    try {
        const newResident = yield residentHelper.addResidentFromHostel(residentData);
        res.status(http_status_1.HttpStatus.CREATED).json({
            message: "Resident registered successfully",
            data: newResident,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.addResidentFromHostelController = addResidentFromHostelController;
const assignRoomToResidentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { residentId } = req.params;
    const { roomId } = req.body;
    try {
        const updatedResident = yield residentHelper.assignRoomToResident(residentId, roomId);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Room assigned to resident successfully",
            data: updatedResident,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.assignRoomToResidentController = assignRoomToResidentController;
const verifyResidentCodeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code, hostelId } = req.body;
    try {
        const verifiedResident = yield residentHelper.verifyResidentCode(code, hostelId);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Resident code verified successfully",
            data: verifiedResident,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.verifyResidentCodeController = verifyResidentCodeController;
const checkInResidentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { residentId } = req.params;
    try {
        const checkedInResident = yield residentHelper.checkInResident(residentId);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Resident checked in successfully",
            data: checkedInResident,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.checkInResidentController = checkInResidentController;
const getResidentRoomDetailsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) {
            throw new http_error_1.default(http_status_1.HttpStatus.UNAUTHORIZED, "No token provided");
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            throw new http_error_1.default(http_status_1.HttpStatus.UNAUTHORIZED, "Invalid token format");
        }
        // Decode token to get userId
        const decoded = (0, jwt_decode_1.jwtDecode)(token);
        if (!decoded || !decoded.id) {
            throw new http_error_1.default(http_status_1.HttpStatus.UNAUTHORIZED, "Invalid token payload");
        }
        const details = yield residentHelper.getResidentRoomDetails(decoded.id);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Room details fetched successfully",
            data: details,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.getResidentRoomDetailsController = getResidentRoomDetailsController;
const createMaintenanceRequestController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader)
            throw new http_error_1.default(http_status_1.HttpStatus.UNAUTHORIZED, "No token provided");
        const token = authHeader.split(" ")[1];
        const decoded = (0, jwt_decode_1.jwtDecode)(token);
        const requestData = req.body;
        // Handle Image Uploads
        const images = [];
        if (req.files && Array.isArray(req.files)) {
            for (const file of req.files) {
                try {
                    const uploaded = yield cloudinary_1.default.uploader.upload(file.path, {
                        folder: "MaintenanceRequests/",
                    });
                    if (uploaded) {
                        images.push(uploaded.secure_url);
                    }
                    // Clean up local file
                    if (fs_1.default.existsSync(file.path)) {
                        fs_1.default.unlinkSync(file.path);
                    }
                }
                catch (uploadError) {
                    console.error("Cloudinary Upload Error:", uploadError);
                    // Optional: handle specific upload errors
                }
            }
        }
        // Assign uploaded image URLs to requestData
        requestData.images = images.length > 0 ? images : undefined;
        const request = yield residentHelper.createMaintenanceRequest(decoded.id, requestData);
        res.status(http_status_1.HttpStatus.CREATED).json({
            message: "Request submitted successfully",
            data: request,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.createMaintenanceRequestController = createMaintenanceRequestController;
const getResidentRequestsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader)
            throw new http_error_1.default(http_status_1.HttpStatus.UNAUTHORIZED, "No token provided");
        const token = authHeader.split(" ")[1];
        const decoded = (0, jwt_decode_1.jwtDecode)(token);
        const requests = yield residentHelper.getResidentRequests(decoded.id);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Requests fetched successfully",
            data: requests,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.getResidentRequestsController = getResidentRequestsController;
const getResidentBillingController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader)
            throw new http_error_1.default(http_status_1.HttpStatus.UNAUTHORIZED, "No token provided");
        const token = authHeader.split(" ")[1];
        const decoded = (0, jwt_decode_1.jwtDecode)(token);
        const billingInfo = yield residentHelper.getResidentBilling(decoded.id);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Billing info fetched successfully",
            data: billingInfo,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.getResidentBillingController = getResidentBillingController;
const getResidentAnnouncementsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader)
            throw new http_error_1.default(http_status_1.HttpStatus.UNAUTHORIZED, "No token provided");
        const token = authHeader.split(" ")[1];
        const decoded = (0, jwt_decode_1.jwtDecode)(token);
        const announcements = yield residentHelper.getResidentAnnouncements(decoded.id);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Announcements fetched successfully",
            data: announcements,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.getResidentAnnouncementsController = getResidentAnnouncementsController;
const createFeedbackController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader)
            throw new http_error_1.default(http_status_1.HttpStatus.UNAUTHORIZED, "No token provided");
        const token = authHeader.split(" ")[1];
        const decoded = (0, jwt_decode_1.jwtDecode)(token);
        const feedbackData = req.body;
        const feedback = yield residentHelper.createFeedback(decoded.id, feedbackData);
        res.status(http_status_1.HttpStatus.CREATED).json({
            message: "Feedback submitted successfully",
            data: feedback,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.createFeedbackController = createFeedbackController;
const getAllocationLetterController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader)
            throw new http_error_1.default(http_status_1.HttpStatus.UNAUTHORIZED, "No token provided");
        const token = authHeader.split(" ")[1];
        const decoded = (0, jwt_decode_1.jwtDecode)(token);
        const data = yield residentHelper.getAllocationDetails(decoded.id);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Allocation details fetched successfully",
            data,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.getAllocationLetterController = getAllocationLetterController;
const getPaymentReceiptController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader)
            throw new http_error_1.default(http_status_1.HttpStatus.UNAUTHORIZED, "No token provided");
        const token = authHeader.split(" ")[1];
        const decoded = (0, jwt_decode_1.jwtDecode)(token);
        const { paymentId } = req.params;
        if (!paymentId)
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, "Payment ID is required");
        const data = yield residentHelper.getPaymentReceiptData(decoded.id, paymentId);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Payment receipt fetched successfully",
            data,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.getPaymentReceiptController = getPaymentReceiptController;
