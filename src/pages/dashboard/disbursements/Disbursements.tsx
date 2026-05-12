import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2, Plus, Wallet, ArrowUpRight, Clock, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/stores/useAuthStore"
import {
  getDisbursementBalance,
  getMyDisbursementRequests,
  requestDisbursement,
  DisbursementRequest,
} from "@/api/disbursements"
import { toast } from "sonner"
import SEOHelmet from "@/components/SEOHelmet"
import { PageHeader } from "@/components/layout/PageHeader"
import { format } from "date-fns"

const Disbursements = () => {
  const queryClient = useQueryClient()
  const userHostelId = useAuthStore((state) => state.hostelId)
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    amount: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    notes: "",
  })

  const { data: balance, isLoading: isBalanceLoading } = useQuery({
    queryKey: ["disbursement-balance"],
    queryFn: () => getDisbursementBalance(userHostelId || undefined),
    enabled: !!userHostelId,
  })

  const { data: requests = [], isLoading: isRequestsLoading } = useQuery({
    queryKey: ["my-disbursement-requests"],
    queryFn: getMyDisbursementRequests,
    enabled: !!userHostelId,
  })

  const requestMutation = useMutation({
    mutationFn: requestDisbursement,
    onSuccess: () => {
      toast.success("Disbursement request submitted successfully")
      setIsRequestDialogOpen(false)
      setFormData({ amount: "", bankName: "", accountNumber: "", accountName: "", notes: "" })
      queryClient.invalidateQueries({ queryKey: ["my-disbursement-requests"] })
      queryClient.invalidateQueries({ queryKey: ["disbursement-balance"] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to submit request")
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!balance) return

    const amount = parseFloat(formData.amount)
    if (amount > balance.availableBalance) {
      toast.error("Amount exceeds available balance")
      return
    }

    requestMutation.mutate({
      amount,
      bankName: formData.bankName,
      accountNumber: formData.accountNumber,
      accountName: formData.accountName,
      notes: formData.notes || undefined,
    })
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
      <SEOHelmet title="Disbursements - Fuse" />
      <PageHeader
        title="Disbursements"
        subtitle="Request payouts from your collected payments"
        icon={Wallet}
        sticky={true}
      />
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-forest-green-50 to-forest-green-100 dark:from-forest-green-950/30 dark:to-forest-green-900/20 border-forest-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-forest-green-600 dark:text-forest-green-400 font-medium">Available Balance</p>
                    <p className="text-3xl font-bold text-forest-green-700 dark:text-forest-green-300 mt-1">
                      {isBalanceLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : `GHS ${balance?.availableBalance.toFixed(2) || "0.00"}`}
                    </p>
                  </div>
                  <div className="p-3 bg-forest-green-500 rounded-full">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-xs text-forest-green-600/70 mt-3">For {new Date().getFullYear()} Calendar Year</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Collected</p>
                    <p className="text-2xl font-semibold mt-1">
                      GHS {balance?.totalPayments.toFixed(2) || "0.00"}
                    </p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Already Disbursed</p>
                    <p className="text-2xl font-semibold mt-1">
                      GHS {balance?.totalDisbursements.toFixed(2) || "0.00"}
                    </p>
                  </div>
                  <Clock className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Request Button */}
          <div className="flex justify-end">
            <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-forest-green-600 hover:bg-forest-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Request Disbursement
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Request Disbursement</DialogTitle>
                  <DialogDescription>
                    Enter your bank details to receive your available balance. Minimum amount is GHS 100.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Amount (GHS)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="100"
                      max={balance?.availableBalance}
                      placeholder="Enter amount"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Available: GHS {balance?.availableBalance.toFixed(2) || "0.00"}
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      placeholder="e.g., Ghana Commercial Bank"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      placeholder="10-16 digits"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountName">Account Name</Label>
                    <Input
                      id="accountName"
                      placeholder="As it appears on bank account"
                      value={formData.accountName}
                      onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any additional information..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsRequestDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={requestMutation.isPending}>
                      {requestMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Submit Request
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Request History */}
          <Card>
            <CardHeader>
              <CardTitle>Request History</CardTitle>
            </CardHeader>
            <CardContent>
              {isRequestsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : requests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No disbursement requests yet
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Bank Details</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{format(new Date(request.createdAt), "MMM d, yyyy")}</TableCell>
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default Disbursements