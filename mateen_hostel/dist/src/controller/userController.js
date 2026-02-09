"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetUserPassword = exports.usersForHostel = exports.logout = exports.getUserProfile = exports.userLogIn = exports.verifyAndCreateHostelUser = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUserByEmail = exports.getAllUsers = exports.signUpUser = void 0;
const http_error_1 = __importDefault(require("../utils/http-error"));
const http_status_1 = require("../utils/http-status");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const userHelper = __importStar(require("../helper/userHelper")); // Assuming you have similar helper methods for users
const bcrypt_1 = require("../utils/bcrypt");
const jsonwebtoken_1 = require("../utils/jsonwebtoken");
const jwt_decode_1 = require("jwt-decode");
const hostelHelper_1 = require("../helper/hostelHelper");
const formatPrisma_1 = require("../utils/formatPrisma");
// User registration function
const signUpUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.body;
    const photo = req.file ? req.file.path : undefined;
    const picture = {
        imageUrl: "",
        imageKey: "",
    };
    try {
        if (photo) {
            const uploaded = yield cloudinary_1.default.uploader.upload(photo, {
                folder: "user/",
            });
            if (uploaded) {
                picture.imageUrl = uploaded.secure_url;
                picture.imageKey = uploaded.public_id;
            }
        }
        if (userData.hostelId) {
            const hostel = yield (0, hostelHelper_1.getHostelById)(userData.hostelId);
            if (!hostel) {
                throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Hostel not found");
            }
        }
        const newUser = yield userHelper.createUser(userData, picture);
        res
            .status(http_status_1.HttpStatus.OK)
            .json({ message: "User created successfully", user: newUser });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.signUpUser = signUpUser;
// Get all users
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield userHelper.getUsers();
        res.status(http_status_1.HttpStatus.OK).json(allUsers);
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.getAllUsers = getAllUsers;
// Get a user by email
const getUserByEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield userHelper.getUserByEmail(email);
        res.status(http_status_1.HttpStatus.OK).json(user);
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.getUserByEmail = getUserByEmail;
// Get a user by ID
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const user = yield userHelper.getUserById(userId);
        res.status(http_status_1.HttpStatus.OK).json(user);
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.getUserById = getUserById;
// Update a user
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const userData = req.body;
    const photo = req.file ? req.file.path : undefined;
    const picture = {
        imageUrl: "",
        imageKey: "",
    };
    try {
        if (photo) {
            const uploaded = yield cloudinary_1.default.uploader.upload(photo, {
                folder: "user/",
            });
            if (uploaded) {
                picture.imageUrl = uploaded.secure_url;
                picture.imageKey = uploaded.public_id;
            }
        }
        const updatedUser = yield userHelper.updateUser(userId, userData, picture);
        res
            .status(http_status_1.HttpStatus.OK)
            .json({ message: "User updated successfully", user: updatedUser });
    }
    catch (error) {
        console.error("Update User Error (Controller):", error);
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.updateUser = updateUser;
// Delete a user
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        yield userHelper.deleteUser(userId);
        res
            .status(http_status_1.HttpStatus.OK)
            .json({ message: `User deleted successfully: ${userId}` });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.deleteUser = deleteUser;
// Verify and create hostel user
const verifyAndCreateHostelUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { hostelId } = req.params;
    try {
        const newHostelUser = yield userHelper.verifyAndcreateHostelUser(hostelId);
        // Sending the email with credentials
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Hostel manager user created and credentials sent to email",
            user: newHostelUser,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.verifyAndCreateHostelUser = verifyAndCreateHostelUser;
// User login function
const userLogIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { email, password } = req.body;
        const authHeader = req.header("Authorization");
        console.log("Authorization header:", authHeader);
        const token = (authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer ")) && ((_a = authHeader.split(" ")[1]) === null || _a === void 0 ? void 0 : _a.trim());
        const isTokenValid = token && token !== "null" && token !== "undefined" && token.length > 10;
        // Token-based login flow
        if (isTokenValid) {
            try {
                const decoded = (0, jwt_decode_1.jwtDecode)(token);
                const currentTime = Date.now() / 1000;
                if (decoded.exp && decoded.exp > currentTime) {
                    const user = yield userHelper.getUserById(decoded.id);
                    if (user) {
                        res.status(http_status_1.HttpStatus.OK).json({
                            message: "success logging in",
                            userId: user.id,
                            token,
                        });
                        return;
                    }
                    else {
                        res.status(http_status_1.HttpStatus.NOT_FOUND).json({
                            message: "User not found",
                        });
                        return;
                    }
                }
                else {
                    res.status(http_status_1.HttpStatus.UNAUTHORIZED).json({
                        message: "Token expired. Please log in again.",
                    });
                    return;
                }
            }
            catch (err) {
                console.error("Invalid or expired token:", err);
                res.status(http_status_1.HttpStatus.UNAUTHORIZED).json({
                    message: "Invalid or expired token. Please log in again.",
                });
                return;
            }
        }
        // Fallback: Email/password login
        if (!email || !password) {
            res.status(http_status_1.HttpStatus.BAD_REQUEST).json({
                message: "Email and password are required",
            });
            return;
        }
        const normalizedEmail = email.trim().toLowerCase();
        const user = yield userHelper.getUserByEmailWithPassword(normalizedEmail);
        if (!user) {
            console.log(`[Login] User not found: ${normalizedEmail}`);
            res.status(http_status_1.HttpStatus.UNAUTHORIZED).json({
                message: "Invalid credentials",
            });
            return;
        }
        if (!user.password) {
            console.log(`[Login] User found but has NO password hash: ${normalizedEmail}`);
            res.status(http_status_1.HttpStatus.UNAUTHORIZED).json({
                message: "Invalid credentials",
            });
            return;
        }
        const isMatch = yield (0, bcrypt_1.compare)(password, user.password);
        if (!isMatch) {
            console.log(`[Login] Password mismatch for user: ${normalizedEmail}`);
            res.status(http_status_1.HttpStatus.UNAUTHORIZED).json({
                message: "Invalid credentials",
            });
            return;
        }
        const newToken = (0, jsonwebtoken_1.signToken)({
            id: user.id,
            role: user.role,
            hostelId: (_b = user.hostel) === null || _b === void 0 ? void 0 : _b.id,
        });
        res.status(http_status_1.HttpStatus.OK).json({
            userId: user.id,
            message: "login successful",
            token: newToken,
        });
        return;
    }
    catch (error) {
        console.error("Login error:", error);
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
        return;
    }
});
exports.userLogIn = userLogIn;
// Get user profile
const getUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.header("Authorization");
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
    if (token) {
        const decoded = (0, jwt_decode_1.jwtDecode)(token);
        const user = yield userHelper.getUserById(decoded === null || decoded === void 0 ? void 0 : decoded.id);
        if (user) {
            res.status(http_status_1.HttpStatus.OK).json({ user });
        }
        else {
            res.status(http_status_1.HttpStatus.NOT_FOUND).json({ message: "User not found" });
        }
    }
    else {
        res.status(http_status_1.HttpStatus.FORBIDDEN).json({ message: "No token found" });
    }
});
exports.getUserProfile = getUserProfile;
// User logout function
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, jsonwebtoken_1.setInvalidToken)();
        res.status(http_status_1.HttpStatus.OK).json({ message: "Logout successful" });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.logout = logout;
const usersForHostel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { hostelId } = req.params;
    try {
        const users = yield userHelper.getAllUsersForHostel(hostelId);
        res
            .status(http_status_1.HttpStatus.OK)
            .json({ message: "users fecthed successfully", data: users });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.usersForHostel = usersForHostel;
const resetUserPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    try {
        const result = yield userHelper.resetPassword(email);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Password reset link sent to your email",
            data: result,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.resetUserPassword = resetUserPassword;
