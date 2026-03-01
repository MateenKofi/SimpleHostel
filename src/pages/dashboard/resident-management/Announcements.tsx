"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Loader, Bell, AlertCircle } from "lucide-react"
import { getAnnouncements } from "@/api/announcements"
import { AnnouncementCard, AnnouncementFilters } from "@/components/announcement"
import SEOHelmet from "@/components/SEOHelmet"
import NoHostelAssigned from "@/components/resident/NoHostelAssigned"
import type { Announcement, AnnouncementCategory, AnnouncementPriority, AnnouncementStatus } from "@/types/announcement"
import { filterAnnouncements } from "@/helper/announcementUtils"
import { PageHeader } from "@/components/layout/PageHeader"
import { useCurrentUser } from "@/hooks/useCurrentUser"

const Announcements = () => {
    const { user, isLoading: isUserLoading, isError: isUserError } = useCurrentUser()
    const hostel = user?.hostel

    // Show loading state while fetching user data
    if (isUserLoading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    // Show error state if user data fetch fails
    if (isUserError) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                <AlertCircle className="w-12 h-12 text-destructive" />
                <p className="text-muted-foreground">Failed to load user data.</p>
            </div>
        )
    }

    // Show NoHostelAssigned if user has no hostel assigned
    if (!hostel) {
        return <NoHostelAssigned />
    }

    // Filters state
    const [filters, setFilters] = useState<{
        categories: AnnouncementCategory[]
        priorities: AnnouncementPriority[]
        statuses: AnnouncementStatus[]
        search: string
    }>({
        categories: [],
        priorities: [],
        statuses: [],
        search: "",
    })

    // Fetch Announcements
    const { data: announcements, isLoading } = useQuery<Announcement[]>({
        queryKey: ["announcements"],
        queryFn: async () => {
            const responseData = await getAnnouncements()
            return responseData?.data || []
        },
    })

    // Filter announcements
    const filteredAnnouncements = announcements
        ? filterAnnouncements(announcements, filters)
        : []

    return (
        <div className="container max-w-7xl py-6 mx-auto">
            <SEOHelmet
                title="Announcements - Fuse"
                description="Stay updated with the latest news and announcements."
            />

            <PageHeader sticky={true}
                title="Announcements"
                subtitle="Latest news, events, and updates from the hostel administration."
                icon={Bell}
            />

            <AnnouncementFilters
                filters={filters}
                onFiltersChange={setFilters}
                resultCount={filteredAnnouncements.length}
            />

            {isLoading ? (
                <div className="flex justify-center p-12">
                    <Loader className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : filteredAnnouncements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAnnouncements.map((announcement) => (
                        <AnnouncementCard
                            key={announcement.id}
                            announcement={announcement}
                            variant="resident"
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-muted/30 dark:bg-muted/20 rounded-lg border border-dashed">
                    <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-lg font-medium text-foreground">No Announcements</h3>
                    <p className="text-muted-foreground">
                        {announcements && announcements.length > 0
                            ? "No announcements match your filters."
                            : "You're all caught up! Check back later for updates."}
                    </p>
                </div>
            )}
        </div>
    )
}

export default Announcements
