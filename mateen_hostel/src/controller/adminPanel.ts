import prisma from "../utils/prisma";
import * as bcrypt from "../utils/bcrypt";
import { Role } from "@prisma/client";
import { ErrorResponse } from "../utils/types";
import HttpException from "../utils/http-error";
import { HttpStatus } from "../utils/http-status";
import { clearAllData } from "../helper/adminHelper";
import { formatPrismaError } from "../utils/formatPrisma";
import { Request, Response, NextFunction } from "express";


export const createSuperAdminUser = async () => {
  const adminEmail = String(process.env.ADMIN_EMAIL);
  const adminPassword = String(process.env.ADMIN_PASSWORD);

  // Check if admin user exists
  try {
    const existingAdmin = await prisma.user.findFirst({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hashPassword(adminPassword);

      // Create the super admin user together with a SuperAdminProfile
      await prisma.user.create({
        data: {
          name: "Mateen Kofi Yeboah",
          email: adminEmail,
          password: hashedPassword,
          phone: "0543983427", // Set a default or random number
          role: Role.super_admin,
          imageKey: "",
          imageUrl: "",
          superAdminProfile: {
            create: {
              title: "Super Admin",
              phoneNumber: "0543983427",
            },
          },
        },
      });

      console.log("super admin user created succesfully.");
    } else {
      console.log("super admin user already exists.");
    }
  } catch (error) {
    const err = error as ErrorResponse;
    throw new HttpException(
      err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      err.message || "Failed to check for super admin"
    );
  } finally {
    await prisma.$disconnect(); // Ensure Prisma client disconnects
  }
};

export const clearDatabase = async (req: Request, res: Response) => {
  try {
    await clearAllData();
    res.status(HttpStatus.OK).json({
      message: "Database cleared successfully",
    });
  }  catch (error) {
      const err = formatPrismaError(error); // Ensure this function is used
      res.status(err.status).json({ message: err.message });
    }
  };
