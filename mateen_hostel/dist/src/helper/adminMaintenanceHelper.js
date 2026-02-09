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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMaintenanceStats = exports.updateMaintenanceRequest = exports.getAllMaintenanceRequests = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const http_error_1 = __importDefault(require("../utils/http-error"));
const http_status_1 = require("../utils/http-status");
const formatPrisma_1 = require("../utils/formatPrisma");
const requestSchema_1 = require("../zodSchema/requestSchema");
const dto_1 = require("../utils/dto");
const getAllMaintenanceRequests = (hostelId_1, ...args_1) => __awaiter(void 0, [hostelId_1, ...args_1], void 0, function* (hostelId, filters = {}) {
    try {
        const requests = yield prisma_1.default.maintenanceRequest.findMany({
            where: Object.assign({ hostelId }, filters),
            include: {
                resident: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                                phone: true,
                            },
                        },
                        room: {
                            select: {
                                number: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        return requests.map((req) => (0, dto_1.toMaintenanceRequestDto)(req));
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getAllMaintenanceRequests = getAllMaintenanceRequests;
const updateMaintenanceRequest = (requestId, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validate = requestSchema_1.updateMaintenanceStatusSchema.safeParse(data);
        if (!validate.success) {
            const errors = validate.error.issues.map(({ message, path }) => `${path}: ${message}`);
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, errors.join(". "));
        }
        const request = yield prisma_1.default.maintenanceRequest.findUnique({
            where: { id: requestId },
        });
        if (!request) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Maintenance request not found");
        }
        yield prisma_1.default.maintenanceRequest.update({
            where: { id: requestId },
            data: {
                status: data.status,
                priority: data.priority,
            },
        });
        const updatedRequestWithDetails = yield prisma_1.default.maintenanceRequest.findUnique({
            where: { id: requestId },
            include: { resident: { include: { user: true, room: true } } },
        });
        return updatedRequestWithDetails ? (0, dto_1.toMaintenanceRequestDto)(updatedRequestWithDetails) : null;
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.updateMaintenanceRequest = updateMaintenanceRequest;
const getMaintenanceStats = (hostelId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stats = yield prisma_1.default.maintenanceRequest.groupBy({
            by: ["status"],
            where: { hostelId },
            _count: {
                _all: true,
            },
        });
        const priorityStats = yield prisma_1.default.maintenanceRequest.count({
            where: { hostelId, priority: "critical" },
        });
        const result = {
            pending: 0,
            in_progress: 0,
            resolved: 0,
            rejected: 0,
            critical: priorityStats,
        };
        stats.forEach((stat) => {
            // @ts-ignore
            result[stat.status] = stat._count._all;
        });
        return result;
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getMaintenanceStats = getMaintenanceStats;
