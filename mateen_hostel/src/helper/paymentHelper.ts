import { Prisma, PaymentMethod } from "@prisma/client";
import prisma from "../utils/prisma";
import { HttpStatus } from "../utils/http-status";
import HttpException from "../utils/http-error";
import { formatPrismaError } from "../utils/formatPrisma";
import { toPaymentDto } from "../utils/dto";
// Note: Avoid importing generated model types directly to keep this file decoupled from generation timing
import paystack from "../utils/paystack";
import { sendBookingSuccessEmail, sendTopUpSuccessEmail, sendAccessCodeEmail } from "./emailHelper";
import { generateAccessCode } from "./residentHelper";
// import Decimal from "decimal.js";


interface OrphanedPaymentResolution {
  paymentId: string;
  resolution:
  | "linked_to_historical"
  | "linked_to_resident"
  | "marked_invalid"
  | "deleted";
  details: string;
}

interface PaymentRecord {
  id: string;
  amount: number;
  method: string | null;
  status: string | null;
  reference: string;
  residentProfileId: string | null;
  roomId: string | null;
  calendarYearId: string;
  historicalResidentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  amountPaid?: number | null;
  balanceOwed?: number | null;
}
// Payment Processing Functions

export const initializePayment = async (
  roomId: string,
  residentId: string,
  initialPayment: number,
) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const residentProfile = await tx.residentProfile.findUnique({
        where: { id: residentId },
        include: { user: true },
      });
      if (!residentProfile || !residentProfile.user?.email) {
        throw new HttpException(
          HttpStatus.BAD_REQUEST,
          "Resident profile with a valid email is required before initializing payment. Please ensure the resident profile exists and has a valid email address.",
        );
      }

      const room = await tx.room.findUnique({
        where: { id: roomId },
        include: { hostel: true },
      });

      if (!room) {
        throw new HttpException(HttpStatus.NOT_FOUND, "Room not found");
      }

      const activeCalendar = await tx.calendarYear.findFirst({
        where: { isActive: true, hostelId: room.hostelId },
      });

      if (!activeCalendar) {
        throw new HttpException(
          HttpStatus.BAD_REQUEST,
          "No active calendar year found",
        );
      }

      const paymentResponse = await paystack.initializeTransaction(
        residentProfile.user.email,
        initialPayment,
      );

      await tx.payment.create({
        data: {
          amount: initialPayment,
          residentProfileId: residentId,
          roomId,
          status: "pending",
          reference: paymentResponse.data.reference,
          method: paymentResponse.data.payment_method,
          calendarYearId: activeCalendar.id,
        },
      });

      return {
        authorizationUrl: paymentResponse.data.authorization_url,
        reference: paymentResponse.data.reference,
      };
    });
  } catch (error) {
    console.error("Error initializing payment:", error);
    throw formatPrismaError(error);
  }
};

export const confirmPayment = async (reference: string): Promise<{ payment: PaymentRecord } | { message: string }> => {
  try {
    const verificationResponse = await paystack.verifyTransaction(reference);
    if (verificationResponse.data.status !== "success") {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        "Payment verification failed.",
      );
    }

    const paymentRecord = await prisma.payment.findUnique({
      where: { reference },
      include: { residentProfile: true, historicalResident: true },
    });

    if (!paymentRecord) {
      throw new HttpException(
        HttpStatus.NOT_FOUND,
        "Payment record not found.",
      );
    }

    const { roomId, residentProfileId, historicalResidentId } = paymentRecord as {
      roomId: string | null;
      residentProfileId: string | null;
      historicalResidentId: string | null;
      amount: number;
      id: string;
    };

    if (!roomId) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        "Room ID is missing in the payment record.",
      );
    }

    if (!residentProfileId && !historicalResidentId) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        "Payment must have either a residentProfileId or historicalResidentId.",
      );
    }

    if (paymentRecord.status === "confirmed") {
      return { message: "Payment already confirmed." };
    }

    if (historicalResidentId) {
      await prisma.payment.update({
        where: { id: paymentRecord.id },
        data: {
          status: "confirmed",
          method: verificationResponse.data.channel as PaymentMethod,
        },
      });
      return { message: "Payment confirmed for historical resident." };
    }

    const result = await prisma.$transaction(async (tx) => {
      const room = await tx.room.findUnique({
        where: { id: roomId },
        include: { hostel: true },
      });
      if (!room) {
        throw new HttpException(HttpStatus.NOT_FOUND, "Room not found.");
      }

      const residentProfile = await tx.residentProfile.findUnique({
        where: { id: residentProfileId! },
        include: { room: true, user: true },
      });
      if (!residentProfile) {
        throw new HttpException(HttpStatus.NOT_FOUND, "Resident profile not found.");
      }

      // Sum previously confirmed payments for this resident profile
      const priorPayments = await tx.payment.findMany({
        where: {
          residentProfileId: residentProfileId!,
          status: "confirmed",
          calendarYearId: paymentRecord.calendarYearId,
        },
        select: { amount: true },
      });
      const prevTotal = priorPayments.reduce(
        (sum: number, p: { amount: number | null }) => sum + (p.amount ?? 0),
        0,
      );
      const totalPaid = Number((prevTotal + paymentRecord.amount).toFixed(2));
      const roomPrice = room.price;
      const debt = roomPrice - totalPaid;
      let balanceOwed: number | null = null;

      if (debt > 0) {
        const paymentPercentage = Number(((totalPaid / roomPrice) * 100).toFixed(2));
        const hostelThreshold = room.hostel.partialPaymentPercentage ?? 70;
        if (paymentPercentage >= hostelThreshold) {
          balanceOwed = Number(debt.toFixed(2));
        }
      }

      // Assign room and hostel to resident profile
      const accessCode = generateAccessCode();

      await tx.residentProfile.update({
        where: { id: residentProfileId! },
        data: {
          roomId,
          hostelId: room.hostelId,
          accessCode,
        },
      });

      // Update User record with hostelId
      await tx.user.update({
        where: { id: residentProfile.userId },
        data: { hostelId: room.hostelId },
      });

      const updatedPayment = await tx.payment.update({
        where: { id: paymentRecord.id },
        data: {
          status: "confirmed",
          method: verificationResponse.data.channel as PaymentMethod,
          amountPaid: Number(totalPaid.toFixed(2)),
          balanceOwed: balanceOwed ?? 0,
        },
      });

      const currentResidentsCount = await tx.residentProfile.count({ where: { roomId } });

      const updatedRoom = await tx.room.update({
        where: { id: roomId },
        data: { currentResidentCount: currentResidentsCount },
      });

      if (updatedRoom.currentResidentCount >= updatedRoom.maxCap) {
        await tx.room.update({
          where: { id: roomId },
          data: { status: "occupied" },
        });
      }

      return {
        payment: toPaymentDto(updatedPayment as any),
        residentEmail: residentProfile.user.email,
        residentName: residentProfile.user.name,
        hostelName: room.hostel.name,
        roomNumber: room.number,
        checkInDate: residentProfile.checkInDate,
        accessCode,
      };
    });

    if ("payment" in result && (result as any).residentEmail) {
      const data = result as any;
      sendBookingSuccessEmail(data.residentEmail, {
        residentName: data.residentName,
        studentId: paymentRecord.residentProfile?.studentId || "",
        hostelName: data.hostelName,
        roomNumber: data.roomNumber,
        amountPaid: data.payment.amountPaid,
        balanceOwed: data.payment.balanceOwed,
        reference: data.payment.reference,
        checkInDate: data.checkInDate?.toISOString() || new Date().toISOString(),
      });

      // Send access code email
      if (data.accessCode) {
        sendAccessCodeEmail(data.residentEmail, {
          residentName: data.residentName,
          accessCode: data.accessCode,
          roomNumber: data.roomNumber,
          hostelName: data.hostelName,
        }).catch((error) => {
          console.error("Failed to send access code email:", error);
        });
      }
    }

    return result;
  } catch (error) {
    console.error("Error confirming payment:", error);
    throw formatPrismaError(error);
  }
};

export const initializeTopUpPayment = async (
  roomId: string,
  residentId: string,
  initialPayment: number,
): Promise<string> => {
  try {
    return await prisma.$transaction(async (tx) => {
      const room = await tx.room.findUnique({
        where: { id: roomId },
        include: { hostel: true },
      });

      if (!room) {
        throw new HttpException(HttpStatus.NOT_FOUND, "Room not found.");
      }

      const activeCalendar = await tx.calendarYear.findFirst({
        where: { isActive: true, hostelId: room.hostelId },
      });

      if (!activeCalendar) {
        throw new HttpException(
          HttpStatus.BAD_REQUEST,
          "No active calendar year found.",
        );
      }

      const residentProfile = await tx.residentProfile.findUnique({
        where: { id: residentId },
        include: { user: true },
      });
      // Compute current debt based on prior confirmed payments
      const priorPayments = await tx.payment.findMany({
        where: { residentProfileId: residentId, status: "confirmed" },
        select: { amount: true },
      });
      const prevTotal = priorPayments.reduce(
        (sum: number, p: { amount: number | null }) => sum + (p.amount ?? 0),
        0,
      );
      const roomPrice = room.price;
      const debtbal = roomPrice - prevTotal;

      if (initialPayment > debtbal) {
        throw new HttpException(
          HttpStatus.BAD_REQUEST,
          "Amount you want to pay must be less than or equal to what you owe.",
        );
      }

      if (!residentProfile || !residentProfile.user?.email) {
        throw new HttpException(
          HttpStatus.BAD_REQUEST,
          "Resident profile with a valid email is required before initializing payment. Please ensure the resident profile exists and has a valid email address.",
        );
      }

      const paymentResponse = await paystack.initializeTransaction(
        residentProfile.user.email,
        initialPayment,
      );

      await tx.payment.create({
        data: {
          amount: initialPayment,
          residentProfileId: residentId,
          roomId,
          status: "pending",
          reference: paymentResponse.data.reference,
          method: paymentResponse.data.channel,
          calendarYearId: activeCalendar.id,
        },
      });

      return paymentResponse.data.authorization_url;
    });
  } catch (error) {
    console.error("error initializing top up payment:", error);
    throw formatPrismaError(error);
  }
};

export const TopUpPayment = async (reference: string): Promise<{ payment: PaymentRecord } | { message: string }> => {
  try {
    // Verify transaction with Paystack
    const verificationResponse = await paystack.verifyTransaction(reference);
    if (verificationResponse.data.status !== "success") {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        "Payment verification failed.",
      );
    }

    // Fetch payment record
    const paymentRecord = await prisma.payment.findUnique({
      where: { reference },
      include: { residentProfile: true, historicalResident: true },
    });

    if (!paymentRecord) {
      throw new HttpException(
        HttpStatus.NOT_FOUND,
        "Payment record not found.",
      );
    }

    const { roomId, residentProfileId, historicalResidentId } = paymentRecord as { roomId: string | null; residentProfileId: string | null; historicalResidentId: string | null };

    if (!roomId) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        "Room ID is missing in the payment record.",
      );
    }

    if (!residentProfileId && !historicalResidentId) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        "Payment must have either a residentProfileId or historicalResidentId.",
      );
    }

    if (paymentRecord.status === "confirmed") {
      return { message: "Payment already confirmed." };
    }

    // Handle historical resident separately
    if (historicalResidentId) {
      await prisma.payment.update({
        where: { id: paymentRecord.id },
        data: {
          status: "confirmed",
          method: verificationResponse.data.channel as PaymentMethod,
        },
      });
      return { message: "Top-up payment confirmed for historical resident." };
    }

    // Transaction for current resident update
    const result = await prisma.$transaction(async (tx) => {
      const room = await tx.room.findUnique({ where: { id: roomId! }, include: { hostel: true } });
      if (!room) {
        throw new HttpException(HttpStatus.NOT_FOUND, "Room not found.");
      }
      const residentProfile = await tx.residentProfile.findUnique({
        where: { id: residentProfileId! },
        include: { user: true },
      });

      const priorPayments = await tx.payment.findMany({
        where: {
          residentProfileId: residentProfileId!,
          status: "confirmed",
          calendarYearId: paymentRecord.calendarYearId,
        },
        select: { amount: true },
      });
      const prevTotal = priorPayments.reduce(
        (sum: number, p: { amount: number | null }) => sum + (p.amount ?? 0),
        0,
      );
      const roomPrice = room.price;
      const totalPaid = Number((prevTotal + paymentRecord.amount).toFixed(2));
      const debt = roomPrice - totalPaid;
      let balanceOwed: number | null = null;

      if (debt > 0) {
        const paymentPercentage = Number(((totalPaid / roomPrice) * 100).toFixed(2));
        const hostelThreshold = room.hostel.partialPaymentPercentage ?? 70;
        if (paymentPercentage >= hostelThreshold) {
          balanceOwed = Number(debt.toFixed(2));
        }
      }

      // Update payment record
      const updatedPayment = await tx.payment.update({
        where: { id: paymentRecord.id },
        data: {
          status: "confirmed",
          method: verificationResponse.data.channel as PaymentMethod,
          amountPaid: Number(totalPaid.toFixed(2)),
          balanceOwed: balanceOwed ?? 0,
        },
      });

      return {
        payment: toPaymentDto(updatedPayment as any),
        residentEmail: residentProfile?.user.email,
        residentName: residentProfile?.user.name,
        hostelName: room.hostel.name,
      };
    });

    if ("payment" in result && (result as any).residentEmail) {
      const data = result as any;
      sendTopUpSuccessEmail(data.residentEmail, {
        residentName: data.residentName,
        amountPaid: data.payment.amountPaid,
        balanceOwed: data.payment.balanceOwed,
        reference: data.payment.reference,
        hostelName: data.hostelName,
      });
    }

    return result;
  } catch (error) {
    console.error("Update Hostel Error:", error);
    throw formatPrismaError(error);
  }
};

export const getAllPayments = async (): Promise<PaymentRecord[]> => {
  try {
    const payments = await prisma.payment.findMany();
    return payments.map((p) => toPaymentDto(p as any));
  } catch (error) {
    console.error("error getting payments:", error);
    throw formatPrismaError(error);
  }
};

export const getPaymentsForHostel = async (hostelId: string): Promise<PaymentRecord[]> => {
  try {
    const payments = await prisma.payment.findMany({ where: { residentProfile: { room: { hostelId } } } });
    return payments.map((p) => toPaymentDto(p as any));
  } catch (error) {
    console.error("error getting payments for hostel:", error);
    throw formatPrismaError(error);
  }
};

export const getPaymentsById = async (paymentId: string): Promise<PaymentRecord> => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        room: {
          include: {
            hostel: true,
            roomImages: true,
          },
        },
        residentProfile: {
          include: {
            user: true,
          },
        },
        calendarYear: true,
      },
    });
    if (!payment) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Payment not found");
    }
    return toPaymentDto(payment as any);
  } catch (error) {
    console.error("error getting payment:", error);
    throw formatPrismaError(error);
  }
};

export const getPaymentsByReference = async (reference: string): Promise<PaymentRecord> => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { reference },
      include: {
        room: {
          include: {
            hostel: true,
          },
        },
        residentProfile: {
          include: {
            user: true,
          },
        },
        calendarYear: true,
      },
    });
    if (!payment) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Payment not found");
    }
    return toPaymentDto(payment as any);
  } catch (error) {
    console.error("error getting payment:", error);
    throw formatPrismaError(error);
  }
};

export const fixOrphanedPayments = async (): Promise<
  OrphanedPaymentResolution[]
> => {
  try {
    const orphanedPayments = await prisma.payment.findMany({
      where: {
        residentProfileId: null,
        historicalResidentId: null,
      },
      include: {
        room: {
          include: {
            residents: true,
            hostel: true,
            roomImages: true,
          },
        },
        calendarYear: true,
      },
    });

    const resolutions: OrphanedPaymentResolution[] = [];

    for (const payment of orphanedPayments) {
      try {
        await prisma.$transaction(async (tx) => {
          // Case 1: Payment has a room with a current resident
          if (payment.room?.residents?.[0]?.id) {
            await tx.payment.update({
              where: { id: payment.id },
              data: { residentProfileId: payment.room.residents[0].id },
            });
            resolutions.push({
              paymentId: payment.id,
              resolution: "linked_to_resident",
              details: `Linked to current resident ${payment.room.residents[0].id}`,
            });
            return;
          }

          // Case 2: Payment has a room and calendar year - try to find historical resident
          if (payment.roomId && payment.calendarYearId) {
            const historicalResident = await tx.historicalResident.findFirst({
              where: {
                roomId: payment.roomId,
                calendarYearId: payment.calendarYearId,
              },
            });

            if (historicalResident) {
              await tx.payment.update({
                where: { id: payment.id },
                data: { historicalResidentId: historicalResident.id },
              });
              resolutions.push({
                paymentId: payment.id,
                resolution: "linked_to_historical",
                details: `Linked to historical resident ${historicalResident.id}`,
              });
              return;
            }
          }

          // Case 3: Payment is older than 6 months and unverified
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

          if (payment.createdAt < sixMonthsAgo && payment.status === "pending") {
            await tx.payment.update({
              where: { id: payment.id },
              data: { status: "cancelled" },
            });
            resolutions.push({
              paymentId: payment.id,
              resolution: "marked_invalid",
              details: "Old unverified payment marked as invalid",
            });
            return;
          }

          // Case 4: Payment is a duplicate (same amount, room, calendar year, within 5 minutes)
          const possibleDuplicates = await tx.payment.findMany({
            where: {
              id: { not: payment.id },
              amount: payment.amount,
              roomId: payment.roomId,
              calendarYearId: payment.calendarYearId,
              createdAt: {
                gte: new Date(payment.createdAt.getTime() - 5 * 60000),
                lte: new Date(payment.createdAt.getTime() + 5 * 60000),
              },
            },
          });

          if (possibleDuplicates.length > 0) {
            await tx.payment.update({
              where: { id: payment.id },
              data: { status: "cancelled" },
            });
            resolutions.push({
              paymentId: payment.id,
              resolution: "deleted",
              details: "Identified as duplicate payment and marked as deleted",
            });
            return;
          }

          // Case 5: Cannot resolve - mark as invalid
          await tx.payment.update({
            where: { id: payment.id },
            data: { status: "cancelled" },
          });
        });
      } catch (error) {
        console.error("Error resolving orphaned payment:", error);
        resolutions.push({
          paymentId: payment.id,
          resolution: "marked_invalid",
          details: "Failed to resolve payment automatically",
        });
      }
    }

    return resolutions;
  } catch (error) {
    console.error("error fixing orphaned payments:", error);
    throw formatPrismaError(error);
  }
};
