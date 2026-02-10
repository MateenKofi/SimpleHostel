import { Router } from "express";
import { authenticateJWT, authorizeRole } from "../utils/jsonwebtoken";
import { validateHostelAccess } from "../utils/AccessControl";

import {
  initiatePayment,
  handlePaymentConfirmation,
  initializeTopUpPaymentControler,
  TopUpPaymentController,
  getAllPaymentController,
  getPaymentByIdController,
  getPaymentByReferenceController,
  getPaymentsForHostelController,
  fixOrphanedPaymentsController,
} from "../controller/paymentController";
import { handlePaystackWebhook } from "../utils/payStackWebhook";
import { testEmailConfiguration } from "../utils/nodeMailer";

const paymentRouter = Router();
paymentRouter.post("/webhook", handlePaystackWebhook);

paymentRouter.post("/init/", initiatePayment);
paymentRouter.get("/confirm", handlePaymentConfirmation);

paymentRouter.post("/topup", initializeTopUpPaymentControler);
paymentRouter.post("/topup/confirm", TopUpPaymentController);
paymentRouter.get(
  "/get",
  authenticateJWT,
  authorizeRole(["super_admin"]),
  getAllPaymentController,
);

paymentRouter.get(
  "/get/ref/:reference", getPaymentByReferenceController,
);
paymentRouter.get(
  "/get/:paymentId",
  authenticateJWT,
  authorizeRole(["admin", "super_admin"]),
  validateHostelAccess,
  getPaymentByIdController,
);
paymentRouter.get(
  "/get/hostel/:hostelId",
  authenticateJWT,
  authorizeRole(["admin", "super_admin"]),
  validateHostelAccess,
  getPaymentsForHostelController,
);
paymentRouter.post(
  "/fix-orphaned-payments",
  authenticateJWT,
  authorizeRole(["super_admin"]),
  fixOrphanedPaymentsController,
);

/**
 * Test email configuration endpoint
 * GET /api/v1/payments/test-email
 * Sends a test email to verify email setup is working
 */
paymentRouter.get(
  "/test-email",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  async (req, res) => {
    const { email } = req.query;
    const result = await testEmailConfiguration(email as string);

    if (result.success) {
      res.status(200).json({
        message: "Test email sent successfully!",
        note: "Check your inbox (and spam folder) for the test email.",
      });
    } else {
      res.status(500).json({
        message: "Failed to send test email",
        error: result.error,
      });
    }
  }
);

/**
 * Generate and send missing access codes
 * POST /api/v1/payments/generate-access-codes
 * Finds residents with booked rooms but no access codes, generates codes, and sends emails
 */
paymentRouter.post(
  "/generate-access-codes",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  async (req, res) => {
    try {
      const prisma = (await import("../utils/prisma")).default;
      const { generateAccessCode } = await import("../helper/residentHelper");
      const { sendAccessCodeEmail } = await import("../helper/emailHelper");

      // Find residents who have rooms but no access codes
      const residentsWithoutCode = await prisma.residentProfile.findMany({
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
      const results: Array<{
        name: string;
        email: string;
        accessCode?: string;
        success: boolean;
        error?: string;
      }> = [];

      for (const resident of residentsWithoutCode) {
        if (!resident.user?.email || !resident.room?.hostel?.name) {
          failCount++;
          results.push({
            name: resident.user?.name || "Unknown",
            email: resident.user?.email || "N/A",
            success: false,
            error: "Missing email or hostel info",
          });
          continue;
        }

        try {
          // Generate unique access code
          let accessCode = generateAccessCode();

          // Check for collision
          const existingCode = await prisma.residentProfile.findUnique({
            where: { accessCode },
            select: { id: true },
          });

          if (existingCode) {
            accessCode = generateAccessCode();
          }

          // Update resident
          await prisma.residentProfile.update({
            where: { id: resident.id },
            data: { accessCode },
          });

          // Send email
          await sendAccessCodeEmail(resident.user.email, {
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
        } catch (error: any) {
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
    } catch (error: any) {
      console.error("Error generating access codes:", error);
      res.status(500).json({
        message: "Failed to generate access codes",
        error: error.message,
      });
    }
  }
);

export default paymentRouter;
