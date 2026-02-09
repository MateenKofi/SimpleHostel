import prisma from "../utils/prisma";
import HttpException from "../utils/http-error";
import { HttpStatus } from "../utils/http-status";
import { Amenities } from "@prisma/client";
import {
  amenitiesSchema,
  updateAmenitiesSchema,
} from "../zodSchema/amenitiesSchema"; // Assuming you have Zod schemas for validation
import { formatPrismaError } from "../utils/formatPrisma";

// Add an Amenity
export const addAmenity = async (amenityData: Amenities) => {
  try {
    // Validate the amenity data using the schema
    const validateAmenity = amenitiesSchema.safeParse(amenityData);
    if (!validateAmenity.success) {
      const errors = validateAmenity.error.issues.map(
        ({ message, path }) => `${path}: ${message}`,
      );
      throw new HttpException(HttpStatus.BAD_REQUEST, errors.join(". "));
    }
    const hostel = await prisma.hostel.findUnique({
      where: { id: amenityData.hostelId },
    });
    if (!hostel) {
      throw new HttpException(HttpStatus.NOT_FOUND, "hostel does not exist");
    }
    const hostelId = hostel.id;
    // Check if amenity already exists (if needed)
    const existingAmenity = await prisma.amenities.findFirst({
      where: { name: amenityData.name, hostelId },
    });
    if (existingAmenity) {
      throw new HttpException(HttpStatus.CONFLICT, "Amenity already exists");
    }

    // Create a new amenity
    const createdAmenity = await prisma.amenities.create({
      data: amenityData,
    });

    return createdAmenity;
  } catch (error) {
    console.error("Error adding amenity:", error);
    throw formatPrismaError(error);
  }
};

// Get All Amenities
export const getAllAmenities = async () => {
  try {
    const amenities = await prisma.amenities.findMany();
    return amenities;
  } catch (error) {
    console.error("Error retrieving Amenities:", error);
    throw formatPrismaError(error);
  }
};

// Get Amenity by ID
export const getAmenityById = async (amenityId: string): Promise<Amenities> => {
  try {
    const amenity = await prisma.amenities.findUnique({
      where: { id: amenityId },
    });

    if (!amenity) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Amenity not found");
    }

    return amenity;
  } catch (error) {
    console.error("Error retrieving Amenity:", error);
    throw formatPrismaError(error);
  }
};

// Update an Amenity
export const updateAmenity = async (
  amenityId: string,
  amenityData: Partial<Amenities>,
) => {
  try {
    // Validate the amenity data using the schema
    const validateAmenity = updateAmenitiesSchema.safeParse(amenityData);
    if (!validateAmenity.success) {
      const errors = validateAmenity.error.issues.map(
        ({ message, path }) => `${path}: ${message}`,
      );
      throw new HttpException(HttpStatus.BAD_REQUEST, errors.join(". "));
    }

    // Check if the amenity exists in the database
    const findAmenity = await prisma.amenities.findUnique({
      where: { id: amenityId },
    });
    if (!findAmenity) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Amenity not found");
    }

    // Update the amenity
    const updatedAmenity = await prisma.amenities.update({
      where: { id: amenityId },
      data: amenityData,
    });

    return updatedAmenity;
  } catch (error) {
    console.error("Error updating Amenity:", error);
    throw formatPrismaError(error);
  }
};

// Delete Amenity
export const deleteAmenity = async (
  amenityId: string,
): Promise<{ message: string }> => {
  try {
    const amenity = await prisma.amenities.findUnique({
      where: { id: amenityId },
    });

    if (!amenity) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Amenity not found");
    }

    // Delete the amenity
    await prisma.amenities.delete({
      where: { id: amenityId },
    });

    return { message: "Amenity deleted successfully" };
  } catch (error) {
    console.error("Error deleting Amenity:", error);
    throw formatPrismaError(error);
  }
};

export const getAllAmenitiesForHostel = async (hostelId: string) => {
  try {
    const rooms = await prisma.amenities.findMany({
      where: {
        hostelId,
        hostel: {
          deletedAt: null,
        },
      },
    });
    return rooms;
  } catch (error) {
    console.error("Error retrieving Amenities for hostel:", error);
    throw formatPrismaError(error);
  }
};
