import { NextFunction, Request, Response } from "express";
import * as roomHelper from "../helper/roomHelper"; // Assuming you have your room service functions in this file
import { HttpStatus } from "../utils/http-status";
import HttpException from "../utils/http-error";
import { Room } from "@prisma/client";
import cloudinary from "../utils/cloudinary";
import { formatPrismaError } from "../utils/formatPrisma";
import { createRoomSchema, updateRoomSchema } from "../zodSchema/roomSchema";

// Add a Room
export const addRoomController = async (req: Request, res: Response) => {
  try {
    const validatedData = createRoomSchema.safeParse(req.body);
    if (!validatedData.success) {
      const errors = validatedData.error.issues.map(
        ({ message, path }) => `${path}: ${message}`
      );
      throw new HttpException(HttpStatus.BAD_REQUEST, errors.join(". "));
    }

    const { amenitiesIds, ...roomData } = validatedData.data;
    const photos = req.files ? (req.files as Express.Multer.File[]) : [];

    if (!photos || photos.length === 0) {
      throw new HttpException(HttpStatus.BAD_REQUEST, "Room images are required");
    }

    const pictures = [];

    if (photos && Array.isArray(photos) && photos.length) {
      for (const photo of photos) {
        const uploaded = await cloudinary.uploader.upload(photo.path, {
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

    const newRoom = await roomHelper.createRoom(
      roomData as any,
      pictures,
      amenitiesIds
    );

    res.status(HttpStatus.CREATED).json({
      message: "Room created successfully",
      data: newRoom,
    });
  } catch (error) {
    const err = formatPrismaError(error);
    res.status(err.status).json({ message: err.message });
  }
};

// Get All Rooms
export const getAllRoomsController = async (req: Request, res: Response) => {
  try {
    const rooms = await roomHelper.getAllRooms();

    res.status(HttpStatus.OK).json({
      message: "Rooms fetched successfully",
      data: rooms,
    });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

// Get Room by ID
export const getRoomByIdController = async (req: Request, res: Response) => {
  const { roomId } = req.params; // Getting room ID from the URL parameters

  try {
    const room = await roomHelper.getRoomById(roomId);

    res.status(HttpStatus.OK).json({
      message: "Room fetched successfully",
      data: room,
    });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

// Update a Room
export const updateRoomController = async (req: Request, res: Response) => {
  const { roomId } = req.params; // Room ID from the URL parameters
  const roomData: Partial<Room> = {
    ...req.body,
    price: parseFloat(req.body.price),
    maxCap: parseInt(req.body.maxCap),
  };
  const amenitiesIds: string[] = req.body.amenitiesIds; // List of amenities IDs to associate with the room
  const photos = req.files as Express.Multer.File[] | undefined;

  const pictures = [];

  try {
    if (photos && photos.length > 0) {
      // Loop over the photos and upload each one to Cloudinary
      for (const photo of photos) {
        const uploaded = await cloudinary.uploader.upload(photo.path, {
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

    const updatedRoom = await roomHelper.updateRoom(roomId, roomData, pictures);

    res.status(HttpStatus.OK).json({
      message: "Room updated successfully",
      data: updatedRoom,
    });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

// Delete a Room
export const deleteRoomController = async (req: Request, res: Response) => {
  const { roomId } = req.params; // Room ID from the URL parameters

  try {
    const result = await roomHelper.deleteRoom(roomId);

    res.status(HttpStatus.OK).json({
      message: result.message,
    });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

// Get Available Rooms
export const getAvailableRoomsController = async (
  req: Request,
  res: Response
) => {
  try {
    const availableRooms = await roomHelper.getAvailableRooms();

    res.status(HttpStatus.OK).json({
      message: "Available rooms fetched successfully",
      data: availableRooms,
    });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

export const addAmenitiesToRoomController = async (
  req: Request,
  res: Response
) => {
  const { roomId } = req.params;
  const amenitiesIds: string[] = req.body.amenitiesIds;

  try {
    const updatedRoom = await roomHelper.addAmenitiesToRoom(
      roomId,
      amenitiesIds
    );
    res.status(HttpStatus.OK).json({
      message: "Amenities added successfully",
      data: updatedRoom,
    });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

export const removeAmenitiesFromRoomController = async (
  req: Request,
  res: Response
) => {
  const { roomId } = req.params;
  const amenitiesIds: string[] = req.body.amenitiesIds;

  try {
    const updatedRoom = await roomHelper.removeAmenitiesFromRoom(
      roomId,
      amenitiesIds
    );
    res.status(HttpStatus.OK).json({
      message: "Amenities removed successfully",
      data: updatedRoom,
    });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

export const roomsForHostel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { hostelId } = req.params;
  try {
    // Fetch all rooms for the given hostel
    const rooms = await roomHelper.getAllRoomsForHostel(hostelId);

    // Group rooms by their status
    const availableRooms = rooms.filter(
      (room: any) => room.status === "AVAILABLE"
    );
    const occupiedRooms = rooms.filter(
      (room: any) => room.status === "OCCUPIED"
    );
    const maintenanceRooms = rooms.filter(
      (room: any) => room.status === "MAINTENANCE"
    );

    // Prepare the response with counts for each status
    res.status(HttpStatus.OK).json({
      message: "Rooms fetched successfully",
      data: {
        totalRooms: rooms.length, // Total number of rooms
        availableRoomsCount: availableRooms.length, // Count of available rooms
        occupiedRoomsCount: occupiedRooms.length, // Count of occupied rooms
        maintenanceRoomsCount: maintenanceRooms.length, // Count of rooms under maintenance
        rooms, // All room details
      },
    });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used for proper error formatting
    res.status(err.status).json({ message: err.message });
  }
};



// Update a Room
// Update a Room
export const updateRoomControllerAll = async (req: Request, res: Response) => {
  const { roomId } = req.params; // Room ID from the URL parameters

  try {
    const validatedData = updateRoomSchema.safeParse(req.body);
    if (!validatedData.success) {
      const errors = validatedData.error.issues.map(
        ({ message, path }) => `${path}: ${message}`
      );
      throw new HttpException(HttpStatus.BAD_REQUEST, errors.join(". "));
    }

    const { addAmenitiesIds, removeAmenitiesIds, ...roomData } = validatedData.data;

    const photos = req.files as Express.Multer.File[] | undefined;
    const pictures = [];

    if (photos && photos.length > 0) {
      // Loop over the photos and upload each one to Cloudinary
      for (const photo of photos) {
        const uploaded = await cloudinary.uploader.upload(photo.path, {
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

    const updatedRoom = await roomHelper.updateRoomAll(
      roomId,
      roomData,
      pictures,
      addAmenitiesIds,
      removeAmenitiesIds
    );

    res.status(HttpStatus.OK).json({
      message: "Room updated successfully",
      data: updatedRoom,
    });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};
