"use client"

import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"
import { CheckCircle, Download, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

interface PaymentData {
  id: string
  amount: number
  date: string
  residentId: string
  status: string
  roomId: string
  reference: string
  method: string
  updatedAt: string
  delFlag: boolean
  calendarYearId: string
  historicalResidentId: string | null
}

const PaymentSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [payment, setPayment] = useState<PaymentData | null>(null)

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const reference = queryParams.get("reference")
    console.log("Payment reference:", reference)

    if (reference) {
      axios
        .get(`/api/payments/get/ref/${reference}`)
        .then((res) => {
          if (res.data?.data) {
            setPayment(res.data.data)
            toast.success("Payment verified successfully!")
          } else {
            toast.error("Payment verification failed.")
          }
        })
        .catch((err) => {
          console.error("Verification error:", err)
          toast.error("An error occurred during payment verification.")
        })
    } else {
      toast.error("No payment reference found.")
    }
  }, [location, navigate])

  const handleDownloadReceipt = () => {
    if (!payment) return

    const doc = new jsPDF()

    // Title
    doc.setFontSize(18)
    doc.text("Payment Receipt", 105, 20, { align: "center" })

    // Info
    doc.setFontSize(12)
    doc.text(`Reference: ${payment.reference}`, 20, 40)
    doc.text(`Transaction ID: ${payment.id}`, 20, 50)
    doc.text(`Date: ${new Date(payment.date).toLocaleString()}`, 20, 60)

    // ✅ Use autoTable like this:
    autoTable(doc, {
      startY: 75,
      head: [["Field", "Value"]],
      body: [
        ["Amount Paid", `GHS ${payment.amount}`],
        ["Method", (payment.method || "").replace("_", " ")],
        ["Status", payment.status],
        ["Room ID", payment.roomId],
        ["Resident ID", payment.residentId],
      ],
      theme: "grid",
      headStyles: { fillColor: [22, 160, 133] },
      bodyStyles: { textColor: 50 },
    })

    // Footer
    const pageHeight = doc.internal.pageSize.height
    doc.setFontSize(10)
    doc.text("Thank you for your payment.", 20, pageHeight - 20)

    doc.save(`receipt-${payment.reference}.pdf`)
  }

  const handleContinue = () => {
    const token = localStorage.getItem("token")
    if (token) {
      navigate("/dashboard") // or wherever you want to redirect
    } else {
      navigate("/")
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground">Payment Successful!</h1>
        <p className="text-muted-foreground">
          {payment ? "Your payment has been processed successfully" : "Loading payment details..."}
        </p>
      </CardHeader>

      {payment && (
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Amount Paid</span>
              <span className="font-semibold text-foreground">GHS {payment.amount}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Transaction ID</span>
              <span className="font-mono text-sm text-foreground">{payment.id}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Reference</span>
              <span className="font-mono text-sm text-foreground">{payment.reference}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Method</span>
              <span className="text-foreground capitalize">{(payment.method || "").replace("_", " ")}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Date</span>
              <span className="text-foreground">{new Date(payment.date).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">Status</span>
              <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
                <CheckCircle className="h-4 w-4" />
                {payment.status}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Button onClick={handleDownloadReceipt} variant="outline" className="w-full bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>

            <Button onClick={handleContinue} className="w-full">
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            A confirmation email has been sent to your registered email address.
          </p>
        </CardContent>
      )}
    </Card>
  )
}

export default PaymentSuccess
