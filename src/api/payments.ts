import axiosInstance from "./axiosInstance";
import type { TopupPaymentRequest } from "@/types/dtos";

export const initPayment = async (payload: { roomId: string, residentId: string, initialPayment: number }) => {
    const response = await axiosInstance.post("/payments/init", payload);
    return response.data;
};

export const confirmPayment = async (reference: string) => {
    const response = await axiosInstance.get(`/payments/confirm?reference=${reference}`);
    return response.data;
};

export const topupPayment = async (payload: TopupPaymentRequest) => {
    const response = await axiosInstance.post("/payments/topup", payload);
    return response.data;
};

/**
 * Admin initiate resident payment
 * Allows admins to initiate a payment for a resident
 */
export const adminInitiateResidentPayment = async (
  residentId: string,
  amount: number
): Promise<{
  authorizationUrl: string;
  reference: string;
  message?: string;
}> => {
  const response = await axiosInstance.post("/payments/admin/resident-payment", {
    residentId,
    amount,
  });
  return response.data;
};

/**
 * Verify top-up payment
 * Verifies a payment with Paystack after redirect
 */
export const verifyTopUpPayment = async (
  reference: string
): Promise<{ message: string; data: any }> => {
  const response = await axiosInstance.get("/payments/verify-topup", {
    params: { reference },
  });
  return response.data;
};

export const verifyPaymentTopup = async (reference: string) => {
    const response = await axiosInstance.get(`/payments/verify-topup?reference=${reference}`);
    return response.data;
}

export const getHostelTransactions = async (hostelId: string) => {
    const response = await axiosInstance.get(`/payments/get/hostel/${hostelId}`);
    return response.data;
};

export const verifyPayment = async (reference: string) => {
    const response = await axiosInstance.get(`/payments/verify?reference=${reference}`);
    return response.data;
};

export const getPaymentByRef = async (reference: string) => {
    const response = await axiosInstance.get(`/payments/get/ref/${reference}`);
    return response.data;
};
