import { Router } from "express";
import * as visitorController from "../controller/visitorController"; // Assuming your controller file is named visitorController
import { authenticateJWT, authorizeRole } from "../utils/jsonwebtoken";
import { validateHostelAccess } from "../utils/AccessControl";
import { validatePayload } from "../middleware/validate-payload";

const visitorRouter = Router();

// Add a new visitor
visitorRouter.post(
  "/add",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validatePayload("Visitor"),
  validateHostelAccess,
  visitorController.addVisitorController
);

// Get all visitors
visitorRouter.get(
  "/get",
  authenticateJWT,
  authorizeRole(["super_admin",]),
  visitorController.getAllVisitorsController
);

// Get a visitor by ID
visitorRouter.get(
  "/get/:visitorId",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,

  visitorController.getVisitorByIdController
);

// Update a visitor's details
visitorRouter.put(
  "/update/:visitorId",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,

  visitorController.updateVisitorController
);

// Delete a visitor
visitorRouter.delete(
  "/delete/:visitorId",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,

  visitorController.deleteVisitorController
);

// Checkout a visitor
visitorRouter.put(
  "/checkout/:visitorId",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,

  visitorController.checkoutVisitorController
);
visitorRouter.get(
  "/hostel/:hostelId",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,
  visitorController.visitorForHostel
);

export default visitorRouter;
