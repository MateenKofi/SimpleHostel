import { Badge } from "@/components/ui/badge";
import { CreditCard, Smartphone, Wallet, Landmark } from "lucide-react";

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
