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
exports.updateHostelDocumentsController = exports.updatePaymentSettingsController = exports.updateHostelRulesController = exports.unPublishHostel = exports.publishHostel = exports.unverifiedHostel = exports.deleteHostelController = exports.updateHostelController = exports.getHostelByIdController = exports.getAllHostelsController = exports.addHostelController = void 0;
const hostelHelper = __importStar(require("../helper/hostelHelper")); // Assuming you have your service functions in this file
const http_status_1 = require("../utils/http-status");
const http_error_1 = __importDefault(require("../utils/http-error"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const formatPrisma_1 = require("../utils/formatPrisma");
// Add a Hostel
const addHostelController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    const hostelData = req.body;
    const pictures = [];
    const uploadedImages = [];
    let logoInfo = null;
    try {
        // Handle logo upload
        if (files.logo && files.logo[0]) {
            const uploadedLogo = yield cloudinary_1.default.uploader.upload(files.logo[0].path, {
                folder: "hostel/logos/",
            });
            if (uploadedLogo) {
                logoInfo = {
                    logoUrl: uploadedLogo.secure_url,
                    logoKey: uploadedLogo.public_id,
                };
                uploadedImages.push(uploadedLogo.public_id);
            }
        }
        // Handle photos upload
        if (files.photos && files.photos.length > 0) {
            for (const photo of files.photos) {
                const uploaded = yield cloudinary_1.default.uploader.upload(photo.path, {
                    folder: "hostel/photos/",
                });
                if (uploaded) {
                    pictures.push({
                        imageUrl: uploaded.secure_url,
                        imageKey: uploaded.public_id,
                    });
                    uploadedImages.push(uploaded.public_id);
                }
            }
        }
        const newHostel = yield hostelHelper.addHostel(hostelData, pictures, logoInfo);
        res.status(http_status_1.HttpStatus.CREATED).json({
            message: "Hostel created successfully",
            data: newHostel,
        });
    }
    catch (error) {
        // If there's an error, delete all uploaded images from cloudinary
        if (uploadedImages.length > 0) {
            for (const imageKey of uploadedImages) {
                yield cloudinary_1.default.uploader.destroy(imageKey);
            }
        }
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.addHostelController = addHostelController;
// Get All Hostels
const getAllHostelsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hostels = yield hostelHelper.getAllHostels();
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Hostels fetched successfully",
            data: hostels,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.getAllHostelsController = getAllHostelsController;
// Get Hostel by ID
const getHostelByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { hostelId } = req.params;
    try {
        const hostel = yield hostelHelper.getHostelById(hostelId);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Hostel fetched successfully",
            data: hostel,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.getHostelByIdController = getHostelByIdController;
// Update a Hostel
const updateHostelController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { hostelId } = req.params;
    const hostelData = req.body;
    const files = req.files;
    const pictures = [];
    let logoInfo = null;
    try {
        // Handle logo upload
        if (files.logo && files.logo[0]) {
            const uploadedLogo = yield cloudinary_1.default.uploader.upload(files.logo[0].path, {
                folder: "hostel/logos/",
            });
            if (uploadedLogo) {
                logoInfo = {
                    logoUrl: uploadedLogo.secure_url,
                    logoKey: uploadedLogo.public_id,
                };
            }
        }
        // Handle photos upload
        if (files.photos && files.photos.length > 0) {
            for (const photo of files.photos) {
                const uploaded = yield cloudinary_1.default.uploader.upload(photo.path, {
                    folder: "hostel/photos/",
                });
                if (uploaded) {
                    pictures.push({
                        imageUrl: uploaded.secure_url,
                        imageKey: uploaded.public_id,
                    });
                }
            }
        }
        const updatedHostel = yield hostelHelper.updateHostel(hostelId, hostelData, pictures, logoInfo);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Hostel updated successfully",
            data: updatedHostel,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.updateHostelController = updateHostelController;
// Delete Hostel
const deleteHostelController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { hostelId } = req.params;
    try {
        const result = yield hostelHelper.deleteHostel(hostelId);
        res.status(http_status_1.HttpStatus.OK).json({
            message: result.message,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.deleteHostelController = deleteHostelController;
const unverifiedHostel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hostels = yield hostelHelper.getUnverifiedHostel();
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Hostels fetched successfully",
            data: hostels,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.unverifiedHostel = unverifiedHostel;
const publishHostel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hostelId } = req.params;
        yield hostelHelper.publishHostel(hostelId);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Hostel published successfully",
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.publishHostel = publishHostel;
const unPublishHostel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hostelId } = req.params;
        yield hostelHelper.unPublishHostel(hostelId);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Hostel unpublished successfully",
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.unPublishHostel = unPublishHostel;
const updateHostelRulesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { hostelId } = req.params;
    const file = req.file;
    try {
        if (!file) {
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, "No rules file provided");
        }
        const uploaded = yield cloudinary_1.default.uploader.upload(file.path, {
            folder: "hostel/rules/",
            resource_type: "raw", // Allow PDF, images, etc. as raw files to avoid processing issues
        });
        if (!uploaded) {
            throw new http_error_1.default(http_status_1.HttpStatus.INTERNAL_SERVER_ERROR, "Failed to upload rules");
        }
        const updatedHostel = yield hostelHelper.updateHostelRules(hostelId, {
            rulesUrl: uploaded.secure_url,
            rulesKey: uploaded.public_id,
        });
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Hostel rules updated successfully",
            data: updatedHostel,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.updateHostelRulesController = updateHostelRulesController;
const updatePaymentSettingsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { hostelId } = req.params;
    const settings = req.body;
    try {
        const updatedHostel = yield hostelHelper.updatePaymentSettings(hostelId, settings);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Payment settings updated successfully",
            data: updatedHostel,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.updatePaymentSettingsController = updatePaymentSettingsController;
const updateHostelDocumentsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { hostelId } = req.params;
    const files = req.files;
    try {
        let signatureUrl, stampUrl;
        if (files.signature && files.signature[0]) {
            const uploaded = yield cloudinary_1.default.uploader.upload(files.signature[0].path, {
                folder: "hostel/documents/",
            });
            signatureUrl = uploaded.secure_url;
        }
        if (files.stamp && files.stamp[0]) {
            const uploaded = yield cloudinary_1.default.uploader.upload(files.stamp[0].path, {
                folder: "hostel/documents/",
            });
            stampUrl = uploaded.secure_url;
        }
        const updatedHostel = yield hostelHelper.updateHostelDocuments(hostelId, {
            signatureUrl,
            stampUrl,
        });
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Hostel documents updated successfully",
            data: updatedHostel,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.updateHostelDocumentsController = updateHostelDocumentsController;
