"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = require("../controller/userController");
const multer_1 = __importDefault(require("../utils/multer"));
const validate_payload_1 = require("../middleware/validate-payload");
const jsonwebtoken_1 = require("../utils/jsonwebtoken");
const express_1 = require("express");
const AccessControl_1 = require("../utils/AccessControl");
const rateLimit_1 = require("../middleware/rateLimit");
const userRouter = (0, express_1.Router)();
// User sign up (public endpoint)
userRouter.post("/signup", rateLimit_1.authLimiter, multer_1.default.single("photo"), (0, validate_payload_1.validatePayload)("User"), userController_1.signUpUser);
// Get all users
userRouter.get("/get", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin"]), userController_1.getAllUsers); // Only accessible by SuperAdmin
// Get user by email
userRouter.get("/email", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), userController_1.getUserByEmail);
// Get user by ID
userRouter.get("/get/:userId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin", "resident"]), AccessControl_1.validateHostelAccess, userController_1.getUserById);
// Update user
userRouter.put("/update/:userId", multer_1.default.single("photo"), (0, validate_payload_1.validatePayload)("User"), jsonwebtoken_1.authenticateJWT, AccessControl_1.validateHostelAccess, userController_1.updateUser);
// Delete user
userRouter.delete("/delete/:userId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), AccessControl_1.validateHostelAccess, userController_1.deleteUser);
// User login
userRouter.post("/login", rateLimit_1.authLimiter, (0, validate_payload_1.validatePayload)("User"), userController_1.userLogIn);
// Get user profile
userRouter.get("/profile", jsonwebtoken_1.authenticateJWT, userController_1.getUserProfile);
// User logout
userRouter.post("/logout", jsonwebtoken_1.authenticateJWT, userController_1.logout);
userRouter.get("/get/:hostel/:hostelId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), AccessControl_1.validateHostelAccess, userController_1.usersForHostel);
userRouter.post("/reset-password", userController_1.resetUserPassword);
exports.default = userRouter;
