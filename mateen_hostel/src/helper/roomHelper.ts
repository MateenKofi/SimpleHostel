import prisma from "../utils/prisma";
import HttpException from "../utils/http-error";
import { HttpStatus } from "../utils/http-status";
import { Room, RoomStatus } from "@prisma/client";
import cloudinary from "../utils/cloudinary";
import { formatPrismaError } from "../utils/formatPrisma";
import { toRoomDto } from "../utils/dto";

export const getAllRooms = async () => {
  try {
    const rooms = await prisma.room.findMany({
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
    return rooms.map(toRoomDto);
  } catch (error) {
    console.error("Error getting all rooms:", error);
    throw formatPrismaError(error);
  }
};

export const updateRoom = async (
  roomId: string,
  roomData: Partial<Room>,
  pictures: { imageUrl: string; imageKey: string }[],
) => {
  try {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { roomImages: true, residents: true },
    });
    if (!room) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Room not found");
    }
    if (roomData.maxCap && room.residents.length > roomData.maxCap) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        "Cannot update maxCap as it is less than the number of residents in the room",
      );
    }

    // Delete old images from Cloudinary
    if (room.roomImages && room.roomImages.length > 0) {
      for (const image of room.roomImages) {
        await cloudinary.uploader.destroy(image.imageKey); // Delete image from Cloudinary
      }
    }

    // Remove old images from the database
    await prisma.roomImage.deleteMany({
      where: { roomId: roomId },
    });

    // Update the room data
    let updatedRoomData = { ...roomData };

    const updatedRoomWithDetails = await prisma.room.findUnique({
      where: { id: roomId },
      include: { amenities: true, roomImages: true, hostel: true },
    });

    return updatedRoomWithDetails ? toRoomDto(updatedRoomWithDetails as any) : null;
  } catch (error) {
    console.error("Update room Error:", error);
    throw formatPrismaError(error);
  }
};

export const deleteRoom = async (roomId: string) => {
  try {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { roomImages: true }, // Include associated images
    });

    if (!room) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Room not found");
    }

    // Delete images from Cloudinary first
    for (const image of room.roomImages) {
      await cloudinary.uploader.destroy(image.imageKey); // Delete image from Cloudinary
    }
    // Check for active residents assigned to this room
    const activeResidents = await prisma.residentProfile.count({
      where: {
        roomId: room.id,
      },
    });

    if (activeResidents > 0) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        "Cannot delete room because it has active residents assigned",
      );
    }

    // Remove the images from the database
    await prisma.roomImage.deleteMany({
      where: { roomId: roomId },
    });

    // Remove the room from the database
    await prisma.room.delete({
      where: { id: roomId },
    });

    return { message: "Room and associated images deleted successfully" };
  } catch (error) {
    console.error("Error deleting room:", error);
    throw formatPrismaError(error);
  }
};

export const getRoomById = async (roomId: string) => {
  try {
    const room = await prisma.room.findFirst({
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
      throw new HttpException(HttpStatus.NOT_FOUND, "Room not found");
    }

    return toRoomDto(room as any);
  } catch (error) {
    console.error("Error getting room:", error);
    throw formatPrismaError(error);
  }
};

export const createRoom = async (
  roomData: Room,
  pictures: { imageUrl: string; imageKey: string }[],
  amenitiesIds?: string[],
) => {
  try {
    // Calculate total price if amenities are provided
    let totalPrice = roomData.price;
    const findRoom = await prisma.room.findFirst({
      where: {
        number: roomData.number,
        floor: roomData.floor,
        hostelId: roomData.hostelId,
      },
    });
    if (findRoom) {
      throw new HttpException(HttpStatus.CONFLICT, "Room already exists");
    }
    if (amenitiesIds && amenitiesIds.length > 0) {
      const amenities = await prisma.amenities.findMany({
        where: {
          id: {
            in: amenitiesIds,
          },
        },
      });

      // Sum up the prices of the selected amenities
      const totalAmenitiesPrice = amenities.reduce(
        (total, amenity) => total + parseFloat(amenity.price.toString()),
        0,
      );
      totalPrice += totalAmenitiesPrice;
    }

    // Create the room and connect amenities if provided
    const newRoom = await prisma.room.create({
      data: {
        number: roomData.number,
        block: roomData.block,
        floor: roomData.floor,
        maxCap: roomData.maxCap,
        hostelId: roomData.hostelId,
        price: totalPrice,
        gender: (roomData.gender as string)?.toLowerCase() as any,
        description: roomData.description,
        type: (roomData.type as string)?.toLowerCase() as any,
        status: (roomData.status as string)?.toLowerCase() as any,
        amenities: amenitiesIds?.length
          ? {
            connect: amenitiesIds.map((id) => ({ id })),
          }
          : undefined, // Only connect amenities if provided
      },
    });
    if (!newRoom) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Error adding room",
      );
    }

    const roomImages = pictures.map((picture) => ({
      imageUrl: picture.imageUrl,
      imageKey: picture.imageKey,
      roomId: newRoom.id,
    }));

    // Ensure the images are inserted into the database
    if (roomImages.length > 0) {
      await prisma.roomImage.createMany({ data: roomImages });
    }

    // Fetch the complete room with images to return
    const roomWithImages = await prisma.room.findUnique({
      where: { id: newRoom.id },
      include: {
        amenities: true,
        roomImages: true,
        hostel: true,
      },
    });

    return roomWithImages ? toRoomDto(roomWithImages as any) : null;
  } catch (error) {
    console.error("Error creating room:", error);
    throw formatPrismaError(error);
  }
};

export const getAvailableRooms = async () => {
  try {
    // Fetch rooms with status 'AVAILABLE'
    const availableRooms = await prisma.room.findMany({
      where: {
        status: RoomStatus.available,
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

    return availableRooms.map(toRoomDto); // Return the list of available rooms
  } catch (error) {
    console.error("Error getting available rooms:", error);
    throw formatPrismaError(error);
  }
};

export const addAmenitiesToRoom = async (
  roomId: string,
  amenitiesIds: string[],
) => {
  try {
    // Check if the room exists
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { amenities: true }, // Include current amenities of the room
    });

    if (!room) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Room not found");
    }

    // Fetch amenities to be added
    const amenitiesToAdd = await prisma.amenities.findMany({
      where: { id: { in: amenitiesIds } },
    });

    // Calculate the total price of the amenities to be added
    const totalAmenitiesPrice = amenitiesToAdd.reduce(
      (total, amenity) => total + amenity.price,
      0,
    );

    // Update the room price and connect the new amenities
    const updatedRoom = await prisma.room.update({
      where: { id: roomId },
      data: {
        price: room.price + totalAmenitiesPrice,
        amenities: {
          connect: amenitiesIds.map((id: string) => ({ id })),
        },
      },
      include: { amenities: true, roomImages: true, hostel: true },
    });

    return toRoomDto(updatedRoom as any);
  } catch (error) {
    console.error("Error adding amenities:", error);
    throw formatPrismaError(error);
  }
};

export const removeAmenitiesFromRoom = async (
  roomId: string,
  amenitiesIds: string[],
) => {
  try {
    // Check if the room exists
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { amenities: true }, // Include current amenities of the room
    });

    if (!room) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Room not found");
    }

    // Fetch amenities to be removed
    const amenitiesToRemove = await prisma.amenities.findMany({
      where: { id: { in: amenitiesIds } },
    });

    // Calculate the total price of the amenities to be removed
    const totalAmenitiesPrice = amenitiesToRemove.reduce(
      (total, amenity) => total + amenity.price,
      0,
    );

    // Update the room price and disconnect the amenities
    const updatedRoom = await prisma.room.update({
      where: { id: roomId },
      data: {
        price: room.price - totalAmenitiesPrice,
        amenities: {
          disconnect: amenitiesIds.map((id: string) => ({ id })),
        },
      },
      include: { amenities: true, roomImages: true, hostel: true },
    });

    return toRoomDto(updatedRoom as any);
  } catch (error) {
    console.error("Error removing amenities:", error);
    throw formatPrismaError(error);
  }
};

export const getAllRoomsForHostel = async (hostelId: string) => {
  try {
    const rooms = await prisma.room.findMany({
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

    return rooms.map(toRoomDto);
  } catch (error) {
    console.error("Update Hostel Error:", error);
    throw formatPrismaError(error);
  }
};

export const updateRoomAll = async (
  roomId: string,
  roomData: Partial<Room>,
  pictures: { imageUrl: string; imageKey: string }[],
  addAmenitiesIds?: string[],
  removeAmenitiesIds?: string[],
) => {
  console.log("roomData: " + JSON.stringify(roomData, null, 2));
  console.log(`addAmenitiesIds ${addAmenitiesIds}`);
  console.log(`removeAmenitiesIds ${removeAmenitiesIds}`);

  try {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { roomImages: true, residents: true, amenities: true },
    });

    if (!room) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Room not found");
    }

    if (roomData.maxCap && room.residents.length > roomData.maxCap) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        "Cannot update maxCap as it is less than the number of residents in the room",
      );
    }

    // Fetch prices of added and removed amenities
    let totalAddedPrice = 0;
    let totalRemovedPrice = 0;

    if (addAmenitiesIds && addAmenitiesIds.length > 0) {
      const addedAmenities = await prisma.amenities.findMany({
        where: { id: { in: addAmenitiesIds } },
        select: { price: true },
      });
      totalAddedPrice = addedAmenities.reduce(
        (sum, amenity) => sum + amenity.price,
        0,
      );
    }

    if (removeAmenitiesIds && removeAmenitiesIds.length > 0) {
      const removedAmenities = await prisma.amenities.findMany({
        where: { id: { in: removeAmenitiesIds } },
        select: { price: true },
      });
      totalRemovedPrice = removedAmenities.reduce(
        (sum, amenity) => sum + amenity.price,
        0,
      );
    }

    // Calculate the new room price
    const updatedPrice =
      (room.price || 0) + totalAddedPrice - totalRemovedPrice;

    console.log(`Updated Room Price: ${updatedPrice}`);

    // Delete old images from Cloudinary
    if (room.roomImages && room.roomImages.length > 0) {
      for (const image of room.roomImages) {
        await cloudinary.uploader.destroy(image.imageKey);
      }
    }

    // Remove old images from the database
    await prisma.roomImage.deleteMany({ where: { roomId: roomId } });

    // Prepare updates for amenities
    const updateAmenities: { connect?: { id: string }[]; disconnect?: { id: string }[] } = {};
    if (addAmenitiesIds && addAmenitiesIds.length > 0) {
      updateAmenities.connect = addAmenitiesIds.map((id) => ({ id }));
    }
    if (removeAmenitiesIds && removeAmenitiesIds.length > 0) {
      updateAmenities.disconnect = removeAmenitiesIds.map((id) => ({ id }));
    }

    // Update the room data along with amenities and the new price
    const updatedRoom = await prisma.room.update({
      where: { id: roomId },
      data: {
        ...roomData,
        gender: roomData.gender ? (roomData.gender as string).toLowerCase() as any : undefined,
        type: roomData.type ? (roomData.type as string).toLowerCase() as any : undefined,
        status: roomData.status ? (roomData.status as string).toLowerCase() as any : undefined,
        price: updatedPrice,
        amenities:
          Object.keys(updateAmenities).length > 0
            ? updateAmenities
            : undefined,
      },
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
      await prisma.roomImage.createMany({ data: roomImages });
    }

    return toRoomDto(updatedRoom as any);
  } catch (error) {
    console.error("Update room Error:", error);
    throw formatPrismaError(error);
  }
};
