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
exports.getMaintenanceStatsController = exports.updateMaintenanceRequestController = exports.getAllMaintenanceRequestsController = void 0;
const adminMaintenanceHelper = __importStar(require("../helper/adminMaintenanceHelper"));
const http_status_1 = require("../utils/http-status");
const formatPrisma_1 = require("../utils/formatPrisma");
const http_error_1 = __importDefault(require("../utils/http-error"));
const getAllMaintenanceRequestsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, priority } = req.query;
        const user = req.user;
        if (!user || !user.hostelId) {
            throw new http_error_1.default(http_status_1.HttpStatus.FORBIDDEN, "Admin not assigned to a hostel");
        }
        const requests = yield adminMaintenanceHelper.getAllMaintenanceRequests(user.hostelId, {
            status: status,
            priority: priority,
        });
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Maintenance requests fetched successfully",
            data: requests,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.getAllMaintenanceRequestsController = getAllMaintenanceRequestsController;
const updateMaintenanceRequestController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { requestId } = req.params;
        const updateData = req.body;
        const request = yield adminMaintenanceHelper.updateMaintenanceRequest(requestId, updateData);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Maintenance request updated successfully",
            data: request,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.updateMaintenanceRequestController = updateMaintenanceRequestController;
const getMaintenanceStatsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user || !user.hostelId) {
            throw new http_error_1.default(http_status_1.HttpStatus.FORBIDDEN, "Admin not assigned to a hostel");
        }
        const stats = yield adminMaintenanceHelper.getMaintenanceStats(user.hostelId);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Maintenance stats fetched successfully",
            data: stats,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.getMaintenanceStatsController = getMaintenanceStatsController;
