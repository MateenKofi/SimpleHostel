import { Router } from "express";
import * as calendarYearController from "../controller/calendarYearController"; // Adjust path as necessary
import { authenticateJWT, authorizeRole } from "../utils/jsonwebtoken"; // Authentication middleware
import { validateHostelAccess } from "../utils/AccessControl"; // Hostel access validation middleware
import * as exportController from "../controller/exportController";
const exportRouter = Router();

// export residents
exportRouter.get(
  "/residents/:hostelId",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,
  exportController.exportResidentsCsv,
);
// export amenities
exportRouter.get(
  "/amenities/:hostelId",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,
  exportController.exportAmenitiesCsv,
);
// export rooms
exportRouter.get(
  "/rooms/:hostelId",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,
  exportController.exportRoomCsv,
);
// export visitor
exportRouter.get(
  "/visitors/:hostelId",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,
  exportController.exportVisitorCsv,
);
// export payments
exportRouter.get(
  "/payments/:hostelId",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,
  exportController.exportPaymentCsv,
);
// export stafss
exportRouter.get(
  "/staffs/:hostelId",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,
  exportController.exportStaffCsv,
);

export default exportRouter;
