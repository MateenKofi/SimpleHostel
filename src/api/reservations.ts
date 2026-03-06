import axiosInstance from "./axiosInstance";
import {
    ClaimReservationRequest,
    CreateReservationRequest,
    ReservationDto
} from "@/types/dtos";

/**
 * Create a new room reservation
 * @param data - Reservation details (roomId, calendarYearId, residentId or name/email/phone)
 * @returns Created reservation data
 */
export const createReservation = async (data: CreateReservationRequest): Promise<{ data: ReservationDto }> => {
    const response = await axiosInstance.post("/reservations", data);
    return response.data;
};

/**
 * Get all reservations for a hostel
 * @param hostelId - The hostel ID
 * @param status - Optional filter by status (pending, confirmed, cancelled, fulfilled)
 * @returns List of reservations for the hostel
 */
export const getReservationsByHostel = async (
    hostelId: string,
    status?: "pending" | "confirmed" | "cancelled" | "fulfilled"
): Promise<{ data: ReservationDto[] }> => {
    const response = await axiosInstance.get(`/reservations/hostel/${hostelId}`, {
        params: status ? { status } : undefined
    });
    return response.data;
};

/**
 * Confirm a reservation (usually after payment)
 * @param reservationId - The reservation ID to confirm
 * @returns Updated reservation data
 */
export const confirmReservation = async (reservationId: string): Promise<{ data: ReservationDto }> => {
    const response = await axiosInstance.patch(`/reservations/confirm/${reservationId}`);
    return response.data;
};

/**
 * Cancel a reservation
 * @param reservationId - The reservation ID to cancel
 * @returns Updated reservation data
 */
export const cancelReservation = async (reservationId: string): Promise<{ data: ReservationDto }> => {
    const response = await axiosInstance.patch(`/reservations/cancel/${reservationId}`);
    return response.data;
};

/**
 * Claim a reservation using a secret code (for new residents during registration)
 * @param data - Secret code and resident ID
 * @returns Updated reservation data
 */
export const claimReservation = async (data: ClaimReservationRequest): Promise<{ data: ReservationDto }> => {
    const response = await axiosInstance.post("/reservations/claim", data);
    return response.data;
};

/**
 * Verify a reservation code (for pre-filling registration form)
 * @param code - The reservation secret code
 * @returns Reservation details if valid
 */
export const verifyReservationCode = async (code: string): Promise<{ data: ReservationDto }> => {
    const response = await axiosInstance.get(`/reservations/verify/${code}`);
    return response.data;
};

/**
 * Get reservation by ID
 * @param reservationId - The reservation ID
 * @returns Reservation details
 */
export const getReservationById = async (reservationId: string): Promise<{ data: ReservationDto }> => {
    const response = await axiosInstance.get(`/reservations/${reservationId}`);
    return response.data;
};