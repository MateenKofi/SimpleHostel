"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnnouncementCard, AnnouncementDialog, AnnouncementFilters } from "@/components/announcement"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getAnnouncementHistory, createAnnouncement, updateAnnouncement, deleteAnnouncement } from "@/api/announcements"
import { toast } from "sonner"
import SEOHelmet from "@/components/SEOHelmet"
import type { ApiError } from "@/types/dtos"
import type { Announcement, AnnouncementCategory, AnnouncementPriority, AnnouncementStatus } from "@/types/announcement"
import { filterAnnouncements } from "@/helper/announcementUtils"

const AnnouncementDashboard = () => {
    const queryClient = useQueryClient()
    const hostelId = localStorage.getItem("hostelId") || ""

    // Dialog states
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null)

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

    const { data: announcements, isLoading } = useQuery<Announcement[]>({
        queryKey: ["admin-announcements"],
        queryFn: async () => {
            const responseData = await getAnnouncementHistory()
            return responseData?.data || []
        },
    })

    // Create mutation
    const createMutation = useMutation({
        mutationFn: async (data: Omit<Announcement, "id" | "hostelId" | "createdAt" | "updatedAt">) => {
            return await createAnnouncement({ ...data, hostelId })
        },
        onSuccess: () => {
            toast.success("Announcement created successfully")
            setIsCreateDialogOpen(false)
            queryClient.invalidateQueries({ queryKey: ["admin-announcements"] })
        },
        onError: (err: ApiError) => {
            toast.error(err.response?.data?.message || "Failed to create announcement")
        },
    })

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: async ({ id, ...data }: Partial<Announcement> & { id: string }) => {
            return await updateAnnouncement(id, data)
        },
        onSuccess: () => {
            toast.success("Announcement updated successfully")
            setEditingAnnouncement(null)
            queryClient.invalidateQueries({ queryKey: ["admin-announcements"] })
        },
        onError: (err: ApiError) => {
            toast.error(err.response?.data?.message || "Failed to update announcement")
        },
    })

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return await deleteAnnouncement(id)
        },
        onSuccess: () => {
            toast.success("Announcement deleted successfully")
            setDeleteDialogOpen(false)
            setAnnouncementToDelete(null)
            queryClient.invalidateQueries({ queryKey: ["admin-announcements"] })
        },
        onError: (err: ApiError) => {
            toast.error(err.response?.data?.message || "Failed to delete announcement")
        },
    })

    // Filter announcements
    const filteredAnnouncements = announcements
        ? filterAnnouncements(announcements, filters)
        : []

    const handleCreate = async (data: {
        title: string
        content: string
        category: AnnouncementCategory
        priority: AnnouncementPriority
        startDate: string
        endDate: string
    }) => {
        await createMutation.mutateAsync(data)
    }

    const handleEdit = (announcement: Announcement) => {
        setEditingAnnouncement(announcement)
    }

    const handleUpdate = async (data: {
        title?: string
        content?: string
        category?: AnnouncementCategory
        priority?: AnnouncementPriority
        startDate?: string
        endDate?: string
    }) => {
        if (editingAnnouncement) {
            await updateMutation.mutateAsync({ id: editingAnnouncement.id, ...data })
        }
    }

    const handleDeleteClick = (announcement: Announcement) => {
        setAnnouncementToDelete(announcement)
        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = () => {
        if (announcementToDelete) {
            deleteMutation.mutate(announcementToDelete.id)
        }
    }

    const handleCloseEditDialog = () => {
        setEditingAnnouncement(null)
    }

    const isMutating = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending

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
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Create Announcement
                </Button>
            </div>

            <AnnouncementFilters
                filters={filters}
                onFiltersChange={setFilters}
                resultCount={filteredAnnouncements.length}
            />

            {isLoading ? (
                <div className="flex justify-center p-8">
                    <Loader className="animate-spin" />
                </div>
            ) : filteredAnnouncements.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredAnnouncements.map((announcement) => (
                        <AnnouncementCard
                            key={announcement.id}
                            announcement={announcement}
                            variant="admin"
                            onEdit={handleEdit}
                            onDelete={handleDeleteClick}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 border border-dashed rounded-lg bg-muted/30">
                    <p className="text-muted-foreground">
                        {announcements && announcements.length > 0
                            ? "No announcements match your filters."
                            : "No announcements found. Create your first announcement!"}
                    </p>
                </div>
            )}

            {/* Create Dialog */}
            <AnnouncementDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                onSubmit={handleCreate}
                isPending={createMutation.isPending}
            />

            {/* Edit Dialog */}
            <AnnouncementDialog
                open={!!editingAnnouncement}
                onOpenChange={handleCloseEditDialog}
                onSubmit={handleUpdate}
                isPending={updateMutation.isPending}
                editAnnouncement={editingAnnouncement}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete &quot;{announcementToDelete?.title}&quot;? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={deleteMutation.isPending}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteMutation.isPending ? (
                                <>
                                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default AnnouncementDashboard
