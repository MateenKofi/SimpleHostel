import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2, Plus, Wallet, ArrowUpRight, Clock, Trash2, Building2, User, CreditCard, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useAuthStore } from "@/stores/useAuthStore"
import {
  getDisbursementBalance,
  getMyDisbursementRequests,
  requestDisbursement,
  getDisbursementAccount,
  saveDisbursementAccount,
  deleteDisbursementAccount,
} from "@/api/disbursements"
import { toast } from "sonner"
import SEOHelmet from "@/components/SEOHelmet"
import { PageHeader } from "@/components/layout/PageHeader"
import { format } from "date-fns"
import { BankSelector } from "@/components/bank/BankSelector"
import { AccountVerifier } from "@/components/bank/AccountVerifier"

const Disbursements = () => {
  const queryClient = useQueryClient()
  const userHostelId = useAuthStore((state) => state.hostelId)
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false)
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
  const [saveAccount, setSaveAccount] = useState(false)
  const [useSavedAccount, setUseSavedAccount] = useState(false)

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

  const { data: savedAccount, isLoading: isSavedAccountLoading } = useQuery({
    queryKey: ["disbursement-account"],
    queryFn: getDisbursementAccount,
    enabled: !!userHostelId,
  })

  const requestMutation = useMutation({
    mutationFn: requestDisbursement,
    onSuccess: () => {
      toast.success("Disbursement request submitted successfully")
      setIsRequestDialogOpen(false)
      setFormData({ amount: "", bankCode: "", bankName: "", accountNumber: "", accountName: "", notes: "" })
      setIsVerified(false)
      setVerificationError("")
      setUseSavedAccount(false)
      queryClient.invalidateQueries({ queryKey: ["my-disbursement-requests"] })
      queryClient.invalidateQueries({ queryKey: ["disbursement-balance"] })
    },
    onError: (error) => {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || "Failed to submit request")
    },
  })

  const saveAccountMutation = useMutation({
    mutationFn: saveDisbursementAccount,
    onSuccess: () => {
      toast.success("Disbursement account saved successfully")
      queryClient.invalidateQueries({ queryKey: ["disbursement-account"] })
    },
    onError: (error) => {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || "Failed to save account")
    },
  })

  const deleteAccountMutation = useMutation({
    mutationFn: deleteDisbursementAccount,
    onSuccess: () => {
      toast.success("Disbursement account removed")
      queryClient.invalidateQueries({ queryKey: ["disbursement-account"] })
      setUseSavedAccount(false)
    },
    onError: (error) => {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || "Failed to remove account")
    },
  })

  const handleBankChange = (bankCode: string, bankName: string) => {
    setFormData({ ...formData, bankCode, bankName })
    setIsVerified(false)
    setVerificationError("")
  }

  const handleAccountVerified = (accountName: string) => {
    setFormData({ ...formData, accountName })
    setIsVerified(true)
    setVerificationError("")
  }

  const handleVerificationError = (error: string) => {
    setVerificationError(error)
    setIsVerified(false)
  }

  const handleUseSavedAccount = () => {
    if (!savedAccount) return
    setFormData({
      ...formData,
      bankCode: savedAccount.bankCode,
      bankName: savedAccount.bankName,
      accountNumber: savedAccount.accountNumber,
      accountName: savedAccount.accountName,
    })
    setIsVerified(true)
    setVerificationError("")
    setUseSavedAccount(true)
    setIsRequestDialogOpen(true)
  }

  const handleSaveAccountAfterVerification = () => {
    if (!isVerified || !formData.bankCode || !formData.bankName || !formData.accountNumber || !formData.accountName) return
    saveAccountMutation.mutate({
      bankCode: formData.bankCode,
      bankName: formData.bankName,
      accountNumber: formData.accountNumber,
      accountName: formData.accountName,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!balance) return

    const amount = parseFloat(formData.amount)
    if (amount > balance.availableBalance) {
      toast.error("Amount exceeds available balance")
      return
    }

    const hasBankDetails = formData.bankCode && formData.bankName && formData.accountNumber && formData.accountName
    const hasSaved = !!savedAccount

    if (!hasBankDetails && !hasSaved) {
      toast.error("Please provide bank details or use saved account")
      return
    }

    if (hasBankDetails && !isVerified) {
      toast.error("Please verify your account number first")
      return
    }
    if (hasBankDetails && verificationError) {
      toast.error("Please enter a valid account number")
      return
    }

    const requestData = {
      amount,
      notes: formData.notes || undefined,
    }

    requestMutation.mutate(requestData)

    if (saveAccount && isVerified && !savedAccount) {
      handleSaveAccountAfterVerification()
    }
  }

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate()
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

  const hasBankDetails = formData.bankCode && formData.bankName && formData.accountNumber && formData.accountName
  const isFormValid = formData.amount && ((hasBankDetails && isVerified && !verificationError) || savedAccount)

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

          {/* Saved Disbursement Account */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Saved Disbursement Account
                </CardTitle>
                {savedAccount && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isSavedAccountLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading account...
                </div>
              ) : savedAccount ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Building2 className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Bank</p>
                        <p className="text-sm font-medium">{savedAccount.bankName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <CreditCard className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Account Number</p>
                        <p className="text-sm font-medium">{savedAccount.accountNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Account Name</p>
                        <p className="text-sm font-medium">{savedAccount.accountName}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={handleUseSavedAccount}
                      className="bg-forest-green-600 hover:bg-forest-green-700"
                    >
                      Use This Account
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button type="button" variant="outline" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Saved Account?</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">No saved disbursement account yet.</p>
                  <p className="text-sm text-muted-foreground">When you request a disbursement, you can save your account for future use.</p>
                </div>
              )}
            </CardContent>
          </Card>

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
                    {savedAccount && useSavedAccount
                      ? "Using your saved account. Minimum amount is GHS 100."
                      : "Enter your bank details to receive your available balance. Minimum amount is GHS 100."}
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

                  {savedAccount && !hasBankDetails && (
                    <div className="p-3 rounded-lg bg-forest-green-50 border border-forest-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-forest-green-700">{savedAccount.bankName}</p>
                          <p className="text-xs text-forest-green-600">Account: {savedAccount.accountNumber}</p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setFormData({ ...formData, bankCode: "", bankName: "", accountNumber: "", accountName: "" })
                            setUseSavedAccount(false)
                            setIsVerified(false)
                          }}
                        >
                          Change
                        </Button>
                      </div>
                    </div>
                  )}

                  {(!savedAccount || (savedAccount && hasBankDetails)) && (
                    <>
                      <div>
                        <Label htmlFor="bank">Select Bank</Label>
                        <BankSelector
                          value={formData.bankCode}
                          onChange={handleBankChange}
                          disabled={requestMutation.isPending}
                        />
                      </div>
                      <div>
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input
                          id="accountNumber"
                          placeholder="10-11 digits"
                          value={formData.accountNumber}
                          onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                          disabled={!formData.bankCode || requestMutation.isPending}
                          required
                        />
                      </div>

                      <AccountVerifier
                        bankCode={formData.bankCode}
                        accountNumber={formData.accountNumber}
                        onVerified={handleAccountVerified}
                        onVerificationError={handleVerificationError}
                        disabled={!formData.bankCode || formData.accountNumber.length < 10}
                      />

                      {!savedAccount && isVerified && (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="saveAccount"
                            checked={saveAccount}
                            onCheckedChange={(checked) => setSaveAccount(checked as boolean)}
                          />
                          <label
                            htmlFor="saveAccount"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Save this account for future disbursements
                          </label>
                        </div>
                      )}
                    </>
                  )}

                  <div>
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any additional information..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      disabled={requestMutation.isPending}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => {
                      setIsRequestDialogOpen(false)
                      setFormData({ amount: "", bankCode: "", bankName: "", accountNumber: "", accountName: "", notes: "" })
                      setUseSavedAccount(false)
                      setSaveAccount(false)
                    }}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={requestMutation.isPending || !isFormValid}>
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