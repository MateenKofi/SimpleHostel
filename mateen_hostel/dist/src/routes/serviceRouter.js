"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const serviceController_1 = require("../controller/serviceController");
const jsonwebtoken_1 = require("../utils/jsonwebtoken");
const serviceRouter = (0, express_1.Router)();
// Admin routes
serviceRouter.post("/create", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["admin", "super_admin"]), serviceController_1.createHostelServiceController);
// Public/Resident routes
serviceRouter.get("/list/:hostelId?", jsonwebtoken_1.authenticateJWT, serviceController_1.getHostelServicesController);
// Resident Booking routes
serviceRouter.post("/book", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["resident"]), serviceController_1.bookServiceController);
serviceRouter.get("/bookings", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["resident"]), serviceController_1.getResidentBookingsController);
exports.default = serviceRouter;
