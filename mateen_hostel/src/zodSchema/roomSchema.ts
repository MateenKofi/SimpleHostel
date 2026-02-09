import { z } from "zod";

export const RoomTypeEnum = z.enum(["single", "double", "suite", "quad"]);
export const RoomStatusEnum = z.enum(["available", "occupied", "maintenance"]);
export const RoomGenderEnum = z.enum(["male", "female", "mix"]);

export const createRoomSchema = z.object({
    number: z.string().min(1, "Room number is required"),
    floor: z.string().optional(),
    block: z.string().optional(),
    type: z.preprocess((val) => (typeof val === "string" ? val.toLowerCase() : val), RoomTypeEnum),
    status: z.preprocess((val) => (typeof val === "string" ? val.toLowerCase() : val), RoomStatusEnum).default("available"),
    gender: z.preprocess((val) => (typeof val === "string" ? val.toLowerCase() : val), RoomGenderEnum),
    maxCap: z.preprocess((val) => parseInt(val as string, 10), z.number().int().min(1)),
    price: z.preprocess((val) => parseFloat(val as string), z.number().min(0)),
    description: z.string().optional(),
    hostelId: z.string().min(1, "Hostel ID is required"),
    amenitiesIds: z.array(z.string()).optional(),
    addAmenitiesIds: z.array(z.string()).optional(),
    removeAmenitiesIds: z.array(z.string()).optional(),
});

export const updateRoomSchema = createRoomSchema.partial();

export type CreateRoomDto = z.infer<typeof createRoomSchema>;
export type UpdateRoomDto = z.infer<typeof updateRoomSchema>;
