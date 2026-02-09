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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoomControllerAll = exports.roomsForHostel = exports.removeAmenitiesFromRoomController = exports.addAmenitiesToRoomController = exports.getAvailableRoomsController = exports.deleteRoomController = exports.updateRoomController = exports.getRoomByIdController = exports.getAllRoomsController = exports.addRoomController = void 0;
const roomHelper = __importStar(require("../helper/roomHelper")); // Assuming you have your room service functions in this file
const http_status_1 = require("../utils/http-status");
const http_error_1 = __importDefault(require("../utils/http-error"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const formatPrisma_1 = require("../utils/formatPrisma");
const roomSchema_1 = require("../zodSchema/roomSchema");
// Add a Room
const addRoomController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = roomSchema_1.createRoomSchema.safeParse(req.body);
        if (!validatedData.success) {
            const errors = validatedData.error.issues.map(({ message, path }) => `${path}: ${message}`);
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, errors.join(". "));
        }
        const _a = validatedData.data, { amenitiesIds } = _a, roomData = __rest(_a, ["amenitiesIds"]);
        const photos = req.files ? req.files : [];
        if (!photos || photos.length === 0) {
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, "Room images are required");
        }
        const pictures = [];
        if (photos && Array.isArray(photos) && photos.length) {
            for (const photo of photos) {
                const uploaded = yield cloudinary_1.default.uploader.upload(photo.path, {
                    folder: "rooms/",
                });
                if (uploaded) {
                    pictures.push({
                        imageUrl: uploaded.secure_url,
                        imageKey: uploaded.public_id,
                    });
                }
            }
        }
        const newRoom = yield roomHelper.createRoom(roomData, pictures, amenitiesIds);
        res.status(http_status_1.HttpStatus.CREATED).json({
            message: "Room created successfully",
            data: newRoom,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.addRoomController = addRoomController;
// Get All Rooms
const getAllRoomsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rooms = yield roomHelper.getAllRooms();
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Rooms fetched successfully",
            data: rooms,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.getAllRoomsController = getAllRoomsController;
// Get Room by ID
const getRoomByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId } = req.params; // Getting room ID from the URL parameters
    try {
        const room = yield roomHelper.getRoomById(roomId);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Room fetched successfully",
            data: room,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.getRoomByIdController = getRoomByIdController;
// Update a Room
const updateRoomController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId } = req.params; // Room ID from the URL parameters
    const roomData = Object.assign(Object.assign({}, req.body), { price: parseFloat(req.body.price), maxCap: parseInt(req.body.maxCap) });
    const amenitiesIds = req.body.amenitiesIds; // List of amenities IDs to associate with the room
    const photos = req.files;
    const pictures = [];
    try {
        if (photos && photos.length > 0) {
            // Loop over the photos and upload each one to Cloudinary
            for (const photo of photos) {
                const uploaded = yield cloudinary_1.default.uploader.upload(photo.path, {
                    folder: "rooms/",
                });
                if (uploaded) {
                    // Add image info (URL & Key) to the pictures array
                    pictures.push({
                        imageUrl: uploaded.secure_url,
                        imageKey: uploaded.public_id,
                    });
                }
            }
        }
        const updatedRoom = yield roomHelper.updateRoom(roomId, roomData, pictures);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Room updated successfully",
            data: updatedRoom,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.updateRoomController = updateRoomController;
// Delete a Room
const deleteRoomController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId } = req.params; // Room ID from the URL parameters
    try {
        const result = yield roomHelper.deleteRoom(roomId);
        res.status(http_status_1.HttpStatus.OK).json({
            message: result.message,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.deleteRoomController = deleteRoomController;
// Get Available Rooms
const getAvailableRoomsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const availableRooms = yield roomHelper.getAvailableRooms();
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Available rooms fetched successfully",
            data: availableRooms,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.getAvailableRoomsController = getAvailableRoomsController;
const addAmenitiesToRoomController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId } = req.params;
    const amenitiesIds = req.body.amenitiesIds;
    try {
        const updatedRoom = yield roomHelper.addAmenitiesToRoom(roomId, amenitiesIds);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Amenities added successfully",
            data: updatedRoom,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.addAmenitiesToRoomController = addAmenitiesToRoomController;
const removeAmenitiesFromRoomController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId } = req.params;
    const amenitiesIds = req.body.amenitiesIds;
    try {
        const updatedRoom = yield roomHelper.removeAmenitiesFromRoom(roomId, amenitiesIds);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Amenities removed successfully",
            data: updatedRoom,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.removeAmenitiesFromRoomController = removeAmenitiesFromRoomController;
const roomsForHostel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { hostelId } = req.params;
    try {
        // Fetch all rooms for the given hostel
        const rooms = yield roomHelper.getAllRoomsForHostel(hostelId);
        // Group rooms by their status
        const availableRooms = rooms.filter((room) => room.status === "AVAILABLE");
        const occupiedRooms = rooms.filter((room) => room.status === "OCCUPIED");
        const maintenanceRooms = rooms.filter((room) => room.status === "MAINTENANCE");
        // Prepare the response with counts for each status
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Rooms fetched successfully",
            data: {
                totalRooms: rooms.length, // Total number of rooms
                availableRoomsCount: availableRooms.length, // Count of available rooms
                occupiedRoomsCount: occupiedRooms.length, // Count of occupied rooms
                maintenanceRoomsCount: maintenanceRooms.length, // Count of rooms under maintenance
                rooms, // All room details
            },
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used for proper error formatting
        res.status(err.status).json({ message: err.message });
    }
});
exports.roomsForHostel = roomsForHostel;
// Update a Room
// Update a Room
const updateRoomControllerAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId } = req.params; // Room ID from the URL parameters
    try {
        const validatedData = roomSchema_1.updateRoomSchema.safeParse(req.body);
        if (!validatedData.success) {
            const errors = validatedData.error.issues.map(({ message, path }) => `${path}: ${message}`);
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, errors.join(". "));
        }
        const _a = validatedData.data, { addAmenitiesIds, removeAmenitiesIds } = _a, roomData = __rest(_a, ["addAmenitiesIds", "removeAmenitiesIds"]);
        const photos = req.files;
        const pictures = [];
        if (photos && photos.length > 0) {
            // Loop over the photos and upload each one to Cloudinary
            for (const photo of photos) {
                const uploaded = yield cloudinary_1.default.uploader.upload(photo.path, {
                    folder: "rooms/",
                });
                if (uploaded) {
                    // Add image info (URL & Key) to the pictures array
                    pictures.push({
                        imageUrl: uploaded.secure_url,
                        imageKey: uploaded.public_id,
                    });
                }
            }
        }
        const updatedRoom = yield roomHelper.updateRoomAll(roomId, roomData, pictures, addAmenitiesIds, removeAmenitiesIds);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Room updated successfully",
            data: updatedRoom,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.updateRoomControllerAll = updateRoomControllerAll;
