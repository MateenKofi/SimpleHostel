"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
    getAllMaintenanceRequests,
    updateMaintenanceRequest,
    getMaintenanceStats
} from "@/api/adminMaintenanceHelper"
import { MaintenanceRequestDto } from "@/types/dtos"
import {
    Loader,
    Wrench,
    Clock,
    Search,
    MoreHorizontal,
    Eye,
    AlertTriangle,
    CheckCircle2
} from "lucide-react"
import { Card, CardHeader } from "@/components/ui/card"
import { StatCard } from "@/components/stat-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { format } from "date-fns"
import SEOHelmet from "@/components/SEOHelmet"
import { PageHeader } from "@/components/layout/PageHeader"
import { getMaintenanceStatusBadge, getPriorityBadge } from "@/utils"
import CustomDataTable from "@/components/CustomDataTable"
import type { TableColumn } from "react-data-table-component"

interface UpdateMaintenanceData {
    status?: string;
    priority?: string;
}

const MaintenanceManagement = () => {
    const queryClient = useQueryClient()
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [priorityFilter, setPriorityFilter] = useState<string>("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequestDto | null>(null)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [newStatus, setNewStatus] = useState<string>("")
    const [newPriority, setNewPriority] = useState<string>("")

    // 1. Fetch Stats
    const { data: stats } = useQuery({
        queryKey: ['admin-maintenance-stats'],
        queryFn: () => getMaintenanceStats()
    })

    // 2. Fetch Requests
    const { data: requestsData, isLoading } = useQuery({
        queryKey: ['admin-maintenance-requests', statusFilter, priorityFilter],
        queryFn: () => getAllMaintenanceRequests({
            status: statusFilter === "all" ? undefined : statusFilter,
            priority: priorityFilter === "all" ? undefined : priorityFilter
        })
    })

    const requests = requestsData?.data || []

    // 3. Update Mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string, data: UpdateMaintenanceData }) => updateMaintenanceRequest(id, data),
        onSuccess: () => {
            toast.success("Request updated successfully!")
            setIsUpdateModalOpen(false)
            queryClient.invalidateQueries({ queryKey: ['admin-maintenance-requests'] })
            queryClient.invalidateQueries({ queryKey: ['admin-maintenance-stats'] })
        },
        onError: () => {
            toast.error("Failed to update request")
        }
    })

    const handleUpdateClick = (request: MaintenanceRequestDto) => {
        setSelectedRequest(request)
        setNewStatus(request.status)
        setNewPriority(request.priority)
        setIsUpdateModalOpen(true)
    }

    const confirmUpdate = () => {
        if (!selectedRequest) return
        updateMutation.mutate({
            id: selectedRequest.id,
            data: { status: newStatus, priority: newPriority }
        })
    }

    const filteredRequests = (requests as MaintenanceRequestDto[]).filter((req) =>
        req.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.residentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.resident?.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const tableColumns: TableColumn<MaintenanceRequestDto>[] = [
        {
            name: "Title",
            selector: (req) => req.title || "",
            sortable: true,
            cell: (req) => <span className="font-medium">{req.title}</span>,
        },
        {
            name: "Resident",
            selector: (req) => req.residentName || req.resident?.user?.name || "N/A",
            sortable: true,
        },
        {
            name: "Room No",
            selector: (req) => req.roomNumber || req.resident?.room?.number || "N/A",
            sortable: true,
        },
        {
            name: "Priority",
            selector: (req) => req.priority,
            sortable: true,
            cell: (req) => getPriorityBadge(req.priority),
        },
        {
            name: "Status",
            selector: (req) => req.status,
            sortable: true,
            cell: (req) => getMaintenanceStatusBadge(req.status),
        },
        {
            name: "Date",
            selector: (req) => format(new Date(req.createdAt), "MMM d, yyyy"),
            sortable: true,
            cell: (req) => (
                <span className="text-muted-foreground">
                    {format(new Date(req.createdAt), "MMM d, yyyy")}
                </span>
            ),
        },
        {
            name: "Actions",
            right: true,
            cell: (req) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-8 h-8 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleUpdateClick(req)}>
                            <Eye className="w-4 h-4 mr-2" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-green-600"
                            onClick={() => updateMutation.mutate({ id: req.id, data: { status: "resolved" } })}
                            disabled={req.status === "resolved"}
                        >
                            Mark as Resolved
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ]

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <SEOHelmet title="Maintenance Management - Admin" />

            <PageHeader
                title="Maintenance Requests"
                subtitle="Monitor and manage all maintenance issues reported by residents"
                icon={Wrench}
                sticky={true}
            />

            <main className="flex-1 p-4 md:p-8">
                <div className="max-w-6xl mx-auto space-y-6">

                    {/* Stats Section */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            icon={CheckCircle2}
                            title="Resolved Today"
                            content={String(stats?.data?.resolved || 0)}
                            description="Completed requests"
                            backgroundColor="bg-gradient-to-br from-sage-green-50 to-sage-green-100/30"
                            titleColor="text-sage-green-700"
                            contentColor="text-sage-green-600"
                            descriptionColor="text-sage-green-600/70"
                        />
                        <StatCard
                            icon={Wrench}
                            title="In Progress"
                            content={String(stats?.data?.in_progress || 0)}
                            description="Currently being fixed"
                            backgroundColor="bg-gradient-to-br from-teal-green-50 to-teal-green-100/30"
                            titleColor="text-teal-green-700"
                            contentColor="text-teal-green-600"
                            descriptionColor="text-teal-green-600/70"
                        />
                        <StatCard
                            icon={Clock}
                            title="Pending Requests"
                            content={String(stats?.data?.pending || 0)}
                            description="Awaiting attention"
                            backgroundColor="bg-gradient-to-br from-warm-gray-100 to-warm-gray-200/30"
                            titleColor="text-warm-gray-700"
                            contentColor="text-warm-gray-600"
                            descriptionColor="text-warm-gray-600/70"
                        />
                        <StatCard
                            icon={AlertTriangle}
                            title="Critical Issues"
                            content={String(stats?.data?.critical || 0)}
                            description="Urgent action required"
                            backgroundColor="bg-gradient-to-br from-warm-red-50 to-warm-red-100/30"
                            titleColor="text-warm-red-700"
                            contentColor="text-warm-red-600"
                            descriptionColor="text-warm-red-600/70"
                        />
                    </div>

                    {/* Filters */}
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                                <div className="relative w-full md:w-96">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by title or resident..."
                                        className="pl-10"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="flex w-full gap-2 md:w-auto">
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-[140px]">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="in_progress">In Progress</SelectItem>
                                            <SelectItem value="resolved">Resolved</SelectItem>
                                            <SelectItem value="rejected">Rejected</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                                        <SelectTrigger className="w-[140px]">
                                            <SelectValue placeholder="Priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Priority</SelectItem>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                            <SelectItem value="critical">Critical</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    <CustomDataTable
                        title="Maintenance Requests"
                        columns={tableColumns}
                        data={filteredRequests}
                        isLoading={isLoading}
                        searchable={false}
                        emptyStateMessage="No requests found. Try adjusting your filters or search query."
                    />

                    {/* Update Modal */}
                    <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Update Maintenance Request</DialogTitle>
                                <DialogDescription>
                                    Review the details and update the status of the reported issue.
                                </DialogDescription>
                            </DialogHeader>

                            {selectedRequest && (
                                <div className="grid gap-6 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-xs text-muted-foreground">Title</Label>
                                            <p className="text-sm font-semibold">{selectedRequest.title}</p>
                                        </div>
                                        <div>
                                            <Label className="text-xs text-muted-foreground">Resident</Label>
                                            <p className="text-sm font-semibold">{selectedRequest.residentName || selectedRequest.resident?.user?.name}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <Label className="text-xs text-muted-foreground">Description</Label>
                                            <p className="p-3 text-sm border rounded-md bg-muted/20">{selectedRequest.description}</p>
                                        </div>
                                    </div>

                                    {selectedRequest.images && selectedRequest.images.length > 0 && (
                                        <div>
                                            <Label className="text-xs text-muted-foreground pb-2 block">Attached Images</Label>
                                            <div className="flex gap-2 overflow-x-auto pb-2">
                                                {selectedRequest.images.map((img: string, i: number) => (
                                                    <img key={i} src={img} alt={`Issue ${i}`} className="w-32 h-32 object-cover rounded-md border" />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="status">Update Status</Label>
                                            <Select value={newStatus} onValueChange={setNewStatus}>
                                                <SelectTrigger id="status">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                                    <SelectItem value="resolved">Resolved</SelectItem>
                                                    <SelectItem value="rejected">Rejected</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsUpdateModalOpen(false)}>Close</Button>
                                <Button onClick={confirmUpdate} disabled={updateMutation.isPending}>
                                    {updateMutation.isPending ? <Loader className="w-4 h-4 animate-spin" /> : "Save Changes"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </main>
        </div>
    )
}

export default MaintenanceManagement
