import { useQuery } from "@tanstack/react-query"
import { useParams, useNavigate } from "react-router-dom"
import { getPaymentByRef } from "@/api/payments"
import { Loader2, Download, Printer, ArrowLeft, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import SEOHelmet from "@/components/SEOHelmet"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { toast } from "sonner"
import ReceiptTemplate from "@/components/payment/ReceiptTemplate"
import { PaymentReceipt } from "@/helper/types/types"

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

    // Mapping full payment object to PaymentReceipt interface
    const receiptData: PaymentReceipt = {
        receiptNumber: payment.reference,
        date: payment.createdAt,
        residentName: payment.residentProfile?.user?.name || "N/A",
        amount: payment.amount,
        amountPaid: payment.amountPaid,
        balanceOwed: payment.balanceOwed,
        method: payment.method,
        hostelName: payment.room?.hostel?.name || "SimpleHostel",
        roomNumber: payment.room?.number || "N/A",
        status: payment.status,
        reference: payment.reference,
        // Extended fields
        studentId: payment.residentProfile?.studentId || undefined,
        academicYear: payment.calendarYear?.name || undefined,
        hostelAddress: payment.room?.hostel?.address || undefined,
        hostelEmail: payment.room?.hostel?.email || undefined,
        hostelPhone: payment.room?.hostel?.phone || undefined,
        hostelLogo: payment.room?.hostel?.logoUrl || undefined,
        hostelStamp: payment.room?.hostel?.stampUrl || undefined,
        hostelSignature: payment.room?.hostel?.signatureUrl || undefined,
        managerName: payment.room?.hostel?.manager || undefined,
    }

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
                    <p className="text-muted-foreground">Reference: {reference}</p>
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

            <Card className="shadow-2xl border-none overflow-hidden bg-white">
                <ReceiptTemplate data={receiptData} ref={receiptRef} />
            </Card>
        </div>
    )
}

export default ReceiptPage;
