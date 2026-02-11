"use client"

import { useQuery } from "@tanstack/react-query"
import { getResidentBilling, getPaymentReceipt } from "@/api/residents"
import { Loader, Download, CreditCard, History, Wallet, AlertCircle, FileText, Printer } from "lucide-react"
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
import { toast } from "sonner"
import ReceiptTemplate from "@/components/payment/ReceiptTemplate"

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

import { useAuthStore } from "@/stores/useAuthStore"
import NoHostelAssigned from "@/components/resident/NoHostelAssigned"

const PaymentBilling = () => {
    const navigate = useNavigate()
    const { user, hostelId: storeHostelId } = useAuthStore()
    const userId = user?.id
    const hostelId = storeHostelId || localStorage.getItem("hostelId")

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
        enabled: !!userId && !!hostelId && hostelId !== 'undefined' && hostelId !== 'null',
        retry: 1
    })

    if (!hostelId || hostelId === 'undefined' || hostelId === 'null') {
        return <NoHostelAssigned />
    }

    const [viewReceiptId, setViewReceiptId] = useState<string | null>(null);
    const receiptRef = useRef<HTMLDivElement>(null)

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

            <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Payments & Billing</h1>
                <p className="text-muted-foreground">View your payment history, receipts, and outstanding balance.</p>
            </div>

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
                                        <th className="px-4 py-3 text-right font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {billingData.payments.map((tx) => (
                                        <tr key={tx.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="px-4 py-3 font-medium">
                                                {format(new Date(tx.createdAt), 'MMM dd, yyyy')}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground font-mono">
                                                {tx.reference}
                                            </td>
                                            <td className="px-4 py-3 capitalize">
                                                {(tx.method || "").replace('_', ' ')}
                                            </td>
                                            <td className="px-4 py-3 font-bold">
                                                GHS {tx.amount.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant={tx.status === 'confirmed' || tx.status === 'success' ? 'default' : tx.status === 'pending' ? 'secondary' : 'destructive'}
                                                    className={`text-[10px] px-2 py-0 h-5 ${(tx.status === 'confirmed' || tx.status === 'success') ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}`}
                                                >
                                                    {tx.status}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Button variant="ghost" size="sm"
                                                    onClick={() => handleViewReceipt(tx.id)}
                                                    className="h-8 gap-1"
                                                >
                                                    <Download className="w-3.5 h-3.5" />
                                                    <span className="sr-only sm:not-sr-only">Receipt</span>
                                                </Button>
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
                                    <Button variant="outline" className="flex-1 sm:flex-none h-11" onClick={handleDownloadPDF}>
                                        <Download className="w-4 h-4 mr-2" /> Download PDF
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
        </div >
    )
}

export default PaymentBilling
