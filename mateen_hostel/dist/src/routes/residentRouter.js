"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const residentController_1 = require("../controller/residentController");
const jsonwebtoken_1 = require("../utils/jsonwebtoken");
const validate_payload_1 = require("../middleware/validate-payload");
const multer_1 = __importDefault(require("../utils/multer"));
const AccessControl_1 = require("../utils/AccessControl");
const residentRouter = (0, express_1.Router)();
// Define your specific routes first
residentRouter.get("/debtors", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin"]), residentController_1.getAlldebtors);
residentRouter.get("/room", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["resident"]), residentController_1.getResidentRoomDetailsController);
residentRouter.post("/requests", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["resident"]), multer_1.default.array("images", 5), residentController_1.createMaintenanceRequestController);
residentRouter.get("/requests", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["resident"]), residentController_1.getResidentRequestsController);
residentRouter.get("/billing", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["resident"]), residentController_1.getResidentBillingController);
residentRouter.get("/announcements", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["resident", "admin", "super_admin"]), residentController_1.getResidentAnnouncementsController);
residentRouter.post("/feedback", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["resident"]), residentController_1.createFeedbackController);
residentRouter.get("/allocation-details", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["resident"]), residentController_1.getAllocationLetterController);
residentRouter.get("/receipt/:paymentId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["resident"]), residentController_1.getPaymentReceiptController);
const rateLimit_1 = require("../middleware/rateLimit");
residentRouter.post("/register", rateLimit_1.authLimiter, residentController_1.registerResidentController);
residentRouter.post("/add", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), multer_1.default.none(), // Parse multipart/form-data without files
(0, validate_payload_1.validatePayload)("Resident"), AccessControl_1.validateHostelAccess, residentController_1.addResidentFromHostelController);
residentRouter.get("/get", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin"]), AccessControl_1.validateHostelAccess, residentController_1.getAllResidentsController);
residentRouter.get("/get/:residentId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), residentController_1.getResidentByIdController);
residentRouter.get("/email/:email", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), AccessControl_1.validateHostelAccess, residentController_1.getResidentByEmailController);
residentRouter.put("/update/:residentId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), AccessControl_1.validateHostelAccess, residentController_1.updateResidentController);
residentRouter.delete("/delete/:residentId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), AccessControl_1.validateHostelAccess, residentController_1.deleteResidentController);
residentRouter.post("/restore/:residentId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), AccessControl_1.validateHostelAccess, residentController_1.restoreResidentController);
residentRouter.get("/hostel/:hostelId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), AccessControl_1.validateHostelAccess, residentController_1.getAllresidentsForHostel);
residentRouter.get("/debtors/hostel/:hostelId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), AccessControl_1.validateHostelAccess, residentController_1.getDebtorsForHostel);
residentRouter.put("/assign/:residentId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), residentController_1.assignRoomToResidentController);
residentRouter.post("/verify", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), residentController_1.verifyResidentCodeController);
residentRouter.post("/:residentId/checkin", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), residentController_1.checkInResidentController);
// Catch-all route for getting resident by ID (must be last to avoid catching other routes)
residentRouter.get("/:residentId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), residentController_1.getResidentByIdController);
exports.default = residentRouter;
