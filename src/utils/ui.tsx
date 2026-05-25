import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock, CreditCard, Landmark, Smartphone, Wallet, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export const getRoomStatusBadgeClass = (status: string | null | undefined) => {
    switch (status?.toLowerCase()) {
        case "available":
            return "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300";
        case "occupied":
            return "bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300";
        case "maintenance":
            return "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300";
        default:
            return "bg-muted text-muted-foreground hover:bg-muted";
    }
};

export const getRoomStatusSolidClass = (status: string | null | undefined) => {
    switch (status?.toLowerCase()) {
        case "available":
            return "bg-green-500";
        case "maintenance":
            return "bg-yellow-500";
        case "occupied":
            return "bg-red-500";
        default:
            return "bg-muted";
    }
};

export const getRoomStatusBadgeVariant = (status: string | null | undefined): BadgeVariant => {
    switch (status?.toLowerCase()) {
        case "available":
            return "default";
        case "occupied":
            return "secondary";
        case "maintenance":
            return "destructive";
        default:
            return "outline";
    }
};

export const getGenderBadgeClass = (gender: string | null | undefined) => {
    switch (gender?.toUpperCase()) {
        case "MALE":
            return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
        case "FEMALE":
            return "bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-100 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800";
        case "MIXED":
        case "MIX":
            return "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800";
        default:
            return "bg-muted text-muted-foreground border-border hover:bg-muted";
    }
};

export const formatStatusLabel = (status: string | null | undefined) => {
    if (!status) return "Unknown";
    return status
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const getResidentStatusBadgeVariant = (status: string | null | undefined): BadgeVariant => {
    switch (status?.toLowerCase()) {
        case "active":
        case "checked_in":
            return "default";
        case "inactive":
        case "checked_out":
            return "secondary";
        case "pending":
            return "outline";
        default:
            return "secondary";
    }
};

export const getResidentStatusLabel = (status: string | null | undefined) => {
    switch (status?.toLowerCase()) {
        case "active":
        case "checked_in":
            return "Active";
        case "inactive":
        case "checked_out":
            return "Inactive";
        case "pending":
            return "Pending";
        default:
            return formatStatusLabel(status);
    }
};

export const getPaymentStatusBadgeVariant = (status: string | null | undefined): BadgeVariant => {
    switch (status?.toLowerCase()) {
        case "confirmed":
        case "success":
            return "default";
        case "pending":
            return "secondary";
        case "failed":
        case "cancelled":
            return "destructive";
        default:
            return "outline";
    }
};

export const getPaymentStatusLabel = (status: string | null | undefined) => {
    switch (status?.toLowerCase()) {
        case "confirmed":
            return "Completed";
        case "pending":
            return "Pending";
        case "failed":
            return "Failed";
        case "cancelled":
            return "Cancelled";
        default:
            return formatStatusLabel(status);
    }
};

export const getDisbursementStatusBadge = (status: string | null | undefined) => {
    switch (status?.toUpperCase()) {
        case "PENDING":
            return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800">Pending</Badge>;
        case "APPROVED":
            return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">Approved</Badge>;
        case "PROCESSED":
            return <Badge className="bg-green-500 text-white hover:bg-green-600">Processed</Badge>;
        case "REJECTED":
            return <Badge variant="destructive">Rejected</Badge>;
        default:
            return <Badge variant="secondary">{formatStatusLabel(status)}</Badge>;
    }
};

export const getTransferStatusBadge = (status: string | null | undefined) => {
    switch (status?.toUpperCase()) {
        case "SUCCESS":
            return <Badge className="bg-green-500 text-white hover:bg-green-600">Transfer Success</Badge>;
        case "PENDING":
            return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800">Transfer Pending</Badge>;
        case "FAILED":
            return <Badge variant="destructive">Transfer Failed</Badge>;
        default:
            return null;
    }
};

export const getPriorityBadge = (priority: string | null | undefined) => {
    switch (priority?.toLowerCase()) {
        case "critical":
            return <Badge className="bg-red-600 text-white hover:bg-red-700">CRITICAL</Badge>;
        case "high":
            return <Badge className="bg-orange-500 text-white hover:bg-orange-600">HIGH</Badge>;
        case "medium":
            return <Badge className="bg-blue-500 text-white hover:bg-blue-600">MEDIUM</Badge>;
        default:
            return <Badge variant="secondary">LOW</Badge>;
    }
};

export const getPriorityTextClass = (priority: string | null | undefined) => {
    switch (priority?.toLowerCase()) {
        case "critical":
            return "text-red-600 font-bold";
        case "high":
            return "text-orange-600 font-bold";
        case "medium":
            return "text-blue-600";
        default:
            return "text-muted-foreground";
    }
};

export const getMaintenanceStatusBadge = (
    status: string | null | undefined,
    options: { showIcon?: boolean } = {}
) => {
    const iconClass = "w-3 h-3 mr-1";
    switch (status?.toLowerCase()) {
        case "pending":
            return (
                <Badge variant="outline" className="border-yellow-500 text-yellow-600 bg-yellow-50 hover:bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-300">
                    {options.showIcon && <Clock className={iconClass} />}
                    Pending
                </Badge>
            );
        case "in_progress":
            return (
                <Badge variant="outline" className="border-blue-500 text-blue-600 bg-blue-50 hover:bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300">
                    {options.showIcon && <Wrench className={iconClass} />}
                    In Progress
                </Badge>
            );
        case "resolved":
            return (
                <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50 hover:bg-green-50 dark:bg-green-900/30 dark:text-green-300">
                    {options.showIcon && <CheckCircle className={iconClass} />}
                    Resolved
                </Badge>
            );
        case "rejected":
        case "cancelled":
            return (
                <Badge variant="destructive">
                    {options.showIcon && <AlertCircle className={iconClass} />}
                    Cancelled
                </Badge>
            );
        default:
            return <Badge variant="secondary">{formatStatusLabel(status)}</Badge>;
    }
};

export const badgeClass = (...classes: Array<string | false | null | undefined>) => cn("w-fit border", ...classes);

/**
 * Returns a Badge component for a given status (Transaction, Maintenance, or Resident)
 * @param status - The status string
 * @returns JSX.Element - A styled Badge component
 */
export const getStatusBadge = (status: string | null | undefined) => {
    const s = (status || "").toLowerCase();

    // Transaction / Maintenance statuses
    switch (s) {
        case "success":
        case "confirmed":
        case "resolved":
        case "active":
        case "checked_in":
            return <Badge className="bg-green-500 hover:bg-green-600">{(s === "confirmed" || s === "success") ? "Success" : s.replace("_", " ").toUpperCase()}</Badge>;

        case "pending":
        case "in_progress":
            return <Badge variant="outline" className="border-yellow-500 text-yellow-600 bg-yellow-50">{s === "in_progress" ? "In Progress" : "Pending"}</Badge>;

        case "failed":
        case "cancelled":
        case "rejected":
        case "inactive":
        case "checked_out":
            return <Badge variant="destructive">{s.replace("_", " ").toUpperCase()}</Badge>;

        default:
            return <Badge variant="secondary">{status || "Unknown"}</Badge>;
    }
};

/**
 * Returns a Lucide icon for a given payment method
 * @param method - The payment method string
 * @returns JSX.Element - A Lucide Icon component
 */
export const getMethodIcon = (method: string | null | undefined) => {
    const m = (method || "").toLowerCase();
    if (m === "mobile_money" || m.includes("momo")) {
        return <Smartphone className="w-4 h-4 text-primary" />;
    }
    if (m === "card" || m.includes("card")) {
        return <CreditCard className="w-4 h-4 text-primary" />;
    }
    if (m === "bank") {
        return <Landmark className="w-4 h-4 text-primary" />;
    }
    return <Wallet className="w-4 h-4 text-muted-foreground" />;
};

/**
 * Simplified version of payment method icon (used in reports)
 * @param method - The payment method string
 * @returns JSX.Element - A Lucide Icon component
 */
export const getMethodIconSimple = (method: string | null | undefined) => {
    return getMethodIcon(method);
};
