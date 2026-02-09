"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.getAllUsersForHostel = exports.getUserProfileHelper = exports.verifyAndcreateHostelUser = exports.updateUser = exports.deleteUser = exports.getUserByEmailWithPassword = exports.getUserByEmail = exports.getUserById = exports.getUsers = exports.createUser = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const http_error_1 = __importDefault(require("../utils/http-error"));
const http_status_1 = require("../utils/http-status");
const client_1 = require("@prisma/client");
const userSchema_1 = require("../zodSchema/userSchema");
const bcrypt_1 = require("../utils/bcrypt");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const generatepass_1 = require("../utils/generatepass");
const nodeMailer_1 = require("../utils/nodeMailer");
const jwt_decode_1 = require("jwt-decode");
const formatPrisma_1 = require("../utils/formatPrisma");
const generateAdminEmail_1 = require("../services/generateAdminEmail");
const generateResetPasswword_1 = require("../services/generateResetPasswword");
const dto_1 = require("../utils/dto");
const userInclude = {
    hostel: true,
    adminProfile: {
        include: {
            hostel: true,
        },
    },
    staffProfile: {
        include: {
            hostel: true,
        },
    },
    residentProfile: {
        include: {
            hostel: true,
            room: true,
        },
    },
    superAdminProfile: true,
};
// Use toUserDto from ../utils/dto for standardized output
function ensureActiveUser(user) {
    if (!user || user.deletedAt) {
        throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "User not found");
    }
    return user;
}
function ensureEmailAvailable(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingUser = yield prisma_1.default.user.findFirst({
            where: {
                email,
                deletedAt: null,
            },
        });
        if (existingUser) {
            throw new http_error_1.default(http_status_1.HttpStatus.CONFLICT, "Email already exists");
        }
    });
}
function resolveAvatar(picture, fallback) {
    if ((picture === null || picture === void 0 ? void 0 : picture.imageUrl) && picture.imageUrl.trim().length > 0) {
        return picture.imageUrl;
    }
    if (fallback && fallback.trim().length > 0) {
        return fallback;
    }
    return undefined;
}
function splitManagerName(name) {
    return { name };
}
function buildUserUpdateData(userData, picture) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const data = {};
        if (userData.name !== undefined)
            data.name = userData.name;
        if (userData.email !== undefined)
            data.email = userData.email;
        if (userData.phone !== undefined)
            data.phone = userData.phone;
        else if (userData.phoneNumber !== undefined)
            data.phone = userData.phoneNumber;
        if (userData.gender !== undefined)
            data.gender = (_a = userData.gender) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        if (userData.accountStatus !== undefined)
            data.accountStatus = (_b = userData.accountStatus) === null || _b === void 0 ? void 0 : _b.toLowerCase();
        if (userData.avatar !== undefined)
            data.avatar = userData.avatar;
        if (userData.imageUrl !== undefined)
            data.imageUrl = userData.imageUrl;
        if (userData.imageKey !== undefined)
            data.imageKey = userData.imageKey;
        if (picture === null || picture === void 0 ? void 0 : picture.imageUrl) {
            data.avatar = picture.imageUrl;
            data.imageUrl = picture.imageUrl;
        }
        if (picture === null || picture === void 0 ? void 0 : picture.imageKey) {
            data.imageKey = picture.imageKey;
        }
        if (userData.password) {
            data.password = yield (0, bcrypt_1.hashPassword)(userData.password);
            data.changedPassword = true;
        }
        return data;
    });
}
const createUser = (userData, picture) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    try {
        const validateUser = userSchema_1.userSchema.safeParse(userData);
        if (!validateUser.success) {
            const errors = validateUser.error.issues.map(({ message, path }) => `${path}: ${message}`);
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, errors.join(". "));
        }
        const normalizedEmail = (_a = userData.email) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
        const { password, name } = userData;
        if (!normalizedEmail || !password) {
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, "Email and password are required");
        }
        if (!name) {
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, "Name is required");
        }
        const normalizedPhone = (_c = (_b = userData.phone) !== null && _b !== void 0 ? _b : userData.phoneNumber) !== null && _c !== void 0 ? _c : null;
        const avatar = resolveAvatar(picture, userData.avatar);
        // Check for existing non-deleted user
        const findUser = yield prisma_1.default.user.findFirst({
            where: {
                email: normalizedEmail,
                deletedAt: null,
            },
        });
        if (findUser) {
            throw new http_error_1.default(http_status_1.HttpStatus.CONFLICT, "Email already exists");
        }
        const hashedPassword = yield (0, bcrypt_1.hashPassword)(password);
        const userRecord = {
            email: normalizedEmail,
            password: hashedPassword,
            name,
            role: (_d = userData.role) !== null && _d !== void 0 ? _d : client_1.Role.admin,
            gender: (_e = userData.gender) !== null && _e !== void 0 ? _e : null,
            phone: normalizedPhone,
        };
        // Attach role-specific profiles
        if (userData.role === client_1.Role.staff) {
            userRecord.staffProfile = {
                create: {
                    hostelId: (_f = userData.hostelId) !== null && _f !== void 0 ? _f : undefined,
                },
            };
        }
        else if (userData.role === client_1.Role.resident) {
            userRecord.residentProfile = {
                create: {
                    hostelId: (_g = userData.hostelId) !== null && _g !== void 0 ? _g : undefined,
                },
            };
        }
        else if (userData.role === client_1.Role.super_admin) {
            // Super admins do not belong to any hostel; create a profile without hostel linkage
            userRecord.superAdminProfile = {
                create: {
                    phoneNumber: normalizedPhone !== null && normalizedPhone !== void 0 ? normalizedPhone : undefined,
                },
            };
        }
        if (avatar) {
            userRecord.avatar = avatar;
        }
        const resolvedImageUrl = (_j = (_h = picture === null || picture === void 0 ? void 0 : picture.imageUrl) !== null && _h !== void 0 ? _h : userData.imageUrl) !== null && _j !== void 0 ? _j : undefined;
        if (resolvedImageUrl) {
            userRecord.imageUrl = resolvedImageUrl;
        }
        const resolvedImageKey = (_l = (_k = picture === null || picture === void 0 ? void 0 : picture.imageKey) !== null && _k !== void 0 ? _k : userData.imageKey) !== null && _l !== void 0 ? _l : undefined;
        if (resolvedImageKey) {
            userRecord.imageKey = resolvedImageKey;
        }
        if (userData.accountStatus) {
            userRecord.accountStatus = userData.accountStatus;
        }
        const newUser = yield prisma_1.default.user.create({
            data: userRecord,
        });
        const { password: storedPassword } = newUser, restOfUser = __rest(newUser, ["password"]);
        return restOfUser;
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.createUser = createUser;
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma_1.default.user.findMany({
            where: {
                deletedAt: null,
            },
            include: userInclude,
        });
        return users.map((u) => (0, dto_1.toUserDto)(u));
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getUsers = getUsers;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma_1.default.user.findFirst({
            where: { id, deletedAt: null }, // Only get non-deleted users
            include: userInclude,
        });
        if (!user) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "User not found.");
        }
        return (0, dto_1.toUserDto)(user);
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getUserById = getUserById;
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const normalizedEmail = email.trim().toLowerCase();
        const user = yield prisma_1.default.user.findFirst({
            where: {
                email: normalizedEmail,
                deletedAt: null, // Only get non-deleted users
            },
            include: userInclude,
        });
        if (!user) {
            return null;
        }
        return (0, dto_1.toUserDto)(user);
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getUserByEmail = getUserByEmail;
/**
 * Retrieves a user by email INCLUDING the password.
 * This should ONLY be used for internal authentication logic (e.g., login verification).
 * DO NOT return the result of this function directly in an API response.
 */
const getUserByEmailWithPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const normalizedEmail = email.trim().toLowerCase();
        const user = yield prisma_1.default.user.findFirst({
            where: {
                email: normalizedEmail,
                deletedAt: null,
            },
            include: userInclude,
        });
        if (!user) {
            return null;
        }
        return (0, dto_1.toInternalUserDto)(user);
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getUserByEmailWithPassword = getUserByEmailWithPassword;
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findUser = yield (0, exports.getUserById)(id);
        if (!findUser) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "User does not exist");
        }
        // Instead of deleting, mark the user as soft deleted
        yield prisma_1.default.user.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
        return { message: "User soft deleted successfully" };
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.deleteUser = deleteUser;
const updateUser = (id, UserData, picture) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateUser = userSchema_1.updateUserSchema.safeParse(UserData);
        if (!validateUser.success) {
            const errors = validateUser.error.issues.map(({ message, path }) => `${path}: ${message}`);
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, errors.join(". "));
        }
        const findUser = yield prisma_1.default.user.findUnique({ where: { id } });
        if (!findUser) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "User not found");
        }
        if ((picture === null || picture === void 0 ? void 0 : picture.imageKey) && findUser.imageKey) {
            yield cloudinary_1.default.uploader.destroy(findUser.imageKey);
        }
        const data = yield buildUserUpdateData(UserData, picture);
        const updatedUser = yield prisma_1.default.user.update({
            where: { id },
            data,
        });
        const { password: _ } = updatedUser, restOfUpdate = __rest(updatedUser, ["password"]);
        return restOfUpdate;
    }
    catch (error) {
        console.error("Update User Error (Helper):", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.updateUser = updateUser;
const verifyAndcreateHostelUser = (hostelId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hostel = yield prisma_1.default.hostel.findUnique({ where: { id: hostelId } });
        if (!hostel) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Hostel not found");
        }
        // 2. Check if the hostel manager email already exists
        const { email, isVerified } = hostel;
        const findUser = yield prisma_1.default.user.findFirst({
            where: { email, deletedAt: null },
        });
        if (findUser || isVerified) {
            throw new http_error_1.default(http_status_1.HttpStatus.CONFLICT, "Email already exists or is verified");
        }
        yield prisma_1.default.hostel.update({
            where: { id: hostelId },
            data: { isVerified: true },
        });
        // 3. Generate a password for the user
        const generatedPassword = (0, generatepass_1.generatePassword)();
        const hashedPassword = yield (0, bcrypt_1.hashPassword)(generatedPassword);
        const managerNames = splitManagerName(hostel.manager);
        // 4. Create the user account
        // Normalize email to lowercase for consistency with login
        const normalizedEmail = email.trim().toLowerCase();
        const newUser = yield prisma_1.default.user.create({
            data: {
                email: normalizedEmail,
                password: hashedPassword,
                name: managerNames.name,
                phone: hostel.phone,
                role: client_1.Role.admin,
                adminProfile: {
                    create: {
                        hostelId: hostel.id,
                        position: "Manager",
                    },
                },
            },
        });
        // 5. Send the generated credentials to the email
        const htmlContent = (0, generateAdminEmail_1.generateAdminWelcomeEmail)(email, generatedPassword);
        yield (0, nodeMailer_1.sendEmail)(email, "Your Hostel Admin Account", htmlContent);
        // 6. Return the user without password
        const { password: _ } = newUser, restOfUser = __rest(newUser, ["password"]);
        return restOfUser;
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.verifyAndcreateHostelUser = verifyAndcreateHostelUser;
const getUserProfileHelper = (authHeader) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!authHeader) {
            throw new http_error_1.default(http_status_1.HttpStatus.FORBIDDEN, "No token provided");
        }
        const token = authHeader.split(" ")[1]; // Extract the token from 'Bearer <token>'
        if (!token) {
            throw new http_error_1.default(http_status_1.HttpStatus.FORBIDDEN, "Invalid token format");
        }
        let decoded;
        try {
            decoded = (0, jwt_decode_1.jwtDecode)(token); // Decode the token
        }
        catch (error) {
            throw new http_error_1.default(http_status_1.HttpStatus.UNAUTHORIZED, "Invalid token");
        }
        const currentTime = Date.now() / 1000;
        if ((decoded === null || decoded === void 0 ? void 0 : decoded.exp) < currentTime) {
            throw new http_error_1.default(http_status_1.HttpStatus.UNAUTHORIZED, "Token expired");
        }
        // Fetch the user profile from DB using the user ID
        const user = yield prisma_1.default.user.findUnique({
            where: { id: decoded.id },
        });
        if (!user) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "User not found");
        }
        return user; // Return the found user
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getUserProfileHelper = getUserProfileHelper;
const getAllUsersForHostel = (hostelId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Users = yield prisma_1.default.user.findMany({
            where: {
                hostel: {
                    is: {
                        id: hostelId,
                        deletedAt: null,
                    },
                },
                deletedAt: null,
            },
            include: {
                hostel: true,
            },
        });
        return Users.map((u) => (0, dto_1.toUserDto)(u));
    }
    catch (error) {
        throw error;
    }
});
exports.getAllUsersForHostel = getAllUsersForHostel;
const resetPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    if (!email) {
        throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, "Email is required");
    }
    try {
        const user = yield prisma_1.default.user.findFirst({
            where: { email, deletedAt: null },
        });
        if (!user) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "User not found");
        }
        const newPassword = (0, generatepass_1.generatePassword)();
        const hashedPassword = yield (0, bcrypt_1.hashPassword)(newPassword);
        yield prisma_1.default.user.update({
            where: { id: user.id },
            data: { password: hashedPassword, changedPassword: false },
        });
        const htmlContent = (0, generateResetPasswword_1.generateResetPasswordEmail)(email, newPassword);
        yield (0, nodeMailer_1.sendEmail)(email, "Password Reset", htmlContent);
        return { message: "Password reset successfully. Check your email." };
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.resetPassword = resetPassword;
