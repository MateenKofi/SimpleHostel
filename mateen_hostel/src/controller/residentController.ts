import { NextFunction, Request, Response } from "express";
import * as residentHelper from "../helper/residentHelper"; // Assuming your helper functions are in this file
import { HttpStatus } from "../utils/http-status";
import HttpException from "../utils/http-error";
import cloudinary from "../utils/cloudinary";
import fs from "fs";
import {
  ResidentRequestDto,
  UpdateResidentRequestDto,
} from "../zodSchema/residentSchema";
import prisma from "../utils/prisma";
import { formatPrismaError } from "../utils/formatPrisma";
import { CreateMaintenanceRequestDto } from "../zodSchema/requestSchema";
import { CreateFeedbackDto } from "../zodSchema/feedbackSchema";
import { jwtDecode } from "jwt-decode";
import { UserPayload } from "../utils/jsonwebtoken";

// Register a Resident
export const registerResidentController = async (
  req: Request,
  res: Response,
) => {
  const residentData: ResidentRequestDto = req.body as ResidentRequestDto; // Get resident data from the request body

  try {
    const newResident = await residentHelper.register(residentData);
    res.status(HttpStatus.CREATED).json({
      message: "Resident registered successfully",
      data: newResident,
    });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

// Get All Residents
export const getAllResidentsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const residents = await residentHelper.getAllResident();
    res.status(HttpStatus.OK).json({
      message: "Residents fetched successfully",
      data: residents,
    });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

// Get Resident by ID
export const getResidentByIdController = async (
  req: Request,
  res: Response,
) => {
  const { residentId } = req.params;

  try {
    const resident = await residentHelper.getResidentById(residentId);
    res.status(HttpStatus.OK).json({
      message: "Resident fetched successfully ID",
      data: resident,
    });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

// Get Resident by Email
export const getResidentByEmailController = async (
  req: Request,
  res: Response,
) => {
  const { email } = req.params;

  try {
    const resident = await residentHelper.getResidentByEmail(email);
    res.status(HttpStatus.OK).json({
      message: "Resident fetched successfully email",
      data: resident,
    });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

// Update a Resident
export const updateResidentController = async (req: Request, res: Response) => {
  const { residentId } = req.params;
  const residentData: UpdateResidentRequestDto = req.body as UpdateResidentRequestDto;

  try {
    const updatedResident = await residentHelper.updateResident(
      residentId,
      residentData,
    );
    res.status(HttpStatus.OK).json({
      message: "Resident updated successfully",
      data: updatedResident,
    });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

// Delete a Resident
export const deleteResidentController = async (req: Request, res: Response) => {
  const { residentId } = req.params;

  try {
    await residentHelper.deleteResident(residentId);
    res.status(HttpStatus.OK).json({
      message: "Resident archived successfully",
    });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

// Restore a Resident
export const restoreResidentController = async (req: Request, res: Response) => {
  const { residentId } = req.params;

  try {
    await residentHelper.restoreResident(residentId);
    res.status(HttpStatus.OK).json({
      message: "Resident restored successfully",
    });
  } catch (error) {
    const err = formatPrismaError(error);
    res.status(err.status).json({ message: err.message });
  }
};

export const getAlldebtors = async (req: Request, res: Response) => {
  try {
    const debtors = await residentHelper.getDebtors();
    if (debtors.length === 0) {
      console.log("No debtors found with balance owed greater than 0");
    }

    res
      .status(HttpStatus.OK)
      .json({ message: "debtors fetched successfully", data: debtors });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

export const getDebtorsForHostel = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { hostelId } = req.params;
  try {
    const debtors = await residentHelper.getDebtorsForHostel(hostelId);
    res
      .status(HttpStatus.OK)
      .json({ message: "debors fected successfully", data: debtors });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

export const getAllresidentsForHostel = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { hostelId } = req.params;
  try {
    const residents = await residentHelper.getAllresidentsForHostel(hostelId);
    res
      .status(HttpStatus.OK)
      .json({ message: "residents fecthed successfully", data: residents });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};
export const addResidentFromHostelController = async (
  req: Request,
  res: Response,
) => {
  const residentData: ResidentRequestDto = req.body as ResidentRequestDto; // Get resident data from the request body

  try {
    const newResident = await residentHelper.addResidentFromHostel(
      residentData,
    );
    res.status(HttpStatus.CREATED).json({
      message: "Resident registered successfully",
      data: newResident,
    });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

export const assignRoomToResidentController = async (
  req: Request,
  res: Response,
) => {
  const { residentId } = req.params;
  const { roomId } = req.body;

  try {
    const updatedResident = await residentHelper.assignRoomToResident(
      residentId,
      roomId,
    );
    res.status(HttpStatus.OK).json({
      message: "Room assigned to resident successfully",
      data: updatedResident,
    });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

export const verifyResidentCodeController = async (
  req: Request,
  res: Response,
) => {
  const { code, hostelId } = req.body;

  try {
    const verifiedResident = await residentHelper.verifyResidentCode(code, hostelId);
    res.status(HttpStatus.OK).json({
      message: "Resident code verified successfully",
      data: verifiedResident,
    });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

export const checkInResidentController = async (
  req: Request,
  res: Response,
) => {
  const { residentId } = req.params;

  try {
    const checkedInResident = await residentHelper.checkInResident(residentId);
    res.status(HttpStatus.OK).json({
      message: "Resident checked in successfully",
      data: checkedInResident,
    });
  } catch (error) {
    const err = formatPrismaError(error);
    res.status(err.status).json({ message: err.message });
  }
};

export const getResidentRoomDetailsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      throw new HttpException(HttpStatus.UNAUTHORIZED, "No token provided");
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new HttpException(HttpStatus.UNAUTHORIZED, "Invalid token format");
    }

    // Decode token to get userId
    const decoded = jwtDecode(token) as UserPayload;
    if (!decoded || !decoded.id) {
      throw new HttpException(HttpStatus.UNAUTHORIZED, "Invalid token payload");
    }

    const details = await residentHelper.getResidentRoomDetails(decoded.id);

    res.status(HttpStatus.OK).json({
      message: "Room details fetched successfully",
      data: details,
    });
  } catch (error) {
    const err = formatPrismaError(error);
    res.status(err.status).json({ message: err.message });
  }
};

export const createMaintenanceRequestController = async (
  req: Request,
  res: Response,
) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader)
      throw new HttpException(HttpStatus.UNAUTHORIZED, "No token provided");
    const token = authHeader.split(" ")[1];
    const decoded = jwtDecode(token) as UserPayload;

    const requestData: CreateMaintenanceRequestDto = req.body;

    // Handle Image Uploads
    const images: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        try {
          const uploaded = await cloudinary.uploader.upload(file.path, {
            folder: "MaintenanceRequests/",
          });
          if (uploaded) {
            images.push(uploaded.secure_url);
          }
          // Clean up local file
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (uploadError) {
          console.error("Cloudinary Upload Error:", uploadError);
          // Optional: handle specific upload errors
        }
      }
    }

    // Assign uploaded image URLs to requestData
    requestData.images = images.length > 0 ? images : undefined;

    const request = await residentHelper.createMaintenanceRequest(
      decoded.id,
      requestData,
    );

    res.status(HttpStatus.CREATED).json({
      message: "Request submitted successfully",
      data: request,
    });
  } catch (error) {
    const err = formatPrismaError(error);
    res.status(err.status).json({ message: err.message });
  }
};

export const getResidentRequestsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) throw new HttpException(HttpStatus.UNAUTHORIZED, "No token provided");
    const token = authHeader.split(" ")[1];
    const decoded = jwtDecode(token) as UserPayload;

    const requests = await residentHelper.getResidentRequests(decoded.id);

    res.status(HttpStatus.OK).json({
      message: "Requests fetched successfully",
      data: requests,
    });
  } catch (error) {
    const err = formatPrismaError(error);
    res.status(err.status).json({ message: err.message });
  }
};

export const getResidentBillingController = async (
  req: Request,
  res: Response,
) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) throw new HttpException(HttpStatus.UNAUTHORIZED, "No token provided");
    const token = authHeader.split(" ")[1];
    const decoded = jwtDecode(token) as UserPayload;

    const billingInfo = await residentHelper.getResidentBilling(decoded.id);

    res.status(HttpStatus.OK).json({
      message: "Billing info fetched successfully",
      data: billingInfo,
    });
  } catch (error) {
    const err = formatPrismaError(error);
    res.status(err.status).json({ message: err.message });
  }
};

export const getResidentAnnouncementsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) throw new HttpException(HttpStatus.UNAUTHORIZED, "No token provided");
    const token = authHeader.split(" ")[1];
    const decoded = jwtDecode(token) as UserPayload;

    const announcements = await residentHelper.getResidentAnnouncements(decoded.id);

    res.status(HttpStatus.OK).json({
      message: "Announcements fetched successfully",
      data: announcements,
    });
  } catch (error) {
    const err = formatPrismaError(error);
    res.status(err.status).json({ message: err.message });
  }
};

export const createFeedbackController = async (
  req: Request,
  res: Response,
) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) throw new HttpException(HttpStatus.UNAUTHORIZED, "No token provided");
    const token = authHeader.split(" ")[1];
    const decoded = jwtDecode(token) as UserPayload;

    const feedbackData: CreateFeedbackDto = req.body;
    const feedback = await residentHelper.createFeedback(decoded.id, feedbackData);

    res.status(HttpStatus.CREATED).json({
      message: "Feedback submitted successfully",
      data: feedback,
    });
  } catch (error) {
    const err = formatPrismaError(error);
    res.status(err.status).json({ message: err.message });
  }
};

export const getAllocationLetterController = async (req: Request, res: Response) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) throw new HttpException(HttpStatus.UNAUTHORIZED, "No token provided");
    const token = authHeader.split(" ")[1];
    const decoded = jwtDecode(token) as UserPayload;

    const data = await residentHelper.getAllocationDetails(decoded.id);

    res.status(HttpStatus.OK).json({
      message: "Allocation details fetched successfully",
      data,
    });
  } catch (error) {
    const err = formatPrismaError(error);
    res.status(err.status).json({ message: err.message });
  }
};

export const getPaymentReceiptController = async (req: Request, res: Response) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) throw new HttpException(HttpStatus.UNAUTHORIZED, "No token provided");
    const token = authHeader.split(" ")[1];
    const decoded = jwtDecode(token) as UserPayload;

    const { paymentId } = req.params;
    if (!paymentId) throw new HttpException(HttpStatus.BAD_REQUEST, "Payment ID is required");

    const data = await residentHelper.getPaymentReceiptData(decoded.id, paymentId);

    res.status(HttpStatus.OK).json({
      message: "Payment receipt fetched successfully",
      data,
    });
  } catch (error) {
    const err = formatPrismaError(error);
    res.status(err.status).json({ message: err.message });
  }
};
