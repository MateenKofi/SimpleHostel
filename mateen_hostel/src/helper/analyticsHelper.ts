import prisma from "../utils/prisma";
import { HttpStatus } from "../utils/http-status";
import HttpException from "../utils/http-error";
import { formatPrismaError } from "../utils/formatPrisma";
import {
  HostelState,
  Payment,
  PaymentStatus,
  ResidentProfile,
  ResidentStatus,
  Room,
  RoomStatus,
  RoomType,
} from "@prisma/client";
import Decimal from "decimal.js";

interface HostelAnalytics {
  totalRevenue: number;
  totalDebt: number;
  debtPercentage: number;
  expectedIncome: number;
  totalPayments: number;
  averagePaymentAmount: number;
  occupancyRate: number;
  totalRooms: number;
  activeRooms: number;
  occupiedRooms: number;
  totalResidents: number;
  totalDebtors: number;
  debtorsPercentage: number;
  averageDebtPerResident: number;
  totalStaff: number;
  averageRoomPrice: number;
  currentYearStats: {
    totalPayments: number;
    expectedRevenue: number;
    collectedRevenue: number;
    outstandingAmount: number;
  };
}

interface SystemAnalytics extends HostelAnalytics {
  totalHostels: number;
  verifiedHostels: number;
  unverifiedHostels: number;
  publishedHostels: number;
  averageOccupancyRate: number;
  systemWideDebtPercentage: number;
  activeCalendarYears: number;
}

export interface HostelSummary {
  hostelId: string;
  name: string;
  phone: string;
  email: string;
  amountCollected: number;
}

export interface HostelSummaryResponse {
  totalCollected: number;
  disbursements: HostelSummary[];
}

interface CalendarYearReport {
  calendarYearId: string;
  calendarYearName: string;
  startDate: Date;
  endDate: Date | null;
  isActive: boolean;

  // Financial Metrics
  totalRevenue: number;
  totalExpectedRevenue: number;
  totalPayments: number;
  averagePaymentAmount: number;
  collectionRate: number;

  // Resident Metrics
  totalResidents: number;
  averageRevenuePerResident: number;

  // Room Metrics
  totalRooms: number;
  activeRooms: number;
  occupiedRooms: number;
  occupancyRate: number;
  averageRoomPrice: number;

  // Historical Data (for completed years)
  historicalResidents: number;
  historicalRevenue: number;

  // Payment Analysis
  paymentMethods: {
    method: string;
    count: number;
    totalAmount: number;
  }[];

  // Monthly Breakdown (for active years)
  monthlyStats?: {
    month: string;
    revenue: number;
    payments: number;
    newResidents: number;
  }[];

  // Performance Indicators
  revenueGrowth?: number; // Compared to previous year
  occupancyGrowth?: number; // Compared to previous year
}

const VALID_PAYMENT_STATUSES: PaymentStatus[] = [PaymentStatus.confirmed];

type ResidentProfileWithPayments = ResidentProfile & {
  payments: Payment[];
  user: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
  } | null;
  room: {
    type: RoomType;
  } | null;
};

interface ResidentStatusBreakdown {
  active: number;
  checkedOut: number;
  banned: number;
}

interface ResidentDebtor {
  residentId: string;
  name: string;
  email: string;
  phone: string | null;
  balance: number;
}

interface ResidentTrendPoint {
  label: string;
  value: number;
}

interface ResidentRoomDistributionItem {
  type: RoomType;
  count: number;
  percentage: number;
}

export interface ResidentAnalytics {
  statusBreakdown: ResidentStatusBreakdown;
  totalOutstandingBalance: number;
  averageDebtPerResident: number;
  topDebtors: ResidentDebtor[];
  paymentTrend: ResidentTrendPoint[];
  roomDistribution: ResidentRoomDistributionItem[];
  admissionTrend: ResidentTrendPoint[];
}

interface ResidentDashboardTotals {
  readonly totalPaid: number;
  readonly outstandingBalance: number;
}

interface ResidentPaymentSummary {
  readonly id: string;
  readonly amount: number;
  readonly status: PaymentStatus | null;
  readonly balanceOwed: number;
  readonly createdAt: Date | null;
}

export interface ResidentDashboardAnalytics {
  readonly residentId: string;
  readonly userId: string;
  readonly hostelId: string | null;
  readonly currentHostel: {
    readonly id: string | null;
    readonly name: string | null;
    readonly address: string | null;
    readonly logoUrl: string | null;
    readonly hostelImages: any[];
  };
  readonly name: string;
  readonly email: string;
  readonly phone: string | null;
  readonly room: {
    readonly roomId: string | null;
    readonly roomNumber: string | null;
    readonly roomType: RoomType | null;
    readonly roomImages: any[];
  };
  readonly stay: {
    readonly checkInDate: Date | null;
    readonly checkOutDate: Date | null;
  };
  readonly totals: ResidentDashboardTotals;
  readonly recentPayments: ResidentPaymentSummary[];
  readonly paymentTrend: ResidentTrendPoint[];
}

type ResidentDashboardProfile = ResidentProfile & {
  user: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
  } | null;
  room: {
    id: string;
    number: string | null;
    type: RoomType | null;
    roomImages: any[];
  } | null;
  hostel: {
    id: string;
    name: string | null;
    address: string | null;
    logoUrl: string | null;
    hostelImages: any[];
  } | null;
  payments: Payment[];
};

interface ResidentContext {
  residents: ResidentProfileWithPayments[];
  payments: Payment[];
}

interface TrendRangeConfig {
  months: number;
  labelFormatter: (date: Date) => string;
}

const RESIDENT_STATUS_MAP: Record<ResidentStatus, keyof ResidentStatusBreakdown> = {
  [ResidentStatus.active]: "active",
  [ResidentStatus.checked_out]: "checkedOut",
  [ResidentStatus.banned]: "banned",
};

const TREND_CONFIG: TrendRangeConfig = {
  months: 6,
  labelFormatter(date: Date): string {
    return `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`;
  },
};

const ADMISSION_TREND_CONFIG: TrendRangeConfig = {
  months: 12,
  labelFormatter(date: Date): string {
    return `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`;
  },
};

const MAX_RECENT_PAYMENTS = 5;

const getMonthKey = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

const buildTrendBuckets = (config: TrendRangeConfig): Map<string, ResidentTrendPoint> => {
  const buckets = new Map<string, ResidentTrendPoint>();
  const now = new Date();

  for (let index = config.months - 1; index >= 0; index -= 1) {
    const target = new Date(now.getFullYear(), now.getMonth() - index, 1);
    const key = getMonthKey(target);
    buckets.set(key, { label: config.labelFormatter(target), value: 0 });
  }

  return buckets;
};

const normalizeResidentStatus = (status: ResidentStatus | null): keyof ResidentStatusBreakdown => {
  return RESIDENT_STATUS_MAP[status ?? ResidentStatus.active];
};

const getResidentContext = async (hostelId?: string): Promise<ResidentContext> => {
  const residentWhereClause = hostelId
    ? {
      hostelId,
    }
    : undefined;

  const residents = await prisma.residentProfile.findMany({
    where: residentWhereClause,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      payments: {
        where: {
          deletedAt: null,
          status: { in: VALID_PAYMENT_STATUSES },
        },
      },
      room: {
        select: {
          type: true,
        },
      },
    },
  });

  const paymentsWhereClause = hostelId
    ? {
      residentProfile: {
        hostelId,
      },
    }
    : undefined;

  const payments = await prisma.payment.findMany({
    where: {
      deletedAt: null,
      status: { in: VALID_PAYMENT_STATUSES },
      ...paymentsWhereClause,
    },
  });

  return { residents, payments };
};

const buildStatusBreakdown = (residents: ResidentProfileWithPayments[]): ResidentStatusBreakdown => {
  const breakdown: ResidentStatusBreakdown = {
    active: 0,
    checkedOut: 0,
    banned: 0,
  };

  residents.forEach((resident) => {
    const key = normalizeResidentStatus(resident.status);
    breakdown[key] += 1;
  });

  return breakdown;
};

const buildTopDebtors = (residents: ResidentProfileWithPayments[]): ResidentDebtor[] => {
  const debts: ResidentDebtor[] = residents.map((resident) => {
    const totalBalance = resident.payments.reduce((sum, payment) => {
      const balance = payment.balanceOwed ?? 0;
      return balance > 0 ? Number(new Decimal(sum).plus(balance).toFixed(2)) : sum;
    }, 0);

    return {
      residentId: resident.id,
      name: resident.user?.name ?? "Unknown",
      email: resident.user?.email ?? "",
      phone: resident.user?.phone ?? null,
      balance: totalBalance,
    };
  });

  return debts
    .filter((debtor) => debtor.balance > 0)
    .sort((left, right) => right.balance - left.balance)
    .slice(0, 5);
};

const buildPaymentTrend = (payments: Payment[]): ResidentTrendPoint[] => {
  const buckets = buildTrendBuckets(TREND_CONFIG);

  payments.forEach((payment) => {
    const createdAt = payment.createdAt ?? new Date();
    const key = getMonthKey(createdAt);
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.value = Number(new Decimal(bucket.value).plus(payment.amount ?? 0).toFixed(2));
    }
  });

  return Array.from(buckets.values());
};

const buildRoomDistribution = (residents: ResidentProfileWithPayments[]): ResidentRoomDistributionItem[] => {
  const distribution = new Map<RoomType, number>();

  residents.forEach((resident) => {
    if (resident.room?.type) {
      const count = distribution.get(resident.room.type) ?? 0;
      distribution.set(resident.room.type, count + 1);
    }
  });

  const total = Array.from(distribution.values()).reduce((sum, count) => sum + count, 0);

  return Array.from(distribution.entries()).map(([type, count]) => ({
    type,
    count,
    percentage: total > 0 ? Number(new Decimal(count).div(total).mul(100).toFixed(2)) : 0,
  }));
};

const buildAdmissionTrend = (residents: ResidentProfileWithPayments[]): ResidentTrendPoint[] => {
  const buckets = buildTrendBuckets(ADMISSION_TREND_CONFIG);

  residents.forEach((resident) => {
    const createdAt = resident.checkInDate ?? resident.createdAt;
    if (!createdAt) {
      return;
    }
    const key = getMonthKey(createdAt);
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.value += 1;
    }
  });

  return Array.from(buckets.values());
};

export const generateResidentAnalytics = async (
  hostelId?: string,
): Promise<ResidentAnalytics> => {
  try {
    const { residents, payments } = await getResidentContext(hostelId);

    const totalOutstandingBalance = residents.reduce((sum, resident) => {
      const residentDebt = resident.payments.reduce((balanceSum, payment) => {
        const balance = payment.balanceOwed ?? 0;
        return Number(new Decimal(balanceSum).plus(balance > 0 ? balance : 0).toFixed(2));
      }, 0);
      return Number(new Decimal(sum).plus(residentDebt).toFixed(2));
    }, 0);

    const totalResidents = residents.length;
    const averageDebtPerResident = totalResidents > 0
      ? Number(new Decimal(totalOutstandingBalance).div(totalResidents).toFixed(2))
      : 0;

    return {
      statusBreakdown: buildStatusBreakdown(residents),
      totalOutstandingBalance,
      averageDebtPerResident,
      topDebtors: buildTopDebtors(residents),
      paymentTrend: buildPaymentTrend(payments),
      roomDistribution: buildRoomDistribution(residents),
      admissionTrend: buildAdmissionTrend(residents),
    };
  } catch (error) {
    console.error("Error generating resident analytics:", error);
    throw formatPrismaError(error);
  }
};

const getResidentDashboardProfile = async (
  userId: string,
): Promise<ResidentDashboardProfile> => {
  const resident = await prisma.residentProfile.findFirst({
    where: {
      OR: [{ userId }, { id: userId }],
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      room: {
        select: {
          id: true,
          number: true,
          type: true,
          roomImages: true,
        },
      },
      hostel: {
        select: {
          id: true,
          name: true,
          address: true,
          logoUrl: true,
          hostelImages: true,
        },
      },
      payments: {
        where: {
          deletedAt: null,
          status: { in: VALID_PAYMENT_STATUSES },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!resident) {
    throw new HttpException(HttpStatus.NOT_FOUND, "Resident not found");
  }

  return resident as ResidentDashboardProfile;
};

const calculateResidentDashboardTotals = (
  payments: Payment[],
): ResidentDashboardTotals => {
  const totals = payments.reduce(
    (accumulator, payment) => {
      const amount = payment.amount ?? 0;
      const balance = payment.balanceOwed ?? 0;
      const paid = Number(new Decimal(accumulator.totalPaid).plus(amount).toFixed(2));
      const outstanding = balance > 0
        ? Number(new Decimal(accumulator.outstandingBalance).plus(balance).toFixed(2))
        : accumulator.outstandingBalance;

      return {
        totalPaid: paid,
        outstandingBalance: outstanding,
      } satisfies ResidentDashboardTotals;
    },
    { totalPaid: 0, outstandingBalance: 0 } satisfies ResidentDashboardTotals,
  );

  return totals;
};

const buildRecentResidentPayments = (
  payments: Payment[],
): ResidentPaymentSummary[] => {
  return payments.slice(0, MAX_RECENT_PAYMENTS).map((payment) => ({
    id: payment.id,
    amount: payment.amount ?? 0,
    status: payment.status ?? null,
    balanceOwed: payment.balanceOwed ?? 0,
    createdAt: payment.createdAt ?? null,
  }));
};

export const generateResidentDashboardAnalytics = async (
  userId: string,
): Promise<ResidentDashboardAnalytics> => {
  try {
    const resident = await getResidentDashboardProfile(userId);
    const totals = calculateResidentDashboardTotals(resident.payments);

    return {
      residentId: resident.id,
      userId: resident.userId,
      hostelId: resident.hostelId ?? null,
      currentHostel: {
        id: resident.hostel?.id ?? null,
        name: resident.hostel?.name ?? null,
        address: resident.hostel?.address ?? null,
        logoUrl: resident.hostel?.logoUrl ?? null,
        hostelImages: resident.hostel?.hostelImages ?? [],
      },
      name: resident.user?.name ?? "Unknown Resident",
      email: resident.user?.email ?? "",
      phone: resident.user?.phone ?? null,
      room: {
        roomId: resident.room?.id ?? null,
        roomNumber: resident.room?.number ?? null,
        roomType: resident.room?.type ?? null,
        roomImages: resident.room?.roomImages ?? [],
      },
      stay: {
        checkInDate: resident.checkInDate ?? null,
        checkOutDate: resident.checkOutDate ?? null,
      },
      totals,
      recentPayments: buildRecentResidentPayments(resident.payments),
      paymentTrend: buildPaymentTrend(resident.payments),
    } satisfies ResidentDashboardAnalytics;
  } catch (error) {
    throw formatPrismaError(error);
  }
};

// Helper: Room metrics
const calculateRoomMetrics = (rooms: Room[]) => {
  const totalRooms = rooms.length;
  const activeRooms = rooms.filter(
    (room) => room.status !== RoomStatus.maintenance,
  ).length;
  const occupiedRooms = rooms.filter(
    (room) => room.status === RoomStatus.occupied,
  ).length;
  const occupancyRate =
    activeRooms > 0
      ? Number(new Decimal(occupiedRooms).div(activeRooms).mul(100).toFixed(2))
      : 0;
  const expectedIncome = rooms.reduce(
    (sum, room) => new Decimal(sum).plus(room.price ?? 0).toNumber(),
    0,
  );
  const averageRoomPrice =
    totalRooms > 0
      ? new Decimal(
        rooms.reduce(
          (sum, room) => new Decimal(sum).plus(room.price ?? 0).toNumber(),
          0,
        ),
      )
        .div(totalRooms)
        .toFixed(2)
      : 0;
  return {
    totalRooms,
    activeRooms,
    occupiedRooms,
    occupancyRate,
    expectedIncome: Number(new Decimal(expectedIncome).toFixed(2)),
    averageRoomPrice: Number(averageRoomPrice),
  };
};

// Helper: Resident metrics
const calculateResidentMetrics = (
  residents: ResidentProfileWithPayments[],
  allPayments: Payment[],
) => {
  let totalRevenue = new Decimal(0);
  let totalDebt = new Decimal(0);
  let totalPayments = 0;
  let totalPaymentAmount = new Decimal(0);
  let totalDebtors = 0;

  // Calculate metrics from residents
  residents.forEach((resident) => {
    const confirmedPayments = (resident.payments || []).filter(
      (payment) =>
        payment.status !== null &&
        VALID_PAYMENT_STATUSES.includes(payment.status),
    );
    totalPayments += confirmedPayments.length;
    confirmedPayments.forEach((payment) => {
      totalPaymentAmount = totalPaymentAmount.plus(payment.amount ?? 0);
      totalRevenue = totalRevenue.plus(payment.amount ?? 0);
      if (payment.balanceOwed && payment.balanceOwed > 0) {
        totalDebt = totalDebt.plus(payment.balanceOwed);
        totalDebtors += 1;
      }
    });
  });

  // Include payments with historicalResidentId or no residentProfileId
  const historicalOrStandalonePayments = allPayments.filter(
    (payment) =>
      !payment.residentProfileId &&
      VALID_PAYMENT_STATUSES.includes(payment.status ?? PaymentStatus.pending),
  );
  historicalOrStandalonePayments.forEach((payment) => {
    totalPayments += 1;
    totalPaymentAmount = totalPaymentAmount.plus(payment.amount ?? 0);
    totalRevenue = totalRevenue.plus(payment.amount ?? 0);
    if (payment.balanceOwed && payment.balanceOwed > 0) {
      totalDebt = totalDebt.plus(payment.balanceOwed);
    }
  });

  const totalResidents = residents.length;
  const debtorsPercentage =
    totalResidents > 0
      ? Number(
        new Decimal(totalDebtors).div(totalResidents).mul(100).toFixed(2),
      )
      : 0;
  const averageDebtPerResident =
    totalDebtors > 0 ? Number(totalDebt.div(totalDebtors).toFixed(2)) : 0;

  const averagePaymentAmount =
    totalPayments > 0
      ? Number(totalPaymentAmount.div(totalPayments).toFixed(2))
      : 0;

  return {
    totalRevenue: Number(totalRevenue.toFixed(2)),
    totalDebt: Number(totalDebt.toFixed(2)),
    totalPayments,
    totalPaymentAmount: Number(totalPaymentAmount.toFixed(2)),
    totalResidents,
    totalDebtors,
    debtorsPercentage,
    averageDebtPerResident,
    averagePaymentAmount,
  };
};

// Helper: Payment metrics
const calculatePaymentMetrics = (payments: Payment[]) => {
  const confirmedPayments = payments.filter(
    (payment) =>
      payment.status !== null &&
      VALID_PAYMENT_STATUSES.includes(payment.status),
  );
  const totalPayments = confirmedPayments.length;
  const totalPaymentAmount = confirmedPayments.reduce(
    (sum, payment) => new Decimal(sum).plus(payment.amount ?? 0).toNumber(),
    0,
  );
  const averagePaymentAmount =
    totalPayments > 0
      ? new Decimal(totalPaymentAmount).div(totalPayments).toFixed(2)
      : 0;
  return {
    totalPayments,
    totalPaymentAmount: new Decimal(totalPaymentAmount).toFixed(2),
    averagePaymentAmount: Number(averagePaymentAmount),
  };
};

// HOSTEL ANALYTICS
export const generateHostelAnalytics = async (
  hostelId: string,
): Promise<HostelAnalytics> => {
  try {
    const hostel = await prisma.hostel.findUnique({
      where: { id: hostelId, deletedAt: null },
      include: {
        rooms: {
          where: { deletedAt: null },
        },
        staffProfiles: true,
        residentProfiles: {
          include: {
            payments: {
              where: {
                deletedAt: null,
                status: { in: VALID_PAYMENT_STATUSES },
              },
            },
          },
        },
        calendarYears: { where: { isActive: true }, select: { id: true } },
      },
    });

    if (!hostel)
      throw new HttpException(HttpStatus.NOT_FOUND, "Hostel not found");

    const roomIds = hostel.rooms.map((r) => r.id);
    const residentIds = hostel.residentProfiles.map((r) => r.id);
    const calendarYearIds = hostel.calendarYears.map((cy) => cy.id);

    const paymentFilters = [] as {
      residentProfileId?: { in: string[] };
      roomId?: { in: string[] };
      calendarYearId?: { in: string[] };
    }[];
    if (residentIds.length > 0) {
      paymentFilters.push({ residentProfileId: { in: residentIds } });
    }
    if (roomIds.length > 0) {
      paymentFilters.push({ roomId: { in: roomIds } });
    }
    if (calendarYearIds.length > 0) {
      paymentFilters.push({ calendarYearId: { in: calendarYearIds } });
    }

    const payments = await prisma.payment.findMany({
      where: {
        deletedAt: null,
        status: { in: VALID_PAYMENT_STATUSES },
        ...(paymentFilters.length > 0 ? { OR: paymentFilters } : {}),
      },
    });

    const roomMetrics = calculateRoomMetrics(hostel.rooms as Room[]);
    const residentMetrics = calculateResidentMetrics(
      hostel.residentProfiles as ResidentProfileWithPayments[],
      payments,
    );

    const debtPercentage =
      Number(roomMetrics.expectedIncome) > 0
        ? Number(
          new Decimal(residentMetrics.totalDebt)
            .div(roomMetrics.expectedIncome)
            .mul(100)
            .toFixed(2),
        )
        : 0;

    return {
      totalRevenue: Number(residentMetrics.totalRevenue),
      totalDebt: Number(residentMetrics.totalDebt),
      debtPercentage,
      expectedIncome: Number(roomMetrics.expectedIncome),
      totalPayments: residentMetrics.totalPayments,
      averagePaymentAmount: Number(residentMetrics.averagePaymentAmount),
      occupancyRate: Number(roomMetrics.occupancyRate),
      totalRooms: roomMetrics.totalRooms,
      activeRooms: roomMetrics.activeRooms,
      occupiedRooms: roomMetrics.occupiedRooms,
      totalResidents: residentMetrics.totalResidents,
      totalDebtors: residentMetrics.totalDebtors,
      debtorsPercentage: residentMetrics.debtorsPercentage,
      averageDebtPerResident: residentMetrics.averageDebtPerResident,
      totalStaff: hostel.staffProfiles.length,
      averageRoomPrice: Number(roomMetrics.averageRoomPrice),
      currentYearStats: {
        totalPayments: residentMetrics.totalPayments,
        expectedRevenue: Number(roomMetrics.expectedIncome),
        collectedRevenue: Number(residentMetrics.totalRevenue),
        outstandingAmount: Number(residentMetrics.totalDebt),
      },
    };
  } catch (error) {
    console.error("Error getting Hostel analytics:", error);
    throw formatPrismaError(error);
  }
};

// SYSTEM ANALYTICS
export const generateSystemAnalytics = async (): Promise<SystemAnalytics> => {
  try {
    const [hostels, allPayments, activeCalendarYears] = await Promise.all([
      prisma.hostel.findMany({
        where: { deletedAt: null },
        include: {
          rooms: { where: { deletedAt: null } },
          staffProfiles: true,
          residentProfiles: {
            include: {
              payments: {
                where: {
                  deletedAt: null,
                  status: { in: VALID_PAYMENT_STATUSES },
                },
              },
            },
          },
        },
      }),
      prisma.payment.findMany({
        where: {
          deletedAt: null,
          status: { in: VALID_PAYMENT_STATUSES },
        },
      }),
      prisma.calendarYear.count({
        where: { isActive: true },
      }),
    ]);

    let systemMetrics = {
      totalRooms: 0,
      activeRooms: 0,
      occupiedRooms: 0,
      totalRevenue: new Decimal(0),
      totalDebt: new Decimal(0),
      totalResidents: 0,
      totalDebtors: 0,
      totalStaff: 0,
      expectedIncome: new Decimal(0),
    };

    const allResidents = hostels.flatMap(
      (hostel) =>
        hostel.residentProfiles as ResidentProfileWithPayments[],
    );
    const residentMetrics = calculateResidentMetrics(allResidents, allPayments);

    hostels.forEach((hostel) => {
      const roomMetrics = calculateRoomMetrics(hostel.rooms as Room[]);
      systemMetrics.totalRooms += roomMetrics.totalRooms;
      systemMetrics.activeRooms += roomMetrics.activeRooms;
      systemMetrics.occupiedRooms += roomMetrics.occupiedRooms;
      systemMetrics.expectedIncome = systemMetrics.expectedIncome.plus(
        roomMetrics.expectedIncome,
      );
      systemMetrics.totalStaff += hostel.staffProfiles.length;
    });

    const paymentMetrics = calculatePaymentMetrics(allPayments);

    const debtPercentage =
      Number(systemMetrics.expectedIncome) > 0
        ? Number(
          new Decimal(residentMetrics.totalDebt)
            .div(systemMetrics.expectedIncome)
            .mul(100)
            .toFixed(2),
        )
        : 0;
    const occupancyRate =
      systemMetrics.activeRooms > 0
        ? Number(
          new Decimal(systemMetrics.occupiedRooms)
            .div(systemMetrics.activeRooms)
            .mul(100)
            .toFixed(2),
        )
        : 0;
    const averageRoomPrice =
      systemMetrics.totalRooms > 0
        ? systemMetrics.expectedIncome.div(systemMetrics.totalRooms).toFixed(2)
        : 0;
    const debtorsPercentage =
      residentMetrics.totalResidents > 0
        ? Number(
          new Decimal(residentMetrics.totalDebtors)
            .div(residentMetrics.totalResidents)
            .mul(100)
            .toFixed(2),
        )
        : 0;

    return {
      totalRevenue: Number(residentMetrics.totalRevenue),
      totalDebt: Number(residentMetrics.totalDebt),
      debtPercentage,
      expectedIncome: Number(systemMetrics.expectedIncome),
      totalPayments: paymentMetrics.totalPayments,
      averagePaymentAmount: paymentMetrics.averagePaymentAmount,
      occupancyRate,
      totalRooms: systemMetrics.totalRooms,
      activeRooms: systemMetrics.activeRooms,
      occupiedRooms: systemMetrics.occupiedRooms,
      totalResidents: residentMetrics.totalResidents,
      totalDebtors: residentMetrics.totalDebtors,
      debtorsPercentage,
      averageDebtPerResident: residentMetrics.averageDebtPerResident,
      totalStaff: systemMetrics.totalStaff,
      averageRoomPrice: Number(averageRoomPrice),
      currentYearStats: {
        totalPayments: paymentMetrics.totalPayments,
        expectedRevenue: Number(systemMetrics.expectedIncome),
        collectedRevenue: Number(residentMetrics.totalRevenue),
        outstandingAmount: Number(residentMetrics.totalDebt),
      },
      totalHostels: hostels.length,
      verifiedHostels: hostels.filter((h) => h.isVerified).length,
      unverifiedHostels: hostels.filter((h) => !h.isVerified).length,
      publishedHostels: hostels.filter(
        (h) => h.state === HostelState.published,
      ).length,
      averageOccupancyRate: occupancyRate,
      systemWideDebtPercentage: debtPercentage,
      activeCalendarYears,
    };
  } catch (error) {
    console.error("Error getting system analytics:", error);
    throw formatPrismaError(error);
  }
};

// HOSTEL DISBURSEMENT SUMMARY
export const getHostelDisbursementSummary =
  async (): Promise<HostelSummaryResponse> => {
    try {
      const hostels = await prisma.hostel.findMany({
        where: { deletedAt: null },
        select: { id: true, name: true, phone: true, email: true },
      });

      const rooms = await prisma.room.findMany({
        where: { deletedAt: null },
        select: { id: true, hostelId: true },
      });
      const roomHostelMap = new Map(rooms.map((room) => [room.id, room.hostelId]));

      const residentProfiles = await prisma.residentProfile.findMany({
        select: { id: true, hostelId: true },
      });
      const residentHostelMap = new Map(
        residentProfiles.map((resident) => [resident.id, resident.hostelId ?? ""]),
      );

      const calendarYears = await prisma.calendarYear.findMany({
        where: { isActive: true },
        select: { id: true, hostelId: true },
      });
      const calendarYearHostelMap = new Map(
        calendarYears.map((cy) => [cy.id, cy.hostelId]),
      );

      const payments = await prisma.payment.findMany({
        where: {
          deletedAt: null,
          status: { in: VALID_PAYMENT_STATUSES },
        },
        select: {
          amount: true,
          calendarYearId: true,
          roomId: true,
          residentProfileId: true,
          historicalResidentId: true,
        },
      });

      const historicalIds = Array.from(
        new Set(
          payments
            .map((payment) => payment.historicalResidentId)
            .filter((id): id is string => Boolean(id)),
        ),
      );

      const historicalResidents = historicalIds.length
        ? await prisma.historicalResident.findMany({
          where: { id: { in: historicalIds } },
          select: { id: true, roomId: true, residentId: true },
        })
        : [];

      const historicalHostelMap = new Map<string, string>();
      historicalResidents.forEach((hist) => {
        if (hist.roomId && roomHostelMap.has(hist.roomId)) {
          historicalHostelMap.set(hist.id, roomHostelMap.get(hist.roomId)!);
        } else if (hist.residentId && residentHostelMap.has(hist.residentId)) {
          historicalHostelMap.set(hist.id, residentHostelMap.get(hist.residentId)!);
        }
      });

      const hostelAmountMap = new Map<string, Decimal>();
      for (const payment of payments) {
        let hostelId: string | undefined;

        if (!hostelId && payment.calendarYearId) {
          hostelId = calendarYearHostelMap.get(payment.calendarYearId);
        }
        if (!hostelId && payment.roomId) {
          hostelId = roomHostelMap.get(payment.roomId);
        }
        if (!hostelId && payment.residentProfileId) {
          hostelId = residentHostelMap.get(payment.residentProfileId);
        }
        if (!hostelId && payment.historicalResidentId) {
          hostelId = historicalHostelMap.get(payment.historicalResidentId);
        }

        if (!hostelId) continue;

        hostelAmountMap.set(
          hostelId,
          (hostelAmountMap.get(hostelId) ?? new Decimal(0)).plus(
            payment.amount ?? 0,
          ),
        );
      }

      const disbursements: HostelSummary[] = hostels.map((hostel) => ({
        hostelId: hostel.id,
        name: hostel.name,
        phone: hostel.phone,
        email: hostel.email,
        amountCollected: Number(
          (hostelAmountMap.get(hostel.id) ?? new Decimal(0)).toFixed(2),
        ),
      }));

      const totalCollected = disbursements.reduce(
        (sum, entry) => new Decimal(sum).plus(entry.amountCollected).toNumber(),
        0,
      );

      return {
        totalCollected: Number(new Decimal(totalCollected).toFixed(2)),
        disbursements,
      };
    } catch (error) {
      console.error("Update Hostel Error:", error);
      throw formatPrismaError(error);
    }
  };

// CALENDAR YEAR REPORT
export const generateCalendarYearReport = async (
  hostelId: string,
  calendarYearId: string,
): Promise<CalendarYearReport> => {
  try {
    const calendarYear = await prisma.calendarYear.findUnique({
      where: { id: calendarYearId, hostelId },
      include: {
        residents: {
          include: {
            room: true,
            payments: {
              where: {
                deletedAt: null,
                status: { in: VALID_PAYMENT_STATUSES },
                calendarYearId,
              },
            },
          },
        },
        historicalResidents: {
          include: {
            room: true,
            payments: {
              where: {
                deletedAt: null,
                status: { in: VALID_PAYMENT_STATUSES },
                calendarYearId,
              },
            },
          },
        },
        payments: {
          where: {
            deletedAt: null,
            status: { in: VALID_PAYMENT_STATUSES },
          },
          select: {
            amount: true,
            method: true,
            residentProfileId: true,
            historicalResidentId: true,
          },
        },
      },
    });

    if (!calendarYear) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Calendar year not found");
    }

    const rooms = await prisma.room.findMany({
      where: {
        hostelId,
        deletedAt: null,
      },
    });

    const currentResidents = calendarYear.residents;
    const historicalResidents = calendarYear.historicalResidents;
    const standalonePayments = calendarYear.payments.filter(
      (payment) => !payment.residentProfileId && !payment.historicalResidentId,
    );

    let totalRevenue = new Decimal(0);
    let totalExpectedRevenue = new Decimal(0);
    let totalPayments = 0;
    let totalPaymentAmount = new Decimal(0);

    currentResidents.forEach((resident) => {
      const confirmedPayments = resident.payments;
      totalPayments += confirmedPayments.length;
      confirmedPayments.forEach((payment) => {
        totalPaymentAmount = totalPaymentAmount.plus(payment.amount ?? 0);
        totalRevenue = totalRevenue.plus(payment.amount ?? 0);
      });
      totalExpectedRevenue = totalExpectedRevenue.plus(resident.room?.price ?? 0);
    });

    const historicalRevenueTotals: number[] = [];
    historicalResidents.forEach((histResident) => {
      const confirmedPayments = histResident.payments;
      totalPayments += confirmedPayments.length;
      const histRevenue = confirmedPayments.reduce(
        (sum, payment) => new Decimal(sum).plus(payment.amount ?? 0),
        new Decimal(0),
      );
      totalPaymentAmount = totalPaymentAmount.plus(histRevenue);
      totalRevenue = totalRevenue.plus(histRevenue);
      totalExpectedRevenue = totalExpectedRevenue.plus(
        histResident.roomPrice ?? histResident.room?.price ?? 0,
      );
      historicalRevenueTotals.push(Number(histRevenue.toFixed(2)));
    });

    standalonePayments.forEach((payment) => {
      totalPayments += 1;
      totalPaymentAmount = totalPaymentAmount.plus(payment.amount ?? 0);
      totalRevenue = totalRevenue.plus(payment.amount ?? 0);
    });

    const totalResidents = currentResidents.length + historicalResidents.length;
    const collectionRate = Number(totalExpectedRevenue) > 0
      ? Number(
        totalRevenue
          .div(totalExpectedRevenue)
          .mul(100)
          .toFixed(2),
      )
      : 0;
    const averagePaymentAmount = totalPayments > 0
      ? Number(totalPaymentAmount.div(totalPayments).toFixed(2))
      : 0;
    const averageRevenuePerResident = totalResidents > 0
      ? Number(totalRevenue.div(totalResidents).toFixed(2))
      : 0;

    const roomMetrics = calculateRoomMetrics(rooms);

    const paymentMethodsMap = new Map<string, { count: number; totalAmount: Decimal }>();
    [...currentResidents, ...historicalResidents].forEach((entity) => {
      entity.payments.forEach((payment) => {
        const method = payment.method ?? "Unknown";
        const existing =
          paymentMethodsMap.get(method) ??
          { count: 0, totalAmount: new Decimal(0) };
        paymentMethodsMap.set(method, {
          count: existing.count + 1,
          totalAmount: existing.totalAmount.plus(payment.amount ?? 0),
        });
      });
    });
    standalonePayments.forEach((payment) => {
      const method = payment.method ?? "Unknown";
      const existing =
        paymentMethodsMap.get(method) ?? { count: 0, totalAmount: new Decimal(0) };
      paymentMethodsMap.set(method, {
        count: existing.count + 1,
        totalAmount: existing.totalAmount.plus(payment.amount ?? 0),
      });
    });

    const paymentMethods = Array.from(paymentMethodsMap.entries()).map(
      ([method, data]) => ({
        method,
        count: data.count,
        totalAmount: Number(data.totalAmount.toFixed(2)),
      }),
    );

    let monthlyStats: CalendarYearReport["monthlyStats"] = undefined;
    if (calendarYear.isActive) {
      monthlyStats = await generateMonthlyBreakdown(calendarYearId, hostelId);
    }

    const previousYear = await prisma.calendarYear.findFirst({
      where: {
        hostelId,
        isActive: false,
        endDate: { lt: calendarYear.startDate },
      },
      orderBy: { endDate: "desc" },
    });

    let revenueGrowth: number | undefined;
    let occupancyGrowth: number | undefined;

    if (previousYear) {
      const previousYearReport = await generateCalendarYearReport(
        hostelId,
        previousYear.id,
      );
      if (previousYearReport.totalRevenue > 0) {
        revenueGrowth = Number(
          totalRevenue
            .div(previousYearReport.totalRevenue)
            .minus(1)
            .mul(100)
            .toFixed(2),
        );
      }
      if (previousYearReport.occupancyRate > 0) {
        occupancyGrowth = Number(
          new Decimal(roomMetrics.occupancyRate)
            .div(previousYearReport.occupancyRate)
            .minus(1)
            .mul(100)
            .toFixed(2),
        );
      }
    }

    const historicalRevenue = historicalRevenueTotals.reduce(
      (sum, value) => new Decimal(sum).plus(value).toNumber(),
      0,
    );

    return {
      calendarYearId: calendarYear.id,
      calendarYearName: calendarYear.name,
      startDate: calendarYear.startDate,
      endDate: calendarYear.endDate,
      isActive: calendarYear.isActive,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalExpectedRevenue: Number(totalExpectedRevenue.toFixed(2)),
      totalPayments,
      averagePaymentAmount,
      collectionRate,
      totalResidents,
      averageRevenuePerResident,
      totalRooms: roomMetrics.totalRooms,
      activeRooms: roomMetrics.activeRooms,
      occupiedRooms: roomMetrics.occupiedRooms,
      occupancyRate: roomMetrics.occupancyRate,
      averageRoomPrice: roomMetrics.averageRoomPrice,
      historicalResidents: historicalResidents.length,
      historicalRevenue,
      paymentMethods,
      monthlyStats,
      revenueGrowth,
      occupancyGrowth,
    };
  } catch (error) {
    console.error("Error generating calendar year report:", error);
    throw formatPrismaError(error);
  }
};

// Helper function to generate monthly breakdown
const generateMonthlyBreakdown = async (
  calendarYearId: string,
  hostelId: string,
): Promise<CalendarYearReport["monthlyStats"]> => {
  try {
    const payments = await prisma.payment.findMany({
      where: {
        calendarYearId,
        deletedAt: null,
        status: { in: VALID_PAYMENT_STATUSES },
      },
      select: {
        amount: true,
        createdAt: true,
      },
    });

    const monthlyMap = new Map<
      string,
      { revenue: Decimal; payments: number; newResidents: number }
    >();

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    months.forEach((month) => {
      monthlyMap.set(month, {
        revenue: new Decimal(0),
        payments: 0,
        newResidents: 0,
      });
    });

    payments.forEach((payment) => {
      const month = payment.createdAt.toLocaleString("en-US", { month: "long" });
      const existing = monthlyMap.get(month) || {
        revenue: new Decimal(0),
        payments: 0,
        newResidents: 0,
      };
      monthlyMap.set(month, {
        revenue: existing.revenue.plus(payment.amount ?? 0),
        payments: existing.payments + 1,
        newResidents: existing.newResidents,
      });
    });

    return Array.from(monthlyMap.entries()).map(([month, data]) => ({
      month,
      revenue: Number(data.revenue.toFixed(2)),
      payments: data.payments,
      newResidents: data.newResidents,
    }));
  } catch (error) {
    console.error("Error generating monthly breakdown:", error);
    return [];
  }
};
