export type { LucideProps } from "lucide-react"

export interface Announcement {
    id: string
    hostelId: string
    title: string
    content: string
    category: AnnouncementCategory
    priority: AnnouncementPriority
    startDate: string
    endDate: string
    createdAt: string
    updatedAt: string
}

export type AnnouncementCategory = "general" | "policy" | "event" | "emergency"
export type AnnouncementPriority = "low" | "high" | "urgent"
export type AnnouncementStatus = "pending" | "ongoing" | "passed"

export interface AnnouncementFilters {
    categories: AnnouncementCategory[]
    priorities: AnnouncementPriority[]
    statuses: AnnouncementStatus[]
    search: string
}

export interface CreateAnnouncementInput {
    title: string
    content: string
    category: AnnouncementCategory
    priority: AnnouncementPriority
    startDate: string
    endDate: string
    hostelId: string
}

export interface UpdateAnnouncementInput extends Partial<CreateAnnouncementInput> {
    id: string
}
