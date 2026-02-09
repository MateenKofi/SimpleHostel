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
export default paymentRouter;
