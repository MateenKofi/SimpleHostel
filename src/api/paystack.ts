import axiosInstance from "./axiosInstance";

export interface PaystackBank {
  id: number;
  name: string;
  slug: string;
  code: string;
  longcode: string;
  gateway: string | null;
  pay_with_bank: boolean;
  supports_recurring_payments: boolean;
  country: string;
  currency: string;
  type: string;
}

export interface AccountVerificationResult {
  accountName: string;
  accountNumber: string;
  bankCode: string;
}

export const getBanks = async (): Promise<PaystackBank[]> => {
  const response = await axiosInstance.get("/paystack/banks");
  return response.data.data;
};

export const resolveAccount = async (
  bankCode: string,
  accountNumber: string
): Promise<AccountVerificationResult> => {
  const response = await axiosInstance.post("/paystack/resolve-account", {
    bankCode,
    accountNumber,
  });
  return response.data.data;
};

export const createRecipient = async (data: {
  name: string;
  accountNumber: string;
  bankCode: string;
}): Promise<{ recipientCode: string; name: string }> => {
  const response = await axiosInstance.post("/paystack/create-recipient", data);
  return response.data.data;
};

export const initiateTransfer = async (data: {
  amount: number;
  recipientCode: string;
  reference?: string;
}): Promise<{ transferCode: string; status: string }> => {
  const response = await axiosInstance.post("/paystack/transfer", data);
  return response.data.data;
};