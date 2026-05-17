import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Wallet, TrendingUp, Send, AlertCircle } from "lucide-react"
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
import { BankSelector } from "@/components/bank/BankSelector"
import { AccountVerifier } from "@/components/bank/AccountVerifier"
import { TextInput } from "@/components/form/TextInput"
import { CustomTextarea } from "@/components/form/CustomTextarea"
import { FormButton, buttonVariants } from "@/components/form/FormButton"
import { StatCard } from "@/components/stat-card"
import CustomDataTable from "@/components/CustomDataTable"
import type { TableColumn } from "react-data-table-component"

const AdminDisbursement = () => {
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    amount: "",
    bankCode: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    notes: "",
  })
  const [verificationError, setVerificationError] = useState("")
  const [isVerified, setIsVerified] = useState(false)

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
      setFormData({ amount: "", bankCode: "", bankName: "", accountNumber: "", accountName: "", notes: "" })
      setIsVerified(false)
      setVerificationError("")
      queryClient.invalidateQueries({ queryKey: ["my-disbursement-requests"] })
      queryClient.invalidateQueries({ queryKey: ["disbursement-balance"] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to submit request")
    },
  })

  const handleBankChange = (bankCode: string, bankName: string) => {
    setFormData(prev => ({ ...prev, bankCode, bankName }))
    setIsVerified(false)
    setVerificationError("")
  }

  const handleAccountVerified = (accountName: string) => {
    setFormData(prev => ({ ...prev, accountName }))
    setIsVerified(true)
    setVerificationError("")
  }

  const handleVerificationError = (error: string) => {
    setVerificationError(error)
    if (error) {
      setIsVerified(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(formData.amount)
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount")
      return
    }
    if (formData.bankCode || formData.accountNumber) {
      if (!formData.bankCode || !formData.accountNumber || !formData.accountName) {
        toast.error("Please fill in all bank details and verify your account")
        return
      }
      if (verificationError) {
        toast.error("Please enter a valid account number")
        return
      }
    }
    requestMutation.mutate({
      amount,
      bankCode: formData.bankCode || undefined,
      bankName: formData.bankName || undefined,
      accountNumber: formData.accountNumber || undefined,
      accountName: formData.accountName || undefined,
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

  const isFormValid = formData.amount && Number(formData.amount) >= 100

  const handleUseTestAccount = () => {
    setFormData(prev => ({
      ...prev,
      bankCode: "MTN",
      bankName: "MTN",
      accountNumber: "0000000000",
    }))
  }

  const tableColumns: TableColumn<DisbursementRequest>[] = [
    {
      name: "Date",
      selector: (row: DisbursementRequest) => format(new Date(row.createdAt), "MMM d, yyyy"),
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row: DisbursementRequest) => `GHS ${Number(row.amount).toFixed(2)}`,
      sortable: true,
      cell: (row: DisbursementRequest) => <span className="font-medium">GHS {Number(row.amount).toFixed(2)}</span>,
    },
    {
      name: "Bank Details",
      sortable: false,
      cell: (row: DisbursementRequest) => (
        <div>
          <p className="text-sm">{row.bankName}</p>
          <p className="text-xs text-muted-foreground">
            {row.accountNumber} - {row.accountName}
          </p>
        </div>
      ),
    },
    {
      name: "Status",
      sortable: true,
      cell: (row: DisbursementRequest) => getStatusBadge(row.status),
    },
  ]

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
            <StatCard
              icon={Wallet}
              title="Available Balance"
              content={balanceLoading ? "..." : `GHS ${Number(balance?.availableBalance || 0).toFixed(2)}`}
              backgroundColor="bg-forest-green-50 dark:bg-forest-green-950/20"
              titleColor="text-forest-green-600"
              contentColor="text-forest-green-700"
            />
            <StatCard
              icon={TrendingUp}
              title="Total Collected"
              content={balanceLoading ? "..." : `GHS ${Number(balance?.totalPayments || 0).toFixed(2)}`}
              backgroundColor="bg-blue-50 dark:bg-blue-950/20"
              titleColor="text-blue-600"
              contentColor="text-blue-700"
            />
            <StatCard
              icon={Send}
              title="Already Disbursed"
              content={balanceLoading ? "..." : `GHS ${Number(balance?.totalDisbursements || 0).toFixed(2)}`}
              backgroundColor="bg-muted"
              titleColor="text-muted-foreground"
              contentColor="text-muted-foreground"
            />
          </div>

          {/* Request Form */}
          <StatCard
            title="Request Disbursement"
            content=""
            className="w-full"
          >
            <div className="flex justify-end mb-4">
              <FormButton
                variant="outline"
                size="sm"
                onClick={handleUseTestAccount}
              >
                Use Test Account
              </FormButton>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <BankSelector
                    value={formData.bankCode}
                    onChange={handleBankChange}
                    disabled={requestMutation.isPending}
                  />
                </div>
                <TextInput
                  id="accountNumber"
                  label="Account Number"
                  placeholder="0000000000"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                  disabled={requestMutation.isPending || !formData.bankCode}
                />
              </div>

              <AccountVerifier
                bankCode={formData.bankCode}
                accountNumber={formData.accountNumber}
                onVerified={handleAccountVerified}
                onVerificationError={handleVerificationError}
                disabled={requestMutation.isPending || !formData.bankCode || formData.accountNumber.length < 10}
              />

              <TextInput
                id="amount"
                label="Amount (GHS)"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                disabled={requestMutation.isPending}
              />

              <CustomTextarea
                id="notes"
                label="Notes (optional)"
                placeholder="Any additional notes for this disbursement..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                disabled={requestMutation.isPending}
              />

              {balance && Number(balance.availableBalance) <= 0 && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0" />
                  <p className="text-sm text-yellow-700">
                    No available balance for disbursement at this time.
                  </p>
                </div>
              )}

              <FormButton
                type="submit"
                disabled={requestMutation.isPending || !isFormValid}
                loading={requestMutation.isPending}
                loadingText="Submitting..."
                leftIcon={Send}
              >
                Submit Request
              </FormButton>
            </form>
          </StatCard>

          {/* My Requests Table */}
          <StatCard
            title="My Requests"
            content=""
            className="w-full"
          >
            <CustomDataTable
              columns={tableColumns}
              data={requests || []}
              isLoading={requestsLoading}
              searchable={false}
              showEmptyState={!requests || requests.length === 0}
              emptyStateMessage="No disbursement requests yet"
            />
          </StatCard>

        </div>
      </main>
    </div>
  )
}

export default AdminDisbursement