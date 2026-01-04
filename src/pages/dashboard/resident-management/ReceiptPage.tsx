"use client"

import { useQuery } from "@tanstack/react-query"
import { useParams, useNavigate } from "react-router-dom"
import { getPaymentByRef } from "@/api/payments"
import { Loader2, Download, Printer, ArrowLeft, CheckCircle2, Building2, User, Calendar, MapPin, Phone, Mail, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import SEOHelmet from "@/components/SEOHelmet"
import { format } from "date-fns"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import toast from "react-hot-toast"

const ReceiptPage = () => {
    const { reference } = useParams<{ reference: string }>()
    const navigate = useNavigate()
    const receiptRef = useRef<HTMLDivElement>(null)

    const { data: response, isLoading, isError } = useQuery({
        queryKey: ["payment-receipt", reference],
        queryFn: () => getPaymentByRef(reference!),
        enabled: !!reference,
    })

    const payment = response?.data

    const handlePrint = useReactToPrint({
        contentRef: receiptRef,
        documentTitle: `Receipt-${reference}`,
    })

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
            pdf.save(`Receipt-${reference}.pdf`)
            toast.success("Receipt downloaded successfully", { id: loadingToast })
        } catch (error) {
            console.error("PDF generation failed:", error)
            toast.error("Failed to generate PDF", { id: loadingToast })
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Fetching receipt details...</p>
            </div>
        )
    }

    if (isError || !payment) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center p-6">
                <div className="p-4 bg-red-50 rounded-full dark:bg-red-900/10">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold">Receipt Not Found</h2>
                <p className="text-muted-foreground max-w-sm">
                    We couldn't find a receipt with reference <span className="font-mono text-foreground font-medium">{reference}</span>.
                </p>
                <Button onClick={() => navigate(-1)} variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
                </Button>
            </div>
        )
    }

    const hostel = payment.room?.hostel
    const resident = payment.residentProfile

    return (
        <div className="container max-w-4xl py-10 mx-auto px-4">
            <SEOHelmet
                title={`Receipt ${reference} - Fuse`}
                description="View and download your official hostel payment receipt."
            />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-2 -ml-2">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">Official Receipt</h1>
                    <p className="text-muted-foreground">Transaction ID: {payment.id}</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button variant="outline" size="sm" onClick={handlePrint} className="flex-1 sm:flex-none">
                        <Printer className="h-4 w-4 mr-2" /> Print
                    </Button>
                    <Button size="sm" onClick={handleDownloadPDF} className="flex-1 sm:flex-none">
                        <Download className="h-4 w-4 mr-2" /> Download PDF
                    </Button>
                </div>
            </div>

            <Card className="shadow-xl border-t-8 border-t-primary overflow-hidden bg-white text-black dark:text-black print:shadow-none print:border-none">
                <div ref={receiptRef} className="p-8 sm:p-12 print:p-0 bg-white">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between gap-8 mb-10">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-primary">
                                <Building2 className="h-8 w-8" />
                                <span className="text-2xl font-black uppercase tracking-tighter">SimpleHostel</span>
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-xl font-bold">{hostel?.name}</h2>
                                <div className="flex items-start gap-2 text-sm text-gray-600">
                                    <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                                    <span>{hostel?.address}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Phone className="h-4 w-4 shrink-0" />
                                    <span>{hostel?.phone || "+233 XXX XXX XXX"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Mail className="h-4 w-4 shrink-0" />
                                    <span>{hostel?.email || "contact@simplehostel.com"}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-left md:text-right space-y-2">
                            <div className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-bold uppercase tracking-widest mb-2">
                                {payment.status}
                            </div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-widest leading-none">Receipt Number</p>
                            <p className="text-2xl font-mono font-bold">{payment.reference}</p>
                            <div className="pt-2">
                                <p className="text-sm text-gray-500">Date Issued</p>
                                <p className="font-medium">{format(new Date(payment.createdAt), "PPP p")}</p>
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-gray-200" />

                    {/* Resident Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Resident Information</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                                        <User className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 leading-none">Full Name</p>
                                        <p className="font-bold text-lg">{resident?.user?.name}</p>
                                    </div>
                                </div>
                                <div className="flex gap-10 ml-1">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Student ID</p>
                                        <p className="font-medium">{resident?.studentId || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Academic Year</p>
                                        <p className="font-medium">{payment.calendarYear?.name}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Room Details</h3>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Room Number</p>
                                        <p className="font-bold text-xl">#{payment.room?.number}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Room Type</p>
                                        <p className="font-medium capitalize">{payment.room?.type}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Floor</p>
                                        <p className="font-medium">{payment.room?.floor || "Ground"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Payment Method</p>
                                        <p className="font-medium capitalize">{payment.method?.replace("_", " ")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="my-10">
                        <div className="w-full border rounded-xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Description</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b">
                                        <td className="px-6 py-4">
                                            <p className="font-bold">Accommodation Fee</p>
                                            <p className="text-sm text-gray-500">Room {payment.room?.number} - Academic Year {payment.calendarYear?.name}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="font-mono">GHS {payment.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot className="bg-gray-50/50">
                                    <tr>
                                        <td className="px-6 py-3 text-right text-sm font-medium text-gray-500">Total Price</td>
                                        <td className="px-6 py-3 text-right font-mono font-medium">GHS {payment.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-3 text-right text-sm font-bold text-primary">Amount Paid</td>
                                        <td className="px-6 py-3 text-right font-mono font-black text-xl text-primary">GHS {payment.amountPaid?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                    </tr>
                                    <tr className="border-t-2 border-primary/20">
                                        <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">Balance Owed</td>
                                        <td className="px-6 py-4 text-right font-mono font-bold text-red-600 bg-red-50">GHS {payment.balanceOwed?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-16 pt-10 border-t border-dashed flex flex-col items-center text-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className="h-px w-12 bg-gray-300"></div>
                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                            <div className="h-px w-12 bg-gray-300"></div>
                        </div>
                        <div className="space-y-2">
                            <p className="italic text-gray-500">This is an electronically generated receipt. No signature required.</p>
                            <p className="font-bold text-gray-800">Thank you for choosing {hostel?.name}!</p>
                        </div>
                        <div className="w-full flex justify-between items-end opacity-30 mt-4 px-4 text-[10px] font-mono uppercase tracking-tighter">
                            <span>SimpleHostel Platform</span>
                            <span>{new Date().toISOString()}</span>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default ReceiptPage;
