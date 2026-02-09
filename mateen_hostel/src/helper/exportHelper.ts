import prisma from "../utils/prisma";
import HttpException from "../utils/http-error";
import { HttpStatus } from "../utils/http-status";
import { parse } from "json2csv";
import { formatPrismaError } from "../utils/formatPrisma";
export const amenitiesCsv = async (hostelId: string) => {
  try {
    const amenities = await prisma.amenities.findMany({
      where: {
        hostelId,
        hostel: { deletedAt: null },
      },
      include: {
        hostel: true,
        rooms: true,
      },
    });

    const modifiedAmenities = amenities.map((amenity) => ({
      ...amenity,
      rooms: amenity.rooms ?? [],
      deletedAt: undefined,
    }));

    // Convert the modified data into CSV
    const csv = parse(modifiedAmenities);
    return csv;
  } catch (error) {
    console.error("error getting amenities csv:", error);
    throw formatPrismaError(error);
  }
};
export const residentCsv = async (hostelId: string) => {
  try {
    const residents = await prisma.residentProfile.findMany({
      where: {
        OR: [{ hostelId }, { room: { hostelId } }],
      },
      include: {
        room: true,
        user: true,
      },
    });

    const modifiedAmenities = residents.map((resident) => ({
      ...resident,
      room: resident.room ?? null,
      user: resident.user ?? null,
      deletedAt: undefined,
    }));

    // Convert the modified data into CSV
    const csv = parse(modifiedAmenities);
    return csv;
  } catch (error) {
    console.error("error generating resident csv:", error);
    throw formatPrismaError(error);
  }
};
export const roomCsv = async (hostelId: string) => {
  try {
    const rooms = await prisma.room.findMany({
      where: {
        hostelId,
        deletedAt: null,
        hostel: { deletedAt: null },
      },
      include: {
        hostel: true,
      },
    });

    const modifiedRooms = rooms.map((room) => ({
      ...room,
      hostel: room.hostel ?? null,
      deletedAt: undefined,
    }));

    // Convert the modified data into CSV
    const csv = parse(modifiedRooms);
    return csv;
  } catch (error) {
    console.error("error generating room csv:", error);
    throw formatPrismaError(error);
  }
};
export const visitorCsv = async (hostelId: string) => {
  try {
    const visitors = await prisma.visitor.findMany({
      where: {
        resident: {
          OR: [{ hostelId }, { room: { hostelId } }],
        },
      },
      include: {
        resident: {
          include: {
            user: true,
            room: true,
          },
        },
      },
    });

    const modifiedVisitors = visitors.map((visitor) => ({
      ...visitor,
      resident: visitor.resident ?? null,
      deletedAt: undefined,
    }));

    // Convert the modified data into CSV
    const csv = parse(modifiedVisitors);
    return csv;
  } catch (error) {
    console.error("error generating visitors csv:", error);
    throw formatPrismaError(error);
  }
};
export const paymentCsv = async (hostelId: string) => {
  try {
    const payments = await prisma.payment.findMany({
      where: {
        deletedAt: null,
        OR: [
          { residentProfile: { hostelId } },
          { room: { hostelId } },
          { calendarYear: { hostelId } },
          { historicalResident: { room: { hostelId } } },
        ],
      },
      include: {
        residentProfile: {
          include: {
            user: true,
            room: true,
          },
        },
        room: true,
        calendarYear: true,
        historicalResident: {
          include: {
            room: true,
          },
        },
      },
    });

    const modifiedPayments = payments.map((payment) => ({
      ...payment,
      residentProfile: payment.residentProfile ?? null,
      deletedAt: undefined,
    }));

    // Convert the modified data into CSV
    const csv = parse(modifiedPayments);
    return csv;
  } catch (error) {
    console.error("error generating payments csv:", error);
    throw formatPrismaError(error);
  }
};
export const StaffCsv = async (hostelId: string) => {
  try {
    const staffProfiles = await prisma.staffProfile.findMany({
      where: {
        OR: [{ hostelId }, { hostel: { id: hostelId } }],
      },
      include: {
        hostel: true,
        user: true,
      },
    });
    const modifiedStaffs = staffProfiles.map((staff) => ({
      ...staff,
      hostel: staff.hostel ?? null,
      user: staff.user ?? null,
      deletedAt: undefined,
    }));

    // Convert the modified data into CSV
    const csv = parse(modifiedStaffs);
    return csv;
  } catch (error) {
    console.error("error generating staff csv:", error);
    throw formatPrismaError(error);
  }
};
