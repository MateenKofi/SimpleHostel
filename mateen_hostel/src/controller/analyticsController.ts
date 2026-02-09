import { Request, Response } from "express";
import * as analyticsHelper from "../helper/analyticsHelper";
import { HttpStatus } from "../utils/http-status";
import { formatPrismaError } from "../utils/formatPrisma";
import HttpException from "../utils/http-error";

interface RequestUser {
  readonly id: string;
  readonly role: string;
  readonly hostelId?: string;
}

interface AccessPayload {
  readonly requester: RequestUser;
  readonly hostelId: string | null;
  readonly residentUserId: string;
}

function ensureResidentDashboardAccess({
  requester,
  hostelId,
  residentUserId,
}: AccessPayload): void {
  const { role, id, hostelId: requesterHostelId } = requester;

  if (role === "super_admin") {
    return;
  }

  if (role === "admin" || role === "staff") {
    if (!hostelId || requesterHostelId !== hostelId) {
      throw new HttpException(HttpStatus.FORBIDDEN, "Access denied for this resident");
    }
    return;
  }

  if (role === "resident") {
    if (residentUserId !== id) {
      throw new HttpException(HttpStatus.FORBIDDEN, "You can only view your own analytics");
    }
    return;
  }

  throw new HttpException(HttpStatus.FORBIDDEN, "Role not permitted");
}





export const getHostelAnalytics = async (req: Request, res: Response) => {
  try {
    const { hostelId } = req.params;
    const analytics = await analyticsHelper.generateHostelAnalytics(hostelId);

    res.status(HttpStatus.OK).json({
      message: "Hostel analytics generated successfully",
      data: analytics,
    });
  } catch (error) {
    const err = formatPrismaError(error);
    res.status(err.status).json({ message: err.message });
  }
};

export const getSystemAnalytics = async (req: Request, res: Response) => {
  try {
    const analytics = await analyticsHelper.generateSystemAnalytics();

    res.status(HttpStatus.OK).json({
      message: "System analytics generated successfully",
      data: analytics,
    });
  } catch (error) {
    const err = formatPrismaError(error);
    res.status(err.status).json({ message: err.message });
  }
};

export const getResidentAnalytics = async (req: Request, res: Response) => {
  try {
    const { hostelId } = req.params;
    const analytics = await analyticsHelper.generateResidentAnalytics(hostelId);

    res.status(HttpStatus.OK).json({
      message: "Resident analytics generated successfully",
      data: analytics,
    });
  } catch (error) {
    const err = formatPrismaError(error);
    res.status(err.status).json({ message: err.message });
  }
};

export const getResidentDashboardAnalytics = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const requester = req.user as RequestUser | undefined;

    if (!requester) {
      throw new HttpException(HttpStatus.UNAUTHORIZED, "Authentication required");
    }

    const analytics = await analyticsHelper.generateResidentDashboardAnalytics(userId);

    ensureResidentDashboardAccess({
      requester,
      hostelId: analytics.hostelId,
      residentUserId: analytics.userId,
    });

    res.status(HttpStatus.OK).json({
      message: "Resident dashboard analytics generated successfully",
      data: analytics,
    });
  } catch (error) {
    const err = formatPrismaError(error);
    res.status(err.status).json({ message: err.message });
  }
};

export const getHostelDisbursementSummaryController = async (
  req: Request,
  res: Response,
) => {
  try {
    const summary = await analyticsHelper.getHostelDisbursementSummary();
    res.status(HttpStatus.OK).json({
      message: "Hostel disbursement summary generated successfully",
      data: summary,
    });
  } catch (error) {
    const err = formatPrismaError(error);
    res.status(err.status).json({ message: err.message });
  }
};

// Generate Calendar Year Report
export const generateCalendarYearReportController = async (
  req: Request,
  res: Response,
) => {
  const { hostelId, calendarYearId } = req.params;

  try {
    const report = await analyticsHelper.generateCalendarYearReport(
      hostelId,
      calendarYearId,
    );

    res.status(HttpStatus.OK).json({
      message: "Calendar year report generated successfully",
      data: report,
    });
  } catch (error) {
    const err = formatPrismaError(error);
    res.status(err.status).json({ message: err.message });
  }
};
