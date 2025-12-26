"use client"

import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Loader, Download, CreditCard, History, Wallet, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { useNavigate } from "react-router-dom"
import SEOHelmet from "@/components/SEOHelmet"

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
            const response = await axios.get(`/api/residents/billing`)
            return response.data?.data || {
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

    const handleDownloadReceipt = (transactionId: string) => {
        // Implement generic PDF download logic or open in new tab
        // For now, we'll just mock the action
        console.log("Downloading receipt for:", transactionId)
        window.open(`/api/exports/receipt/${transactionId}`, '_blank')
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
                                                <span className="capitalize">{tx.method.replace('_', ' ')}</span>
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
                                        <Button variant="ghost" size="icon" onClick={() => handleDownloadReceipt(tx.id)} title="Download Receipt">
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
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default PaymentBilling
