import prisma from "../utils/prisma";
import HttpException from "../utils/http-error";
import { HttpStatus } from "../utils/http-status";
import { PaymentStatus, ResidentStatus, RoomStatus } from "@prisma/client";
import { formatPrismaError } from "../utils/formatPrisma";

export const startNewCalendar = async (hostelId: string, name: string) => {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.calendarYear.updateMany({
        where: { hostelId, isActive: true },
        data: { isActive: false, endDate: new Date() },
      });

      const newCalendarYear = await tx.calendarYear.create({
        data: {
          name,
          startDate: new Date(),
          endDate: null,
          isActive: true,
          hostelId,
        },
      });

      const residents = await tx.residentProfile.findMany({
        where: {
          roomId: { not: null },
          room: { hostelId },
        },
        include: {
          room: true,
          payments: {
            where: {
              deletedAt: null,
              status: { in: [PaymentStatus.confirmed] },
            },
          },
        },
      });

      for (const resident of residents) {
        if (!resident.roomId) continue;

        const totalPaid = resident.payments.reduce((sum, payment) => {
          const value = payment.amountPaid ?? payment.amount ?? 0;
          return sum + value;
        }, 0);

        const historicalResident = await tx.historicalResident.create({
          data: {
            residentId: resident.id,
            roomId: resident.roomId,
            calendarYearId: newCalendarYear.id,
            amountPaid: totalPaid,
            roomPrice: resident.room?.price ?? 0,
          },
        });

        await tx.payment.updateMany({
          where: { residentProfileId: resident.id },
          data: {
            residentProfileId: null,
            historicalResidentId: historicalResident.id,
          },
        });

        await tx.residentProfile.update({
          where: { id: resident.id },
          data: {
            roomId: null,
            status: ResidentStatus.checked_out,
          },
        });
      }

      await tx.room.updateMany({
        where: { hostelId },
        data: { status: RoomStatus.available, currentResidentCount: 0 },
      });
    });
  } catch (error) {
    console.error("Transaction failed with error:", error);
    throw formatPrismaError(error);
  }
};

// Get current calendar year
export const getCurrentCalendarYear = async (hostelId: string) => {
  try {
    const currentYear = await prisma.calendarYear.findFirst({
      where: {
        hostelId,
        isActive: true,
      },
      include: {
        residents: {
          include: {
            room: true,
            payments: true,
          },
        },
      },
    });

    if (!currentYear) {
      throw new HttpException(
        HttpStatus.NOT_FOUND,
        "No active calendar year found",
      );
    }

    return currentYear;
  } catch (error) {
    console.error("Error getting current calendar year:", error);
    throw formatPrismaError(error);
  }
};

// Get historical calendar years
export const getHistoricalCalendarYears = async (hostelId: string) => {
  try {
    const historicalYears = await prisma.calendarYear.findMany({
      where: {
        hostelId,
        isActive: false,
      },
      include: {
        historicalResidents: {
          include: {
            room: true,
          },
        },
      },
      orderBy: {
        startDate: "desc",
      },
    });

    return historicalYears;
  } catch (error) {
    console.error("Error getting historical calendar year:", error);
    throw formatPrismaError(error);
  }
};

// Get calendar year financial report
export const getCalendarYearFinancialReport = async (
  calendarYearId: string,
) => {
  try {
    const report = await prisma.calendarYear.findUnique({
      where: { id: calendarYearId },
      include: {
        historicalResidents: true,
      },
    });

    if (!report) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Calendar year not found");
    }

    const totalRevenue = report.historicalResidents.reduce(
      (sum, hist) => sum + hist.amountPaid,
      0,
    );

    return {
      totalRevenue,
      historicalResidents: report.historicalResidents.length,
      averageRevenuePerResident:
        report.historicalResidents.length > 0
          ? totalRevenue / report.historicalResidents.length
          : 0,
    };
  } catch (error) {
    console.error("Error getting  calendar financial year report:", error);
    throw formatPrismaError(error);
  }
};
// Update calendar year
export const updateCalendarYear = async (
  id: string,
  data: {
    name?: string;
  },
) => {
  try {
    const updatedYear = await prisma.calendarYear.update({
      where: { id },
      data,
      include: {
        residents: true,
        historicalResidents: true,
      },
    });

    return updatedYear;
  } catch (error) {
    console.error("Error updating  calendar year:", error);
    throw formatPrismaError(error);
  }
};

export const deleteCalendarYear = async (
  calendarYearId: string,
  hostelId: string,
) => {
  try {
    // Find the calendar year to delete
    const calendarYear = await prisma.calendarYear.findUnique({
      where: { id: calendarYearId },
      include: {
        residents: true,
      },
    });

    if (!calendarYear) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Calendar year not found");
    }

    if (calendarYear.isActive) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        "Cannot delete an active calendar year",
      );
    }

    // Begin transaction to handle the deletion
    await prisma.$transaction(async (tx) => {
      // Optionally, you can reset room statuses to AVAILABLE if needed
      await tx.room.updateMany({
        where: { hostelId },
        data: { status: RoomStatus.available },
      });

      // Delete the calendar year
      await tx.calendarYear.delete({
        where: { id: calendarYearId },
      });

      // Optionally, delete associated historical records (if necessary)
      await tx.historicalResident.deleteMany({
        where: { calendarYearId },
      });
    });

    return { message: "Calendar year deleted successfully" };
  } catch (error) {
    throw new HttpException(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Error deleting calendar year",
    );
  }
};

// End calendar year
export const endCalendarYear = async (calendarYearId: string) => {
  try {
    const calendarYear = await prisma.calendarYear.findUnique({
      where: { id: calendarYearId },
    });

    if (!calendarYear) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Calendar year not found");
    }

    if (!calendarYear.isActive) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        "Cannot end an already ended calendar year",
      );
    }

    const endedYear = await prisma.$transaction(async (tx) => {
      // Move all active residents to historical residents
      const residents = await tx.residentProfile.findMany({
        where: {
          roomId: { not: null },
          room: { hostelId: calendarYear.hostelId },
        },
        include: {
          room: true,
          payments: {
            where: {
              deletedAt: null,
              status: { in: [PaymentStatus.confirmed] },
              calendarYearId: calendarYearId,
            },
          },
        },
      });

      for (const resident of residents) {
        if (!resident.roomId) continue;

        const totalPaid = resident.payments.reduce((sum, payment) => {
          const value = payment.amountPaid ?? payment.amount ?? 0;
          return sum + value;
        }, 0);

        const historicalResident = await tx.historicalResident.create({
          data: {
            residentId: resident.id,
            roomId: resident.roomId,
            calendarYearId: calendarYearId,
            amountPaid: totalPaid,
            roomPrice: resident.room?.price ?? 0,
          },
        });

        await tx.payment.updateMany({
          where: { residentProfileId: resident.id },
          data: {
            residentProfileId: null,
            historicalResidentId: historicalResident.id,
          },
        });

        await tx.residentProfile.update({
          where: { id: resident.id },
          data: {
            roomId: null,
            status: ResidentStatus.checked_out,
          },
        });
      }

      // Reset all rooms in the hostel to available
      await tx.room.updateMany({
        where: {
          hostelId: calendarYear.hostelId,
        },
        data: { status: RoomStatus.available, currentResidentCount: 0 },
      });

      // End the calendar year
      return await tx.calendarYear.update({
        where: { id: calendarYearId },
        data: {
          isActive: false,
          endDate: new Date(),
        },
        include: {
          historicalResidents: true,
        },
      });
    });

    return endedYear;
  } catch (error) {
    console.error("Error ending calendar year:", error);
    throw formatPrismaError(error);
  }
};
