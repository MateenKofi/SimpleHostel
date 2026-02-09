import { Router } from "express";
import {
    createHostelServiceController,
    getHostelServicesController,
    bookServiceController,
    getResidentBookingsController,
} from "../controller/serviceController";
import { authenticateJWT, authorizeRole } from "../utils/jsonwebtoken";
import { validateHostelAccess } from "../utils/AccessControl";

const serviceRouter = Router();

// Admin routes
serviceRouter.post(
    "/create",
    authenticateJWT,
    authorizeRole(["admin", "super_admin"]),
    createHostelServiceController,
);

// Public/Resident routes
serviceRouter.get(
    "/list/:hostelId?",
    authenticateJWT,
    getHostelServicesController,
);

// Resident Booking routes
serviceRouter.post(
    "/book",
    authenticateJWT,
    authorizeRole(["resident"]),
    bookServiceController,
);

serviceRouter.get(
    "/bookings",
    authenticateJWT,
    authorizeRole(["resident"]),
    getResidentBookingsController,
);

export default serviceRouter;
