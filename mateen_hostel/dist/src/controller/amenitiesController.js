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
exports.getAmenitiesForHostel = exports.deleteAmenityController = exports.updateAmenityController = exports.getAmenityByIdController = exports.getAllAmenitiesController = exports.addAmenityController = void 0;
const amenitiesHelper = __importStar(require("../helper/amenitiesHelper")); // Assuming your service functions are in this file
const http_status_1 = require("../utils/http-status");
const formatPrisma_1 = require("../utils/formatPrisma");
// Add an Amenity
const addAmenityController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const amenitiesData = req.body;
        // Call the service to add the amenity
        const newAmenity = yield amenitiesHelper.addAmenity(amenitiesData);
        // Send response back to the client
        res.status(http_status_1.HttpStatus.CREATED).json({
            message: "Amenity created successfully",
            data: newAmenity,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.addAmenityController = addAmenityController;
// Get All Amenities
const getAllAmenitiesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const amenities = yield amenitiesHelper.getAllAmenities();
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Amenities fetched successfully",
            data: amenities,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.getAllAmenitiesController = getAllAmenitiesController;
// Get Amenity by ID
const getAmenityByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amenityId } = req.params;
    try {
        const amenity = yield amenitiesHelper.getAmenityById(amenityId);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Amenity fetched successfully",
            data: amenity,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.getAmenityByIdController = getAmenityByIdController;
// Update an Amenity
const updateAmenityController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amenityId } = req.params;
    const amenitiesData = req.body;
    try {
        const updatedAmenity = yield amenitiesHelper.updateAmenity(amenityId, amenitiesData);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Amenity updated successfully",
            data: updatedAmenity,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.updateAmenityController = updateAmenityController;
// Delete Amenity
const deleteAmenityController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amenityId } = req.params;
    try {
        const result = yield amenitiesHelper.deleteAmenity(amenityId);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "deleted successfully",
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.deleteAmenityController = deleteAmenityController;
const getAmenitiesForHostel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { hostelId } = req.params;
    try {
        const amenities = yield amenitiesHelper.getAllAmenitiesForHostel(hostelId);
        res
            .status(http_status_1.HttpStatus.OK)
            .json({ message: "amenities fetched successfully", data: amenities });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.getAmenitiesForHostel = getAmenitiesForHostel;
