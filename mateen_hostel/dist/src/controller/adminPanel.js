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
exports.clearDatabase = exports.createSuperAdminUser = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const bcrypt = __importStar(require("../utils/bcrypt"));
const client_1 = require("@prisma/client");
const http_error_1 = __importDefault(require("../utils/http-error"));
const http_status_1 = require("../utils/http-status");
const adminHelper_1 = require("../helper/adminHelper");
const formatPrisma_1 = require("../utils/formatPrisma");
const createSuperAdminUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const adminEmail = String(process.env.ADMIN_EMAIL);
    const adminPassword = String(process.env.ADMIN_PASSWORD);
    // Check if admin user exists
    try {
        const existingAdmin = yield prisma_1.default.user.findFirst({
            where: { email: adminEmail },
        });
        if (!existingAdmin) {
            const hashedPassword = yield bcrypt.hashPassword(adminPassword);
            // Create the super admin user together with a SuperAdminProfile
            yield prisma_1.default.user.create({
                data: {
                    name: "Mateen Kofi Yeboah",
                    email: adminEmail,
                    password: hashedPassword,
                    phone: "0543983427", // Set a default or random number
                    role: client_1.Role.super_admin,
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
        }
        else {
            console.log("super admin user already exists.");
        }
    }
    catch (error) {
        const err = error;
        throw new http_error_1.default(err.status || http_status_1.HttpStatus.INTERNAL_SERVER_ERROR, err.message || "Failed to check for super admin");
    }
    finally {
        yield prisma_1.default.$disconnect(); // Ensure Prisma client disconnects
    }
});
exports.createSuperAdminUser = createSuperAdminUser;
const clearDatabase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, adminHelper_1.clearAllData)();
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Database cleared successfully",
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.clearDatabase = clearDatabase;
