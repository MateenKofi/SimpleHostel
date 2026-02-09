import type { Announcement, AnnouncementCategory, AnnouncementPriority, AnnouncementStatus } from "@/types/announcement"
import type { LucideProps } from "lucide-react"
import { AlertTriangle, Calendar, Info, Megaphone } from "lucide-react"

const IconMap: Record<AnnouncementCategory, React.ComponentType<Omit<LucideProps, "ref">>> = {
    emergency: AlertTriangle,
    event: Calendar,
    policy: Info,
    general: Megaphone,
}

const CategoryColorClass: Record<AnnouncementCategory, string> = {
    emergency: "text-destructive",
    event: "text-blue-600 dark:text-blue-500",
    policy: "text-amber-600 dark:text-amber-500",
    general: "text-muted-foreground",
}

const StatusInfoMap: Record<AnnouncementStatus, { label: string; colorClass: string }> = {
    pending: {
        label: "Pending",
        colorClass: "bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20",
    },
    ongoing: {
        label: "Ongoing",
        colorClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-emerald-500/20",
    },
    passed: {
        label: "Passed",
        colorClass: "bg-muted text-muted-foreground border-border",
    },
}

const PriorityVariantMap: Record<AnnouncementPriority, "default" | "secondary" | "destructive"> = {
    low: "secondary",
    high: "default",
    urgent: "destructive",
}

const PriorityLabelMap: Record<AnnouncementPriority, string | null> = {
    low: null,
    high: "Important",
    urgent: "Urgent",
}

/**
 * Get the Lucide icon component for a category
 */
export const getCategoryIcon = (category: AnnouncementCategory) => {
    return IconMap[category]
}

/**
 * Get the color class for a category icon
 */
export const getCategoryColorClass = (category: AnnouncementCategory): string => {
    return CategoryColorClass[category]
}

/**
 * Get status information (label and color class) based on start and end dates
 */
export const getStatusInfo = (startDate: string | null | undefined, endDate: string | null | undefined): { label: string; colorClass: string; status: AnnouncementStatus } => {
    if (!startDate || !endDate) {
        return {
            label: "Internal",
            colorClass: "bg-muted text-muted-foreground border-border",
            status: "passed",
        }
    }

    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return {
            label: "Internal",
            colorClass: "bg-muted text-muted-foreground border-border",
            status: "passed",
        }
    }

    if (now < start) {
        return {
            ...StatusInfoMap.pending,
            status: "pending",
        }
    } else if (now > end) {
        return {
            ...StatusInfoMap.passed,
            status: "passed",
        }
    } else {
        return {
            ...StatusInfoMap.ongoing,
            status: "ongoing",
        }
    }
}

/**
 * Get the badge variant for a priority level
 */
export const getPriorityVariant = (priority: AnnouncementPriority): "default" | "secondary" | "destructive" => {
    return PriorityVariantMap[priority]
}

/**
 * Get the display label for a priority level (returns null for low priority)
 */
export const getPriorityLabel = (priority: AnnouncementPriority): string | null => {
    return PriorityLabelMap[priority]
}

/**
 * Get all unique category values
 */
export const getAllCategories = (): AnnouncementCategory[] => {
    return Object.keys(IconMap) as AnnouncementCategory[]
}

/**
 * Get all unique priority values
 */
export const getAllPriorities = (): AnnouncementPriority[] => {
    return Object.keys(PriorityVariantMap) as AnnouncementPriority[]
}

/**
 * Get all unique status values
 */
export const getAllStatuses = (): AnnouncementStatus[] => {
    return Object.keys(StatusInfoMap) as AnnouncementStatus[]
}

/**
 * Filter announcements based on the provided filters
 */
export const filterAnnouncements = (
    announcements: Announcement[],
    filters: {
        categories: AnnouncementCategory[]
        priorities: AnnouncementPriority[]
        statuses: AnnouncementStatus[]
        search: string
    }
): Announcement[] => {
    return announcements.filter((announcement) => {
        // Category filter
        if (filters.categories.length > 0 && !filters.categories.includes(announcement.category)) {
            return false
        }

        // Priority filter
        if (filters.priorities.length > 0 && !filters.priorities.includes(announcement.priority)) {
            return false
        }

        // Status filter
        if (filters.statuses.length > 0) {
            const { status } = getStatusInfo(announcement.startDate, announcement.endDate)
            if (!filters.statuses.includes(status)) {
                return false
            }
        }

        // Search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase()
            const matchesSearch =
                announcement.title?.toLowerCase().includes(searchLower) ||
                announcement.content?.toLowerCase().includes(searchLower)
            if (!matchesSearch) {
                return false
            }
        }

        return true
    })
}
