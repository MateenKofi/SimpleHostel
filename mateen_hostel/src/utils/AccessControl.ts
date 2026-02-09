import { Request, Response, NextFunction } from "express";
import HttpException from "./http-error"; // Adjust the import path as needed
import { HttpStatus } from "./http-status"; // Adjust the import path as needed
import { UserPayload } from "./jsonwebtoken"; // Adjust the import path as needed

import prisma from "../utils/prisma"; // Import Prisma client

export const validateHostelAccess = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const user = req.user as UserPayload;

  // If the user is a super_admin, allow access to all data
  if (user.role === "super_admin") {
    return next();
  }

  if (user.role === "resident") {
    const { userId } = req.params;
    if (userId && userId === user.id) {
      return next();
    }
  }

  // Extract hostelId from the request (params, body, or query)
  let requestedHostelId =
    req.params.hostelId || req.body.hostelId || req.query.hostelId;

  // If hostelId is not provided directly, fetch it from the database
  if (!requestedHostelId) {
    const {
      roomId,
      residentId,
      paymentId,
      visitorId,
      staffId,
      amenityId,
      reference,
      userId,
      calendarYearId,
    } = req.params;

    if (roomId) {
      // Fetch hostelId from the room
      const room = await prisma.room.findUnique({
        where: { id: roomId },
        select: { hostelId: true },
      });
      requestedHostelId = room?.hostelId;
    } else if (residentId) {
      // Fetch hostelId from the resident profile's room
      const resident = await prisma.residentProfile.findUnique({
        where: { id: residentId },
        include: { room: { select: { hostelId: true } } },
      });
      requestedHostelId = resident?.room?.hostelId;
    } else if (paymentId) {
      // Fetch hostelId from the payment's resident's room
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: {
          historicalResident: {
            include: { room: { select: { hostelId: true } } },
          },
          residentProfile: {
            include: { room: { select: { hostelId: true } } },
          },
        },
      });
      requestedHostelId =
        payment?.residentProfile?.room?.hostelId ??
        payment?.historicalResident?.room?.hostelId;
    } else if (visitorId) {
      // Fetch hostelId from the visitor's resident's room
      const visitor = await prisma.visitor.findUnique({
        where: { id: visitorId },
        include: {
          resident: { include: { room: { select: { hostelId: true } } } },
        },
      });
      requestedHostelId = visitor?.resident.room?.hostelId;
    } else if (staffId) {
      // Fetch hostelId from the staff profile
      const staff = await prisma.staffProfile.findUnique({
        where: { id: staffId },
        select: { hostelId: true },
      });
      requestedHostelId = staff?.hostelId;
    } else if (amenityId) {
      // Fetch hostelId from the amenities
      const amenities = await prisma.amenities.findUnique({
        where: { id: amenityId },
        select: { hostelId: true },
      });
      requestedHostelId = amenities?.hostelId;
    } else if (userId) {
      // Derive hostelId from user's profile associations
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          adminProfile: { select: { hostelId: true } },
          staffProfile: { select: { hostelId: true } },
          residentProfile: { select: { hostelId: true } },
        },
      });
      requestedHostelId =
        user?.adminProfile?.hostelId ??
        user?.staffProfile?.hostelId ??
        user?.residentProfile?.hostelId;
    } else if (calendarYearId) {
      // Fetch hostelId from the amenities
      const calender = await prisma.calendarYear.findUnique({
        where: { id: calendarYearId },
        select: { hostelId: true },
      });
      requestedHostelId = calender?.hostelId;
    } else if (reference) {
      // Fetch hostelId from the reference
      const payment = await prisma.payment.findUnique({
        where: { reference },
        include: {
          historicalResident: {
            include: { room: { select: { hostelId: true } } },
          },
          residentProfile: {
            include: {
              room: {
                select: {
                  hostelId: true, // Only selecting hostelId from the room
                },
              },
            },
          },
        },
      });

      requestedHostelId =
        payment?.residentProfile?.room?.hostelId ??
        payment?.historicalResident?.room?.hostelId;
    }
  }

  // If no hostelId is found, deny access
  if (!requestedHostelId) {
    return next(
      new HttpException(HttpStatus.BAD_REQUEST, "Hostel ID is required"),
    );
  }

  // Check if the user's hostelId matches the requested hostelId
  if (user.hostelId !== requestedHostelId) {
    return next(
      new HttpException(
        HttpStatus.FORBIDDEN,
        "Access to this hostel is denied",
      ),
    );
  }

  // If everything is fine, proceed to the next middleware or route handler
  next();
};
