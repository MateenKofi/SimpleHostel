import prisma from "../utils/prisma";
import HttpException from "../utils/http-error";
import { HttpStatus } from "../utils/http-status";
import { Visitor, VisitorStatus } from "@prisma/client";
import { visitorSchema, updateVisitorSchema } from "../zodSchema/visitorSchema"; // Assuming you have Zod schemas for validation
import { formatPrismaError } from "../utils/formatPrisma";

// Add a Visitor

export const addVisitor = async (visitorData: Visitor) => {
  try {
    // Validate the visitor data using the schema
    const validateVisitor = visitorSchema.safeParse(visitorData);
    if (!validateVisitor.success) {
      const errors = validateVisitor.error.issues.map(
        ({ message, path }) => `${path}: ${message}`,
      );
      throw new HttpException(HttpStatus.BAD_REQUEST, errors.join(". "));
    }

    // Check if the visitor already exists by email or phone (or another unique identifier)
    const existingVisitor = await prisma.visitor.findFirst({
      where: {
        OR: [{ email: visitorData.email }, { phone: visitorData.phone }],
      },
    });

    // If visitor exists, create a new entry with the same details (new visit)
    const visitorToCreate = existingVisitor
      ? {
          ...visitorData,
          status: VisitorStatus.active, // new visit, status should be ACTIVE
          residentId: existingVisitor.residentId, // Retain the relation with the resident
        }
      : visitorData; // If the visitor does not exist, create a new one with all details

    // Create or reuse the visitor (if a repeat visitor)
    const createdVisitor = await prisma.visitor.create({
      data: visitorToCreate,
    });

    return createdVisitor;
  } catch (error) {
    throw formatPrismaError(error);
  }
};

// Get All Visitors
export const getAllVisitors = async (): Promise<Visitor[]> => {
  try {
    const visitors = await prisma.visitor.findMany({
      include: { resident: true },
    });
    return visitors;
  } catch (error) {
    throw formatPrismaError(error);
  }
};

// Get Visitor by ID
export const getVisitorById = async (visitorId: string): Promise<Visitor> => {
  try {
    const visitor = await prisma.visitor.findUnique({
      where: { id: visitorId },
      include: { resident: true },
    });

    if (!visitor) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Visitor not found");
    }

    return visitor;
  } catch (error) {
    throw formatPrismaError(error);
  }
};

// Update a Visitor
export const updateVisitor = async (
  visitorId: string,
  visitorData: { name: string; email: string; phone: string },
): Promise<Visitor> => {
  try {
    // Validate the visitor data using the schema
    const validateVisitor = updateVisitorSchema.safeParse(visitorData);
    if (!validateVisitor.success) {
      const errors = validateVisitor.error.issues.map(
        ({ message, path }) => `${path}: ${message}`,
      );
      throw new HttpException(HttpStatus.BAD_REQUEST, errors.join(". "));
    }

    // Check if the visitor exists in the database
    const findVisitor = await prisma.visitor.findUnique({
      where: { id: visitorId },
    });
    if (!findVisitor) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Visitor not found");
    }

    // Update the visitor details
    const updatedVisitor = await prisma.visitor.update({
      where: { id: visitorId },
      data: visitorData,
    });

    return updatedVisitor;
  } catch (error) {
    throw formatPrismaError(error);
  }
};

// Delete a Visitor
export const deleteVisitor = async (
  visitorId: string,
): Promise<{ message: string }> => {
  try {
    const visitor = await prisma.visitor.findUnique({
      where: { id: visitorId },
    });

    if (!visitor) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Visitor not found");
    }

    // Delete the visitor from the database
    await prisma.visitor.delete({
      where: { id: visitorId },
    });

    return { message: "Visitor deleted successfully" };
  } catch (error) {
    throw formatPrismaError(error);
  }
};

export const checkoutVisitor = async (visitorId: string) => {
  try {
    // Find the visitor by ID
    const visitor = await prisma.visitor.findUnique({
      where: { id: visitorId },
      include: {
        resident: true, // Assuming you want to include the resident details as well
      },
    });

    // If visitor doesn't exist, throw an error
    if (!visitor) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Visitor not found");
    }

    // If the visitor is already checked out, throw an error
    if (visitor.status === VisitorStatus.checked_out) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        "Visitor is already checked out",
      );
    }

    // Update the visitor's status to checked out
    const updatedVisitor = await prisma.visitor.update({
      where: { id: visitorId },
      data: {
        status: VisitorStatus.checked_out ,
      },
    });

    // Return the updated visitor information
    return updatedVisitor;
  } catch (error) {
    throw formatPrismaError(error);
  }
};

export const getVisitorsForHostel = async (hostelId: string) => {
  try {
    // First, ensure the hostel exists and is not deleted
    const hostel = await prisma.hostel.findUnique({
      where: { id: hostelId },
    });
    
    if (!hostel) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Hostel not found");
    }

    // Now, query for visitors whose resident's room is in the specified hostel and is not deleted
    const visitors = await prisma.visitor.findMany({
      where: {
        resident: {
          room: {
            hostelId, // Ensure the room belongs to the given hostel
            hostel: {
              deletedAt: null, // Ensure the hostel is not deleted
            },
          },
        },
      },
      include: {
        resident: true, // Include resident details
      },
    });

    return visitors;
  } catch (error) {
    throw formatPrismaError(error);
  }
};
