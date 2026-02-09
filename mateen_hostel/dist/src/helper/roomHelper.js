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
exports.updateRoomAll = exports.getAllRoomsForHostel = exports.removeAmenitiesFromRoom = exports.addAmenitiesToRoom = exports.getAvailableRooms = exports.createRoom = exports.getRoomById = exports.deleteRoom = exports.updateRoom = exports.getAllRooms = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const http_error_1 = __importDefault(require("../utils/http-error"));
const http_status_1 = require("../utils/http-status");
const client_1 = require("@prisma/client");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const formatPrisma_1 = require("../utils/formatPrisma");
const dto_1 = require("../utils/dto");
const getAllRooms = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rooms = yield prisma_1.default.room.findMany({
            where: {
                deletedAt: null,
                hostel: {
                    is: {
                        deletedAt: null,
                    },
                },
            },
            include: {
                amenities: true, // Include the amenities in the response
                roomImages: true,
                residents: {
                    include: {
                        user: true, // Include user details for residents
                    },
                },
                hostel: true, // Include hostel if needed
            },
        });
        return rooms.map(dto_1.toRoomDto);
    }
    catch (error) {
        console.error("Error getting all rooms:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getAllRooms = getAllRooms;
const updateRoom = (roomId, roomData, pictures) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const room = yield prisma_1.default.room.findUnique({
            where: { id: roomId },
            include: { roomImages: true, residents: true },
        });
        if (!room) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Room not found");
        }
        if (roomData.maxCap && room.residents.length > roomData.maxCap) {
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, "Cannot update maxCap as it is less than the number of residents in the room");
        }
        // Delete old images from Cloudinary
        if (room.roomImages && room.roomImages.length > 0) {
            for (const image of room.roomImages) {
                yield cloudinary_1.default.uploader.destroy(image.imageKey); // Delete image from Cloudinary
            }
        }
        // Remove old images from the database
        yield prisma_1.default.roomImage.deleteMany({
            where: { roomId: roomId },
        });
        // Update the room data
        let updatedRoomData = Object.assign({}, roomData);
        const updatedRoomWithDetails = yield prisma_1.default.room.findUnique({
            where: { id: roomId },
            include: { amenities: true, roomImages: true, hostel: true },
        });
        return updatedRoomWithDetails ? (0, dto_1.toRoomDto)(updatedRoomWithDetails) : null;
    }
    catch (error) {
        console.error("Update room Error:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.updateRoom = updateRoom;
const deleteRoom = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const room = yield prisma_1.default.room.findUnique({
            where: { id: roomId },
            include: { roomImages: true }, // Include associated images
        });
        if (!room) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Room not found");
        }
        // Delete images from Cloudinary first
        for (const image of room.roomImages) {
            yield cloudinary_1.default.uploader.destroy(image.imageKey); // Delete image from Cloudinary
        }
        // Check for active residents assigned to this room
        const activeResidents = yield prisma_1.default.residentProfile.count({
            where: {
                roomId: room.id,
            },
        });
        if (activeResidents > 0) {
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, "Cannot delete room because it has active residents assigned");
        }
        // Remove the images from the database
        yield prisma_1.default.roomImage.deleteMany({
            where: { roomId: roomId },
        });
        // Remove the room from the database
        yield prisma_1.default.room.delete({
            where: { id: roomId },
        });
        return { message: "Room and associated images deleted successfully" };
    }
    catch (error) {
        console.error("Error deleting room:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.deleteRoom = deleteRoom;
const getRoomById = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const room = yield prisma_1.default.room.findFirst({
            where: {
                id: roomId,
                deletedAt: null, // Room is not deleted
                hostel: {
                    is: {
                        deletedAt: null, // Hostel is not deleted
                    },
                },
            },
            include: {
                amenities: true, // Include the amenities for the room
                roomImages: true, // Include the room images for the room
                residents: {
                    include: {
                        user: true, // Include user details for residents
                    },
                },
                hostel: {
                    include: {
                        hostelImages: true,
                    },
                },
            },
        });
        if (!room) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Room not found");
        }
        return (0, dto_1.toRoomDto)(room);
    }
    catch (error) {
        console.error("Error getting room:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getRoomById = getRoomById;
const createRoom = (roomData, pictures, amenitiesIds) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        // Calculate total price if amenities are provided
        let totalPrice = roomData.price;
        const findRoom = yield prisma_1.default.room.findFirst({
            where: {
                number: roomData.number,
                floor: roomData.floor,
                hostelId: roomData.hostelId,
            },
        });
        if (findRoom) {
            throw new http_error_1.default(http_status_1.HttpStatus.CONFLICT, "Room already exists");
        }
        if (amenitiesIds && amenitiesIds.length > 0) {
            const amenities = yield prisma_1.default.amenities.findMany({
                where: {
                    id: {
                        in: amenitiesIds,
                    },
                },
            });
            // Sum up the prices of the selected amenities
            const totalAmenitiesPrice = amenities.reduce((total, amenity) => total + parseFloat(amenity.price.toString()), 0);
            totalPrice += totalAmenitiesPrice;
        }
        // Create the room and connect amenities if provided
        const newRoom = yield prisma_1.default.room.create({
            data: {
                number: roomData.number,
                block: roomData.block,
                floor: roomData.floor,
                maxCap: roomData.maxCap,
                hostelId: roomData.hostelId,
                price: totalPrice,
                gender: (_a = roomData.gender) === null || _a === void 0 ? void 0 : _a.toLowerCase(),
                description: roomData.description,
                type: (_b = roomData.type) === null || _b === void 0 ? void 0 : _b.toLowerCase(),
                status: (_c = roomData.status) === null || _c === void 0 ? void 0 : _c.toLowerCase(),
                amenities: (amenitiesIds === null || amenitiesIds === void 0 ? void 0 : amenitiesIds.length)
                    ? {
                        connect: amenitiesIds.map((id) => ({ id })),
                    }
                    : undefined, // Only connect amenities if provided
            },
        });
        if (!newRoom) {
            throw new http_error_1.default(http_status_1.HttpStatus.INTERNAL_SERVER_ERROR, "Error adding room");
        }
        const roomImages = pictures.map((picture) => ({
            imageUrl: picture.imageUrl,
            imageKey: picture.imageKey,
            roomId: newRoom.id,
        }));
        // Ensure the images are inserted into the database
        if (roomImages.length > 0) {
            yield prisma_1.default.roomImage.createMany({ data: roomImages });
        }
        // Fetch the complete room with images to return
        const roomWithImages = yield prisma_1.default.room.findUnique({
            where: { id: newRoom.id },
            include: {
                amenities: true,
                roomImages: true,
                hostel: true,
            },
        });
        return roomWithImages ? (0, dto_1.toRoomDto)(roomWithImages) : null;
    }
    catch (error) {
        console.error("Error creating room:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.createRoom = createRoom;
const getAvailableRooms = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch rooms with status 'AVAILABLE'
        const availableRooms = yield prisma_1.default.room.findMany({
            where: {
                status: client_1.RoomStatus.available,
                hostel: {
                    is: {
                        deletedAt: null,
                    },
                },
            },
            include: {
                amenities: true, // Include related amenities if needed
                roomImages: true,
                residents: {
                    include: {
                        user: true, // Include user details for residents
                    },
                },
            },
        });
        return availableRooms.map(dto_1.toRoomDto); // Return the list of available rooms
    }
    catch (error) {
        console.error("Error getting available rooms:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getAvailableRooms = getAvailableRooms;
const addAmenitiesToRoom = (roomId, amenitiesIds) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the room exists
        const room = yield prisma_1.default.room.findUnique({
            where: { id: roomId },
            include: { amenities: true }, // Include current amenities of the room
        });
        if (!room) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Room not found");
        }
        // Fetch amenities to be added
        const amenitiesToAdd = yield prisma_1.default.amenities.findMany({
            where: { id: { in: amenitiesIds } },
        });
        // Calculate the total price of the amenities to be added
        const totalAmenitiesPrice = amenitiesToAdd.reduce((total, amenity) => total + amenity.price, 0);
        // Update the room price and connect the new amenities
        const updatedRoom = yield prisma_1.default.room.update({
            where: { id: roomId },
            data: {
                price: room.price + totalAmenitiesPrice,
                amenities: {
                    connect: amenitiesIds.map((id) => ({ id })),
                },
            },
            include: { amenities: true, roomImages: true, hostel: true },
        });
        return (0, dto_1.toRoomDto)(updatedRoom);
    }
    catch (error) {
        console.error("Error adding amenities:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.addAmenitiesToRoom = addAmenitiesToRoom;
const removeAmenitiesFromRoom = (roomId, amenitiesIds) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the room exists
        const room = yield prisma_1.default.room.findUnique({
            where: { id: roomId },
            include: { amenities: true }, // Include current amenities of the room
        });
        if (!room) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Room not found");
        }
        // Fetch amenities to be removed
        const amenitiesToRemove = yield prisma_1.default.amenities.findMany({
            where: { id: { in: amenitiesIds } },
        });
        // Calculate the total price of the amenities to be removed
        const totalAmenitiesPrice = amenitiesToRemove.reduce((total, amenity) => total + amenity.price, 0);
        // Update the room price and disconnect the amenities
        const updatedRoom = yield prisma_1.default.room.update({
            where: { id: roomId },
            data: {
                price: room.price - totalAmenitiesPrice,
                amenities: {
                    disconnect: amenitiesIds.map((id) => ({ id })),
                },
            },
            include: { amenities: true, roomImages: true, hostel: true },
        });
        return (0, dto_1.toRoomDto)(updatedRoom);
    }
    catch (error) {
        console.error("Error removing amenities:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.removeAmenitiesFromRoom = removeAmenitiesFromRoom;
const getAllRoomsForHostel = (hostelId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rooms = yield prisma_1.default.room.findMany({
            where: {
                hostelId,
                deletedAt: null,
                hostel: {
                    is: {
                        deletedAt: null,
                    },
                },
            },
            include: {
                roomImages: true,
                residents: {
                    include: {
                        user: true, // Include user details for residents
                    },
                },
                amenities: true,
                hostel: true, // Include hostel details if needed
            },
        });
        return rooms.map(dto_1.toRoomDto);
    }
    catch (error) {
        console.error("Update Hostel Error:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getAllRoomsForHostel = getAllRoomsForHostel;
const updateRoomAll = (roomId, roomData, pictures, addAmenitiesIds, removeAmenitiesIds) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("roomData: " + JSON.stringify(roomData, null, 2));
    console.log(`addAmenitiesIds ${addAmenitiesIds}`);
    console.log(`removeAmenitiesIds ${removeAmenitiesIds}`);
    try {
        const room = yield prisma_1.default.room.findUnique({
            where: { id: roomId },
            include: { roomImages: true, residents: true, amenities: true },
        });
        if (!room) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Room not found");
        }
        if (roomData.maxCap && room.residents.length > roomData.maxCap) {
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, "Cannot update maxCap as it is less than the number of residents in the room");
        }
        // Fetch prices of added and removed amenities
        let totalAddedPrice = 0;
        let totalRemovedPrice = 0;
        if (addAmenitiesIds && addAmenitiesIds.length > 0) {
            const addedAmenities = yield prisma_1.default.amenities.findMany({
                where: { id: { in: addAmenitiesIds } },
                select: { price: true },
            });
            totalAddedPrice = addedAmenities.reduce((sum, amenity) => sum + amenity.price, 0);
        }
        if (removeAmenitiesIds && removeAmenitiesIds.length > 0) {
            const removedAmenities = yield prisma_1.default.amenities.findMany({
                where: { id: { in: removeAmenitiesIds } },
                select: { price: true },
            });
            totalRemovedPrice = removedAmenities.reduce((sum, amenity) => sum + amenity.price, 0);
        }
        // Calculate the new room price
        const updatedPrice = (room.price || 0) + totalAddedPrice - totalRemovedPrice;
        console.log(`Updated Room Price: ${updatedPrice}`);
        // Delete old images from Cloudinary
        if (room.roomImages && room.roomImages.length > 0) {
            for (const image of room.roomImages) {
                yield cloudinary_1.default.uploader.destroy(image.imageKey);
            }
        }
        // Remove old images from the database
        yield prisma_1.default.roomImage.deleteMany({ where: { roomId: roomId } });
        // Prepare updates for amenities
        const updateAmenities = {};
        if (addAmenitiesIds && addAmenitiesIds.length > 0) {
            updateAmenities.connect = addAmenitiesIds.map((id) => ({ id }));
        }
        if (removeAmenitiesIds && removeAmenitiesIds.length > 0) {
            updateAmenities.disconnect = removeAmenitiesIds.map((id) => ({ id }));
        }
        // Update the room data along with amenities and the new price
        const updatedRoom = yield prisma_1.default.room.update({
            where: { id: roomId },
            data: Object.assign(Object.assign({}, roomData), { gender: roomData.gender ? roomData.gender.toLowerCase() : undefined, type: roomData.type ? roomData.type.toLowerCase() : undefined, status: roomData.status ? roomData.status.toLowerCase() : undefined, price: updatedPrice, amenities: Object.keys(updateAmenities).length > 0
                    ? updateAmenities
                    : undefined }),
            include: {
                amenities: true,
                roomImages: true,
                residents: {
                    include: {
                        user: true, // Include user details for residents
                    },
                },
            },
        });
        // Add new images to Cloudinary and save them to the database
        if (pictures.length > 0) {
            const roomImages = pictures.map((picture) => ({
                imageUrl: picture.imageUrl,
                imageKey: picture.imageKey,
                roomId: roomId,
            }));
            yield prisma_1.default.roomImage.createMany({ data: roomImages });
        }
        return (0, dto_1.toRoomDto)(updatedRoom);
    }
    catch (error) {
        console.error("Update room Error:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.updateRoomAll = updateRoomAll;
