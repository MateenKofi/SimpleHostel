// In calendarYearRoutes.ts

import { Router } from "express";
import * as calendarYearController from "../controller/calendarYearController"; // Adjust path as necessary
import { validatePayload } from "../middleware/validate-payload"; // Assuming you have validation middleware
import { authenticateJWT, authorizeRole } from "../utils/jsonwebtoken"; // Authentication middleware
import { validateHostelAccess } from "../utils/AccessControl"; // Hostel access validation middleware

const calendarYearRoute = Router();

// Start a new calendar year (POST request)
calendarYearRoute.post(
  "/start",
  validatePayload("CalendarYear"), // Assuming you have a validation schema for calendar year data
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]), // Example roles, modify as per your requirements
  calendarYearController.startNewCalendarController
);

// Get the current calendar year (GET request)
calendarYearRoute.get(
  "/current/:hostelId",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess, // Assuming this is middleware to check access to the hostel
  calendarYearController.getCurrentCalendarYearController
);

// Get historical calendar years (GET request)
calendarYearRoute.get(
  "/historical/:hostelId",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,
  calendarYearController.getHistoricalCalendarYearsController
);

// Get calendar year financial report (GET request)
calendarYearRoute.get(
  "/financial-report/:calendarYearId",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,
  calendarYearController.getCalendarYearFinancialReportController
);

// Update calendar year details (PUT request)
calendarYearRoute.put(
  "/update/:calendarYearId",
  validatePayload("calendarYear"), // Assuming you have a validation schema for updating calendar year data
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,
  calendarYearController.updateCalendarYearController
);

// Delete a calendar year (DELETE request)
calendarYearRoute.delete(
  "/delete/:calendarYearId",
  authenticateJWT,
  authorizeRole(["super_admin"]),
  validateHostelAccess,
  calendarYearController.deleteCalendarYearController
);

// End a calendar year (PATCH request)
calendarYearRoute.patch(
  "/end/:calendarYearId",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,
  calendarYearController.endCalendarYearController
);

export default calendarYearRoute;
