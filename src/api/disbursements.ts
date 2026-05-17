import axiosInstance from "./axiosInstance";

export interface DisbursementBalance {
  totalPayments: number;
  totalDisbursements: number;
  totalRefunds: number;
  availableBalance: number;
  currency: string;
}

export interface DisbursementRequest {
  id: string;
  hostelId: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "PROCESSED" | "REJECTED";
  bankName: string;
  bankCode: string | null;
  accountNumber: string;
  accountName: string;
  recipientCode: string | null;
  transferCode: string | null;
  transferStatus: string | null;
  notes: string | null;
  processedDate: string | null;
  rejectedDate: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  hostel?: {
    id: string;
    name: string;
    location?: string;
  };
}

export interface DisbursementFilters {
  status?: string;
  hostelId?: string;
  page?: number;
  limit?: number;
}

export interface DisbursementStats {
  pending: number;
  approved: number;
  processed: number;
  rejected: number;
}

export interface DisbursementAccount {
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  recipientCode?: string;
  isVerified: boolean;
}

export const getDisbursementBalance = async (hostelId?: string): Promise<DisbursementBalance> => {
  const response = await axiosInstance.get("/disbursements/balance", {
    params: hostelId ? { hostelId } : {},
  });
  return response.data.data;
};

export const getMyDisbursementRequests = async (): Promise<DisbursementRequest[]> => {
  const response = await axiosInstance.get("/disbursements/my-requests");
  return response.data.data;
};

export const requestDisbursement = async (data: {
  amount: number;
  bankCode?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  notes?: string;
}): Promise<DisbursementRequest> => {
  const response = await axiosInstance.post("/disbursements/request", data);
  return response.data.data;
};

export const getAllDisbursementRequests = async (filters?: DisbursementFilters): Promise<{ requests: DisbursementRequest[], stats: DisbursementStats }> => {
  const response = await axiosInstance.get("/disbursements/all", { params: filters });
  return response.data.data;
};

export const approveDisbursement = async (id: string): Promise<DisbursementRequest> => {
  const response = await axiosInstance.put(`/disbursements/${id}/approve`);
  return response.data.data;
};

export const rejectDisbursement = async (id: string, reason: string): Promise<DisbursementRequest> => {
  const response = await axiosInstance.put(`/disbursements/${id}/reject`, { reason });
  return response.data.data;
};

export const processDisbursement = async (id: string): Promise<DisbursementRequest> => {
  const response = await axiosInstance.put(`/disbursements/${id}/process`);
  return response.data.data;
};

export const getDisbursementAccount = async (): Promise<DisbursementAccount | null> => {
  try {
    const response = await axiosInstance.get("/hostels/disbursement-account");
    return response.data.data;
  } catch (error) {
    const err = error as { response?: { status?: number } };
    if (err.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export const saveDisbursementAccount = async (data: {
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}): Promise<DisbursementAccount> => {
  const response = await axiosInstance.post("/hostels/disbursement-account", data);
  return response.data.data;
};

export const deleteDisbursementAccount = async (): Promise<void> => {
  await axiosInstance.delete("/hostels/disbursement-account");
};