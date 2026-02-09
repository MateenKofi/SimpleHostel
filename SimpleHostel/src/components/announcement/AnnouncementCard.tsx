import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Pencil, Trash2 } from "lucide-react"
import type { Announcement } from "@/types/announcement"
import { getCategoryIcon, getCategoryColorClass, getStatusInfo, getPriorityLabel, getPriorityVariant } from "@/helper/announcementUtils"

interface AnnouncementCardProps {
    announcement: Announcement
    variant?: "admin" | "resident"
    onEdit?: (announcement: Announcement) => void
    onDelete?: (announcement: Announcement) => void
}

const AnnouncementCard = ({
    announcement,
    variant = "resident",
    onEdit,
    onDelete,
}: AnnouncementCardProps) => {
    const CategoryIcon = getCategoryIcon(announcement.category)
    const categoryColorClass = getCategoryColorClass(announcement.category)
    const status = getStatusInfo(announcement.startDate, announcement.endDate)
    const priorityLabel = getPriorityLabel(announcement.priority)
    const priorityVariant = getPriorityVariant(announcement.priority)

    const isAdmin = variant === "admin"

    return (
        <Card
            className={`flex flex-col h-full transition-all hover:shadow-md border ${
                announcement.priority === "urgent" ? "ring-2 ring-destructive ring-offset-2" : ""
            }`}
        >
            <CardHeader className="pb-3 space-y-3">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <CategoryIcon className={`w-5 h-5 ${categoryColorClass}`} />
                        <Badge variant="outline" className="capitalize text-[10px] px-1.5 py-0 h-4 font-normal bg-popover/50">
                            {announcement.category}
                        </Badge>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <Badge
                            variant="outline"
                            className={`${status.colorClass} border-none font-bold uppercase text-[10px]`}
                        >
                            {status.label}
                        </Badge>
                        {priorityLabel && (
                            <Badge variant={priorityVariant} className="text-[10px] px-1.5 py-0 h-5">
                                {priorityLabel}
                            </Badge>
                        )}
                    </div>
                </div>
                <div>
                    <CardTitle className="text-lg leading-tight line-clamp-2 min-h-[3.5rem] flex items-center">
                        {announcement.title}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-4">
                        {announcement.content}
                    </p>
                </div>
                <div className="space-y-1.5 pt-4 border-t border-border">
                    <span className="text-[11px] text-muted-foreground block font-medium">
                        Posted: {announcement.createdAt ? format(new Date(announcement.createdAt), "MMM d, yyyy") : "N/A"}
                    </span>
                    {announcement.startDate && announcement.endDate && (
                        <div className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                            <span>
                                {format(new Date(announcement.startDate), "MMM d, h:mm a")} - {format(new Date(announcement.endDate), "MMM d, yyyy h:mm a")}
                            </span>
                        </div>
                    )}
                </div>

                {isAdmin && (
                    <div className="flex gap-2 pt-4 border-t border-border mt-2">
                        {onEdit && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => onEdit(announcement)}
                            >
                                <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit
                            </Button>
                        )}
                        {onDelete && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => onDelete(announcement)}
                            >
                                <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default AnnouncementCard
