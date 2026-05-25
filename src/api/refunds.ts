import axiosInstance from "./axiosInstance";

export interface RefundRequestDto {
  id: string;
  paymentId: string;
  residentId: string;
  amount: number;
  reason: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "PROCESSED";
  reviewedBy: string | null;
  rejectionReason: string | null;
  processedAt: string | null;
  createdAt: string;
  updatedAt: string;
  payment: {
    id: string;
    amount: number;
    method: string;
    reference: string;
    status: string;
  };
  resident: {
    id: string;
    user: {
      name: string;
      email: string;
    };
  };
}

export interface RefundCalculationDto {
  refundableAmount: number;
  daysStayed: number;
  totalDays: number;
  checkedIn: boolean;
  paymentAmount: number;
  nonRefundablePercentage: number;
  adminRefundFee: number;
}

export const calculateRefund = async (paymentId: string): Promise<{ data: RefundCalculationDto }> => {
  const response = await axiosInstance.get(`/refunds/calculate/${paymentId}`);
  return response.data;
};

export const requestRefund = async (paymentId: string, reason: string): Promise<{ data: RefundRequestDto }> => {
  const response = await axiosInstance.post("/refunds/request", { paymentId, reason });
  return response.data;
};

export const getRefundRequests = async (params?: { hostelId?: string; status?: string }): Promise<{ data: RefundRequestDto[] }> => {
  const response = await axiosInstance.get("/refunds/requests", { params });
  return response.data;
};

export const approveRefund = async (refundRequestId: string): Promise<{ data: RefundRequestDto }> => {
  const response = await axiosInstance.post(`/refunds/approve/${refundRequestId}`);
  return response.data;
};

export const rejectRefund = async (refundRequestId: string, rejectionReason: string): Promise<{ data: RefundRequestDto }> => {
  const response = await axiosInstance.post(`/refunds/reject/${refundRequestId}`, { rejectionReason });
  return response.data;
};

export const instantRefund = async (paymentId: string, amount: number, reason: string): Promise<{ data: any }> => {
  const response = await axiosInstance.post("/refunds/instant", { paymentId, amount, reason });
  return response.data;
};
