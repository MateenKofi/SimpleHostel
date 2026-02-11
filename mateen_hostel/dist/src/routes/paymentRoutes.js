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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = require("../utils/jsonwebtoken");
const AccessControl_1 = require("../utils/AccessControl");
const paymentController_1 = require("../controller/paymentController");
const payStackWebhook_1 = require("../utils/payStackWebhook");
const nodeMailer_1 = require("../utils/nodeMailer");
const paymentRouter = (0, express_1.Router)();
paymentRouter.post("/webhook", payStackWebhook_1.handlePaystackWebhook);
paymentRouter.post("/init/", paymentController_1.initiatePayment);
paymentRouter.get("/confirm", paymentController_1.handlePaymentConfirmation);
paymentRouter.post("/topup", paymentController_1.initializeTopUpPaymentControler);
paymentRouter.post("/topup/confirm", paymentController_1.TopUpPaymentController);
paymentRouter.get("/get", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin"]), paymentController_1.getAllPaymentController);
paymentRouter.get("/get/ref/:reference", paymentController_1.getPaymentByReferenceController);
paymentRouter.get("/get/:paymentId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["admin", "super_admin"]), AccessControl_1.validateHostelAccess, paymentController_1.getPaymentByIdController);
paymentRouter.get("/get/hostel/:hostelId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["admin", "super_admin"]), AccessControl_1.validateHostelAccess, paymentController_1.getPaymentsForHostelController);
paymentRouter.post("/fix-orphaned-payments", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin"]), paymentController_1.fixOrphanedPaymentsController);
/**
 * Test email configuration endpoint
 * GET /api/v1/payments/test-email
 * Sends a test email to verify email setup is working
 */
paymentRouter.get("/test-email", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.query;
    const result = yield (0, nodeMailer_1.testEmailConfiguration)(email);
    if (result.success) {
        res.status(200).json({
            message: "Test email sent successfully!",
            note: "Check your inbox (and spam folder) for the test email.",
        });
    }
    else {
        res.status(500).json({
            message: "Failed to send test email",
            error: result.error,
        });
    }
}));
/**
 * Generate and send missing access codes
 * POST /api/v1/payments/generate-access-codes
 * Finds residents with booked rooms but no access codes, generates codes, and sends emails
 */
paymentRouter.post("/generate-access-codes", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const prisma = (yield Promise.resolve().then(() => __importStar(require("../utils/prisma")))).default;
        const { generateAccessCode } = yield Promise.resolve().then(() => __importStar(require("../helper/residentHelper")));
        const { sendAccessCodeEmail } = yield Promise.resolve().then(() => __importStar(require("../helper/emailHelper")));
        // Find residents who have rooms but no access codes
        const residentsWithoutCode = yield prisma.residentProfile.findMany({
            where: {
                roomId: { not: null },
                accessCode: null,
                status: "active",
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                room: {
                    select: {
                        number: true,
                        hostel: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });
        if (residentsWithoutCode.length === 0) {
            return res.status(200).json({
                message: "All residents have access codes",
                processed: 0,
                success: 0,
                failed: 0,
            });
        }
        // Process each resident
        let successCount = 0;
        let failCount = 0;
        const results = [];
        for (const resident of residentsWithoutCode) {
            if (!((_a = resident.user) === null || _a === void 0 ? void 0 : _a.email) || !((_c = (_b = resident.room) === null || _b === void 0 ? void 0 : _b.hostel) === null || _c === void 0 ? void 0 : _c.name)) {
                failCount++;
                results.push({
                    name: ((_d = resident.user) === null || _d === void 0 ? void 0 : _d.name) || "Unknown",
                    email: ((_e = resident.user) === null || _e === void 0 ? void 0 : _e.email) || "N/A",
                    success: false,
                    error: "Missing email or hostel info",
                });
                continue;
            }
            try {
                // Generate unique access code
                let accessCode = generateAccessCode();
                // Check for collision
                const existingCode = yield prisma.residentProfile.findUnique({
                    where: { accessCode },
                    select: { id: true },
                });
                if (existingCode) {
                    accessCode = generateAccessCode();
                }
                // Update resident
                yield prisma.residentProfile.update({
                    where: { id: resident.id },
                    data: { accessCode },
                });
                // Send email
                yield sendAccessCodeEmail(resident.user.email, {
                    residentName: resident.user.name,
                    accessCode,
                    roomNumber: resident.room.number,
                    hostelName: resident.room.hostel.name,
                });
                successCount++;
                results.push({
                    name: resident.user.name,
                    email: resident.user.email,
                    accessCode,
                    success: true,
                });
            }
            catch (error) {
                failCount++;
                results.push({
                    name: resident.user.name,
                    email: resident.user.email,
                    success: false,
                    error: error.message,
                });
            }
        }
        res.status(200).json({
            message: `Processed ${residentsWithoutCode.length} residents`,
            processed: residentsWithoutCode.length,
            success: successCount,
            failed: failCount,
            results,
        });
    }
    catch (error) {
        console.error("Error generating access codes:", error);
        res.status(500).json({
            message: "Failed to generate access codes",
            error: error.message,
        });
    }
}));
exports.default = paymentRouter;
