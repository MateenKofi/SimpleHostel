"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoomSchema = exports.createRoomSchema = exports.RoomGenderEnum = exports.RoomStatusEnum = exports.RoomTypeEnum = void 0;
const zod_1 = require("zod");
exports.RoomTypeEnum = zod_1.z.enum(["single", "double", "suite", "quad"]);
exports.RoomStatusEnum = zod_1.z.enum(["available", "occupied", "maintenance"]);
exports.RoomGenderEnum = zod_1.z.enum(["male", "female", "mix"]);
exports.createRoomSchema = zod_1.z.object({
    number: zod_1.z.string().min(1, "Room number is required"),
    floor: zod_1.z.string().optional(),
    block: zod_1.z.string().optional(),
    type: zod_1.z.preprocess((val) => (typeof val === "string" ? val.toLowerCase() : val), exports.RoomTypeEnum),
    status: zod_1.z.preprocess((val) => (typeof val === "string" ? val.toLowerCase() : val), exports.RoomStatusEnum).default("available"),
    gender: zod_1.z.preprocess((val) => (typeof val === "string" ? val.toLowerCase() : val), exports.RoomGenderEnum),
    maxCap: zod_1.z.preprocess((val) => parseInt(val, 10), zod_1.z.number().int().min(1)),
    price: zod_1.z.preprocess((val) => parseFloat(val), zod_1.z.number().min(0)),
    description: zod_1.z.string().optional(),
    hostelId: zod_1.z.string().min(1, "Hostel ID is required"),
    amenitiesIds: zod_1.z.array(zod_1.z.string()).optional(),
    addAmenitiesIds: zod_1.z.array(zod_1.z.string()).optional(),
    removeAmenitiesIds: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.updateRoomSchema = exports.createRoomSchema.partial();
