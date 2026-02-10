import prisma from "../utils/prisma";
import { Gender } from "@prisma/client";
import HttpException from "../utils/http-error";
import { HttpStatus } from "../utils/http-status";
import { ErrorResponse } from "../utils/types";
import { ResidentRequestDto, UpdateResidentRequestDto, AdminResidentRequestDto } from "../zodSchema/residentSchema";
import { hashPassword } from "../utils/bcrypt";
import {
  residentSchema,
  updateResidentSchema,
  adminResidentSchema,
} from "../zodSchema/residentSchema";
import { CreateMaintenanceRequestDto, createMaintenanceRequestSchema } from "../zodSchema/requestSchema";
import { formatPrismaError } from "../utils/formatPrisma";
import { CreateFeedbackDto, createFeedbackSchema } from "../zodSchema/feedbackSchema";
import { toResidentDto, toMaintenanceRequestDto, toPaymentDto, toFeedbackDto, toRoomDto } from "../utils/dto";
import { sendEmail } from "../utils/nodeMailer";
import { generatePasswordSetupEmail } from "../services/generatePasswordSetupEmail";

/**
 * Generate a random password with 12 characters
 * Includes uppercase, lowercase, numbers, and special characters
 */
export const generateRandomPassword = (): string => {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const special = "!@#$%^&*";

  let password = "";
  // Ensure at least one of each type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  // Fill the rest (8 more characters for 12 total)
  const allChars = uppercase + lowercase + numbers + special;
  for (let i = 0; i < 8; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password.split("").sort(() => Math.random() - 0.5).join("");
};

/**
 * Generate a unique access code for resident verification
 * Uses characters that are not ambiguous (no 0/O, 1/I)
 */
export const generateAccessCode = (): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No ambiguous chars (0/O, 1/I)
  let code = "";
  for (let i = 0; i < 10; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

/**
 * Send password setup email to a new resident
 */
export const sendPasswordSetupEmail = async (email: string, tempPassword: string): Promise<void> => {
  const htmlContent = generatePasswordSetupEmail(email, tempPassword);
  await sendEmail(email, "Welcome to Fuse - Your Account Credentials", htmlContent);
};

export const register = async (residentData: ResidentRequestDto) => {
  try {
    const validateResident = residentSchema.safeParse(residentData);
    if (!validateResident.success) {
      const errors = validateResident.error.issues.map(
        ({ message, path }) => `${path}: ${message}`,
      );
      throw new HttpException(HttpStatus.BAD_REQUEST, errors.join(". "));
    }

    const { roomId } = residentData as { roomId?: string };
    if (roomId) {
      const existingRoom = await prisma.room.findUnique({
        where: { id: roomId },
      });
      if (!existingRoom) {
        throw new HttpException(HttpStatus.NOT_FOUND, "Room not found.");
      }
      if (
        existingRoom.gender !== "mix" &&
        existingRoom.gender !== residentData.gender
      ) {
        throw new HttpException(
          HttpStatus.BAD_REQUEST,
          `Room gender does not match resident's gender.`,
        );
      }

      const currentResidentsCount = await prisma.residentProfile.count({
        where: { roomId: residentData.roomId as string },
      });

      if (currentResidentsCount >= existingRoom.maxCap) {
        throw new HttpException(
          HttpStatus.CONFLICT,
          "Room has reached its maximum capacity.",
        );
      }
    }

    const normalizedEmail = residentData.email.trim().toLowerCase();
    const hashed = await hashPassword(residentData.password);
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashed,
        name: residentData.name,
        gender: residentData.gender.toLowerCase() as Gender, // Convert to lowercase for Prisma enum
        phone: residentData.phone,
        role: "resident",
      },
    });

    const newProfile = await prisma.residentProfile.create({
      data: {
        userId: user.id,
        hostelId: residentData.hostelId ?? null,
        roomId,
        studentId: residentData.studentId ?? null,
        course: residentData.course ?? null,
        status: "active",
        checkInDate: residentData.checkInDate ?? null,
        checkOutDate: residentData.checkOutDate ?? null,
        emergencyContactName: residentData.emergencyContactName ?? null,
        emergencyContactPhone: residentData.emergencyContactPhone ?? null,
        emergencyContactRelationship: residentData.emergencyContactRelationship ?? null,
      },
      include: { room: true, user: true },
    });

    return toResidentDto(newProfile as any);
  } catch (error) {
    throw formatPrismaError(error);
  }
};

export const getAllResident = async () => {
  try {
    const residents = await prisma.residentProfile.findMany({
      where: { deletedAt: null },
      include: { room: { include: { hostel: true } }, user: true },
    });
    return residents.map((resident) => toResidentDto(resident as any));
  } catch (error) {
    throw formatPrismaError(error);
  }
};


export const getResidentById = async (residentId: string) => {
  try {
    const resident = await prisma.residentProfile.findUnique({
      where: { id: residentId },
      include: { room: true, user: true },
    });
    if (!resident) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Resident not found.");
    }
    return toResidentDto(resident as any);
  } catch (error) {
    throw formatPrismaError(error);
  }
};

export const getResidentByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { residentProfile: { include: { room: true } } },
    });
    const resident = user?.residentProfile;
    if (!resident) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Resident not found.");
    }
    return toResidentDto(resident as any);
  } catch (error) {
    throw formatPrismaError(error);
  }
};

export const updateResident = async (
  residentId: string,
  residentData: UpdateResidentRequestDto,
) => {
  try {
    const validateResident = updateResidentSchema.safeParse(residentData);
    if (!validateResident.success) {
      const errors = validateResident.error.issues.map(
        ({ message, path }) => `${path}: ${message}`,
      );
      throw new HttpException(HttpStatus.BAD_REQUEST, errors.join(". "));
    }

    const resident = await prisma.residentProfile.findUnique({
      where: { id: residentId },
      include: { user: true },
    });
    if (!resident) {
      throw new HttpException(HttpStatus.NOT_FOUND, "resident not found");
    }

    // Update User fields if provided
    if (residentData.name || residentData.email || residentData.phone || residentData.gender) {
      await prisma.user.update({
        where: { id: resident.userId },
        data: {
          ...(residentData.name && { name: residentData.name }),
          ...(residentData.email && { email: residentData.email }),
          ...(residentData.phone && { phone: residentData.phone }),
          ...(residentData.gender && {
            gender: residentData.gender.toLowerCase() as "male" | "female" | "other"
          }),
        },
      });
    }

    // Update ResidentProfile fields
    const updatedResident = await prisma.residentProfile.update({
      where: { id: residentId },
      data: {
        ...(residentData.hostelId && { hostelId: residentData.hostelId }),
        ...(residentData.roomId && { roomId: residentData.roomId }),
        ...(residentData.studentId && { studentId: residentData.studentId }),
        ...(residentData.course && { course: residentData.course }),
        ...(residentData.roomNumber && { roomNumber: residentData.roomNumber }),
        ...(residentData.status && { status: residentData.status }),
        ...(residentData.checkInDate && { checkInDate: residentData.checkInDate }),
        ...(residentData.checkOutDate && { checkOutDate: residentData.checkOutDate }),
        ...(residentData.emergencyContactName && { emergencyContactName: residentData.emergencyContactName }),
        ...(residentData.emergencyContactPhone && { emergencyContactPhone: residentData.emergencyContactPhone }),
        ...(residentData.emergencyContactRelationship !== undefined && { emergencyContactRelationship: residentData.emergencyContactRelationship }),
      },
    });

    const updatedResidentWithDetails = await prisma.residentProfile.findUnique({
      where: { id: residentId },
      include: { room: true, user: true },
    });
    return updatedResidentWithDetails ? toResidentDto(updatedResidentWithDetails as any) : null;
  } catch (error) {
    throw formatPrismaError(error);
  }
};

export const deleteResident = async (residentId: string) => {
  try {
    const resident = await prisma.residentProfile.findUnique({
      where: { id: residentId },
      include: {
        room: true,
        user: true,
      },
    });

    if (!resident) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Resident not found");
    }

    const result = await prisma.$transaction(async (tx) => {
      // Soft delete by setting deletedAt timestamp
      await tx.residentProfile.update({
        where: { id: residentId },
        data: {
          deletedAt: new Date(),
          // Clear room assignment if resident has one
          roomId: resident.roomId ? null : undefined,
        },
      });

      // Update room count if resident was assigned
      if (resident.roomId) {
        const currentCount = await tx.residentProfile.count({
          where: { roomId: resident.roomId },
        });
        await tx.room.update({
          where: { id: resident.roomId },
          data: {
            currentResidentCount: currentCount,
            status: currentCount >= 1 ? "occupied" : "available",
          },
        });
      }

      // Archive the associated user record (soft delete user too)
      await tx.user.update({
        where: { id: resident.userId },
        data: { deletedAt: new Date() },
      });

      return { archived: true };
    });

    return result;
  } catch (error) {
    throw formatPrismaError(error);
  }
};

export const restoreResident = async (residentId: string) => {
  try {
    const resident = await prisma.residentProfile.findUnique({
      where: { id: residentId },
      include: {
        user: true,
      },
    });

    if (!resident) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Resident not found");
    }

    if (!resident.deletedAt) {
      throw new HttpException(HttpStatus.BAD_REQUEST, "Resident is not archived");
    }

    // Restore resident and user
    await prisma.$transaction([
      prisma.residentProfile.update({
        where: { id: residentId },
        data: { deletedAt: null },
      }),
      prisma.user.update({
        where: { id: resident.userId },
        data: { deletedAt: null },
      }),
    ]);

    return { restored: true };
  } catch (error) {
    throw formatPrismaError(error);
  }
};

export const getDebtors = async () => {
  try {
    const debtorRefs: Array<{ residentProfileId: string | null }> = await prisma.payment.findMany({
      where: { status: "confirmed", balanceOwed: { gt: 0 } },
      select: { residentProfileId: true },
      distinct: ["residentProfileId"],
    });
    const ids = debtorRefs
      .map((d: { residentProfileId: string | null }) => d.residentProfileId)
      .filter((x: string | null): x is string => !!x);
    if (ids.length === 0) return [];
    const debtors = await prisma.residentProfile.findMany({
      where: { id: { in: ids }, deletedAt: null },
      include: { room: true, user: true }
    });
    return debtors.map((d) => toResidentDto(d as any));
  } catch (error) {
    throw formatPrismaError(error);
  }
};

export const getDebtorsForHostel = async (hostelId: string) => {
  try {
    const debtorRefs: Array<{ residentProfileId: string | null }> = await prisma.payment.findMany({
      where: { status: "confirmed", balanceOwed: { gt: 0 }, residentProfile: { room: { hostelId } } },
      select: { residentProfileId: true },
      distinct: ["residentProfileId"],
    });
    const ids = debtorRefs
      .map((d: { residentProfileId: string | null }) => d.residentProfileId)
      .filter((x: string | null): x is string => !!x);
    if (ids.length === 0) return [];
    const debtors = await prisma.residentProfile.findMany({
      where: { id: { in: ids }, deletedAt: null },
      include: { room: true, user: true }
    });
    return debtors.map((d) => toResidentDto(d as any));
  } catch (error) {
    const err = error as ErrorResponse;
    throw new HttpException(
      err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      err.message || "Error fetching debtors",
    );
  }
};

export const getAllresidentsForHostel = async (hostelId: string) => {
  try {
    const residents = await prisma.residentProfile.findMany({
      where: {
        deletedAt: null,
        OR: [
          { room: { hostelId } },
          { hostelId },
        ],
      },
      include: { room: true, user: true },
    });
    return residents.map((r) => toResidentDto(r as any));
  } catch (error) {
    throw formatPrismaError(error);
  }
};

export const addResidentFromHostel = async (residentData: AdminResidentRequestDto) => {
  try {
    // Use adminResidentSchema which allows optional password
    const validateResident = adminResidentSchema.safeParse(residentData);
    if (!validateResident.success) {
      const errors = validateResident.error.issues.map(
        ({ message, path }) => `${path}: ${message}`,
      );
      throw new HttpException(HttpStatus.BAD_REQUEST, errors.join(". "));
    }

    // Generate a random password if not provided
    let password = residentData.password || "";
    let shouldSendEmail = false;

    if (!password || password.trim() === "") {
      password = generateRandomPassword();
      shouldSendEmail = true;
    }

    // Create the resident with the password
    const result = await register({ ...residentData, password });

    // Send password setup email if password was auto-generated
    if (shouldSendEmail) {
      // Send email asynchronously, don't wait for it
      sendPasswordSetupEmail(residentData.email, password).catch((error) => {
        console.error("Failed to send password setup email:", error);
      });
    }

    return result;
  } catch (error) {
    throw formatPrismaError(error);
  }
};

export const assignRoomToResident = async (
  residentId: string,
  roomId: string,
) => {
  try {
    const resident = await prisma.residentProfile.findUnique({
      where: { id: residentId },
      include: { user: true },
    });
    if (!resident) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Resident not found.");
    }
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Room not found.");
    }
    if (room.gender !== "mix" && room.gender !== resident.user?.gender) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        `Room gender does not match resident's gender.`,
      );
    }
    if (resident.hostelId !== room.hostelId) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        `Resident and room do not belong to the same hostel.`,
      );
    }

    const currentResidentsCount = await prisma.residentProfile.count({
      where: { roomId: resident.roomId ?? undefined },
    });

    if (currentResidentsCount >= room.maxCap) {
      throw new HttpException(
        HttpStatus.CONFLICT,
        "Room has reached its maximum capacity.",
      );
    }

    const assignResident = await prisma.residentProfile.update({
      where: { id: residentId },
      data: { roomId },
      include: { room: true, user: true },
    });

    return toResidentDto(assignResident as any);
  } catch (error) {
    throw formatPrismaError(error);
  }
};

export const verifyResidentCode = async (code: string, hostelId?: string) => {
  const normalizedCode = code.trim().toUpperCase();

  const resident = await prisma.residentProfile.findFirst({
    where: {
      accessCode: {
        equals: normalizedCode,
        mode: "insensitive",
      },
      ...(hostelId ? {
        OR: [
          { hostelId },
          { room: { hostelId } },
        ],
      } : {}),
    },
    include: { room: { include: { hostel: true } }, user: true, hostel: true },
  });

  if (!resident) {
    throw new HttpException(HttpStatus.NOT_FOUND, "Invalid access code");
  }

  // Check expiry if set
  if (resident.accessCodeExpiry && new Date() > resident.accessCodeExpiry) {
    throw new HttpException(HttpStatus.BAD_REQUEST, "Access code has expired");
  }

  // Fetch payments to calculate financial summary
  const payments = await prisma.payment.findMany({
    where: { residentProfileId: resident.id },
    orderBy: { createdAt: "desc" },
  });

  // Calculate totals based on the latest confirmed payment
  const confirmedPayments = payments.filter((p) => p.status === "confirmed");
  const latestConfirmed = confirmedPayments[0]; // Ordered by createdAt desc

  const amountPaid = latestConfirmed?.amountPaid ?? 0;
  const balanceOwed = latestConfirmed?.balanceOwed ?? (resident.room?.price || 0);
  const roomPrice = resident.room?.price || 0;

  const residentDto = toResidentDto(resident as any);

  return {
    ...residentDto,
    amountPaid,
    roomPrice,
    balanceOwed,
  };
};

export const checkInResident = async (residentId: string) => {
  const resident = await prisma.residentProfile.findUnique({
    where: { id: residentId },
    include: { user: true, room: true },
  });

  if (!resident) {
    throw new HttpException(HttpStatus.NOT_FOUND, "Resident not found");
  }

  if (!resident.roomId) {
    throw new HttpException(HttpStatus.BAD_REQUEST, "Resident has no assigned room");
  }

  const updated = await prisma.residentProfile.update({
    where: { id: residentId },
    data: {
      status: "active",
      checkInDate: new Date(),
    },
    include: { room: true, user: true },
  });

  // Update room occupancy
  const currentCount = await prisma.residentProfile.count({
    where: { roomId: resident.roomId },
  });

  await prisma.room.update({
    where: { id: resident.roomId },
    data: {
      currentResidentCount: currentCount,
      status: currentCount > 0 ? "occupied" : "available",
    },
  });

  return toResidentDto(updated as any);
};

export const getResidentRoomDetails = async (userId: string) => {
  try {
    const resident = await prisma.residentProfile.findUnique({
      where: { userId },
      include: {
        room: {
          include: {
            amenities: true,
            hostel: {
              include: {
                hostelImages: true,
              },
            },
            roomImages: true,
          },
        },
      },
    });

    if (!resident) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Resident profile not found");
    }

    if (!resident.roomId) {
      return { resident, room: null, roommates: [] };
    }

    const roommates = await prisma.residentProfile.findMany({
      where: {
        roomId: resident.roomId,
        id: { not: resident.id }, // Exclude the resident themselves
        deletedAt: null, // Exclude archived residents
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            imageUrl: true,
          },
        },
      },
    });

    // Destructure to avoid returning the redundant room object inside resident
    const { room, ...residentData } = resident as any;

    return {
      resident: toResidentDto(residentData as any),
      room: room ? toRoomDto(room as any) : null,
      roommates: roommates.map((r) => toResidentDto(r as any)),
    };
  } catch (error) {
    throw formatPrismaError(error);
  }
};

export const createMaintenanceRequest = async (
  userId: string,
  requestData: CreateMaintenanceRequestDto,
) => {
  try {
    const validateRequest = createMaintenanceRequestSchema.safeParse(requestData);
    if (!validateRequest.success) {
      const errors = validateRequest.error.issues.map(
        ({ message, path }) => `${path}: ${message}`,
      );
      throw new HttpException(HttpStatus.BAD_REQUEST, errors.join(". "));
    }

    const resident = await prisma.residentProfile.findUnique({
      where: { userId },
    });

    if (!resident) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Resident profile not found");
    }

    if (!resident.hostelId) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        "Resident is not assigned to any hostel",
      );
    }

    const request = await prisma.maintenanceRequest.create({
      data: {
        residentId: resident.id,
        hostelId: resident.hostelId,
        type: requestData.type,
        subject: requestData.subject,
        description: requestData.description,
        priority: requestData.priority,
        images: requestData.images || [],
      },
    });

    const requestWithDetails = await prisma.maintenanceRequest.findUnique({
      where: { id: request.id },
      include: { resident: { include: { user: true, room: true } } },
    });

    return requestWithDetails ? toMaintenanceRequestDto(requestWithDetails as any) : null;
  } catch (error) {
    throw formatPrismaError(error);
  }
};

export const getResidentRequests = async (userId: string) => {
  try {
    const resident = await prisma.residentProfile.findUnique({
      where: { userId },
    });

    if (!resident) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Resident profile not found");
    }

    const requestsWithDetails = await prisma.maintenanceRequest.findMany({
      where: { residentId: resident.id },
      include: { resident: { include: { user: true, room: true } } },
      orderBy: { createdAt: "desc" },
    });

    return requestsWithDetails.map((req) => toMaintenanceRequestDto(req as any));
  } catch (error) {
    throw formatPrismaError(error);
  }
};

export const getResidentBilling = async (userId: string) => {
  try {
    const resident = await prisma.residentProfile.findUnique({
      where: { userId },
      include: {
        hostel: {
          include: {
            hostelImages: true,
          },
        },
        room: {
          include: {
            roomImages: true,
          },
        },
      },
    });

    if (!resident) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Resident profile not found");
    }

    const payments = await prisma.payment.findMany({
      where: { residentProfileId: resident.id },
      orderBy: { createdAt: "desc" },
      include: {
        calendarYear: {
          select: { name: true }
        },
        room: {
          select: { number: true, price: true }
        }
      }
    });

    // Calculate totals based on the latest confirmed payment
    const confirmedPayments = payments.filter(p => p.status === "confirmed");
    const latestConfirmed = confirmedPayments[0]; // Ordered by createdAt desc

    const totalAmountPaid = latestConfirmed?.amountPaid ?? 0;
    const balanceOwed = latestConfirmed?.balanceOwed ?? (resident.room?.price || 0);

    return {
      payments: payments.map((p) => toPaymentDto(p as any)),
      summary: {
        room: resident.room ? toRoomDto(resident.room as any) : null,
        roomNumber: resident.room?.number || "N/A",
        roomPrice: resident.room?.price || 0,
        totalAmountPaid,
        balanceOwed,
        allowPartialPayment: resident.hostel?.allowPartialPayment ?? false,
        hostelName: resident.hostel?.name || "N/A",
      }
    };

  } catch (error) {
    throw formatPrismaError(error);
  }
};

export const getResidentAnnouncements = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        residentProfile: true,
        adminProfile: true,
      },
    });

    if (!user) {
      throw new HttpException(HttpStatus.NOT_FOUND, "User not found");
    }

    const hostelId = user.residentProfile?.hostelId || user.adminProfile?.hostelId;

    if (!hostelId) {
      return []; // Return empty if not assigned to a hostel yet
    }

    const announcements = await prisma.announcement.findMany({
      where: { hostelId },
      orderBy: { createdAt: "desc" },
    });

    return announcements;
  } catch (error) {
    throw formatPrismaError(error);
  }
};

export const createFeedback = async (userId: string, data: CreateFeedbackDto) => {
  try {
    const validate = createFeedbackSchema.safeParse(data);
    if (!validate.success) {
      const errors = validate.error.issues.map(
        ({ message, path }) => `${path}: ${message}`,
      );
      throw new HttpException(HttpStatus.BAD_REQUEST, errors.join(". "));
    }

    const resident = await prisma.residentProfile.findUnique({
      where: { userId },
    });

    if (!resident || !resident.hostelId) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Resident profile or hostel not found");
    }

    const feedback = await prisma.feedback.create({
      data: {
        residentId: resident.id,
        hostelId: resident.hostelId,
        rating: data.rating,
        comment: data.comment,
        category: data.category,
      },
    });

    const feedbackWithDetails = await prisma.feedback.findUnique({
      where: { id: feedback.id },
      include: { resident: { include: { user: true } } },
    });

    return feedbackWithDetails ? toFeedbackDto(feedbackWithDetails as any) : null;
  } catch (error) {
    throw formatPrismaError(error);
  }
};

export const getAllocationDetails = async (userId: string) => {
  try {
    const resident = await prisma.residentProfile.findUnique({
      where: { userId },
      include: {
        user: true,
        hostel: {
          include: {
            hostelImages: true,
            calendarYears: {
              where: { isActive: true },
            },
          },
        },
        room: {
          include: {
            roomImages: true,
          },
        },
      },
    });

    if (!resident || !resident.hostel || !resident.room) {
      throw new HttpException(
        HttpStatus.NOT_FOUND,
        "Resident allocation records not found. Ensure you are assigned to a room.",
      );
    }

    // Get the active academic period name
    const academicPeriod = resident.hostel.calendarYears[0]?.name || "N/A";

    // Fetch the latest confirmed payment for financial status
    const latestPayment = await prisma.payment.findFirst({
      where: {
        residentProfileId: resident.id,
        status: "confirmed",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      residentName: resident.user.name,
      studentId: resident.studentId,
      course: resident.course,
      gender: resident.user.gender,
      academicPeriod,
      hostelName: resident.hostel.name,
      hostelAddress: resident.hostel.address,
      hostelEmail: resident.hostel.email,
      hostelPhone: resident.hostel.phone,
      hostelLogo: resident.hostel.logoUrl,
      room: resident.room,
      roomNumber: resident.room.number,
      roomType: resident.room.type,
      roomFloor: resident.room.floor,
      roomBlock: resident.room.block,
      roomPrice: resident.room.price,
      amountPaid: latestPayment?.amountPaid ?? 0,
      balanceOwed: latestPayment?.balanceOwed ?? resident.room.price,
      checkInDate: resident.checkInDate,
      checkOutDate: resident.checkOutDate,
      rulesUrl: resident.hostel.rulesUrl,
      issueDate: new Date(),
      hostelSignature: resident.hostel.signatureUrl,
      hostelStamp: resident.hostel.stampUrl,
    };
  } catch (error) {
    throw formatPrismaError(error);
  }
};

export const getPaymentReceiptData = async (userId: string, paymentId: string) => {
  try {
    const resident = await prisma.residentProfile.findUnique({
      where: { userId },
    });

    if (!resident) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Resident not found");
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        residentProfile: {
          include: {
            user: true,
            hostel: {
              include: {
                hostelImages: true,
              },
            },
            room: {
              include: {
                roomImages: true,
              },
            },
          },
        },
      },
    });

    if (!payment || payment.residentProfileId !== resident.id) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Payment record not found or unauthorized");
    }

    return {
      receiptNumber: payment.reference,
      date: payment.createdAt,
      residentName: payment.residentProfile?.user.name,
      amount: payment.amount,
      amountPaid: payment.amountPaid,
      balanceOwed: payment.balanceOwed,
      method: payment.method,
      hostelName: payment.residentProfile?.hostel?.name,
      room: payment.residentProfile?.room ? toRoomDto(payment.residentProfile.room as any) : null,
      roomNumber: payment.residentProfile?.room?.number,
      status: payment.status,
    };
  } catch (error) {
    throw formatPrismaError(error);
  }
};
