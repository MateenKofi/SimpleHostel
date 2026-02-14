"use client"

import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { getPaymentByRef } from "@/api/payments"
import { toast } from "sonner"
import {
  CheckCircle2,
  ArrowRight,
  User,
  CreditCard,
  Loader2,
  Building2,
  MapPin,
  Mail,
  Phone,
  Receipt,
  Key,
  Copy,
  Check,
  Home,
  DoorOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { useAuthStore } from "@/stores/useAuthStore"

interface PaymentData {
  id: string
  amount: number
  amountPaid: number
  balanceOwed: number
  date: string
  createdAt: string
  residentId: string
  status: string
  roomId: string
  reference: string
  method: string
  updatedAt: string
  delFlag: boolean
  calendarYearId: string
  historicalResidentId: string | null
  // Extended data
  residentProfile?: {
    user?: {
      name: string
      email: string
      phone: string
      avatar?: string | null
    }
    studentId?: string
    course?: string
    accessCode?: string | null
    accessCodeExpiry?: string | null
  }
  room?: {
    number: string
    type: string
    block?: string
    floor?: string
    hostel?: {
      name: string
      address?: string
      email?: string
      phone?: string
      logoUrl?: string | null
      manager?: string
    }
  }
  calendarYear?: {
    name: string
  }
}

// Floating card base class matching project style
const floatingCard = "bg-gradient-to-br from-card to-muted/50 rounded-2xl shadow-lg border border-border/50"
const iconContainerInfo = "p-2.5 rounded-xl bg-gradient-to-br from-forest-green-50 to-forest-green-100/50"

const PaymentSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [payment, setPayment] = useState<PaymentData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const { user, fetchUser } = useAuthStore()

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    // Check both reference and trxref (Paystack uses both)
    const reference = queryParams.get("reference") || queryParams.get("trxref")

    console.log("Payment Success URL params:", {
      reference: queryParams.get("reference"),
      trxref: queryParams.get("trxref"),
      finalRef: reference,
    })

    if (!reference) {
      console.error("No payment reference found in URL")
      toast.error("No payment reference found.")
      setIsLoading(false)
      return
    }

    // Fetch full payment details
    getPaymentByRef(reference)
      .then((response) => {
        console.log("Payment API response:", response)
        const paymentData = response?.data
        if (paymentData) {
          setPayment(paymentData)
          toast.success("Payment verified successfully!")
          // Refresh user data to get updated hostelId after payment
          if (user?.id) {
            fetchUser(user.id).catch((err) => {
              console.error("Failed to refresh user data:", err)
            })
          }
        } else {
          throw new Error("No payment data received")
        }
      })
      .catch((err) => {
        console.error("Payment verification error:", err)
        toast.error("Failed to verify payment. Please contact support if the issue persists.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [location, user, fetchUser])

  const handleCopyAccessCode = () => {
    const accessCode = payment?.residentProfile?.accessCode
    if (accessCode) {
      navigator.clipboard.writeText(accessCode)
      setCopied(true)
      toast.success("Access code copied!")
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleViewReceipt = () => {
    if (payment?.reference) {
      navigate(`/dashboard/receipt/${payment.reference}`)
    }
  }

  const handleContinue = () => {
    const token = localStorage.getItem("token")
    navigate(token ? "/dashboard" : "/")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(amount)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-white">
        <Card className="w-full max-w-md p-8 text-center border-border/50">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-200 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">Verifying Payment</h2>
              <p className="text-gray-500 text-sm">Please wait while we confirm your transaction...</p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // No payment data state
  if (!payment) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-white">
        <Card className="w-full max-w-md p-8 text-center border-border/50">
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-red-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">Payment Not Found</h2>
              <p className="text-gray-500 text-sm">
                We couldn't find your payment details. Please contact support if you believe this is an error.
              </p>
            </div>
            <Button onClick={handleContinue} className="w-full">
              Return to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const isSuccess = payment.status?.toLowerCase() === "success" || payment.status?.toLowerCase() === "confirmed"
  const hostel = payment.room?.hostel
  const resident = payment.residentProfile?.user
  const room = payment.room
  const accessCode = payment.residentProfile?.accessCode

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Success Header */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex relative">
            <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping" />
            <div className="relative w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={3} />
            </div>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {isSuccess ? "Payment Successful!" : "Payment Pending"}
            </h1>
            <p className="text-gray-500">
              Transaction Reference: <span className="font-mono font-medium text-gray-700">{payment.reference}</span>
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Payment Details Card */}
          <Card className={floatingCard}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Amount Paid</p>
                <p className="text-3xl font-bold text-emerald-700">{formatCurrency(payment.amountPaid || payment.amount)}</p>
              </div>
              {payment.balanceOwed > 0 && (
                <div className="flex items-center justify-between py-2 border-t border-border">
                  <span className="text-sm text-muted-foreground">Balance Due</span>
                  <span className="font-semibold text-amber-600">{formatCurrency(payment.balanceOwed)}</span>
                </div>
              )}
              <div className="flex items-center justify-between py-2 border-t border-border">
                <span className="text-sm text-muted-foreground">Payment Method</span>
                <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                  {payment.method?.replace("_", " ") || "Paystack"}
                </Badge>
              </div>
              <div className="flex items-center justify-between py-2 border-t border-border">
                <span className="text-sm text-muted-foreground">Transaction Date</span>
                <span className="text-sm text-gray-700">
                  {payment.date || payment.createdAt
                    ? format(new Date(payment.date || payment.createdAt), "PPP")
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-t border-border">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  {payment.status}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Room Allocation Card */}
          {room && (
            <Card className={floatingCard}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Room Allocation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Room Number</p>
                    <p className="text-2xl font-bold text-gray-900">#{room.number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="text-lg font-semibold capitalize text-gray-700">{room.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-xl">
                  <DoorOpen className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium text-gray-900">
                      {room.block && `Block ${room.block}`}
                      {room.block && room.floor && " • "}
                      {room.floor && `Floor ${room.floor}`}
                    </p>
                  </div>
                </div>
                {hostel && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-sm text-muted-foreground">Hostel</p>
                    <p className="font-medium text-gray-900">{hostel.name}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Access Code Card - Important! */}
        {accessCode && (
          <Card className={`bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 shrink-0">
                  <Key className="w-6 h-6 text-amber-700" />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">Your Access Code</h3>
                    <p className="text-sm text-gray-600">
                      Save this code! You'll need it to verify your identity and check in.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 p-3 bg-white rounded-lg border-2 border-amber-200">
                      <p className="text-2xl font-mono font-bold text-center tracking-widest text-amber-900">
                        {accessCode}
                      </p>
                    </div>
                    <Button
                      onClick={handleCopyAccessCode}
                      variant="outline"
                      size="icon"
                      className="shrink-0 border-amber-300 hover:bg-amber-50"
                    >
                      {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    This code has also been sent to your email: {resident?.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resident Information */}
        {resident && (
          <Card className={floatingCard}>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className={`shrink-0 ${iconContainerInfo}`}>
                  <User className="w-5 h-5 text-forest-green-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground">Resident</p>
                  <p className="font-semibold text-gray-900 truncate">{resident.name}</p>
                  {payment.residentProfile?.studentId && (
                    <p className="text-sm text-gray-500">Student ID: {payment.residentProfile.studentId}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Hostel Contact Info */}
        {hostel && (hostel.address || hostel.phone || hostel.email) && (
          <Card className={floatingCard}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Hostel Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {hostel.address && (
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-gray-700">{hostel.address}</span>
                </div>
              )}
              {hostel.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-gray-700">{hostel.phone}</span>
                </div>
              )}
              {hostel.email && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-gray-700 truncate">{hostel.email}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Separator />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleViewReceipt}
            variant="outline"
            className="flex-1 h-12"
          >
            <Receipt className="w-4 h-4 mr-2" />
            View Official Receipt
          </Button>
          <Button onClick={handleContinue} className="flex-1 h-12">
            Continue to Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Footer Note */}
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">
            A confirmation email has been sent to <span className="font-medium text-gray-700">{resident?.email || "your email"}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-2">Powered by SimpleHostel • Secure Payment</p>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess
