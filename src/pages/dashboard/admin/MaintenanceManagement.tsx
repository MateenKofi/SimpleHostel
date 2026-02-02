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
    AlertCircle,
    CheckCircle,
    Clock,
    Filter,
    Search,
    MoreHorizontal,
    Eye,
    TrendingUp,
    AlertTriangle,
    CheckCircle2
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
        queryFn: getMaintenanceStats
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
        mutationFn: ({ id, data }: { id: string, data: any }) => updateMaintenanceRequest(id, data),
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

    const handleUpdateClick = (request: any) => {
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

    // Helpers
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <Badge variant="outline" className="border-yellow-500 text-yellow-600 bg-yellow-50">Pending</Badge>
            case 'in_progress': return <Badge variant="outline" className="border-blue-500 text-blue-600 bg-blue-50">In Progress</Badge>
            case 'resolved': return <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50">Resolved</Badge>
            case 'rejected':
            case 'cancelled': return <Badge variant="destructive">Cancelled</Badge>
            default: return <Badge variant="secondary">{status}</Badge>
        }
    }

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'critical': return <Badge className="bg-red-600">CRITICAL</Badge>
            case 'high': return <Badge className="bg-orange-500">HIGH</Badge>
            case 'medium': return <Badge className="bg-blue-500">MEDIUM</Badge>
            default: return <Badge variant="secondary">LOW</Badge>
        }
    }

    const filteredRequests = (requests as MaintenanceRequestDto[]).filter((req) =>
        req.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.residentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.resident?.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="container py-6 mx-auto space-y-8">
            <SEOHelmet title="Maintenance Management - Admin" />

            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Maintenance Requests</h1>
                <p className="text-muted-foreground">Monitor and manage all maintenance issues reported by residents.</p>
            </div>

            {/* Stats Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                        <Clock className="w-4 h-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.data?.pending || 0}</div>
                        <p className="text-xs text-muted-foreground">Awaiting attention</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                        <Wrench className="w-4 h-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.data?.in_progress || 0}</div>
                        <p className="text-xs text-muted-foreground">Currently being fixed</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.data?.resolved || 0}</div>
                        <p className="text-xs text-muted-foreground">Completed requests</p>
                    </CardContent>
                </Card>
                <Card className="border-red-100 bg-red-50/30">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-red-600">Critical Issues</CardTitle>
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{stats?.data?.critical || 0}</div>
                        <p className="text-xs text-red-600/70">Urgent action required</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and List */}
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
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader className="w-10 h-10 animate-spin text-primary" />
                        </div>
                    ) : filteredRequests.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="p-4 font-semibold">Title</th>
                                        <th className="p-4 font-semibold">Resident</th>
                                        <th className="p-4 font-semibold">Room No</th>
                                        <th className="p-4 font-semibold">Priority</th>
                                        <th className="p-4 font-semibold">Status</th>
                                        <th className="p-4 font-semibold">Date</th>
                                        <th className="p-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRequests.map((req) => (
                                        <tr key={req.id} className="border-b hover:bg-muted/30 transition-colors">
                                            <td className="p-4 font-medium">{req.title}</td>
                                            <td className="p-4">{req.residentName || req.resident?.user?.name || "N/A"}</td>
                                            <td className="p-4">{req.roomNumber || req.resident?.room?.number || "N/A"}</td>
                                            <td className="p-4">{getPriorityBadge(req.priority)}</td>
                                            <td className="p-4">{getStatusBadge(req.status)}</td>
                                            <td className="p-4 text-muted-foreground">{format(new Date(req.createdAt), 'MMM d, yyyy')}</td>
                                            <td className="p-4 text-right">
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
                                                            onClick={() => updateMutation.mutate({ id: req.id, data: { status: 'resolved' } })}
                                                            disabled={req.status === 'resolved'}
                                                        >
                                                            Mark as Resolved
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 space-y-3">
                            <div className="p-4 rounded-full bg-muted">
                                <Search className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium">No requests found</h3>
                            <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

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
    )
}

export default MaintenanceManagement
