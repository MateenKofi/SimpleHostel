import {
  signUpUser,
  getAllUsers,
  getUserByEmail,
  getUserById,
  updateUser,
  deleteUser,
  userLogIn,
  getUserProfile,
  logout,
  usersForHostel,
  resetUserPassword,
} from "../controller/userController";
import upload from "../utils/multer";
import { validatePayload } from "../middleware/validate-payload";
import { authenticateJWT, authorizeRole } from "../utils/jsonwebtoken";
import { Router } from "express";
import { validateHostelAccess } from "../utils/AccessControl";

import { authLimiter } from "../middleware/rateLimit";

const userRouter = Router();

// User sign up (public endpoint)
userRouter.post(
  "/signup",
  authLimiter,
  upload.single("photo"),
  validatePayload("User"),
  signUpUser
);

// Get all users
userRouter.get(
  "/get",
  authenticateJWT,
  authorizeRole(["super_admin"]),
  getAllUsers,
); // Only accessible by SuperAdmin

// Get user by email
userRouter.get(
  "/email",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  getUserByEmail,
);

// Get user by ID
userRouter.get(
  "/get/:userId",
  authenticateJWT,
  authorizeRole(["super_admin", "admin", "resident"]),
  validateHostelAccess,

  getUserById,
);

// Update user
userRouter.put(
  "/update/:userId",

  upload.single("photo"),
  validatePayload("User"),
  authenticateJWT,
  validateHostelAccess,

  updateUser,
);

// Delete user
userRouter.delete(
  "/delete/:userId",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,

  deleteUser,
);

// User login
userRouter.post("/login", authLimiter, validatePayload("User"), userLogIn);

// Get user profile
userRouter.get("/profile", authenticateJWT, getUserProfile);

// User logout
userRouter.post("/logout", authenticateJWT, logout);
userRouter.get(
  "/get/:hostel/:hostelId",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,

  usersForHostel,
);
userRouter.post("/reset-password", resetUserPassword);
export default userRouter;
