import prisma from "../utils/prisma";
import HttpException from "../utils/http-error";
import { HttpStatus } from "../utils/http-status";
import { formatPrismaError } from "../utils/formatPrisma";
import { UpdateMaintenanceStatusDto, updateMaintenanceStatusSchema } from "../zodSchema/requestSchema";
import { RequestStatus, Priority } from "@prisma/client";
import { toMaintenanceRequestDto } from "../utils/dto";

export const getAllMaintenanceRequests = async (
    hostelId: string,
    filters: { status?: RequestStatus; priority?: Priority } = {},
) => {
    try {
        const requests = await prisma.maintenanceRequest.findMany({
            where: {
                hostelId,
                ...filters,
            },
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

        return requests.map((req) => toMaintenanceRequestDto(req as any));
    } catch (error) {
        throw formatPrismaError(error);
    }
};

export const updateMaintenanceRequest = async (
    requestId: string,
    data: UpdateMaintenanceStatusDto,
) => {
    try {
        const validate = updateMaintenanceStatusSchema.safeParse(data);
        if (!validate.success) {
            const errors = validate.error.issues.map(
                ({ message, path }) => `${path}: ${message}`,
            );
            throw new HttpException(HttpStatus.BAD_REQUEST, errors.join(". "));
        }

        const request = await prisma.maintenanceRequest.findUnique({
            where: { id: requestId },
        });

        if (!request) {
            throw new HttpException(HttpStatus.NOT_FOUND, "Maintenance request not found");
        }

        await prisma.maintenanceRequest.update({
            where: { id: requestId },
            data: {
                status: data.status,
                priority: data.priority,
            },
        });

        const updatedRequestWithDetails = await prisma.maintenanceRequest.findUnique({
            where: { id: requestId },
            include: { resident: { include: { user: true, room: true } } },
        });

        return updatedRequestWithDetails ? toMaintenanceRequestDto(updatedRequestWithDetails as any) : null;
    } catch (error) {
        throw formatPrismaError(error);
    }
};

export const getMaintenanceStats = async (hostelId: string) => {
    try {
        const stats = await prisma.maintenanceRequest.groupBy({
            by: ["status"],
            where: { hostelId },
            _count: {
                _all: true,
            },
        });

        const priorityStats = await prisma.maintenanceRequest.count({
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
    } catch (error) {
        throw formatPrismaError(error);
    }
};
