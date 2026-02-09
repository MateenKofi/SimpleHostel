import { Request, Response } from "express";
import * as exportHelper from "../helper/exportHelper"; // Import your export helper functions
import { formatPrismaError } from "../utils/formatPrisma"; // Ensure the error formatting utility is used

// Controller for exporting residents CSV
export const exportResidentsCsv = async (req: Request, res: Response) => {
  try {
    const hostelId = req.params.hostelId; // Get hostelId from the request parameters
    const csvData = await exportHelper.residentCsv(hostelId); // Call the helper function for residents CSV

    // Set response headers for file download
    res.header("Content-Type", "text/csv");
    res.attachment("residents.csv"); // Name the file as "residents.csv"

    // Send the CSV data as the response
    res.send(csvData);
  } catch (error) {
    const err = formatPrismaError(error);
    res.status(err.status).json({ message: err.message });
  }
};

// Controller for exporting amenities CSV
export const exportAmenitiesCsv = async (req: Request, res: Response) => {
  try {
    const hostelId = req.params.hostelId; // Get hostelId from the request parameters
    const csvData = await exportHelper.amenitiesCsv(hostelId); // Call the helper function for amenities CSV

    // Set response headers for file download
    res.header("Content-Type", "text/csv");
    res.attachment("amenities.csv"); // Name the file as "amenities.csv"

    // Send the CSV data as the response
    res.send(csvData);
  } catch (error) {
    const err = formatPrismaError(error);
    res.status(err.status).json({ message: err.message });
  }
};

// Controller for exporting room CSV
export const exportRoomCsv = async (req: Request, res: Response) => {
  try {
    const hostelId = req.params.hostelId; // Get hostelId from the request parameters
    const csvData = await exportHelper.roomCsv(hostelId); // Call the helper function for room CSV

    // Set response headers for file download
    res.header("Content-Type", "text/csv");
    res.attachment("rooms.csv"); // Name the file as "rooms.csv"

    // Send the CSV data as the response
    res.send(csvData);
  } catch (error) {
    const err = formatPrismaError(error);
    res.status(err.status).json({ message: err.message });
  }
};

// Controller for exporting visitor CSV
export const exportVisitorCsv = async (req: Request, res: Response) => {
  try {
    const hostelId = req.params.hostelId; // Get hostelId from the request parameters
    const csvData = await exportHelper.visitorCsv(hostelId); // Call the helper function for visitor CSV

    // Set response headers for file download
    res.header("Content-Type", "text/csv");
    res.attachment("visitors.csv"); // Name the file as "visitors.csv"

    // Send the CSV data as the response
    res.send(csvData);
  } catch (error) {
    const err = formatPrismaError(error);
    res.status(err.status).json({ message: err.message });
  }
};

// Controller for exporting payment CSV
export const exportPaymentCsv = async (req: Request, res: Response) => {
  try {
    const hostelId = req.params.hostelId; // Get hostelId from the request parameters
    const csvData = await exportHelper.paymentCsv(hostelId); // Call the helper function for payment CSV

    // Set response headers for file download
    res.header("Content-Type", "text/csv");
    res.attachment("payments.csv"); // Name the file as "payments.csv"

    // Send the CSV data as the response
    res.send(csvData);
  } catch (error) {
    const err = formatPrismaError(error);
    res.status(err.status).json({ message: err.message });
  }
};

// Controller for exporting staff CSV (same structure as the other controllers)
export const exportStaffCsv = async (req: Request, res: Response) => {
  try {
    const hostelId = req.params.hostelId; // Get hostelId from the request parameters
    const csvData = await exportHelper.StaffCsv(hostelId); // Call the helper function for staff CSV

    // Set response headers for file download
    res.header("Content-Type", "text/csv");
    res.attachment("staff.csv"); // Name the file as "staff.csv"

    // Send the CSV data as the response
    res.send(csvData);
  } catch (error) {
    const err = formatPrismaError(error);
    res.status(err.status).json({ message: err.message });
  }
};
