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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analyticsController = __importStar(require("../controller/analyticsController"));
const jsonwebtoken_1 = require("../utils/jsonwebtoken");
const AccessControl_1 = require("../utils/AccessControl");
const analyticsRouter = (0, express_1.Router)();
// Get hostel-specific analytics
analyticsRouter.get("/get/hostel/:hostelId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), AccessControl_1.validateHostelAccess, analyticsController.getHostelAnalytics);
// Get system-wide analytics (super_admin only)
analyticsRouter.get("/get/system", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin"]), analyticsController.getSystemAnalytics);
// Get resident analytics for a hostel
analyticsRouter.get("/get/residents/:hostelId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), AccessControl_1.validateHostelAccess, analyticsController.getResidentAnalytics);
// Get analytics tailored for a specific resident dashboard
analyticsRouter.get("/get/resident-dashboard/:userId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin", "staff", "resident"]), analyticsController.getResidentDashboardAnalytics);
// Get disbursement summary (super_admin only)
analyticsRouter.get("/get/disbursement-summary", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin"]), analyticsController.getHostelDisbursementSummaryController);
// Calendar Year Report
analyticsRouter.get("/calendar-year/:hostelId/:calendarYearId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), AccessControl_1.validateHostelAccess, analyticsController.generateCalendarYearReportController);
exports.default = analyticsRouter;
