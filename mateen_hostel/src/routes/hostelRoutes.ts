import { Router } from "express";
import * as hostelController from "../controller/hostelController"; // Adjust the path as necessary
import { validatePayload } from "../middleware/validate-payload"; // Assuming you have validation middleware
import upload from "../utils/multer";
import { verifyAndCreateHostelUser } from "../controller/userController";
import { authenticateJWT, authorizeRole } from "../utils/jsonwebtoken";
import { validateHostelAccess } from "../utils/AccessControl";

const hostelRoute = Router();

// Add a new hostel (POST request)
hostelRoute.post(
  "/add",
  validatePayload("Hostel"),
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "photos", maxCount: 10 },
  ]),
  hostelController.addHostelController,
);

// Get all hostels (GET request)
hostelRoute.get(
  "/get",

  hostelController.getAllHostelsController,
);
// get unverified hostels
hostelRoute.get(
  "/unverified",
  authenticateJWT,
  authorizeRole(["super_admin"]),
  hostelController.unverifiedHostel,
);

// Get a specific hostel by ID (GET request)
hostelRoute.get(
  "/get/:hostelId",
  authenticateJWT,
  authorizeRole(["super_admin", "admin", "resident"]),
  validateHostelAccess,
  hostelController.getHostelByIdController,
);

// Update a hostel by ID (PUT request)
hostelRoute.put(
  "/update/:hostelId",
  validatePayload("Hostel"),
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "photos", maxCount: 10 },
  ]),
  hostelController.updateHostelController,
);
// publish hostel
hostelRoute.put(
  "/publish/:hostelId",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,
  hostelController.publishHostel,
);

// unpublish hostel
hostelRoute.put(
  "/unpublish/:hostelId",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,
  hostelController.unPublishHostel,
);
// Delete a hostel by ID (DELETE request)
hostelRoute.delete(
  "/delete/:hostelId",
  authenticateJWT,
  authorizeRole(["super_admin"]),
  hostelController.deleteHostelController,
);

// Update hostel rules
hostelRoute.put(
  "/rules/:hostelId",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,
  upload.single("rules"),
  hostelController.updateHostelRulesController,
);

hostelRoute.put(
  "/payment-settings/:hostelId",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,
  validatePayload("paymentSettings"),
  hostelController.updatePaymentSettingsController,
);

hostelRoute.put(
  "/documents/:hostelId",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,
  upload.fields([
    { name: "signature", maxCount: 1 },
    { name: "stamp", maxCount: 1 },
  ]),
  hostelController.updateHostelDocumentsController,
);

hostelRoute.post(
  "/verify/:hostelId",
  authenticateJWT,
  authorizeRole(["super_admin"]),

  verifyAndCreateHostelUser,
);

export default hostelRoute;
