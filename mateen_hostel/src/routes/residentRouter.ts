import { Router } from "express";
import {
  getAllResidentsController,
  getAlldebtors,
  getResidentByEmailController,
  getResidentByIdController,
  updateResidentController,
  registerResidentController,
  deleteResidentController,
  getAllresidentsForHostel,
  getDebtorsForHostel,
  addResidentFromHostelController,
  assignRoomToResidentController,
  verifyResidentCodeController,
  checkInResidentController,
  getResidentRoomDetailsController,
  createMaintenanceRequestController,
  getResidentRequestsController,
  getResidentBillingController,
  getResidentAnnouncementsController,
  createFeedbackController,
  getAllocationLetterController,
  getPaymentReceiptController,
} from "../controller/residentController";
import { authenticateJWT, authorizeRole } from "../utils/jsonwebtoken";
import { validatePayload } from "../middleware/validate-payload";
import upload from "../utils/multer";
import { validateHostelAccess } from "../utils/AccessControl";

const residentRouter = Router();

// Define your specific routes first
residentRouter.get(
  "/debtors",
  authenticateJWT,
  authorizeRole(["super_admin"]),
  getAlldebtors,
);

residentRouter.get(
  "/room",
  authenticateJWT,
  authorizeRole(["resident"]),
  getResidentRoomDetailsController,
);

residentRouter.post(
  "/requests",
  authenticateJWT,
  authorizeRole(["resident"]),
  upload.array("images", 5),
  createMaintenanceRequestController,
);

residentRouter.get(
  "/requests",
  authenticateJWT,
  authorizeRole(["resident"]),
  getResidentRequestsController,
);



residentRouter.get(
  "/billing",
  authenticateJWT,
  authorizeRole(["resident"]),
  getResidentBillingController,
);

residentRouter.get(
  "/announcements",
  authenticateJWT,
  authorizeRole(["resident", "admin", "super_admin"]),
  getResidentAnnouncementsController,
);

residentRouter.post(
  "/feedback",
  authenticateJWT,
  authorizeRole(["resident"]),
  createFeedbackController,
);

residentRouter.get(
  "/allocation-details",
  authenticateJWT,
  authorizeRole(["resident"]),
  getAllocationLetterController,
);

residentRouter.get(
  "/receipt/:paymentId",
  authenticateJWT,
  authorizeRole(["resident"]),
  getPaymentReceiptController,
);

import { authLimiter } from "../middleware/rateLimit";

residentRouter.post("/register", authLimiter, registerResidentController);
residentRouter.post(
  "/add",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validatePayload("Resident"),
  validateHostelAccess,
  addResidentFromHostelController,
);
residentRouter.get(
  "/get",
  authenticateJWT,
  authorizeRole(["super_admin"]),
  validateHostelAccess,
  getAllResidentsController,
);

residentRouter.get(
  "/get/:residentId",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  getResidentByIdController,
);

residentRouter.get(
  "/email/:email",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,
  getResidentByEmailController,
);

residentRouter.put(
  "/update/:residentId",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,
  updateResidentController,
);

residentRouter.delete(
  "/delete/:residentId",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,
  deleteResidentController,
);

residentRouter.get(
  "/hostel/:hostelId",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,
  getAllresidentsForHostel,
);

residentRouter.get(
  "/debtors/hostel/:hostelId",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,
  getDebtorsForHostel,
);

residentRouter.put(
  "/assign/:residentId",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  assignRoomToResidentController,
);

residentRouter.post(
  "/verify",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  verifyResidentCodeController,
);

residentRouter.post(
  "/:residentId/checkin",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  checkInResidentController,
);

// Catch-all route for getting resident by ID (must be last to avoid catching other routes)
residentRouter.get(
  "/:residentId",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  getResidentByIdController,
);

export default residentRouter;
