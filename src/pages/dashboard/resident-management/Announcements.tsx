"use client"

import { useQuery } from "@tanstack/react-query"
import { getAnnouncements } from "@/api/announcements"
import { Loader, Bell, Calendar, Info, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import SEOHelmet from "@/components/SEOHelmet"

interface Announcement {
    id: string
    hostelId: string
    title: string
    content: string
    category: "general" | "policy" | "event" | "emergency"
    priority: "low" | "high" | "urgent"
    startDate: string
    endDate: string
    createdAt: string
    updatedAt: string
}

import NoHostelAssigned from "@/components/resident/NoHostelAssigned"

const Announcements = () => {
    const hostelId = localStorage.getItem("hostelId")
    const isInvalidHostelId = !hostelId || hostelId === 'undefined' || hostelId === 'null'

    // Fetch Announcements
    const { data: announcements, isLoading } = useQuery<Announcement[]>({
        queryKey: ['announcements'],
        queryFn: async () => {
            const responseData = await getAnnouncements()
            return responseData?.data || []
        },
        enabled: !isInvalidHostelId
    })

    if (isInvalidHostelId) {
        return <NoHostelAssigned />
    }

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'emergency': return <AlertTriangle className="w-5 h-5" />
            case 'event': return <Calendar className="w-5 h-5" />
            case 'policy': return <Info className="w-5 h-5" />
            default: return <Bell className="w-5 h-5" />
        }
    }

    const getPriorityBadge = (priority: string) => {
        if (priority === 'urgent') return <Badge variant="destructive">Urgent</Badge>
        if (priority === 'high') return <Badge className="bg-orange-500 hover:bg-orange-600">Important</Badge>
        return null
    }

    const getStatusInfo = (startDate: string, endDate: string) => {
        if (!startDate || !endDate) return { label: "Internal", colorClass: "bg-slate-50 text-slate-600 border-slate-200" }

        const now = new Date()
        const start = new Date(startDate)
        const end = new Date(endDate)

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return { label: "Internal", colorClass: "bg-slate-50 text-slate-600 border-slate-200" }
        }

        if (now < start) {
            return { label: "Pending", colorClass: "bg-amber-50 text-amber-700 border-amber-200" }
        } else if (now > end) {
            return { label: "Passed", colorClass: "bg-red-50 text-red-700 border-red-200" }
        } else {
            return { label: "Ongoing", colorClass: "bg-green-50 text-green-700 border-green-200" }
        }
    }

    return (
        <div className="container max-w-7xl py-6 mx-auto">
            <SEOHelmet
                title="Announcements - Fuse"
                description="Stay updated with the latest news and announcements."
            />

            <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
                <p className="text-muted-foreground">Latest news, events, and updates from the hostel administration.</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-12">
                    <Loader className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : announcements && announcements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {announcements.map((announcement) => {
                        const status = getStatusInfo(announcement.startDate, announcement.endDate)
                        return (
                            <Card key={announcement.id} className={`flex flex-col h-full transition-all hover:shadow-md border ${status.colorClass} ${announcement.priority === 'urgent' ? 'ring-2 ring-red-500 ring-offset-2' : ''}`}>
                                <CardHeader className="pb-3 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <div className="p-2 flex items-center gap-2">
                                            {getCategoryIcon(announcement.category)}
                                            <Badge variant="outline" className="capitalize text-[10px] px-1.5 py-0 h-4 font-normal mb-1 bg-white/50">
                                            {announcement.category}
                                        </Badge>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <Badge variant="outline" className={`${status.colorClass} border-none font-bold uppercase text-[10px]`}>
                                                {status.label}
                                            </Badge>
                                            {getPriorityBadge(announcement.priority)}
                                        </div>
                                    </div>
                                    <div>
                                        
                                        <CardTitle className="text-lg leading-tight line-clamp-2 min-h-[3.5rem] flex items-center">{announcement.title}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="prose dark:prose-invert max-w-none text-sm text-gray-700 dark:text-gray-300 line-clamp-4 mb-4">
                                            {announcement.content}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 pt-4 border-t border-black/5 dark:border-white/5">
                                        <span className="text-[11px] text-muted-foreground block font-medium">
                                            Posted: {announcement.createdAt ? format(new Date(announcement.createdAt), 'MMM d, yyyy') : 'N/A'}
                                        </span>
                                        {announcement.startDate && announcement.endDate && (
                                            <div className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
                                                <Calendar className="w-3 h-3" />
                                                <span>
                                                    {format(new Date(announcement.startDate), 'MMM d, h:mm a')} - {format(new Date(announcement.endDate), 'MMM d, yyyy h:mm a')}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center py-16 bg-slate-50 dark:bg-zinc-900 rounded-lg border border-dashed">
                    <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No Announcements</h3>
                    <p className="text-muted-foreground">You're all caught up! Check back later for updates.</p>
                </div>
            )}
        </div>
    )
}

export default Announcements
