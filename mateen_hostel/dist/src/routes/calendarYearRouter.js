"use strict";
// In calendarYearRoutes.ts
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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const calendarYearController = __importStar(require("../controller/calendarYearController")); // Adjust path as necessary
const validate_payload_1 = require("../middleware/validate-payload"); // Assuming you have validation middleware
const jsonwebtoken_1 = require("../utils/jsonwebtoken"); // Authentication middleware
const AccessControl_1 = require("../utils/AccessControl"); // Hostel access validation middleware
const calendarYearRoute = (0, express_1.Router)();
// Start a new calendar year (POST request)
calendarYearRoute.post("/start", (0, validate_payload_1.validatePayload)("CalendarYear"), // Assuming you have a validation schema for calendar year data
jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), // Example roles, modify as per your requirements
calendarYearController.startNewCalendarController);
// Get the current calendar year (GET request)
calendarYearRoute.get("/current/:hostelId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), AccessControl_1.validateHostelAccess, // Assuming this is middleware to check access to the hostel
calendarYearController.getCurrentCalendarYearController);
// Get historical calendar years (GET request)
calendarYearRoute.get("/historical/:hostelId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), AccessControl_1.validateHostelAccess, calendarYearController.getHistoricalCalendarYearsController);
// Get calendar year financial report (GET request)
calendarYearRoute.get("/financial-report/:calendarYearId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), AccessControl_1.validateHostelAccess, calendarYearController.getCalendarYearFinancialReportController);
// Update calendar year details (PUT request)
calendarYearRoute.put("/update/:calendarYearId", (0, validate_payload_1.validatePayload)("calendarYear"), // Assuming you have a validation schema for updating calendar year data
jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), AccessControl_1.validateHostelAccess, calendarYearController.updateCalendarYearController);
// Delete a calendar year (DELETE request)
calendarYearRoute.delete("/delete/:calendarYearId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin"]), AccessControl_1.validateHostelAccess, calendarYearController.deleteCalendarYearController);
// End a calendar year (PATCH request)
calendarYearRoute.patch("/end/:calendarYearId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), AccessControl_1.validateHostelAccess, calendarYearController.endCalendarYearController);
exports.default = calendarYearRoute;
