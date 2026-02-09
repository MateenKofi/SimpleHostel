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
exports.staffForHostel = exports.deleteStaffController = exports.updateStaffController = exports.getStaffByIdController = exports.getAllStaffsController = exports.addStaffController = void 0;
const StaffHelper = __importStar(require("../helper/staffHelper")); // Assuming you have your service functions in this file
const http_status_1 = require("../utils/http-status");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const formatPrisma_1 = require("../utils/formatPrisma");
const prisma_1 = __importDefault(require("../utils/prisma"));
// Add a Staff
const addStaffController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const photo = req.file ? req.file.path : undefined;
    const StaffData = req.body;
    console.log("staff data:", JSON.stringify(StaffData));
    const picture = {
        passportUrl: "",
        passportKey: "",
    };
    try {
        // First, try to add the staff (don't upload the photo yet)
        const newStaff = yield StaffHelper.addStaff(StaffData, picture);
        // If staff creation is successful, upload the photo to Cloudinary
        if (photo) {
            const uploaded = yield cloudinary_1.default.uploader.upload(photo, {
                folder: "Staff/",
            });
            if (uploaded) {
                // Update the picture URL and key after the photo is successfully uploaded
                picture.passportUrl = uploaded.secure_url;
                picture.passportKey = uploaded.public_id;
                // Optionally, update the staff record with the photo URL and key
                yield prisma_1.default.user.update({
                    where: { email: StaffData.email }, // Update associated user avatar
                    data: {
                        imageUrl: picture.passportUrl,
                        imageKey: picture.passportKey,
                    },
                });
            }
        }
        // Respond with success if everything went well
        res.status(http_status_1.HttpStatus.CREATED).json({
            message: "Staff created successfully",
            data: newStaff,
        });
    }
    catch (error) {
        // If anything fails, handle the error, rollback any uploaded photo
        if (photo) {
            // Optionally delete the uploaded photo from Cloudinary
            const filePath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path; // Use the file path here if needed to delete the photo
            if (filePath) {
                const publicId = picture.passportKey;
                if (publicId) {
                    yield cloudinary_1.default.uploader.destroy(publicId); // Delete the uploaded file from Cloudinary
                }
            }
        }
        // Format and send error response
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.addStaffController = addStaffController;
// Get All Staffs
const getAllStaffsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Staffs = yield StaffHelper.getAllStaffs();
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Staffs fetched successfully",
            data: Staffs,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.getAllStaffsController = getAllStaffsController;
// Get Staff by ID
const getStaffByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { staffId } = req.params;
    try {
        const Staff = yield StaffHelper.getStaffById(staffId);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Staff fetched successfully",
            data: Staff,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.getStaffByIdController = getStaffByIdController;
// Update a Staff
const updateStaffController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { staffId } = req.params;
    const StaffData = req.body;
    const photo = req.file ? req.file.path : undefined;
    const picture = {
        passportUrl: "",
        passportKey: "",
    };
    console.log(StaffData);
    try {
        if (photo) {
            const uploaded = yield cloudinary_1.default.uploader.upload(photo, {
                folder: "Staff/",
            });
            if (uploaded) {
                picture.passportUrl = uploaded.secure_url;
                picture.passportKey = uploaded.public_id;
            }
        }
        const updatedStaff = yield StaffHelper.updateStaff(staffId, StaffData, picture);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Staff updated successfully",
            data: updatedStaff,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.updateStaffController = updateStaffController;
// Delete Staff
const deleteStaffController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { staffId } = req.params;
    try {
        yield StaffHelper.deleteStaff(staffId);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Staff deleted successfully",
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.deleteStaffController = deleteStaffController;
const staffForHostel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { hostelId } = req.params;
    try {
        const staffs = yield StaffHelper.getAllStaffForHostel(hostelId);
        res
            .status(http_status_1.HttpStatus.OK)
            .json({ message: "staff fecthed successfully", data: staffs });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.staffForHostel = staffForHostel;
