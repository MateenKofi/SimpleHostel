import { Request, Response } from "express";
import * as hostelHelper from "../helper/hostelHelper"; // Assuming you have your service functions in this file
import { HttpStatus } from "../utils/http-status";
import HttpException from "../utils/http-error";
import { Hostel } from "@prisma/client";
import cloudinary from "../utils/cloudinary";
import {
  HostelRequestDto,
  UpdateHostelRequestDto,
} from "../zodSchema/hostelSchema";
import { formatPrismaError } from "../utils/formatPrisma";

// Add a Hostel
export const addHostelController = async (req: Request, res: Response) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const hostelData: Hostel = req.body satisfies HostelRequestDto;
  const pictures = [];
  const uploadedImages = [];
  let logoInfo = null;

  try {
    // Handle logo upload
    if (files.logo && files.logo[0]) {
      const uploadedLogo = await cloudinary.uploader.upload(
        files.logo[0].path,
        {
          folder: "hostel/logos/",
        },
      );

      if (uploadedLogo) {
        logoInfo = {
          logoUrl: uploadedLogo.secure_url,
          logoKey: uploadedLogo.public_id,
        };
        uploadedImages.push(uploadedLogo.public_id);
      }
    }

    // Handle photos upload
    if (files.photos && files.photos.length > 0) {
      for (const photo of files.photos) {
        const uploaded = await cloudinary.uploader.upload(photo.path, {
          folder: "hostel/photos/",
        });

        if (uploaded) {
          pictures.push({
            imageUrl: uploaded.secure_url,
            imageKey: uploaded.public_id,
          });
          uploadedImages.push(uploaded.public_id);
        }
      }
    }

    const newHostel = await hostelHelper.addHostel(
      hostelData,
      pictures,
      logoInfo,
    );

    res.status(HttpStatus.CREATED).json({
      message: "Hostel created successfully",
      data: newHostel,
    });
  } catch (error) {
    // If there's an error, delete all uploaded images from cloudinary
    if (uploadedImages.length > 0) {
      for (const imageKey of uploadedImages) {
        await cloudinary.uploader.destroy(imageKey);
      }
    }

    const err = formatPrismaError(error);
    res.status(err.status).json({ message: err.message });
  }
};

// Get All Hostels
export const getAllHostelsController = async (req: Request, res: Response) => {
  try {
    const hostels = await hostelHelper.getAllHostels();

    res.status(HttpStatus.OK).json({
      message: "Hostels fetched successfully",
      data: hostels,
    });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

// Get Hostel by ID
export const getHostelByIdController = async (req: Request, res: Response) => {
  const { hostelId } = req.params;

  try {
    const hostel = await hostelHelper.getHostelById(hostelId);

    res.status(HttpStatus.OK).json({
      message: "Hostel fetched successfully",
      data: hostel,
    });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

// Update a Hostel
export const updateHostelController = async (req: Request, res: Response) => {
  const { hostelId } = req.params;
  const hostelData: Partial<Hostel> = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const pictures = [];
  let logoInfo = null;

  try {
    // Handle logo upload
    if (files.logo && files.logo[0]) {
      const uploadedLogo = await cloudinary.uploader.upload(
        files.logo[0].path,
        {
          folder: "hostel/logos/",
        },
      );

      if (uploadedLogo) {
        logoInfo = {
          logoUrl: uploadedLogo.secure_url,
          logoKey: uploadedLogo.public_id,
        };
      }
    }

    // Handle photos upload
    if (files.photos && files.photos.length > 0) {
      for (const photo of files.photos) {
        const uploaded = await cloudinary.uploader.upload(photo.path, {
          folder: "hostel/photos/",
        });

        if (uploaded) {
          pictures.push({
            imageUrl: uploaded.secure_url,
            imageKey: uploaded.public_id,
          });
        }
      }
    }

    const updatedHostel = await hostelHelper.updateHostel(
      hostelId,
      hostelData,
      pictures,
      logoInfo,
    );

    res.status(HttpStatus.OK).json({
      message: "Hostel updated successfully",
      data: updatedHostel,
    });
  } catch (error) {
    const err = formatPrismaError(error);
    res.status(err.status).json({ message: err.message });
  }
};

// Delete Hostel
export const deleteHostelController = async (req: Request, res: Response) => {
  const { hostelId } = req.params;

  try {
    const result = await hostelHelper.deleteHostel(hostelId);

    res.status(HttpStatus.OK).json({
      message: result.message,
    });
  } catch (error) {
    const err = formatPrismaError(error);
    res.status(err.status).json({ message: err.message });
  }
};

export const unverifiedHostel = async (req: Request, res: Response) => {
  try {
    const hostels = await hostelHelper.getUnverifiedHostel();
    res.status(HttpStatus.OK).json({
      message: "Hostels fetched successfully",
      data: hostels,
    });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

export const publishHostel = async (req: Request, res: Response) => {
  try {
    const { hostelId } = req.params;
    await hostelHelper.publishHostel(hostelId);

    res.status(HttpStatus.OK).json({
      message: "Hostel published successfully",
    });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

export const unPublishHostel = async (req: Request, res: Response) => {
  try {
    const { hostelId } = req.params;
    await hostelHelper.unPublishHostel(hostelId);

    res.status(HttpStatus.OK).json({
      message: "Hostel unpublished successfully",
    });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

export const updateHostelRulesController = async (req: Request, res: Response) => {
  const { hostelId } = req.params;
  const file = req.file;

  try {
    if (!file) {
      throw new HttpException(HttpStatus.BAD_REQUEST, "No rules file provided");
    }

    const uploaded = await cloudinary.uploader.upload(file.path, {
      folder: "hostel/rules/",
      resource_type: "raw", // Allow PDF, images, etc. as raw files to avoid processing issues
    });

    if (!uploaded) {
      throw new HttpException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to upload rules");
    }

    const updatedHostel = await hostelHelper.updateHostelRules(hostelId, {
      rulesUrl: uploaded.secure_url,
      rulesKey: uploaded.public_id,
    });

    res.status(HttpStatus.OK).json({
      message: "Hostel rules updated successfully",
      data: updatedHostel,
    });
  } catch (error) {
    const err = formatPrismaError(error);
    res.status(err.status).json({ message: err.message });
  }
};

export const updatePaymentSettingsController = async (req: Request, res: Response) => {
  const { hostelId } = req.params;
  const settings = req.body;

  try {
    const updatedHostel = await hostelHelper.updatePaymentSettings(hostelId, settings);

    res.status(HttpStatus.OK).json({
      message: "Payment settings updated successfully",
      data: updatedHostel,
    });
  } catch (error) {
    const err = formatPrismaError(error);
    res.status(err.status).json({ message: err.message });
  }
};

export const updateHostelDocumentsController = async (req: Request, res: Response) => {
  const { hostelId } = req.params;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  try {
    let signatureUrl, stampUrl;

    if (files.signature && files.signature[0]) {
      const uploaded = await cloudinary.uploader.upload(files.signature[0].path, {
        folder: "hostel/documents/",
      });
      signatureUrl = uploaded.secure_url;
    }

    if (files.stamp && files.stamp[0]) {
      const uploaded = await cloudinary.uploader.upload(files.stamp[0].path, {
        folder: "hostel/documents/",
      });
      stampUrl = uploaded.secure_url;
    }

    const updatedHostel = await hostelHelper.updateHostelDocuments(hostelId, {
      signatureUrl,
      stampUrl,
    });

    res.status(HttpStatus.OK).json({
      message: "Hostel documents updated successfully",
      data: updatedHostel,
    });
  } catch (error) {
    const err = formatPrismaError(error);
    res.status(err.status).json({ message: err.message });
  }
};
