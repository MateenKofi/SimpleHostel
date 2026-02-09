import axios from "axios";
import crypto from "crypto";
import HttpException from "./http-error";
import { ErrorResponse } from "./types";

const PAYSTACK_BASE_URL = "https://api.paystack.co";
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_KEY || "";

if (!PAYSTACK_SECRET_KEY) {
  throw new Error(
    "PAYSTACK_SECRET_KEY is not set in the environment variables"
  );
}

interface PaystackService {
  initializeTransaction: (email: string, amount: number) => Promise<any>;
  verifyTransaction: (reference: string) => Promise<any>;
  verifyWebhookSignature: (body: string, signature: string) => boolean;
}

const paystack: PaystackService = {
  initializeTransaction: async (email: string, amount: number) => {
    try {
      const response = await axios.post(
        `${PAYSTACK_BASE_URL}/transaction/initialize`,
        { email, amount: Math.ceil(amount * 100) },
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      const err = error as ErrorResponse;
      throw new Error(
        `Paystack initialization error: ${(error as any).response?.data?.message || err.message
        }`
      );
    }
  },

  verifyTransaction: async (reference: string) => {
    try {
      const response = await axios.get(
        `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      const err = error as ErrorResponse;
      throw new Error(
        `Paystack verification error: ${(error as any).response?.data?.message || err.message
        }`
      );
    }
  },

  verifyWebhookSignature: (body: string, signature: string): boolean => {
    const hmac = crypto.createHmac("sha512", PAYSTACK_SECRET_KEY);
    const computedSignature = hmac.update(body).digest("hex");
    return computedSignature === signature;
  },
};

export default paystack;