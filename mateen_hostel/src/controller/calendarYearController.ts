import { Request, Response } from "express";
import * as CalendarYearHelper from "../helper/calendarYearHelper"; // Import helper functions for calendar
import { HttpStatus } from "../utils/http-status";
import HttpException from "../utils/http-error";
import { formatPrismaError } from "../utils/formatPrisma";

// Start New Calendar Year
export const startNewCalendarController = async (req: Request, res: Response) => {
  const { hostelId, name } = req.body;

  try {
    await CalendarYearHelper.startNewCalendar(hostelId, name);

    res.status(HttpStatus.CREATED).json({
      message: "New calendar year started successfully",
    });
  } catch (error) {
    const err = formatPrismaError(error);
    res.status(err.status).json({ message: err.message });
  }
};
// Get current calendar year
export const getCurrentCalendarYearController = async (req: Request, res: Response) => {
    const { hostelId } = req.params;
  
    try {
      const currentYear = await CalendarYearHelper.getCurrentCalendarYear(hostelId);
  
      res.status(HttpStatus.OK).json({
        message: "Current calendar year fetched successfully",
        data: currentYear,
      });
    } catch (error) {
      const err = formatPrismaError(error);
      res.status(err.status).json({ message: err.message });
    }
  };
// Get historical calendar years
export const getHistoricalCalendarYearsController = async (req: Request, res: Response) => {
    const { hostelId } = req.params;
  
    try {
      const historicalYears = await CalendarYearHelper.getHistoricalCalendarYears(hostelId);
  
      res.status(HttpStatus.OK).json({
        message: "Historical calendar years fetched successfully",
        data: historicalYears,
      });
    } catch (error) {
      const err = formatPrismaError(error);
      res.status(err.status).json({ message: err.message });
    }
  };
// Get calendar year financial report
export const getCalendarYearFinancialReportController = async (req: Request, res: Response) => {
    const { calendarYearId } = req.params;
  
    try {
      const report = await CalendarYearHelper.getCalendarYearFinancialReport(calendarYearId);
  
      res.status(HttpStatus.OK).json({
        message: "Calendar year financial report fetched successfully",
        data: report,
      });
    } catch (error) {
      const err = formatPrismaError(error);
      res.status(err.status).json({ message: err.message });
    }
  };
// Update calendar year
export const updateCalendarYearController = async (req: Request, res: Response) => {
    const { calendarYearId } = req.params;
    const { name } = req.body;
  
    try {
      const updatedYear = await CalendarYearHelper.updateCalendarYear(calendarYearId, { name });
  
      res.status(HttpStatus.OK).json({
        message: "Calendar year updated successfully",
        data: updatedYear,
      });
    } catch (error) {
      const err = formatPrismaError(error);
      res.status(err.status).json({ message: err.message });
    }
  };
        

  export const deleteCalendarYearController = async (req: Request, res: Response) => {
    const { calendarYearId } = req.params; // Get calendar year ID from the URL
    const { hostelId } = req.body; // Get hostel ID from the request body (optional, can be part of the request params)

    try {
      const response = await CalendarYearHelper.deleteCalendarYear(calendarYearId, hostelId);

      res.status(HttpStatus.OK).json({
        message: response.message,
      });
    } catch (error) {
      const err = formatPrismaError(error);
      res.status(err.status).json({ message: err.message });
    }
  };

// End calendar year
export const endCalendarYearController = async (req: Request, res: Response) => {
  const { calendarYearId } = req.params;

  try {
    const endedYear = await CalendarYearHelper.endCalendarYear(calendarYearId);

    res.status(HttpStatus.OK).json({
      message: "Calendar year ended successfully",
      data: endedYear,
    });
  } catch (error) {
    const err = formatPrismaError(error);
    res.status(err.status).json({ message: err.message });
  }
};
  