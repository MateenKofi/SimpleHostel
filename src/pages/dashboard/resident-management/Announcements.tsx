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
    title: string
    content: string
    category: "general" | "policy" | "event" | "emergency"
    createdAt: string
    priority: "low" | "high" | "urgent"
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
            case 'emergency': return <AlertTriangle className="w-5 h-5 text-red-500" />
            case 'event': return <Calendar className="w-5 h-5 text-blue-500" />
            case 'policy': return <Info className="w-5 h-5 text-amber-500" />
            default: return <Bell className="w-5 h-5 text-gray-500" />
        }
    }

    const getPriorityBadge = (priority: string) => {
        if (priority === 'urgent') return <Badge variant="destructive">Urgent</Badge>
        if (priority === 'high') return <Badge className="bg-orange-500 hover:bg-orange-600">Important</Badge>
        return null
    }

    return (
        <div className="container max-w-4xl py-6 mx-auto">
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
                <div className="grid gap-6">
                    {announcements.map((announcement) => (
                        <Card key={announcement.id} className={`transition-all ${announcement.priority === 'urgent' ? 'border-red-200 bg-red-50/50 dark:bg-red-900/10' : ''}`}>
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-3">
                                        <div className="mt-1">
                                            {getCategoryIcon(announcement.category)}
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl">{announcement.title}</CardTitle>
                                            <div className="flex gap-2 mt-1">
                                                <Badge variant="outline" className="capitalize text-xs font-normal">
                                                    {announcement.category}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground flex items-center">
                                                    {format(new Date(announcement.createdAt), 'PPP')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {getPriorityBadge(announcement.priority)}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="prose dark:prose-invert max-w-none text-sm text-gray-700 dark:text-gray-300">
                                    {announcement.content}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
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
