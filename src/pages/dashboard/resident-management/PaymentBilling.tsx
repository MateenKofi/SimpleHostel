"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getResidentBilling, getPaymentReceipt, downloadAllocationLetterPDF, downloadPaymentReceiptPDF } from "@/api/residents"
import { retryPayment, cancelPayment } from "@/api/payments"
import { calculateRefund, requestRefund, RefundCalculationDto } from "@/api/refunds"
import { Loader, Download, CreditCard, History, Wallet, AlertCircle, FileText, Printer, RefreshCw, X } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { useNavigate } from "react-router-dom"
import SEOHelmet from "@/components/SEOHelmet"
import { PaymentReceipt } from "@/helper/types/types"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import ReceiptTemplate from "@/components/payment/ReceiptTemplate"
import { useAuthStore } from "@/stores/useAuthStore"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import NoHostelAssigned from "@/components/resident/NoHostelAssigned"
import { PageHeader } from "@/components/layout/PageHeader"

interface PaymentTransaction {
    id: string
    amount: number
    amountPaid: number
    balanceOwed: number
    createdAt: string
    method: string
    reference: string
    status: string
    room: {
        number: string
    }
    calendarYear: {
        name: string
    }
}

interface BillingSummary {
    payments: PaymentTransaction[]
    summary: {
        roomNumber: string
        roomPrice: number
        totalAmountPaid: number
        balanceOwed: number
        allowPartialPayment: boolean
        hostelName: string
    }
}



const PaymentBilling = () => {
    const navigate = useNavigate()
    const { user: authUser, hostelId: storeHostelId } = useAuthStore()
    const { user, isLoading: isUserLoading, isError: isUserError } = useCurrentUser()
    const userId = user?.id || authUser?.id
    const hostel = user?.hostel
    const queryClient = useQueryClient()

    const [processingPayment, setProcessingPayment] = useState<string | null>(null)

    // Show loading state while fetching user data
    if (isUserLoading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    // Show error state if user data fetch fails
    if (isUserError) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                <AlertCircle className="w-12 h-12 text-destructive" />
                <p className="text-muted-foreground">Failed to load user data.</p>
            </div>
        )
    }

    // Show NoHostelAssigned if user has no hostel assigned
    if (!hostel) {
        return <NoHostelAssigned />
    }

    const { data: billingData, isLoading, isError, refetch } = useQuery<BillingSummary>({
        queryKey: ['resident-billing', userId],
        queryFn: async () => {
            const res = await getResidentBilling()
            // Handle multiple potential wrappers (.json or .data)
            const data = res?.json || res?.data || res

            if (!data || (!data.payments && !data.summary)) {
                throw new Error("Invalid data format")
            }

            return data
        },
        enabled: !!userId && !!hostel?.id,
        retry: 1
    })

    const [viewReceiptId, setViewReceiptId] = useState<string | null>(null);
    const [downloadingReceipt, setDownloadingReceipt] = useState<string | null>(null);
    const [downloadingAllocation, setDownloadingAllocation] = useState(false);
    const receiptRef = useRef<HTMLDivElement>(null)

    // Refund states
    const [refundPaymentId, setRefundPaymentId] = useState<string | null>(null);
    const [refundReason, setRefundReason] = useState("");
    const [isCalculatingRefund, setIsCalculatingRefund] = useState(false);
    const [refundCalculation, setRefundCalculation] = useState<RefundCalculationDto | null>(null);
    const [submittingRefund, setSubmittingRefund] = useState(false);

    // Download Allocation Letter PDF
    const handleDownloadAllocationLetter = async () => {
        if (downloadingAllocation) return;
        setDownloadingAllocation(true);
        try {
            const blob = await downloadAllocationLetterPDF();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `Allocation-Letter-${new Date().getTime()}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success("Allocation letter downloaded successfully!");
        } catch (error) {
            console.error("Failed to download allocation letter:", error);
            toast.error("Failed to download allocation letter");
        } finally {
            setDownloadingAllocation(false);
        }
    };

    // Download Payment Receipt PDF (from backend)
    const handleDownloadReceiptPDF = async (paymentId: string) => {
        if (downloadingReceipt === paymentId) return;
        setDownloadingReceipt(paymentId);
        try {
            const blob = await downloadPaymentReceiptPDF(paymentId);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `Receipt-${paymentId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success("Receipt downloaded successfully!");
        } catch (error) {
            console.error("Failed to download receipt:", error);
            toast.error("Failed to download receipt");
        } finally {
            setDownloadingReceipt(null);
        }
    };

    const handlePrint = useReactToPrint({
        contentRef: receiptRef,
        documentTitle: `Receipt-${viewReceiptId}`,
    });

    const handleDownloadPDF = async () => {
        if (!receiptRef.current) return

        const loadingToast = toast.loading("Generating PDF...")
        try {
            const canvas = await html2canvas(receiptRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
            })
            const imgData = canvas.toDataURL("image/png")
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            })

            const imgWidth = 210
            const imgHeight = (canvas.height * imgWidth) / canvas.width

            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
            pdf.save(`Receipt-${viewReceiptId}.pdf`)
            toast.success("Receipt downloaded successfully", { id: loadingToast })
        } catch (error) {
            console.error("PDF generation failed:", error)
            toast.error("Failed to generate PDF", { id: loadingToast })
        }
    }

    const { data: receiptData, isLoading: isReceiptLoading } = useQuery<PaymentReceipt>({
        queryKey: ['receipt', viewReceiptId],
        queryFn: async () => {
            const res = await getPaymentReceipt(viewReceiptId!)
            const data = res?.data || res?.json || res

            // Map the transaction object to PaymentReceipt interface
            return {
                receiptNumber: data.receiptNumber || data.reference,
                date: data.date || data.createdAt,
                residentName: data.residentName || "Resident",
                amount: data.amount,
                amountPaid: data.amountPaid,
                balanceOwed: data.balanceOwed,
                method: data.method,
                hostelName: data.hostelName || "SimpleHostel",
                roomNumber: data.roomNumber || data.room?.number,
                status: data.status,
                reference: data.receiptNumber || data.reference
            }
        },
        enabled: !!viewReceiptId
    })

    const handleViewReceipt = (transactionId: string) => {
        setViewReceiptId(transactionId)
    }

    const handleRetryPayment = async (reference: string) => {
        if (processingPayment) return
        setProcessingPayment(reference)

        try {
            const result = await retryPayment(reference)
            toast.success("Redirecting to payment...", {
                description: "Your payment session has been reinitialized.",
            })
            // Redirect to Paystack authorization URL
            window.location.href = result.authorizationUrl
        } catch (error: any) {
            console.error("Retry payment error:", error)
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to retry payment"
            toast.error("Retry Failed", { description: errorMessage })
        } finally {
            setProcessingPayment(null)
        }
    }

    const handleCancelPayment = async (reference: string) => {
        if (processingPayment) return
        setProcessingPayment(reference)

        try {
            await cancelPayment(reference)
            toast.success("Payment cancelled", {
                description: "Your pending payment has been cancelled.",
            })
            // Refresh the payment list
            queryClient.invalidateQueries({ queryKey: ['resident-billing', userId] })
        } catch (error: any) {
            console.error("Cancel payment error:", error)
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to cancel payment"
            toast.error("Cancel Failed", { description: errorMessage })
        } finally {
            setProcessingPayment(null)
        }
    }

    const isPending = (status: string) => status.toLowerCase() === "pending"
    const isProcessing = (reference: string) => processingPayment === reference

    const handleOpenRefundModal = async (paymentId: string) => {
        setRefundPaymentId(paymentId);
        setIsCalculatingRefund(true);
        setRefundCalculation(null);
        setRefundReason("");
        try {
            const res = await calculateRefund(paymentId);
            setRefundCalculation(res.data);
        } catch (error) {
            console.error("Failed to calculate refund:", error);
            toast.error("Could not calculate refund details");
        } finally {
            setIsCalculatingRefund(false);
        }
    };

    const handleSubmitRefund = async () => {
        if (!refundPaymentId || !refundReason.trim()) {
            toast.error("Please provide a reason for the refund");
            return;
        }
        setSubmittingRefund(true);
        try {
            await requestRefund(refundPaymentId, refundReason);
            toast.success("Refund request submitted successfully", {
                description: "The hostel administrator will review your request shortly.",
            });
            setRefundPaymentId(null);
            queryClient.invalidateQueries({ queryKey: ['resident-billing', userId] });
        } catch (error: any) {
            console.error("Failed to submit refund request:", error);
            const msg = error?.response?.data?.message || "Failed to submit refund request";
            toast.error("Refund Request Failed", { description: msg });
        } finally {
            setSubmittingRefund(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                <AlertCircle className="w-12 h-12 text-destructive" />
                <p className="text-muted-foreground">Failed to load billing history.</p>
                <Button onClick={() => refetch()}>Try Again</Button>
            </div>
        )
    }

    return (
        <div className="container max-w-5xl py-6 mx-auto">
            <SEOHelmet
                title="Payments & Billing - Fuse"
                description="Manage your hostel payments and view billing history."
            />

            <PageHeader
                title="Payments & Billing"
                subtitle="View your payment history, receipts, and outstanding balance."
                icon={CreditCard}
                sticky={true}
            />

            {/* Summary Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-primary">
                            GHS {billingData?.summary?.balanceOwed?.toLocaleString() ?? '0.00'}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={() => navigate('/dashboard/top-up')}>
                            <CreditCard className="w-4 h-4 mr-2" /> Pay Now
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Paid</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600 dark:text-green-500">
                            GHS {billingData?.summary?.totalAmountPaid?.toLocaleString() ?? '0.00'}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Room Info</CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="ml-auto h-8 gap-1"
                            onClick={handleDownloadAllocationLetter}
                            disabled={downloadingAllocation}
                        >
                            <Download className="w-4 h-4" />
                            {downloadingAllocation ? "Downloading..." : "Allocation Letter"}
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            #{billingData?.summary?.roomNumber || "N/A"}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Price: GHS {billingData?.summary?.roomPrice?.toLocaleString() || "0.00"}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Transaction History */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Transaction History</CardTitle>
                            <CardDescription>A record of all your payments and billing charges.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm">
                            <History className="w-4 h-4 mr-2" /> Filter Date
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {billingData?.payments && billingData.payments.length > 0 ? (
                        <div className="rounded-md border">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 border-b">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium">Date</th>
                                        <th className="px-4 py-3 text-left font-medium">Reference</th>
                                        <th className="px-4 py-3 text-left font-medium">Method</th>
                                        <th className="px-4 py-3 text-left font-medium">Amount</th>
                                        <th className="px-4 py-3 text-left font-medium">Status</th>
                                        <th className="px-4 py-3 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {billingData.payments.map((tx) => (
                                        <tr key={tx.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="px-4 py-3 font-medium">
                                                {format(new Date(tx.createdAt), 'MMM dd, yyyy')}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                                                {tx.reference.slice(0, 12)}...
                                            </td>
                                            <td className="px-4 py-3 capitalize">
                                                {(tx.method || "").replace('_', ' ')}
                                            </td>
                                            <td className="px-4 py-3 font-bold">
                                                GHS {tx.amount.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant={tx.status === 'confirmed' || tx.status === 'success' ? 'default' : tx.status === 'pending' ? 'secondary' : tx.status === 'refunded' ? 'outline' : 'destructive'}
                                                    className={`text-[10px] px-2 py-0 h-5 ${(tx.status === 'confirmed' || tx.status === 'success') ? 'bg-green-100 text-green-800 hover:bg-green-100' : tx.status === 'refunded' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 hover:bg-amber-100' : ''}`}
                                                >
                                                    {tx.status}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    {/* Download receipt for confirmed payments */}
                                                    {(tx.status === 'confirmed' || tx.status === 'success') && (
                                                        <div className="flex items-center justify-end gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleViewReceipt(tx.id)}
                                                                className="h-8 gap-1"
                                                                title="Download Receipt"
                                                            >
                                                                <Download className="w-3.5 h-3.5" />
                                                                <span className="sr-only sm:not-sr-only">Receipt</span>
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleOpenRefundModal(tx.id)}
                                                                className="h-8 gap-1 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/20"
                                                                title="Request Refund"
                                                            >
                                                                <RefreshCw className="w-3.5 h-3.5" />
                                                                <span className="sr-only sm:not-sr-only">Refund</span>
                                                            </Button>
                                                        </div>
                                                    )}
                                                    {/* Retry and Cancel buttons for pending payments */}
                                                    {isPending(tx.status) && (
                                                        <>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleRetryPayment(tx.reference)}
                                                                disabled={isProcessing(tx.reference)}
                                                                className="h-8 gap-1 text-xs"
                                                                title="Retry Payment"
                                                            >
                                                                <RefreshCw className={`w-3.5 h-3.5 ${isProcessing(tx.reference) ? "animate-spin" : ""}`} />
                                                                <span className="hidden sm:inline">Retry</span>
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleCancelPayment(tx.reference)}
                                                                disabled={isProcessing(tx.reference)}
                                                                className="h-8 gap-1 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                                                                title="Cancel Payment"
                                                            >
                                                                <X className="w-3.5 h-3.5" />
                                                                <span className="hidden sm:inline">Cancel</span>
                                                            </Button>
                                                        </>
                                                    )}
                                                    {/* Show dash for other statuses */}
                                                    {!isPending(tx.status) && tx.status !== 'confirmed' && tx.status !== 'success' && (
                                                        <span className="text-muted-foreground text-xs">-</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-12 text-center text-muted-foreground border rounded-md border-dashed">
                            No transactions found.
                        </div>
                    )
                    }
                </CardContent >
            </Card >

            <Dialog open={!!viewReceiptId} onOpenChange={(open) => !open && setViewReceiptId(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
                    <DialogHeader className="p-6 pb-2">
                        <DialogTitle>Payment Receipt</DialogTitle>
                        <DialogDescription>
                            Review transaction details and download or print your official record.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto p-6 pt-0">
                        {isReceiptLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                <Loader className="w-10 h-10 animate-spin text-primary" />
                                <p className="text-sm text-muted-foreground animate-pulse">Fetching receipt details...</p>
                            </div>
                        ) : receiptData ? (
                            <div className="space-y-6">
                                <div className="border rounded-xl bg-white shadow-2xl overflow-hidden ring-1 ring-black/5">
                                    <div className="scale-[0.9] sm:scale-100 origin-top transform-gpu">
                                        <ReceiptTemplate data={receiptData} ref={receiptRef} />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end pb-2">
                                    <Button variant="outline" className="flex-1 sm:flex-none h-11" onClick={handlePrint}>
                                        <Printer className="w-4 h-4 mr-2" /> Print Receipt
                                    </Button>
                                    <Button variant="outline" className="flex-1 sm:flex-none h-11" onClick={() => viewReceiptId && handleDownloadReceiptPDF(viewReceiptId)} disabled={downloadingReceipt === viewReceiptId}>
                                        <Download className="w-4 h-4 mr-2" /> {downloadingReceipt === viewReceiptId ? "Downloading..." : "Download PDF"}
                                    </Button>
                                    {receiptData.reference && (
                                        <Button className="flex-1 sm:flex-none h-11" onClick={() => navigate(`/dashboard/receipt/${receiptData.reference}`)}>
                                            <FileText className="w-4 h-4 mr-2" /> Full Page View
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="py-20 text-center space-y-3">
                                <AlertCircle className="w-12 h-12 text-destructive mx-auto opacity-20" />
                                <p className="text-destructive font-medium">Failed to load receipt information.</p>
                                <Button variant="link" onClick={() => setViewReceiptId(null)}>Close modal</Button>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Refund Request Modal */}
            <Dialog open={!!refundPaymentId} onOpenChange={(open) => !open && setRefundPaymentId(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Request Room Refund</DialogTitle>
                        <DialogDescription>
                            Submit a request to refund your room payment. Calculations are based on your stay duration.
                        </DialogDescription>
                    </DialogHeader>

                    {isCalculatingRefund ? (
                        <div className="flex flex-col items-center justify-center py-10 space-y-4">
                            <Loader className="w-8 h-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground animate-pulse">Calculating refund amount...</p>
                        </div>
                    ) : refundCalculation ? (
                        <div className="space-y-4 py-4">
                            <div className="rounded-lg bg-muted/50 p-4 space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Original Payment:</span>
                                    <span className="font-medium">GHS {refundCalculation.paymentAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Stay Status:</span>
                                    <span className="font-medium">
                                        {refundCalculation.checkedIn 
                                            ? `Checked in (${refundCalculation.daysStayed} days stayed)` 
                                            : "No show (Not checked in)"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Refund Rule:</span>
                                    <span className="font-medium">Pro-rata calculation</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between text-destructive">
                                    <span>Non-refundable penalty ({refundCalculation.nonRefundablePercentage}%):</span>
                                    <span>- GHS {((refundCalculation.paymentAmount * (refundCalculation.checkedIn ? (1 - refundCalculation.daysStayed / refundCalculation.totalDays) : 1)) * (refundCalculation.nonRefundablePercentage / 100)).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-destructive">
                                    <span>Admin Refund Fee:</span>
                                    <span>- GHS {refundCalculation.adminRefundFee.toFixed(2)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-base text-forest-green-700 dark:text-forest-green-300">
                                    <span>Estimated Refund:</span>
                                    <span>GHS {refundCalculation.refundableAmount.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="refund-reason" className="text-sm font-medium">
                                    Reason for refund request <span className="text-destructive">*</span>
                                </label>
                                <textarea
                                    id="refund-reason"
                                    placeholder="Explain why you are requesting a refund (e.g., leaving the hostel, double payment...)"
                                    className="w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    value={refundReason}
                                    onChange={(e) => setRefundReason(e.target.value)}
                                    maxLength={250}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="py-6 text-center text-destructive">
                            Failed to compute refund estimate.
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRefundPaymentId(null)} disabled={submittingRefund}>
                            Cancel
                        </Button>
                        <Button 
                            className="bg-forest-green-600 hover:bg-forest-green-700 text-white"
                            onClick={handleSubmitRefund} 
                            disabled={submittingRefund || isCalculatingRefund || !refundCalculation || !refundReason.trim()}
                        >
                            {submittingRefund ? "Submitting..." : "Submit Request"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    )
}

export default PaymentBilling
