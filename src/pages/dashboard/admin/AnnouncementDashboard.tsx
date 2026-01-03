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
import toast from "react-hot-toast"
import SEOHelmet from "@/components/SEOHelmet"

interface Announcement {
    id: string
    title: string
    content: string
    category: "general" | "policy" | "event" | "emergency"
    createdAt: string
    priority: "low" | "high" | "urgent"
}

const AnnouncementDashboard = () => {
    const queryClient = useQueryClient()
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newAnnouncement, setNewAnnouncement] = useState({
        title: "",
        content: "",
        category: "general",
        priority: "low"
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
            setNewAnnouncement({ title: "", content: "", category: "general", priority: "low" })
            queryClient.invalidateQueries({ queryKey: ['admin-announcements'] })
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to post announcement")
        }
    })

    const handleCreate = () => {
        if (!newAnnouncement.title || !newAnnouncement.content) return
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
                    announcements.map((announcement) => (
                        <Card key={announcement.id}>
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <Badge variant="outline" className="flex items-center gap-1 capitalize">
                                        {getCategoryIcon(announcement.category)}
                                        {announcement.category}
                                    </Badge>
                                    {announcement.priority === 'urgent' && <Badge variant="destructive">Urgent</Badge>}
                                </div>
                                <CardTitle className="text-lg mt-2">{announcement.title}</CardTitle>
                                <CardDescription>
                                    Posted on {format(new Date(announcement.createdAt), 'PPP')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                    {announcement.content}
                                </p>
                            </CardContent>
                        </Card>
                    ))
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
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    onValueChange={(val) => setNewAnnouncement({ ...newAnnouncement, category: val })}
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
                                    onValueChange={(val) => setNewAnnouncement({ ...newAnnouncement, priority: val })}
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
