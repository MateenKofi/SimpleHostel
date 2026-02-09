import { NextFunction, Request, Response } from "express";
import * as visitorHelper from "../helper/visitorHelper"; // Assuming your helper functions are in this file
import { HttpStatus } from "../utils/http-status";
import HttpException from "../utils/http-error";
import { Visitor } from "@prisma/client";
import { VisitorRequestDto } from "../zodSchema/visitorSchema";
import { formatPrismaError } from "../utils/formatPrisma";

// Add a Visitor
export const addVisitorController = async (req: Request, res: Response) => {
  const visitorData: Visitor = req.body satisfies VisitorRequestDto; // Get visitor data from the request body
  try {
    const createdVisitor = await visitorHelper.addVisitor(visitorData);
    res.status(HttpStatus.CREATED).json({
      message: "Visitor added successfully",
      data: createdVisitor,
    });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

// Get All Visitors
export const getAllVisitorsController = async (req: Request, res: Response) => {
  try {
    const visitors = await visitorHelper.getAllVisitors();
    res.status(HttpStatus.OK).json({
      message: "Visitors fetched successfully",
      data: visitors,
    });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

// Get Visitor by ID
export const getVisitorByIdController = async (req: Request, res: Response) => {
  const { visitorId } = req.params;
  try {
    const visitor = await visitorHelper.getVisitorById(visitorId);
    res.status(HttpStatus.OK).json({
      message: "Visitor fetched successfully",
      data: visitor,
    });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

// Update a Visitor
export const updateVisitorController = async (req: Request, res: Response) => {
  const { visitorId } = req.params;
  const visitorData = req.body; // Get visitor data from the request body
  try {
    const updatedVisitor = await visitorHelper.updateVisitor(
      visitorId,
      visitorData
    );
    res.status(HttpStatus.OK).json({
      message: "Visitor updated successfully",
      data: updatedVisitor,
    });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

// Delete a Visitor
export const deleteVisitorController = async (req: Request, res: Response) => {
  const { visitorId } = req.params;
  try {
    const result = await visitorHelper.deleteVisitor(visitorId);
    res.status(HttpStatus.OK).json({
      message: result.message,
    });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

// Checkout a Visitor
export const checkoutVisitorController = async (
  req: Request,
  res: Response
) => {
  const { visitorId } = req.params;
  try {
    const checkedOutVisitor = await visitorHelper.checkoutVisitor(visitorId);
    res.status(HttpStatus.OK).json({
      message: "Visitor checked out successfully",
      data: checkedOutVisitor,
    });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

export const visitorForHostel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { hostelId } = req.params;
  try {
    const visitors = await visitorHelper.getVisitorsForHostel(hostelId);
    res.status(HttpStatus.OK).json({
      message: "Visitors fetched successfully for the hostel",
      data: visitors,
    });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};
