"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hostelController = __importStar(require("../controller/hostelController")); // Adjust the path as necessary
const validate_payload_1 = require("../middleware/validate-payload"); // Assuming you have validation middleware
const multer_1 = __importDefault(require("../utils/multer"));
const userController_1 = require("../controller/userController");
const jsonwebtoken_1 = require("../utils/jsonwebtoken");
const AccessControl_1 = require("../utils/AccessControl");
const hostelRoute = (0, express_1.Router)();
// Add a new hostel (POST request)
hostelRoute.post("/add", (0, validate_payload_1.validatePayload)("Hostel"), multer_1.default.fields([
    { name: "logo", maxCount: 1 },
    { name: "photos", maxCount: 10 },
]), hostelController.addHostelController);
// Get all hostels (GET request)
hostelRoute.get("/get", hostelController.getAllHostelsController);
// get unverified hostels
hostelRoute.get("/unverified", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin"]), hostelController.unverifiedHostel);
// Get a specific hostel by ID (GET request)
hostelRoute.get("/get/:hostelId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin", "resident"]), AccessControl_1.validateHostelAccess, hostelController.getHostelByIdController);
// Update a hostel by ID (PUT request)
hostelRoute.put("/update/:hostelId", (0, validate_payload_1.validatePayload)("Hostel"), jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), AccessControl_1.validateHostelAccess, multer_1.default.fields([
    { name: "logo", maxCount: 1 },
    { name: "photos", maxCount: 10 },
]), hostelController.updateHostelController);
// publish hostel
hostelRoute.put("/publish/:hostelId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), AccessControl_1.validateHostelAccess, hostelController.publishHostel);
// unpublish hostel
hostelRoute.put("/unpublish/:hostelId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), AccessControl_1.validateHostelAccess, hostelController.unPublishHostel);
// Delete a hostel by ID (DELETE request)
hostelRoute.delete("/delete/:hostelId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin"]), hostelController.deleteHostelController);
// Update hostel rules
hostelRoute.put("/rules/:hostelId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), AccessControl_1.validateHostelAccess, multer_1.default.single("rules"), hostelController.updateHostelRulesController);
hostelRoute.put("/payment-settings/:hostelId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), AccessControl_1.validateHostelAccess, (0, validate_payload_1.validatePayload)("paymentSettings"), hostelController.updatePaymentSettingsController);
hostelRoute.put("/documents/:hostelId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), AccessControl_1.validateHostelAccess, multer_1.default.fields([
    { name: "signature", maxCount: 1 },
    { name: "stamp", maxCount: 1 },
]), hostelController.updateHostelDocumentsController);
hostelRoute.post("/verify/:hostelId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin"]), userController_1.verifyAndCreateHostelUser);
exports.default = hostelRoute;
