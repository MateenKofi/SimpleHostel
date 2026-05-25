import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import type { TableColumn } from "react-data-table-component"
import {
  calculateRefund,
  getRefundRequests,
  approveRefund,
  rejectRefund,
  instantRefund,
  RefundRequestDto,
} from "@/api/refunds"
import { getHostelTransactions } from "@/api/payments"
import {
  Loader,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
} from "lucide-react"
import { toast } from "sonner"
import SEOHelmet from "@/components/SEOHelmet"
import { PageHeader } from "@/components/layout/PageHeader"
import CustomDataTable from "@/components/CustomDataTable"
import { StatCard } from "@/components/stat-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { format } from "date-fns"

export default function RefundRequests() {
  const queryClient = useQueryClient()
  const hostelId = localStorage.getItem("hostelId") || ""

  // Active filters and query keys
  const [activeTab, setActiveTab] = useState<string>("all")

  // Modal states
  const [approvingRequest, setApprovingRequest] = useState<RefundRequestDto | null>(null)
  const [isApproving, setIsApproving] = useState(false)

  const [rejectingRequest, setRejectingRequest] = useState<RefundRequestDto | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isRejecting, setIsRejecting] = useState(false)

  // Instant Refund states
  const [isInstantOpen, setIsInstantOpen] = useState(false)
  const [selectedPaymentId, setSelectedPaymentId] = useState("")
  const [instantReason, setInstantReason] = useState("")
  const [customRefundAmount, setCustomRefundAmount] = useState("")
  const [isCalculatingInstant, setIsCalculatingInstant] = useState(false)
  const [instantCalc, setInstantCalc] = useState<any>(null)
  const [isProcessingInstant, setIsProcessingInstant] = useState(false)

  // Fetch refund requests
  const { data: requests, isLoading: isRequestsLoading, refetch } = useQuery<RefundRequestDto[]>({
    queryKey: ["refund-requests", hostelId],
    queryFn: async () => {
      const res = await getRefundRequests({ hostelId })
      return res.data || res || []
    },
    enabled: !!hostelId,
  })

  // Fetch confirmed payments for instant refund dropdown
  const { data: transactions } = useQuery({
    queryKey: ["confirmed-transactions", hostelId],
    queryFn: async () => {
      const res = await getHostelTransactions(hostelId)
      const data = res?.data || []
      // Only return confirmed/success payments that haven't been fully refunded yet
      return data.filter(
        (t: any) =>
          (t.status === "confirmed" || t.status === "success") &&
          (!t.refundedAmount || t.refundedAmount < t.amountPaid)
      )
    },
    enabled: isInstantOpen && !!hostelId,
  })

  // Handle calculation when select payment in instant refund
  const handlePaymentChange = async (paymentId: string) => {
    setSelectedPaymentId(paymentId)
    if (!paymentId) {
      setInstantCalc(null)
      return
    }
    setIsCalculatingInstant(true)
    try {
      const res = await calculateRefund(paymentId)
      setInstantCalc(res.data)
      setCustomRefundAmount(res.data.refundableAmount.toString())
    } catch (e) {
      toast.error("Failed to calculate pro-rata refund details")
    } finally {
      setIsCalculatingInstant(false)
    }
  }

  // Submit Approval
  const handleConfirmApprove = async () => {
    if (!approvingRequest) return
    setIsApproving(true)
    try {
      await approveRefund(approvingRequest.id)
      toast.success("Refund approved and processed successfully")
      setApprovingRequest(null)
      queryClient.invalidateQueries({ queryKey: ["refund-requests", hostelId] })
      queryClient.invalidateQueries({ queryKey: ["confirmed-transactions", hostelId] })
    } catch (error: any) {
      console.error(error)
      const msg = error?.response?.data?.message || "Failed to process refund"
      toast.error("Approval Failed", { description: msg })
    } finally {
      setIsApproving(false)
    }
  }

  // Submit Rejection
  const handleConfirmReject = async () => {
    if (!rejectingRequest || !rejectionReason.trim()) {
      toast.error("Please provide a rejection reason")
      return
    }
    setIsRejecting(true)
    try {
      await rejectRefund(rejectingRequest.id, rejectionReason)
      toast.success("Refund request rejected")
      setRejectingRequest(null)
      setRejectionReason("")
      queryClient.invalidateQueries({ queryKey: ["refund-requests", hostelId] })
    } catch (error: any) {
      console.error(error)
      const msg = error?.response?.data?.message || "Failed to reject refund"
      toast.error("Rejection Failed", { description: msg })
    } finally {
      setIsRejecting(false)
    }
  }

  // Process Instant Refund
  const handleProcessInstant = async () => {
    if (!selectedPaymentId || !instantReason.trim() || !customRefundAmount) {
      toast.error("Please fill in all details")
      return
    }
    const amountNum = parseFloat(customRefundAmount)
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid amount")
      return
    }
    if (instantCalc && amountNum > instantCalc.refundableAmount) {
      toast.error(`Refund amount cannot exceed max refundable: GHS ${instantCalc.refundableAmount}`)
      return
    }

    setIsProcessingInstant(true)
    try {
      await instantRefund(selectedPaymentId, amountNum, instantReason)
      toast.success("Instant refund processed successfully")
      setIsInstantOpen(false)
      setSelectedPaymentId("")
      setInstantReason("")
      setCustomRefundAmount("")
      setInstantCalc(null)
      queryClient.invalidateQueries({ queryKey: ["refund-requests", hostelId] })
      queryClient.invalidateQueries({ queryKey: ["confirmed-transactions", hostelId] })
    } catch (error: any) {
      console.error(error)
      const msg = error?.response?.data?.message || "Failed to process instant refund"
      toast.error("Instant Refund Failed", { description: msg })
    } finally {
      setIsProcessingInstant(false)
    }
  }

  // Filter requests based on tab and search
  const filteredRequests = (requests || []).filter((req) => {
    return activeTab === "all" || req.status.toLowerCase() === activeTab.toLowerCase()
  })

  // Metrics
  const pendingCount = (requests || []).filter((r) => r.status === "PENDING").length
  const processedCount = (requests || []).filter((r) => r.status === "PROCESSED").length
  const totalRefundedSum = (requests || [])
    .filter((r) => r.status === "PROCESSED")
    .reduce((sum, r) => sum + r.amount, 0)

  const columns: TableColumn<RefundRequestDto>[] = [
    {
      name: "Date Requested",
      selector: (row) => format(new Date(row.createdAt), "MMM dd, yyyy HH:mm"),
      sortable: true,
      minWidth: "170px",
    },
    {
      name: "Resident",
      selector: (row) => `${row.resident?.user?.name || ""} ${row.resident?.user?.email || ""}`,
      cell: (row) => (
        <div className="py-3">
          <div className="font-semibold text-foreground">{row.resident?.user?.name || "Unknown"}</div>
          <div className="text-xs text-muted-foreground">{row.resident?.user?.email || "No email"}</div>
        </div>
      ),
      sortable: true,
      minWidth: "220px",
    },
    {
      name: "Payment",
      selector: (row) => row.payment?.reference || "",
      cell: (row) => (
        <div className="py-3">
          <div className="text-xs font-mono font-medium">Ref: {row.payment?.reference || "N/A"}</div>
          <div className="text-xs text-muted-foreground capitalize">
            Method: {(row.payment?.method || "unknown").replace("_", " ")}
          </div>
        </div>
      ),
      minWidth: "230px",
    },
    {
      name: "Refund Amount",
      selector: (row) => row.amount,
      cell: (row) => <span className="font-bold text-foreground">GHS {row.amount.toLocaleString()}</span>,
      sortable: true,
      minWidth: "140px",
    },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) => (
        <Badge
          variant={
            row.status === "PENDING"
              ? "secondary"
              : row.status === "PROCESSED"
              ? "default"
              : "destructive"
          }
          className={
            row.status === "PENDING"
              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 hover:bg-amber-100"
              : row.status === "PROCESSED"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-100"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-100"
          }
        >
          {row.status}
        </Badge>
      ),
      sortable: true,
      minWidth: "120px",
    },
    {
      name: "Actions",
      right: true,
      cell: (row) => (
        <div className="flex flex-wrap items-center justify-end gap-2 py-2">
          {row.status === "PENDING" ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/20"
                onClick={() => setApprovingRequest(row)}
              >
                <CheckCircle className="w-4 h-4 mr-1" /> Approve
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                onClick={() => setRejectingRequest(row)}
              >
                <XCircle className="w-4 h-4 mr-1" /> Reject
              </Button>
            </>
          ) : row.status === "REJECTED" ? (
            <span
              className="text-xs text-muted-foreground flex items-center gap-1 cursor-help hover:text-foreground"
              title={`Reason: ${row.rejectionReason || "None specified"}`}
            >
              <Info className="w-3.5 h-3.5" /> View Reason
            </span>
          ) : (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-green-500" />
              Refunded {row.processedAt && format(new Date(row.processedAt), "MMM dd")}
            </span>
          )}
        </div>
      ),
      minWidth: "230px",
    },
  ]

  return (
    <div className="container max-w-6xl py-4 sm:py-6 mx-auto">
      <SEOHelmet
        title="Refund Management - Fuse"
        description="Review and process resident refund requests."
      />

      <PageHeader
        title="Refund Management"
        subtitle="Process resident refund requests and issue pro-rata payouts."
        icon={RefreshCw}
        sticky={false}
        actions={
          <Button
            className="w-full sm:w-auto bg-primary text-primary-foreground shrink-0 shadow-sm"
            onClick={() => setIsInstantOpen(true)}
          >
            Instant Refund
          </Button>
        }
      />

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <StatCard
          icon={AlertTriangle}
          title="Pending Requests"
          content={pendingCount.toString()}
          description="Awaiting administrator review."
          contentColor="text-amber-600"
          className="rounded-lg shadow-sm"
        />
        <StatCard
          icon={CheckCircle}
          title="Processed"
          content={processedCount.toString()}
          description="Successfully refunded payments."
          contentColor="text-forest-green-600"
          className="rounded-lg shadow-sm"
        />
        <StatCard
          icon={RefreshCw}
          title="Total Refunded"
          content={`GHS ${totalRefundedSum.toLocaleString()}`}
          description="Cumulative refund value."
          contentColor="text-foreground"
          className="rounded-lg shadow-sm"
        />
      </div>

      {/* Requests Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
          <div className="overflow-x-auto rounded-lg border bg-card px-3 py-2">
            <TabsList className="bg-transparent border-b-0 gap-2 min-w-max">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md px-3 py-1.5 text-xs font-semibold"
              >
                All Requests
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800 rounded-md px-3 py-1.5 text-xs font-semibold"
              >
                Pending ({pendingCount})
              </TabsTrigger>
              <TabsTrigger
                value="processed"
                className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800 rounded-md px-3 py-1.5 text-xs font-semibold"
              >
                Processed
              </TabsTrigger>
              <TabsTrigger
                value="rejected"
                className="data-[state=active]:bg-red-100 data-[state=active]:text-red-800 rounded-md px-3 py-1.5 text-xs font-semibold"
              >
                Rejected
              </TabsTrigger>
            </TabsList>
          </div>

          <CustomDataTable
            title="Refund Requests"
            columns={columns}
            data={filteredRequests}
            isLoading={isRequestsLoading}
            refetch={refetch}
            emptyStateMessage="No refund requests match the selected status."
            exportFilename="refund-requests.csv"
          />
      </Tabs>

      {/* APPROVAL DIALOG */}
      <Dialog open={!!approvingRequest} onOpenChange={(open) => !open && setApprovingRequest(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Approve and Process Refund</DialogTitle>
            <DialogDescription>
              Confirm refund disbursement details for this resident.
            </DialogDescription>
          </DialogHeader>

          {approvingRequest && (
            <div className="space-y-4 py-3">
              <div className="rounded-lg bg-muted/60 p-4 space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Resident:</span>
                  <span className="font-semibold">{approvingRequest.resident?.user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payout Method:</span>
                  <span className="font-semibold uppercase">
                    {approvingRequest.payment?.method || "Cash"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Ref:</span>
                  <span className="font-mono font-medium">{approvingRequest.payment?.reference}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-base text-forest-green-700 dark:text-forest-green-300">
                  <span>Refund Amount:</span>
                  <span>GHS {approvingRequest.amount.toLocaleString()}</span>
                </div>
              </div>

              {approvingRequest.payment?.method === "cash" ? (
                <div className="rounded-lg border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/20 p-3 text-xs flex gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-800 dark:text-amber-300">Manual Cash Refund:</span>
                    <p className="text-amber-700 dark:text-amber-400 mt-1">
                      This payment was completed via Cash. Approving it will register the refund in the system and deallocate the student's room, but you must arrange the cash return manually.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20 p-3 text-xs flex gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-blue-800 dark:text-blue-300">Online Paystack Payout:</span>
                    <p className="text-blue-700 dark:text-blue-400 mt-1">
                      This transaction was completed online. Approving it will initiate an automated refund request to the Paystack API directly.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setApprovingRequest(null)} disabled={isApproving}>
              Cancel
            </Button>
            <Button
              className="bg-forest-green-600 hover:bg-forest-green-700 text-white"
              onClick={handleConfirmApprove}
              disabled={isApproving}
            >
              {isApproving ? "Processing Payout..." : "Confirm Approval"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* REJECTION DIALOG */}
      <Dialog open={!!rejectingRequest} onOpenChange={(open) => !open && setRejectingRequest(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Refund Request</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this resident's refund request.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="space-y-1.5">
              <label htmlFor="rejection-reason" className="text-xs font-semibold text-muted-foreground uppercase">
                Rejection Reason <span className="text-destructive">*</span>
              </label>
              <Textarea
                id="rejection-reason"
                placeholder="State the reason clearly. The resident will see this reason in their portal..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-[90px]"
                maxLength={250}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectingRequest(null)} disabled={isRejecting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmReject}
              disabled={isRejecting || !rejectionReason.trim()}
            >
              {isRejecting ? "Rejecting..." : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* INSTANT REFUND DIALOG */}
      <Dialog open={isInstantOpen} onOpenChange={(open) => !open && setIsInstantOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Process Instant Refund</DialogTitle>
            <DialogDescription>
              Directly override a confirmed payment transaction to issue an immediate refund.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase">
                Select Confirmed Transaction <span className="text-destructive">*</span>
              </label>
              <select
                className="w-full h-10 px-3 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                value={selectedPaymentId}
                onChange={(e) => handlePaymentChange(e.target.value)}
              >
                <option value="">-- Choose confirmed payment --</option>
                {transactions?.map((t: any) => (
                  <option key={t.id} value={t.id}>
                    {t.residentProfile?.user?.name || "Unknown Resident"} - GHS {t.amountPaid} ({t.reference.slice(0, 10)}...)
                  </option>
                ))}
              </select>
            </div>

            {isCalculatingInstant ? (
              <div className="flex flex-col items-center justify-center py-6 space-y-2">
                <Loader className="w-6 h-6 animate-spin text-primary" />
                <p className="text-xs text-muted-foreground">Calculating pro-rata limits...</p>
              </div>
            ) : instantCalc ? (
              <div className="space-y-3">
                <div className="rounded-lg bg-muted/60 p-4 space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Original Payment:</span>
                    <span className="font-semibold">GHS {instantCalc.paymentAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stay status:</span>
                    <span>
                      {instantCalc.checkedIn
                        ? `Checked in (${instantCalc.daysStayed}/${instantCalc.totalDays} days)`
                        : "No show"}
                    </span>
                  </div>
                  <div className="flex justify-between text-destructive">
                    <span>Deduction (Admin Fee & Penalty):</span>
                    <span>
                      - GHS{" "}
                      {(
                        instantCalc.paymentAmount -
                        instantCalc.refundableAmount
                      ).toFixed(2)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-sm text-forest-green-700 dark:text-forest-green-300">
                    <span>Suggested/Max Refundable:</span>
                    <span>GHS {instantCalc.refundableAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">
                    Refund Amount (GHS) <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Enter amount"
                    value={customRefundAmount}
                    onChange={(e) => setCustomRefundAmount(e.target.value)}
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Must not exceed GHS {instantCalc.refundableAmount}
                  </p>
                </div>
              </div>
            ) : null}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase">
                Refund Reason / Audit Note <span className="text-destructive">*</span>
              </label>
              <Textarea
                placeholder="Explain the reason for this instant override refund..."
                value={instantReason}
                onChange={(e) => setInstantReason(e.target.value)}
                className="min-h-[70px]"
                maxLength={250}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsInstantOpen(false)
                setSelectedPaymentId("")
                setInstantReason("")
                setCustomRefundAmount("")
                setInstantCalc(null)
              }}
              disabled={isProcessingInstant}
            >
              Cancel
            </Button>
            <Button
              className="bg-forest-green-600 hover:bg-forest-green-700 text-white"
              onClick={handleProcessInstant}
              disabled={
                isProcessingInstant ||
                !selectedPaymentId ||
                !instantReason.trim() ||
                !customRefundAmount
              }
            >
              {isProcessingInstant ? "Processing Refund..." : "Process Instant Refund"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
