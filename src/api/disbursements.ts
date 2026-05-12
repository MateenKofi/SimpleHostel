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
  accountNumber: string;
  accountName: string;
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
  bankName: string;
  accountNumber: string;
  accountName: string;
  notes?: string;
}): Promise<DisbursementRequest> => {
  const response = await axiosInstance.post("/disbursements/request", data);
  return response.data.data;
};

export const getAllDisbursementRequests = async (filters?: DisbursementFilters) => {
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