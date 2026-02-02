"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getAnnouncementHistory, createAnnouncement } from "@/api/announcements"
import { Loader, Plus, Megaphone, AlertTriangle, Calendar, Info, Send } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { toast } from "sonner"
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

const AnnouncementDashboard = () => {
    const queryClient = useQueryClient()
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newAnnouncement, setNewAnnouncement] = useState({
        title: "",
        content: "",
        category: "general",
        priority: "low",
        startDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        endDate: format(new Date(), "yyyy-MM-dd'T'HH:mm")
    })

    const { data: announcements, isLoading } = useQuery<Announcement[]>({
        queryKey: ['admin-announcements'],
        queryFn: async () => {
            const responseData = await getAnnouncementHistory()
            return responseData?.data || []
        }
    })

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            return await createAnnouncement(data)
        },
        onSuccess: () => {
            toast.success("Announcement posted successfully")
            setIsCreateOpen(false)
            setNewAnnouncement({
                title: "",
                content: "",
                category: "general",
                priority: "low",
                startDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
                endDate: format(new Date(), "yyyy-MM-dd'T'HH:mm")
            })
            queryClient.invalidateQueries({ queryKey: ['admin-announcements'] })
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to post announcement")
        }
    })

    const handleCreate = () => {
        if (!newAnnouncement.title || !newAnnouncement.content || !newAnnouncement.startDate || !newAnnouncement.endDate) {
            toast.error("Please fill in all fields")
            return
        }

        if (new Date(newAnnouncement.startDate) > new Date(newAnnouncement.endDate)) {
            toast.error("Start time cannot be after end time")
            return
        }

        createMutation.mutate(newAnnouncement)
    }

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'emergency': return <AlertTriangle className="w-4 h-4 text-red-500" />
            case 'event': return <Calendar className="w-4 h-4 text-blue-500" />
            case 'policy': return <Info className="w-4 h-4 text-amber-500" />
            default: return <Megaphone className="w-4 h-4 text-gray-500" />
        }
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
        <div className="p-6">
            <SEOHelmet
                title="Announcements Dashboard - Fuse"
                description="Broadcast messages to hostel residents."
            />

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
                    <p className="text-muted-foreground">Broadcast news, alerts, and events to all residents.</p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)}>
                    <Send className="w-4 h-4 mr-2" /> Make Announcement
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                    <div className="col-span-3 flex justify-center p-8"><Loader className="animate-spin" /></div>
                ) : announcements && announcements.length > 0 ? (
                    announcements.map((announcement) => {
                        const status = getStatusInfo(announcement.startDate, announcement.endDate)
                        return (
                            <Card key={announcement.id} className={`border ${status.colorClass}`}>
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <Badge variant="outline" className="flex items-center gap-1 capitalize bg-white/50">
                                            {getCategoryIcon(announcement.category)}
                                            {announcement.category}
                                        </Badge>
                                        <div className="flex gap-2">
                                            <Badge variant="outline" className={`${status.colorClass} border-none font-bold uppercase text-[10px]`}>
                                                {status.label}
                                            </Badge>
                                            {announcement.priority === 'urgent' && <Badge variant="destructive">Urgent</Badge>}
                                        </div>
                                    </div>
                                    <CardTitle className="text-lg mt-2">{announcement.title}</CardTitle>
                                    <CardDescription className="flex flex-col gap-1">
                                        <span className="text-xs">Posted on {announcement.createdAt ? format(new Date(announcement.createdAt), 'PPP') : 'N/A'}</span>
                                        {announcement.startDate && announcement.endDate && (
                                            <span className="text-xs font-bold text-slate-600">
                                                Active: {format(new Date(announcement.startDate), 'MMM d, h:mm a')} - {format(new Date(announcement.endDate), 'MMM d, yyyy h:mm a')}
                                            </span>
                                        )}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                        {announcement.content}
                                    </p>
                                    <div className="pt-4 border-t border-black/5 dark:border-white/5 grid grid-cols-1 gap-2 text-[10px] text-muted-foreground font-mono">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-500 uppercase tracking-wider">Announcement ID:</span>
                                            <span className="truncate">{announcement.id}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-500 uppercase tracking-wider">Hostel ID:</span>
                                            <span className="truncate">{announcement.hostelId}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-500 uppercase tracking-wider">Last Updated:</span>
                                            <span>{announcement.updatedAt ? format(new Date(announcement.updatedAt), 'PPpp') : 'N/A'}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                ) : (
                    <div className="col-span-3 text-center py-12 border border-dashed rounded-lg bg-slate-50">
                        <p className="text-muted-foreground">No announcements history found.</p>
                    </div>
                )}
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create Announcement</DialogTitle>
                        <DialogDescription>
                            This message will be visible to all residents immediately.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Headline</Label>
                            <Input
                                id="title"
                                value={newAnnouncement.title}
                                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                placeholder="e.g. Fire Drill Tomorrow"
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="startDate">Start Date & Time</Label>
                                <Input
                                    id="startDate"
                                    type="datetime-local"
                                    value={newAnnouncement.startDate}
                                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, startDate: e.target.value })}
                                    className="w-full"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="endDate">End Date & Time</Label>
                                <Input
                                    id="endDate"
                                    type="datetime-local"
                                    value={newAnnouncement.endDate}
                                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, endDate: e.target.value })}
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    onValueChange={(val) => setNewAnnouncement({ ...newAnnouncement, category: val as any })}
                                    defaultValue="general"
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="general">General</SelectItem>
                                        <SelectItem value="policy">Policy/Rules</SelectItem>
                                        <SelectItem value="event">Event</SelectItem>
                                        <SelectItem value="emergency">Emergency</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="priority">Priority</Label>
                                <Select
                                    onValueChange={(val) => setNewAnnouncement({ ...newAnnouncement, priority: val as any })}
                                    defaultValue="low"
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="urgent">Urgent</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                value={newAnnouncement.content}
                                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                                placeholder="Type your message here..."
                                className="min-h-[120px]"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreate} disabled={createMutation.isPending || !newAnnouncement.title}>
                            {createMutation.isPending ? <Loader className="w-4 h-4 animate-spin" /> : "Post Message"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AnnouncementDashboard
