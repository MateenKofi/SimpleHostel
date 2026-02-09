import { Request, Response, NextFunction, response } from "express";
import * as roomHelper from "../helper/roomHelper"; // Assuming you have your room service functions in this file
import { HttpStatus } from "../utils/http-status";
import HttpException from "../utils/http-error";
import {
  confirmPayment,
  getAllPayments,
  initializePayment,
  initializeTopUpPayment,
  TopUpPayment,
  getPaymentsById,
  getPaymentsByReference,
  getPaymentsForHostel,
  fixOrphanedPayments,
} from "../helper/paymentHelper";
import { date } from "zod";
import { formatPrismaError } from "../utils/formatPrisma";
export const initiatePayment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { roomId, residentId, initialPayment } = req.body;
    const paymentUrl = await initializePayment(
      roomId,
      residentId,
      initialPayment,
    );
    res.status(201).json({
      message: "Payment initialized.",
      paymentUrl,
    });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

export const handlePaymentConfirmation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { reference } = req.query;
    const result = await confirmPayment(reference as string);
    res.status(200).json({
      message: "Payment confirmed.",
      data: result,
    });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

export const TopUpPaymentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { reference } = req.query;
    const result = await TopUpPayment(reference as string);
    res.status(200).json({
      message: "Payment confirmed.",
      data: result,
    });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

export const initializeTopUpPaymentControler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { roomId, residentId, initialPayment } = req.body;
    const paymentUrl = await initializeTopUpPayment(
      roomId,
      residentId,
      initialPayment,
    );
    res.status(201).json({
      message: "Payment initialized.",
      paymentUrl,
    });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

export const getAllPaymentController = async (req: Request, res: Response) => {
  try {
    const payments = await getAllPayments();
    res
      .status(HttpStatus.OK)
      .json({ message: "retrieved succesfully", data: payments });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

export const getPaymentByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { paymentId } = req.params;
  try {
    const payments = await getPaymentsById(paymentId);
    res
      .status(HttpStatus.OK)
      .json({ message: "payment fetch successfully", data: payments });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

export const getPaymentsForHostelController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { hostelId } = req.params;
  try {
    const payments = await getPaymentsForHostel(hostelId);
    res
      .status(HttpStatus.OK)
      .json({ message: "payments fetch successfully", data: payments });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

export const getPaymentByReferenceController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { reference } = req.params;
  try {
    const payments = await getPaymentsByReference(reference as string);
    res
      .status(HttpStatus.OK)
      .json({ message: "payments fetch successfully", data: payments });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

export const fixOrphanedPaymentsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const fixedPayments = await fixOrphanedPayments();
    res.status(HttpStatus.OK).json({
      message: "Orphaned payments fixed successfully.",
      data: fixedPayments,
    });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};
