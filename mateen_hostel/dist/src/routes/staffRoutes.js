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
const StaffController = __importStar(require("../controller/staffController")); // Adjust the path as necessary
const validate_payload_1 = require("../middleware/validate-payload"); // Assuming you have validation middleware
const multer_1 = __importDefault(require("../utils/multer"));
const jsonwebtoken_1 = require("../utils/jsonwebtoken");
const AccessControl_1 = require("../utils/AccessControl");
const StaffRouter = (0, express_1.Router)();
// Add a new Staff (POST request)
StaffRouter.post("/add", jsonwebtoken_1.authenticateJWT, // Ensure user is authenticated first
(0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), // Ensure user has required roles
multer_1.default.single("photo"), // Process file upload AFTER validation
AccessControl_1.validateHostelAccess, // Ensure user has access to the hostel
(0, validate_payload_1.validatePayload)("Staff"), // ✅ Validate payload before file upload
StaffController.addStaffController // Proceed to controller
);
// Get all Staffs (GET request)
StaffRouter.get("/get", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin"]), AccessControl_1.validateHostelAccess, StaffController.getAllStaffsController);
// Get a specific Staff by ID (GET request)
StaffRouter.get("/get/:staffId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), AccessControl_1.validateHostelAccess, StaffController.getStaffByIdController);
// Update a Staff by ID (PUT request)
StaffRouter.put("/update/:staffId", (0, validate_payload_1.validatePayload)("Staff"), multer_1.default.single("photo"), jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), AccessControl_1.validateHostelAccess, 
// Optional: Assuming you have a validation schema for updating a Staff
StaffController.updateStaffController);
// Delete a Staff by ID (DELETE request)
StaffRouter.delete("/delete/:staffId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), AccessControl_1.validateHostelAccess, StaffController.deleteStaffController);
StaffRouter.get("/get/hostel/:hostelId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), AccessControl_1.validateHostelAccess, StaffController.staffForHostel);
exports.default = StaffRouter;
