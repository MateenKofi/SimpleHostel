"use client"

import { useQuery } from "@tanstack/react-query"
import { getResidentBilling, getPaymentReceipt } from "@/api/residents"
import { Loader, Download, CreditCard, History, Wallet, AlertCircle } from "lucide-react"
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

interface PaymentTransaction {
    id: string
    amount: number
    date: string
    method: "momo" | "card" | "bank_transfer" | "cash"
    reference: string
    status: "success" | "pending" | "failed"
    description: string
}

interface BillingSummary {
    totalPaid: number
    balanceOwed: number
    nextDueDate: string | null
    currency: string
    transactions: PaymentTransaction[]
}

import NoHostelAssigned from "@/components/resident/NoHostelAssigned"

const PaymentBilling = () => {
    const navigate = useNavigate()
    const userId = localStorage.getItem("userId")
    const hostelId = localStorage.getItem("hostelId")

    const { data: billingData, isLoading } = useQuery<BillingSummary>({
        queryKey: ['resident-billing', userId],
        queryFn: async () => {
            const responseData = await getResidentBilling()
            return responseData?.data || {
                totalPaid: 0,
                balanceOwed: 0,
                nextDueDate: null,
                currency: "GHS",
                transactions: []
            }
        },
        enabled: !!userId && !!hostelId && hostelId !== 'undefined' && hostelId !== 'null' // Only fetch if assigned
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

    const { data: receiptData, isLoading: isReceiptLoading } = useQuery<PaymentReceipt>({
        queryKey: ['receipt', viewReceiptId],
        queryFn: async () => {
            const responseData = await getPaymentReceipt(viewReceiptId!)
            return responseData?.data
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
                            {billingData?.currency} {billingData?.balanceOwed?.toLocaleString() ?? '0.00'}
                        </div>
                        {billingData?.nextDueDate && (
                            <p className="text-xs text-muted-foreground mt-2 flex items-center">
                                <AlertCircle className="w-3 h-3 mr-1 text-orange-500" />
                                Due on {format(new Date(billingData.nextDueDate), 'PPP')}
                            </p>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={() => navigate('/dashboard/make-payment')}>
                            <CreditCard className="w-4 h-4 mr-2" /> Pay Now
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Paid (YTD)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600 dark:text-green-500">
                            {billingData?.currency} {billingData?.totalPaid?.toLocaleString() ?? '0.00'}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {billingData?.transactions?.length || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Transactions recorded</p>
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
                    {billingData?.transactions && billingData.transactions.length > 0 ? (
                        <div className="space-y-4">
                            {billingData.transactions.map((tx) => (
                                <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 border rounded-full bg-background">
                                            <Wallet className="w-5 h-5 text-gray-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{tx.description || "Payment"}</p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span>{format(new Date(tx.date), 'PPP')}</span>
                                                <span>•</span>
                                                <span className="capitalize">{(tx.method || "").replace('_', ' ')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="font-bold text-sm">
                                                {billingData.currency} {tx.amount.toLocaleString()}
                                            </p>
                                            <Badge variant={tx.status === 'success' ? 'default' : tx.status === 'pending' ? 'secondary' : 'destructive'}
                                                className={`text-[10px] px-1.5 h-5 ${tx.status === 'success' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}`}
                                            >
                                                {tx.status}
                                            </Badge>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => handleViewReceipt(tx.id)} title="View Receipt">
                                            <Download className="w-4 h-4 text-muted-foreground" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center text-muted-foreground">
                            No transactions found.
                        </div>
                    )
                    }
                </CardContent >
            </Card >

            <Dialog open={!!viewReceiptId} onOpenChange={(open) => !open && setViewReceiptId(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Payment Receipt</DialogTitle>
                        <DialogDescription>
                            Review transaction details
                        </DialogDescription>
                    </DialogHeader>

                    {isReceiptLoading ? (
                        <div className="flex justify-center p-8">
                            <Loader className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : receiptData ? (
                        <div className="space-y-4">
                            <div className="p-6 border rounded-sm bg-white text-black shadow-sm print:shadow-none" ref={receiptRef}>
                                <div className="text-center mb-6">
                                    <h3 className="font-bold text-lg uppercase tracking-wider">{receiptData.hostelName}</h3>
                                    <p className="text-xs text-gray-500">Official Payment Receipt</p>
                                </div>

                                <Separator className="my-4" />

                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-500">Receipt No:</span>
                                    <span className="font-mono font-medium">{receiptData.receiptNumber}</span>
                                </div>
                                <div className="flex justify-between text-sm mb-4">
                                    <span className="text-gray-500">Date:</span>
                                    <span>{new Date(receiptData.date).toLocaleDateString()}</span>
                                </div>

                                <div className="space-y-1 mb-6">
                                    <p className="text-xs text-gray-500">Received From</p>
                                    <p className="font-medium">{receiptData.residentName}</p>
                                    <p className="text-xs text-gray-500">Room: {receiptData.roomNumber}</p>
                                </div>

                                <div className="bg-gray-100 p-3 rounded-md flex justify-between items-center mb-6">
                                    <span className="font-medium">Amount Paid</span>
                                    <span className="font-bold text-lg">GHS {receiptData.amountPaid.toFixed(2)}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                                    <div>
                                        <p>Payment Method</p>
                                        <p className="text-black font-medium capitalize">{receiptData.method}</p>
                                    </div>
                                    <div className="text-right">
                                        <p>Balance Owed</p>
                                        <p className="text-black font-medium">GHS {receiptData.balanceOwed.toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="mt-8 text-center">
                                    <Badge variant="outline" className="border-green-500 text-green-600 uppercase text-[10px] tracking-widest">
                                        {receiptData.status}
                                    </Badge>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button className="w-full" onClick={handlePrint}>
                                    <Download className="w-4 h-4 mr-2" /> Print / Download PDF
                                </Button>
                            </DialogFooter>
                        </div>
                    ) : (
                        <div className="p-6 text-center text-red-500">
                            Failed to load receipt.
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div >
    )
}

export default PaymentBilling
