import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2, Check, X, Clock, AlertCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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
import {
  getAllDisbursementRequests,
  approveDisbursement,
  rejectDisbursement,
  processDisbursement,
  DisbursementRequest,
  DisbursementStats,
} from "@/api/disbursements"
import { toast } from "sonner"
import SEOHelmet from "@/components/SEOHelmet"
import { PageHeader } from "@/components/layout/PageHeader"
import { Wallet } from "lucide-react"
import { format } from "date-fns"

const DisbursementManagement = () => {
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<DisbursementRequest | null>(null)
  const [rejectReason, setRejectReason] = useState("")

  const { data, isLoading } = useQuery({
    queryKey: ["all-disbursement-requests", statusFilter],
    queryFn: () => getAllDisbursementRequests({ status: statusFilter }),
  })

  const requests = data?.requests || []
  const stats: DisbursementStats = data?.stats || { pending: 0, approved: 0, processed: 0, rejected: 0 }

  const approveMutation = useMutation({
    mutationFn: approveDisbursement,
    onSuccess: () => {
      toast.success("Disbursement approved")
      queryClient.invalidateQueries({ queryKey: ["all-disbursement-requests"] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to approve")
    },
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => rejectDisbursement(id, reason),
    onSuccess: () => {
      toast.success("Disbursement rejected")
      setRejectDialogOpen(false)
      setSelectedRequest(null)
      setRejectReason("")
      queryClient.invalidateQueries({ queryKey: ["all-disbursement-requests"] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to reject")
    },
  })

  const processMutation = useMutation({
    mutationFn: processDisbursement,
    onSuccess: () => {
      toast.success("Disbursement marked as processed")
      queryClient.invalidateQueries({ queryKey: ["all-disbursement-requests"] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to process")
    },
  })

  const handleRejectClick = (request: DisbursementRequest) => {
    setSelectedRequest(request)
    setRejectDialogOpen(true)
  }

  const handleConfirmReject = () => {
    if (!selectedRequest || !rejectReason) return
    rejectMutation.mutate({ id: selectedRequest.id, reason: rejectReason })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>
      case "APPROVED":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Approved</Badge>
      case "PROCESSED":
        return <Badge className="bg-green-500">Processed</Badge>
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHelmet title="Disbursement Management - Admin" />
      <PageHeader
        title="Disbursement Requests"
        subtitle="Review and process hostel disbursement requests"
        icon={Wallet}
        sticky={true}
      />
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-xs text-yellow-600">Pending</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                  <Check className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.approved}</p>
                  <p className="text-xs text-blue-600">Approved</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-green-50 dark:bg-green-950/20 border-green-200">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.processed}</p>
                  <p className="text-xs text-green-600">Processed</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-red-50 dark:bg-red-950/20 border-red-200">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
                  <X className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.rejected}</p>
                  <p className="text-xs text-red-600">Rejected</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4">
            <Label>Filter by status:</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="PROCESSED">Processed</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Requests Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : requests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No disbursement requests found
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Hostel</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Bank Details</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request: DisbursementRequest) => (
                      <TableRow key={request.id}>
                        <TableCell>{format(new Date(request.createdAt), "MMM d, yyyy")}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{request.hostel?.name}</p>
                            <p className="text-xs text-muted-foreground">{request.hostel?.location}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">GHS {Number(request.amount).toFixed(2)}</TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{request.bankName}</p>
                            <p className="text-xs text-muted-foreground">
                              {request.accountNumber} - {request.accountName}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell className="text-right">
                          {request.status === "PENDING" && (
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-green-500 text-green-600 hover:bg-green-50"
                                onClick={() => approveMutation.mutate(request.id)}
                                disabled={approveMutation.isPending}
                              >
                                {approveMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Approve"}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500 text-red-600 hover:bg-red-50"
                                onClick={() => handleRejectClick(request)}
                                disabled={rejectMutation.isPending}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                          {request.status === "APPROVED" && (
                            <Button
                              size="sm"
                              className="bg-forest-green-600 hover:bg-forest-green-700"
                              onClick={() => processMutation.mutate(request.id)}
                              disabled={processMutation.isPending}
                            >
                              {processMutation.isPending ? (
                                <>
                                  <Loader2 className="w-3 h-3 animate-spin mr-1" />
                                  Initiating...
                                </>
                              ) : (
                                <>
                                  <Send className="w-3 h-3 mr-1" />
                                  Initiate Transfer
                                </>
                              )}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Disbursement Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this disbursement request. This will be visible to the hostel admin.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejectReason">Rejection Reason</Label>
              <Textarea
                id="rejectReason"
                placeholder="Enter reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmReject}
              disabled={!rejectReason || rejectMutation.isPending}
            >
              {rejectMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DisbursementManagement