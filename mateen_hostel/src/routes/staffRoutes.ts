import { Router } from "express";
import * as StaffController from "../controller/staffController"; // Adjust the path as necessary
import { validatePayload } from "../middleware/validate-payload"; // Assuming you have validation middleware
import upload from "../utils/multer";
import { authenticateJWT, authorizeRole } from "../utils/jsonwebtoken";
import { validateHostelAccess } from "../utils/AccessControl";

const StaffRouter = Router();

// Add a new Staff (POST request)
StaffRouter.post(
  "/add",
  authenticateJWT, // Ensure user is authenticated first
  authorizeRole(["super_admin", "admin"]), // Ensure user has required roles
  upload.single("photo"), // Process file upload AFTER validation
  validateHostelAccess, // Ensure user has access to the hostel
  validatePayload("Staff"), // ✅ Validate payload before file upload
  StaffController.addStaffController // Proceed to controller
);


// Get all Staffs (GET request)
StaffRouter.get(
  "/get",
  authenticateJWT,
  authorizeRole(["super_admin"]),
  validateHostelAccess,

  StaffController.getAllStaffsController
);

// Get a specific Staff by ID (GET request)
StaffRouter.get(
  "/get/:staffId",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,

  StaffController.getStaffByIdController
);

// Update a Staff by ID (PUT request)
StaffRouter.put(
  "/update/:staffId",
  validatePayload("Staff"),
  upload.single("photo"),
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,
   // Optional: Assuming you have a validation schema for updating a Staff
  StaffController.updateStaffController
);

// Delete a Staff by ID (DELETE request)
StaffRouter.delete(
  "/delete/:staffId",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,

  StaffController.deleteStaffController
);

StaffRouter.get(
  "/get/hostel/:hostelId",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,

  StaffController.staffForHostel
);

export default StaffRouter;
