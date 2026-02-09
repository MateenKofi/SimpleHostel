import { RequestHandler } from "express";
import { confirmPayment } from "../helper/paymentHelper";
import paystack from "./paystack";
import prisma from "./prisma";

export const handlePaystackWebhook: RequestHandler = async (req, res) => {
  const signature = req.headers["x-paystack-signature"] as string;
  const rawBody = (req as any).rawBody;

  // Verify signature first
  if (!paystack.verifyWebhookSignature(rawBody, signature)) {
    console.error("Webhook signature verification failed");
    res.status(401).send("Unauthorized");
    return;
  }

  try {
    const body = JSON.parse(rawBody);

    if (body.event === "charge.success") {
      const reference = body.data.reference;
      console.log(`[Webhook] Processing payment confirmation for reference: ${reference}`);

      const payment = await prisma.payment.findUnique({
        where: { reference },
      });

      if (!payment) {
        console.error(`[Webhook] Payment record not found for reference: ${reference}`);
        res.status(404).send("Payment not found");
        return;
      }

      // Check if payment is already confirmed to avoid redundant processing
      if (payment.status === "confirmed") {
        console.log(`[Webhook] Payment ${reference} is already confirmed. Skipping.`);
        res.sendStatus(200);
        return;
      }

      // Process confirmation using the unified helper
      // This handles both initial room assignment and top-ups
      await confirmPayment(reference);

      console.log(`[Webhook] Successfully confirmed payment: ${reference}`);
      res.sendStatus(200);
      return;
    }

    // Handle other events (just acknowledge them)
    res.sendStatus(200);
  } catch (error) {
    console.error("Webhook processing error:", error);
    // Return 200 even on internal error to prevent Paystack from retrying indefinitely
    // (unless you want it to retry, in which case 500 is appropriate)
    res.status(500).send("Internal Server Error");
  }
};
