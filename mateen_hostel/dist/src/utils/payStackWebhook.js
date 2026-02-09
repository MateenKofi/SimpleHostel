"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePaystackWebhook = void 0;
const paymentHelper_1 = require("../helper/paymentHelper");
const paystack_1 = __importDefault(require("./paystack"));
const prisma_1 = __importDefault(require("./prisma"));
const handlePaystackWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const signature = req.headers["x-paystack-signature"];
    const rawBody = req.rawBody;
    // Verify signature first
    if (!paystack_1.default.verifyWebhookSignature(rawBody, signature)) {
        console.error("Webhook signature verification failed");
        res.status(401).send("Unauthorized");
        return;
    }
    try {
        const body = JSON.parse(rawBody);
        if (body.event === "charge.success") {
            const reference = body.data.reference;
            console.log(`[Webhook] Processing payment confirmation for reference: ${reference}`);
            const payment = yield prisma_1.default.payment.findUnique({
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
            yield (0, paymentHelper_1.confirmPayment)(reference);
            console.log(`[Webhook] Successfully confirmed payment: ${reference}`);
            res.sendStatus(200);
            return;
        }
        // Handle other events (just acknowledge them)
        res.sendStatus(200);
    }
    catch (error) {
        console.error("Webhook processing error:", error);
        // Return 200 even on internal error to prevent Paystack from retrying indefinitely
        // (unless you want it to retry, in which case 500 is appropriate)
        res.status(500).send("Internal Server Error");
    }
});
exports.handlePaystackWebhook = handlePaystackWebhook;
