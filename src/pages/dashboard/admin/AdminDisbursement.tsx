import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Wallet, TrendingUp, Send, AlertCircle, Save, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  getDisbursementBalance,
  getMyDisbursementRequests,
  requestDisbursement,
  getDisbursementAccount,
  saveDisbursementAccount,
  deleteDisbursementAccount,
  DisbursementRequest,
  DisbursementAccount,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { TableColumn } from "react-data-table-component"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

const AdminDisbursement = () => {
  const queryClient = useQueryClient()

  const [selectedYear, setSelectedYear] = useState<number>(currentYear)
  const [useSavedAccount, setUseSavedAccount] = useState(false)
  const [saveAccount, setSaveAccount] = useState(false)

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

  const { data: savedAccount, isLoading: savedAccountLoading } = useQuery({
    queryKey: ["disbursement-account"],
    queryFn: getDisbursementAccount,
  })

  const { data: balance, isLoading: balanceLoading } = useQuery({
    queryKey: ["disbursement-balance", selectedYear],
    queryFn: () => getDisbursementBalance(undefined, selectedYear),
  })

  const { data: requests, isLoading: requestsLoading } = useQuery({
    queryKey: ["my-disbursement-requests", selectedYear],
    queryFn: () => getMyDisbursementRequests(),
  })

  const filteredRequests = useMemo(() => {
    if (!requests) return []
    return requests.filter((req) => {
      const reqYear = new Date(req.createdAt).getFullYear()
      return reqYear === selectedYear
    })
  }, [requests, selectedYear])

  const saveAccountMutation = useMutation({
    mutationFn: saveDisbursementAccount,
    onSuccess: () => {
      toast.success("Bank account saved successfully")
      queryClient.invalidateQueries({ queryKey: ["disbursement-account"] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to save account")
    },
  })

  const deleteAccountMutation = useMutation({
    mutationFn: deleteDisbursementAccount,
    onSuccess: () => {
      toast.success("Bank account removed")
      queryClient.invalidateQueries({ queryKey: ["disbursement-account"] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to remove account")
    },
  })

  const requestMutation = useMutation({
    mutationFn: async (data: { amount: number; bankCode?: string; bankName?: string; accountNumber?: string; accountName?: string; notes?: string }) => {
      const result = await requestDisbursement(data)
      if (saveAccount && data.bankCode && data.accountNumber && data.accountName) {
        await saveDisbursementAccount({
          bankCode: data.bankCode,
          bankName: data.bankName || "",
          accountNumber: data.accountNumber,
          accountName: data.accountName,
        })
      }
      return result
    },
    onSuccess: () => {
      toast.success("Disbursement request submitted successfully")
      if (saveAccount) {
        toast.success("Bank account saved for future use")
      }
      setFormData({ amount: "", bankCode: "", bankName: "", accountNumber: "", accountName: "", notes: "" })
      setIsVerified(false)
      setVerificationError("")
      setSaveAccount(false)
      queryClient.invalidateQueries({ queryKey: ["my-disbursement-requests"] })
      queryClient.invalidateQueries({ queryKey: ["disbursement-balance"] })
      queryClient.invalidateQueries({ queryKey: ["disbursement-account"] })
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
      
      // Check if it's test account (MTN + 0000000000)
      const isTestAccount = formData.bankCode === "MTN" && formData.accountNumber === "0000000000"
      
      // Allow test account even if verification failed, otherwise check verification
      if (!isTestAccount && verificationError) {
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
    setUseSavedAccount(false)
  }

  const handleUseSavedAccount = () => {
    if (savedAccount) {
      setFormData(prev => ({
        ...prev,
        bankCode: savedAccount.bankCode,
        bankName: savedAccount.bankName,
        accountNumber: savedAccount.accountNumber,
        accountName: savedAccount.accountName,
      }))
      setIsVerified(savedAccount.isVerified)
    }
  }

  const handleDeleteSavedAccount = () => {
    if (confirm("Are you sure you want to remove your saved bank account?")) {
      deleteAccountMutation.mutate()
    }
  }

  const getTransferStatusBadge = (status: string | null) => {
    switch (status) {
      case "SUCCESS":
        return <Badge className="bg-green-500 text-white">Transfer Success</Badge>
      case "PENDING":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Transfer Pending</Badge>
      case "FAILED":
        return <Badge variant="destructive">Transfer Failed</Badge>
      default:
        return null
    }
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
    {
      name: "Transfer",
      sortable: false,
      cell: (row: DisbursementRequest) => getTransferStatusBadge(row.transferStatus),
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

          {/* Year Filter */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Financial Overview</h2>
            <Select
              value={selectedYear.toString()}
              onValueChange={(value) => setSelectedYear(parseInt(value))}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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

          {/* Saved Account Section */}
          {savedAccount && (
            <Card className="mb-6 bg-forest-green-50/50 border-forest-green-200">
              <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-forest-green-900">Saved Bank Account</p>
                  <p className="text-sm font-medium text-forest-green-700 mt-1">
                    {savedAccount.bankName} - <span className="font-mono">****{savedAccount.accountNumber.slice(-4)}</span>
                  </p>
                  <p className="text-sm text-forest-green-600 mt-0.5">{savedAccount.accountName}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <FormButton
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleUseSavedAccount}
                    leftIcon={Save}
                    className="bg-white"
                  >
                    Use This Account
                  </FormButton>
                  <FormButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleDeleteSavedAccount}
                    disabled={deleteAccountMutation.isPending}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    leftIcon={Trash2}
                  >
                    Remove
                  </FormButton>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Request Form */}
          <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
              <div className="space-y-1">
                <CardTitle>Request Disbursement</CardTitle>
                <CardDescription>
                  {!savedAccount 
                    ? "Save your bank account for faster future requests" 
                    : "Enter the amount and confirm the bank account for this disbursement"}
                </CardDescription>
              </div>
              <FormButton
                type="button"
                variant="outline"
                size="sm"
                onClick={handleUseTestAccount}
              >
                Use Test Account
              </FormButton>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
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

              {!savedAccount && isVerified && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="saveAccount"
                    checked={saveAccount}
                    onCheckedChange={(checked) => setSaveAccount(checked as boolean)}
                  />
                  <label
                    htmlFor="saveAccount"
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    Save this account for future disbursements
                  </label>
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
            </CardContent>
          </Card>

          {/* My Requests Table */}
          <Card>
            <CardHeader>
              <CardTitle>My Requests - {selectedYear}</CardTitle>
              <CardDescription>View your past and pending disbursement requests</CardDescription>
            </CardHeader>
            <CardContent>
              <CustomDataTable
                columns={tableColumns}
                data={filteredRequests}
                isLoading={requestsLoading}
                searchable={false}
                showEmptyState={!filteredRequests || filteredRequests.length === 0}
                emptyStateMessage="No disbursement requests yet"
              />
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  )
}

export default AdminDisbursement