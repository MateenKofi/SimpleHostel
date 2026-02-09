import { NextFunction, Request, Response } from "express";
import * as StaffHelper from "../helper/staffHelper"; // Assuming you have your service functions in this file
import { HttpStatus } from "../utils/http-status";
import HttpException from "../utils/http-error";
import cloudinary from "../utils/cloudinary";
import {
  StaffRequestDto,
  UpdateStaffRequestDto,
} from "../zodSchema/staffSchema";
import { formatPrismaError } from "../utils/formatPrisma";
import prisma from "../utils/prisma";

// Add a Staff
export const addStaffController = async (req: Request, res: Response) => {
  const photo = req.file ? req.file.path : undefined;
  const StaffData: StaffRequestDto = req.body as StaffRequestDto;
  console.log("staff data:", JSON.stringify(StaffData));

  const picture = {
    passportUrl: "",
    passportKey: "",
  };

  try {
    // First, try to add the staff (don't upload the photo yet)
    const newStaff = await StaffHelper.addStaff(StaffData, picture);

    // If staff creation is successful, upload the photo to Cloudinary
    if (photo) {
      const uploaded = await cloudinary.uploader.upload(photo, {
        folder: "Staff/",
      });

      if (uploaded) {
        // Update the picture URL and key after the photo is successfully uploaded
        picture.passportUrl = uploaded.secure_url;
        picture.passportKey = uploaded.public_id;

        // Optionally, update the staff record with the photo URL and key
        await prisma.user.update({
          where: { email: StaffData.email }, // Update associated user avatar
          data: {
            imageUrl: picture.passportUrl,
            imageKey: picture.passportKey,
          },
        });
      }
    }

    // Respond with success if everything went well
    res.status(HttpStatus.CREATED).json({
      message: "Staff created successfully",
      data: newStaff,
    });
  } catch (error) {
    // If anything fails, handle the error, rollback any uploaded photo
    if (photo) {
      // Optionally delete the uploaded photo from Cloudinary
      const filePath = req.file?.path; // Use the file path here if needed to delete the photo
      if (filePath) {
        const publicId = picture.passportKey;
        if (publicId) {
          await cloudinary.uploader.destroy(publicId); // Delete the uploaded file from Cloudinary
        }
      }
    }

    // Format and send error response
    const err = formatPrismaError(error); 
    res.status(err.status).json({ message: err.message });
  }
};

// Get All Staffs
export const getAllStaffsController = async (req: Request, res: Response) => {
  try {
    const Staffs = await StaffHelper.getAllStaffs();

    res.status(HttpStatus.OK).json({
      message: "Staffs fetched successfully",
      data: Staffs,
    });
  }  catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

// Get Staff by ID
export const getStaffByIdController = async (req: Request, res: Response) => {
  const { staffId } = req.params;

  try {
    const Staff = await StaffHelper.getStaffById(staffId);

    res.status(HttpStatus.OK).json({
      message: "Staff fetched successfully",
      data: Staff,
    });
  }  catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

// Update a Staff
export const updateStaffController = async (req: Request, res: Response) => {
  const { staffId } = req.params;
  const StaffData: UpdateStaffRequestDto = req.body as UpdateStaffRequestDto; 
  const photo = req.file ? req.file.path : undefined;

  const picture = {
    passportUrl: "",
    passportKey: "",
  };
  console.log(StaffData);
  try {
    if (photo) {
      const uploaded = await cloudinary.uploader.upload(photo, {
        folder: "Staff/",
      });
      if (uploaded) {
        picture.passportUrl = uploaded.secure_url;
        picture.passportKey = uploaded.public_id;
      }
    }

    const updatedStaff = await StaffHelper.updateStaff(
      staffId,
      StaffData,
      picture
    );

    res.status(HttpStatus.OK).json({
      message: "Staff updated successfully",
      data: updatedStaff,
    });
  }  catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

// Delete Staff
export const deleteStaffController = async (req: Request, res: Response) => {
  const { staffId } = req.params;

  try {
    await StaffHelper.deleteStaff(staffId);

    res.status(HttpStatus.OK).json({
      message: "Staff deleted successfully",
    });
  }  catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

export const staffForHostel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { hostelId } = req.params;
  try {
    const staffs = await StaffHelper.getAllStaffForHostel(hostelId);
    res
      .status(HttpStatus.OK)
      .json({ message: "staff fecthed successfully", data: staffs });
  }  catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};