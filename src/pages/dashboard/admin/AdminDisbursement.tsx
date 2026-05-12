import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2, Wallet, TrendingUp, Send, AlertCircle } from "lucide-react"
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
  getDisbursementBalance,
  getMyDisbursementRequests,
  requestDisbursement,
  DisbursementRequest,
} from "@/api/disbursements"
import { toast } from "sonner"
import SEOHelmet from "@/components/SEOHelmet"
import { PageHeader } from "@/components/layout/PageHeader"
import { format } from "date-fns"

const AdminDisbursement = () => {
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    amount: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    notes: "",
  })

  const { data: balance, isLoading: balanceLoading } = useQuery({
    queryKey: ["disbursement-balance"],
    queryFn: () => getDisbursementBalance(),
  })

  const { data: requests, isLoading: requestsLoading } = useQuery({
    queryKey: ["my-disbursement-requests"],
    queryFn: getMyDisbursementRequests,
  })

  const requestMutation = useMutation({
    mutationFn: requestDisbursement,
    onSuccess: () => {
      toast.success("Disbursement request submitted successfully")
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
    const amount = parseFloat(formData.amount)
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount")
      return
    }
    if (!formData.bankName || !formData.accountNumber || !formData.accountName) {
      toast.error("Please fill in all bank details")
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
      <SEOHelmet title="Disbursements - Admin" />
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
            <Card className="bg-forest-green-50 dark:bg-forest-green-950/20 border-forest-green-200">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-forest-green-100 dark:bg-forest-green-900/40 rounded-lg">
                  <Wallet className="w-5 h-5 text-forest-green-600" />
                </div>
                <div>
                  <p className="text-xs text-forest-green-600">Available Balance</p>
                  <p className="text-2xl font-bold text-forest-green-700">
                    {balanceLoading ? "..." : `GHS ${Number(balance?.availableBalance || 0).toFixed(2)}`}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-blue-600">Total Collected</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {balanceLoading ? "..." : `GHS ${Number(balance?.totalPayments || 0).toFixed(2)}`}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-muted dark:bg-muted/20">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-muted-foreground/10 dark:bg-muted-foreground/20 rounded-lg">
                  <Send className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Already Disbursed</p>
                  <p className="text-2xl font-bold text-muted-foreground">
                    {balanceLoading ? "..." : `GHS ${Number(balance?.totalDisbursements || 0).toFixed(2)}`}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Request Form */}
          <Card>
            <CardHeader>
              <CardTitle>Request Disbursement</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Amount (GHS)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="mt-1"
                      disabled={requestMutation.isPending}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      placeholder="e.g. Ghana Commercial Bank"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      className="mt-1"
                      disabled={requestMutation.isPending}
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      placeholder="0000000000"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      className="mt-1"
                      disabled={requestMutation.isPending}
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountName">Account Name</Label>
                    <Input
                      id="accountName"
                      placeholder="Account holder name"
                      value={formData.accountName}
                      onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                      className="mt-1"
                      disabled={requestMutation.isPending}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional notes for this disbursement..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="mt-1"
                    disabled={requestMutation.isPending}
                  />
                </div>
                {balance && Number(balance.availableBalance) <= 0 && (
                  <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0" />
                    <p className="text-sm text-yellow-700">
                      No available balance for disbursement at this time.
                    </p>
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={requestMutation.isPending || !formData.amount || !formData.bankName || !formData.accountNumber || !formData.accountName}
                >
                  {requestMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Request
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* My Requests Table */}
          <Card>
            <CardHeader>
              <CardTitle>My Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {requestsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : !requests || requests.length === 0 ? (
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
                    {requests.map((request: DisbursementRequest) => (
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

export default AdminDisbursement