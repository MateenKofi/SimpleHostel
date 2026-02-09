import { Request, Response, NextFunction } from "express";
import HttpException from "../utils/http-error";
import { HttpStatus } from "../utils/http-status";
import { ErrorResponse } from "../utils/types";
import cloudinary from "../utils/cloudinary";
import * as userHelper from "../helper/userHelper"; // Assuming you have similar helper methods for users
import type { User } from "@prisma/client";
import { compare } from "../utils/bcrypt";
import { setInvalidToken, signToken, UserPayload } from "../utils/jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import { getHostelById } from "../helper/hostelHelper";
import prisma from "../utils/prisma";
import { formatPrismaError } from "../utils/formatPrisma";
import { clearAllData } from "../helper/adminHelper";

// User registration function
export const signUpUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userData: User = req.body;
  const photo = req.file ? req.file.path : undefined;
  const picture = {
    imageUrl: "",
    imageKey: "",
  };

  try {
    if (photo) {
      const uploaded = await cloudinary.uploader.upload(photo, {
        folder: "user/",
      });
      if (uploaded) {
        picture.imageUrl = uploaded.secure_url;
        picture.imageKey = uploaded.public_id;
      }
    }
    if (userData.hostelId) {
      const hostel = await getHostelById(userData.hostelId);
      if (!hostel) {
        throw new HttpException(HttpStatus.NOT_FOUND, "Hostel not found");
      }
    }
    const newUser = await userHelper.createUser(userData, picture);
    res
      .status(HttpStatus.OK)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

// Get all users
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const allUsers = await userHelper.getUsers();
    res.status(HttpStatus.OK).json(allUsers);
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

// Get a user by email
export const getUserByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;
    const user = await userHelper.getUserByEmail(email);
    res.status(HttpStatus.OK).json(user);
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

// Get a user by ID
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;
    const user = await userHelper.getUserById(userId);
    res.status(HttpStatus.OK).json(user);
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

// Update a user
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req.params;
  const userData: Partial<User> = req.body;
  const photo = req.file ? req.file.path : undefined;
  const picture = {
    imageUrl: "",
    imageKey: "",
  };

  try {
    if (photo) {
      const uploaded = await cloudinary.uploader.upload(photo, {
        folder: "user/",
      });
      if (uploaded) {
        picture.imageUrl = uploaded.secure_url;
        picture.imageKey = uploaded.public_id;
      }
    }

    const updatedUser = await userHelper.updateUser(userId, userData, picture);
    res
      .status(HttpStatus.OK)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Update User Error (Controller):", error);
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

// Delete a user
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req.params;
  try {
    await userHelper.deleteUser(userId);
    res
      .status(HttpStatus.OK)
      .json({ message: `User deleted successfully: ${userId}` });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

// Verify and create hostel user
export const verifyAndCreateHostelUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { hostelId } = req.params;

  try {
    const newHostelUser = await userHelper.verifyAndcreateHostelUser(hostelId);

    // Sending the email with credentials

    res.status(HttpStatus.OK).json({
      message: "Hostel manager user created and credentials sent to email",
      user: newHostelUser,
    });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

// User login function

export const userLogIn = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const authHeader = req.header("Authorization");
    console.log("Authorization header:", authHeader);

    const token =
      authHeader?.startsWith("Bearer ") && authHeader.split(" ")[1]?.trim();

    const isTokenValid =
      token && token !== "null" && token !== "undefined" && token.length > 10;

    // Token-based login flow
    if (isTokenValid) {
      try {
        const decoded = jwtDecode<UserPayload & { exp: number }>(token!);
        const currentTime = Date.now() / 1000;

        if (decoded.exp && decoded.exp > currentTime) {
          const user = await userHelper.getUserById(decoded.id);
          if (user) {
            res.status(HttpStatus.OK).json({
              message: "success logging in",
              userId: user.id,
              token,
            });
            return;
          } else {
            res.status(HttpStatus.NOT_FOUND).json({
              message: "User not found",
            });
            return;
          }
        } else {
          res.status(HttpStatus.UNAUTHORIZED).json({
            message: "Token expired. Please log in again.",
          });
          return;
        }
      } catch (err) {
        console.error("Invalid or expired token:", err);
        res.status(HttpStatus.UNAUTHORIZED).json({
          message: "Invalid or expired token. Please log in again.",
        });
        return;
      }
    }

    // Fallback: Email/password login
    if (!email || !password) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: "Email and password are required",
      });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await userHelper.getUserByEmailWithPassword(normalizedEmail);

    if (!user) {
      console.log(`[Login] User not found: ${normalizedEmail}`);
      res.status(HttpStatus.UNAUTHORIZED).json({
        message: "Invalid credentials",
      });
      return;
    }

    if (!user.password) {
      console.log(`[Login] User found but has NO password hash: ${normalizedEmail}`);
      res.status(HttpStatus.UNAUTHORIZED).json({
        message: "Invalid credentials",
      });
      return;
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      console.log(`[Login] Password mismatch for user: ${normalizedEmail}`);
      res.status(HttpStatus.UNAUTHORIZED).json({
        message: "Invalid credentials",
      });
      return;
    }

    const newToken = signToken({
      id: user.id,
      role: user.role,
      hostelId: user.hostel?.id,
    });

    res.status(HttpStatus.OK).json({
      userId: user.id,
      message: "login successful",
      token: newToken,
    });
    return;
  } catch (error) {
    console.error("Login error:", error);
    const err = formatPrismaError(error);
    res.status(err.status).json({ message: err.message });
    return;
  }
};

// Get user profile
export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.header("Authorization");

  const token = authHeader?.split(" ")[1];
  if (token) {
    const decoded = jwtDecode(token) as UserPayload;
    const user = await userHelper.getUserById(decoded?.id);
    if (user) {
      res.status(HttpStatus.OK).json({ user });
    } else {
      res.status(HttpStatus.NOT_FOUND).json({ message: "User not found" });
    }
  } else {
    res.status(HttpStatus.FORBIDDEN).json({ message: "No token found" });
  }
};

// User logout function
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    setInvalidToken();
    res.status(HttpStatus.OK).json({ message: "Logout successful" });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

export const usersForHostel = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { hostelId } = req.params;
  try {
    const users = await userHelper.getAllUsersForHostel(hostelId);
    res
      .status(HttpStatus.OK)
      .json({ message: "users fecthed successfully", data: users });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};

export const resetUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const email = req.body.email;
  try {
    const result = await userHelper.resetPassword(email);
    res.status(HttpStatus.OK).json({
      message: "Password reset link sent to your email",
      data: result,
    });
  } catch (error) {
    const err = formatPrismaError(error); // Ensure this function is used
    res.status(err.status).json({ message: err.message });
  }
};
