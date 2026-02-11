import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { format } from "date-fns"
import { toast } from "sonner"
import type { Announcement } from "@/types/announcement"
import { getAllCategories, getAllPriorities } from "@/helper/announcementUtils"

const announcementFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    category: z.enum(["general", "policy", "event", "emergency"]),
    priority: z.enum(["low", "high", "urgent"]),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
})

type AnnouncementFormValues = z.infer<typeof announcementFormSchema>

interface AnnouncementDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: AnnouncementFormValues) => void | Promise<void>
    isPending?: boolean
    editAnnouncement?: Announcement | null
}

const AnnouncementDialog = ({
    open,
    onOpenChange,
    onSubmit,
    isPending = false,
    editAnnouncement,
}: AnnouncementDialogProps) => {
    const isEditMode = !!editAnnouncement
    const defaultStartDate = format(new Date(), "yyyy-MM-dd'T'HH:mm")
    const defaultEndDate = format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm") // +7 days

    const form = useForm<AnnouncementFormValues>({
        resolver: zodResolver(announcementFormSchema),
        defaultValues: {
            title: "",
            content: "",
            category: "general",
            priority: "low",
            startDate: defaultStartDate,
            endDate: defaultEndDate,
        },
    })

    useEffect(() => {
        if (editAnnouncement) {
            form.reset({
                title: editAnnouncement.title,
                content: editAnnouncement.content,
                category: editAnnouncement.category,
                priority: editAnnouncement.priority,
                startDate: editAnnouncement.startDate
                    ? format(new Date(editAnnouncement.startDate), "yyyy-MM-dd'T'HH:mm")
                    : defaultStartDate,
                endDate: editAnnouncement.endDate
                    ? format(new Date(editAnnouncement.endDate), "yyyy-MM-dd'T'HH:mm")
                    : defaultEndDate,
            })
        } else {
            form.reset({
                title: "",
                content: "",
                category: "general",
                priority: "low",
                startDate: defaultStartDate,
                endDate: defaultEndDate,
            })
        }
    }, [editAnnouncement, form, defaultStartDate, defaultEndDate, open])

    const handleSubmit = async (data: AnnouncementFormValues) => {
        // Validate date range
        if (new Date(data.startDate) > new Date(data.endDate)) {
            toast.error("Start time cannot be after end time")
            return
        }

        await onSubmit(data)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Edit Announcement" : "Create Announcement"}</DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? "Update the announcement details. Changes will be visible immediately."
                            : "This message will be visible to all residents immediately."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Headline</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. Fire Drill Tomorrow"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 gap-4">
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start Date & Time</FormLabel>
                                        <FormControl>
                                            <Input type="datetime-local" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>End Date & Time</FormLabel>
                                        <FormControl>
                                            <Input type="datetime-local" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {getAllCategories().map((cat) => (
                                                    <SelectItem key={cat} value={cat}>
                                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Priority</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select priority" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {getAllPriorities().map((prio) => (
                                                    <SelectItem key={prio} value={prio}>
                                                        {prio.charAt(0).toUpperCase() + prio.slice(1)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Type your message here..."
                                            className="min-h-[120px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? (
                                    <>
                                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                                        {isEditMode ? "Updating..." : "Creating..."}
                                    </>
                                ) : (
                                    isEditMode ? "Update Announcement" : "Create Announcement"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AnnouncementDialog
