import prisma from "../utils/prisma";
import HttpException from "../utils/http-error";
import { HttpStatus } from "../utils/http-status";
import { Hostel, HostelState, RoomStatus } from "@prisma/client";
import { hostelSchema, updateHostelSchema } from "../zodSchema/hostelSchema";
import cloudinary from "../utils/cloudinary";
import { formatPrismaError } from "../utils/formatPrisma";
import { toHostelDto } from "../utils/dto";

export const addHostel = async (
  hostelData: Hostel,
  pictures: { imageUrl: string; imageKey: string }[],
  logoInfo?: { logoUrl: string; logoKey: string } | null,
) => {
  try {
    const validateHostel = hostelSchema.safeParse(hostelData);
    if (!validateHostel.success) {
      const errors = validateHostel.error.issues.map(
        ({ message, path }) => `${path}: ${message}`,
      );
      throw new HttpException(HttpStatus.BAD_REQUEST, errors.join(". "));
    }

    // Check for existing hostel
    const normalizedEmail = hostelData.email.trim().toLowerCase();
    const findHostel = await prisma.hostel.findFirst({
      where: {
        email: normalizedEmail,
        deletedAt: null,
      },
    });
    if (findHostel) {
      throw new HttpException(
        HttpStatus.CONFLICT,
        "Hostel already registered with this email",
      );
    }

    const createdHostel = await prisma.hostel.create({
      data: {
        ...hostelData,
        email: normalizedEmail,
        logoUrl: logoInfo?.logoUrl,
        logoKey: logoInfo?.logoKey,
      },
    });

    if (!createdHostel) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "error creating hostel",
      );
    }

    // Handle hostel images
    if (pictures.length > 0) {
      const hostelImages = pictures.map((picture) => ({
        imageUrl: picture.imageUrl,
        imageKey: picture.imageKey,
        hostelId: createdHostel.id,
      }));
      await prisma.hostelImage.createMany({ data: hostelImages });
    }

    return toHostelDto(createdHostel as any);
  } catch (error) {
    console.error("Adding Hostel Error:", error);
    throw formatPrismaError(error);
  }
};

export const getAllHostels = async () => {
  try {
    const hostels = await prisma.hostel.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        rooms: {
          include: { amenities: true, roomImages: true },
        },
        staffProfiles: {
          include: { user: true },
        },
        adminProfiles: {
          include: { user: true },
        },
        residentProfiles: true,
        amenities: true,
        hostelImages: true,
        calendarYears: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            isActive: true,
            startDate: true,
            endDate: true,
          },
        },
        feedbacks: {
          select: { rating: true },
        },
      },
    });
    return hostels.map((hostel: any) => {
      const totalRating = hostel.feedbacks.reduce((sum: number, f: any) => sum + f.rating, 0);
      const averageRating = hostel.feedbacks.length > 0 ? totalRating / hostel.feedbacks.length : 0;
      return toHostelDto({ ...hostel, averageRating });
    });
  } catch (error) {
    console.error("Error retrieving hostels:", error);
    throw formatPrismaError(error);
  }
};

export const getHostelById = async (hostelId: string) => {
  try {
    const hostel = await prisma.hostel.findUnique({
      where: {
        id: hostelId,
        deletedAt: null,
      },
      include: {
        rooms: {
          include: {
            amenities: true,
            roomImages: true,
          },
        },
        staffProfiles: {
          include: { user: true },
        },
        adminProfiles: {
          include: { user: true },
        },
        hostelImages: true,
        calendarYears: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            isActive: true,
            startDate: true,
            endDate: true,
          },
        },
        feedbacks: {
          select: { rating: true },
        },
      },
    });
    const hostelData = hostel as any;
    const totalRating = hostelData.feedbacks.reduce((sum: number, f: any) => sum + f.rating, 0);
    const averageRating = hostelData.feedbacks.length > 0 ? totalRating / hostelData.feedbacks.length : 0;

    return toHostelDto({ ...hostelData, averageRating });
  } catch (error) {
    console.error("Error retrieving hostel:", error);
    throw formatPrismaError(error);
  }
};

export const deleteHostel = async (hostelId: string) => {
  try {
    const findHostel = await prisma.hostel.findUnique({
      where: { id: hostelId },
      include: { hostelImages: true },
    });

    if (!findHostel) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Hostel not found");
    }

    await prisma.hostel.update({
      where: { id: hostelId },
      data: { deletedAt: new Date() },
    });

    return { message: "Hostel soft deleted successfully" };
  } catch (error) {
    console.error("Error deleting hostel:", error);
    throw formatPrismaError(error);
  }
};

export const updateHostel = async (
  hostelId: string,
  hostelData: Partial<Hostel>,
  pictures: { imageUrl: string; imageKey: string }[],
  logoInfo?: { logoUrl: string; logoKey: string } | null,
) => {
  try {
    const validateHostel = updateHostelSchema.safeParse(hostelData);
    if (!validateHostel.success) {
      const errors = validateHostel.error.issues.map(
        ({ message, path }) => `${path}: ${message}`,
      );
      throw new HttpException(HttpStatus.BAD_REQUEST, errors.join(". "));
    }

    const findHostel = await prisma.hostel.findUnique({
      where: { id: hostelId },
      include: { hostelImages: true },
    });

    if (!findHostel) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Hostel not found");
    }

    // Handle logo update
    if (logoInfo?.logoUrl && logoInfo?.logoKey) {
      if (findHostel.logoKey) {
        await cloudinary.uploader.destroy(findHostel.logoKey);
      }
      hostelData.logoUrl = logoInfo.logoUrl;
      hostelData.logoKey = logoInfo.logoKey;
    }

    // Handle photos update only if new pictures are provided
    if (pictures.length > 0) {
      // Delete old images from Cloudinary
      for (const image of findHostel.hostelImages || []) {
        if (image.imageKey) {
          try {
            await cloudinary.uploader.destroy(image.imageKey);
          } catch (e) {
            console.warn(
              "Failed to delete image from Cloudinary:",
              image.imageKey,
              e,
            );
          }
        }
      }

      // Delete image records from database
      await prisma.hostelImage.deleteMany({
        where: { hostelId },
      });

      // Add new image records
      const hostelImages = pictures.map((picture) => ({
        imageUrl: picture.imageUrl,
        imageKey: picture.imageKey,
        hostelId,
      }));
      await prisma.hostelImage.createMany({ data: hostelImages });
    }

    const updatedHostelWithDetails = await prisma.hostel.findUnique({
      where: { id: hostelId },
      include: { hostelImages: true },
    });

    return updatedHostelWithDetails ? toHostelDto(updatedHostelWithDetails as any) : null;
  } catch (error) {
    console.error("Update Hostel Error:", error);
    throw formatPrismaError(error);
  }
};

export const getUnverifiedHostel = async () => {
  try {
    const unverifiedHostel = await prisma.hostel.findMany({
      where: {
        isVerified: false,
        deletedAt: null,
      },
    });
    return unverifiedHostel.map((h) => toHostelDto(h as any));
  } catch (error) {
    console.error("Error retrieving hostels:", error);
    throw formatPrismaError(error);
  }
};

export const publishHostel = async (hostelId: string) => {
  try {
    const hostel = await prisma.hostel.findUnique({
      where: {
        id: hostelId,
        deletedAt: null,
      },
    });
    if (!hostel) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Hostel not found");
    }
    const isActive = await prisma.calendarYear.findFirst({
      where: {
        hostelId: hostelId,
        isActive: true,
      },
    });
    if (!isActive) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        "Calendar year must be active before publishing hostel",
      );
    }
    await prisma.hostel.update({
      where: { id: hostelId },
      data: { state: HostelState.published },
    });
  } catch (error) {
    console.error("Publish Hostel Error:", error); //
    throw formatPrismaError(error);
  }
};

export const unPublishHostel = async (hostelId: string) => {
  try {
    const hostel = await prisma.hostel.findUnique({
      where: {
        id: hostelId,
        deletedAt: null,
      },
    });
    if (!hostel) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Hostel not found");
    }
    await prisma.hostel.update({
      where: { id: hostelId },
      data: { state: HostelState.unpublished },
    });
  } catch (error) {
    console.error("Unpublish Hostel Error:", error);
    throw formatPrismaError(error);
  }
};

export const updateHostelRules = async (
  hostelId: string,
  rulesInfo: { rulesUrl: string; rulesKey: string }
) => {
  try {
    const findHostel = await prisma.hostel.findUnique({
      where: { id: hostelId },
    });

    if (!findHostel) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Hostel not found");
    }

    if (findHostel.rulesKey) {
      await cloudinary.uploader.destroy(findHostel.rulesKey);
    }

    const updatedHostelWithDetails = await prisma.hostel.findUnique({
      where: { id: hostelId },
      include: { hostelImages: true },
    });

    return updatedHostelWithDetails ? toHostelDto(updatedHostelWithDetails as any) : null;
  } catch (error) {
    console.error("Update Hostel Rules Error:", error);
    throw formatPrismaError(error);
  }
};

export const updatePaymentSettings = async (
  hostelId: string,
  settings: { allowPartialPayment: boolean; partialPaymentPercentage?: number }
) => {
  try {
    const findHostel = await prisma.hostel.findUnique({
      where: { id: hostelId },
    });

    if (!findHostel) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Hostel not found");
    }

    const updatedHostelWithDetails = await prisma.hostel.findUnique({
      where: { id: hostelId },
      include: { hostelImages: true },
    });

    return updatedHostelWithDetails ? toHostelDto(updatedHostelWithDetails as any) : null;
  } catch (error) {
    console.error("Update Payment Settings Error:", error);
    throw formatPrismaError(error);
  }
};

export const updateHostelDocuments = async (
  hostelId: string,
  data: { signatureUrl?: string; stampUrl?: string }
) => {
  try {
    const updatedHostelWithDetails = await prisma.hostel.findUnique({
      where: { id: hostelId },
      include: { hostelImages: true },
    });

    return updatedHostelWithDetails ? toHostelDto(updatedHostelWithDetails as any) : null;
  } catch (error) {
    throw formatPrismaError(error);
  }
};
