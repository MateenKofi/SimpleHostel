import { z } from "zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { initPayment } from "@/api/payments"
import { getHostelById } from "@/api/hostels"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import {
  Loader2,
  ChevronLeft,
  User,
  Home,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Calendar,
  GraduationCap,
  Mail,
  Phone,
  Users,
  Flag,
  BadgeCent,
  Receipt,
  BadgeCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useAddedResidentStore } from "@/stores/useAddedResidentStore"
import { useSelectedRoomStore } from "@/stores/useSelectedRoomStore"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

const paymentFormSchema = z.object({
  paymentAmount: z.number().min(1, "Payment amount must be greater than 0"),
})
type PaymentInputs = z.infer<typeof paymentFormSchema>

const PaymentSummaryForm = () => {
  const navigate = useNavigate()
  const room = useSelectedRoomStore((s: any) => s.room)!
  const resident = useAddedResidentStore((s: any) => s.resident)!
  const totalAmount = room.price

  const [paymentType, setPaymentType] = useState<"full" | "partial">("full")

  const { data: hostel } = useQuery({
    queryKey: ["hostel", room?.hostelId],
    queryFn: async () => {
      if (!room?.hostelId) return null
      const res = await getHostelById(room.hostelId)
      return res.data
    },
    enabled: !!room?.hostelId,
  })

  const form = useForm<PaymentInputs>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      paymentAmount: totalAmount,
    },
  })

  const partialAmount = hostel?.allowPartialPayment
    ? (totalAmount * (hostel.partialPaymentPercentage || 50)) / 100
    : totalAmount

  useEffect(() => {
    if (paymentType === "full") {
      form.setValue("paymentAmount", totalAmount, { shouldValidate: true })
    } else {
      form.setValue("paymentAmount", partialAmount, { shouldValidate: true })
    }
  }, [paymentType, totalAmount, partialAmount, form])

  const mutation = useMutation({
    mutationFn: async (data: PaymentInputs) => {
      try {
        // Payload strictly following "Resident Booking and Payment Guide"
        // Endpoint: /api/v1/payment/init
        const payload = {
          roomId: room.id,
          residentId: resident.id,
          initialPayment: data.paymentAmount,
        }
        const resData = await initPayment(payload)

        // Guide says: Returns a authorizationUrl (Paystack checkout page) and a reference.
        if (resData?.authorizationUrl) {
          toast(resData.message || "Redirecting to payment...");
          window.location.href = resData.authorizationUrl;
        } else if (resData?.paymentUrl?.authorizationUrl) {
          // Fallback for previous structure if backend hasn't fully switched but we are pushing for v1
          toast(resData.message || "Redirecting to payment...");
          window.location.href = resData.paymentUrl.authorizationUrl;
        } else {
          toast.error("Payment initiation failed: No authorization URL received");
        }

        return resData
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || "An unexpected error occurred"
        toast.error(errorMessage)
        throw error
      }
    },
  })

  const onSubmit = (values: PaymentInputs) => {
    mutation.mutate(values)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen px-4 py-12 bg-gradient-to-b from-gray-50 to-gray-100 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl mx-auto overflow-hidden border-0 shadow-lg">
        <div className="p-6 bg-gradient-to-r from-black via-indigo-600 to-gray-600">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-white hover:bg-white/20">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Badge variant="outline" className="px-3 py-1 text-white border-white/30">
              {room?.status || "Pending"}
            </Badge>
          </div>
          <div className="flex items-center gap-4 mt-6">
            <Avatar className="w-16 h-16 border-2 border-white">
              <AvatarFallback className="text-xl text-white bg-indigo-800">
                {getInitials(resident?.name || "")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-white">{resident?.name || ""}</h1>
              <div className="flex items-center gap-2 text-indigo-100">
                <GraduationCap className="w-4 h-4" />
                <span>{resident?.studentId || ""}</span>
              </div>
            </div>
          </div>
        </div>
        <CardContent className="p-6 space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Resident Information */}
            <Card className="border shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg font-medium">Resident Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-2 pb-4">
                <dl className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-gray-500" />
                    <dt className="w-24 text-gray-500">Course:</dt>
                    <dd className="font-medium">{resident?.course || ""}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <dt className="w-24 text-gray-500">Email:</dt>
                    <dd className="font-medium">{resident?.email || ""}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <dt className="w-24 text-gray-500">Phone:</dt>
                    <dd className="font-medium">{resident?.phone || ""}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <dt className="w-24 text-gray-500">Gender:</dt>
                    <dd className="font-medium">{resident?.gender || ""}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flag className="w-4 h-4 text-gray-500" />
                    <dt className="w-24 text-gray-500">Nationality:</dt>
                    <dd className="font-medium">Ghanaian</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            {/* Room Information */}
            {room && (
              <Card className="border shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-100 rounded-full">
                      <Home className="w-5 h-5 text-indigo-600" />
                    </div>
                    <CardTitle className="text-lg font-medium">Room Details</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-2 pb-4">
                  <dl className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="w-4 h-4 text-gray-500" />
                      <dt className="w-24 text-gray-500">Room No:</dt>
                      <dd className="font-medium">{room?.number || ""}</dd>
                    </div>
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-gray-500" />
                      <dt className="w-24 text-gray-500">Block:</dt>
                      <dd className="font-medium">{room?.block || ""}</dd>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <dt className="w-24 text-gray-500">Type:</dt>
                      <dd className="font-medium">{room?.type || ""}</dd>
                    </div>
                    <div className="flex items-center gap-2">
                      <BadgeCent className="w-4 h-4 text-gray-500" />
                      <dt className="w-24 text-gray-500">Price:</dt>
                      <dd className="font-medium text-green-600">GH₵{room?.price?.toLocaleString() || ""}</dd>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <dt className="w-24 text-gray-500">Floor:</dt>
                      <dd className="font-medium">{room?.floor || ""}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            )}
          </div>
          {/* Payment Summary */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Card className="border shadow-sm bg-gradient-to-r from-green-50 to-emerald-50">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Receipt className="w-5 h-5 text-green-600" />
                    </div>
                    <CardTitle className="text-lg font-medium">Payment Summary</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-white rounded-lg shadow-sm font-sans">
                      <div className="text-sm text-gray-500">Total Amount</div>
                      <div className="text-xl font-bold text-gray-900">GH₵{totalAmount?.toLocaleString()}</div>
                    </div>
                    <div className="p-3 bg-white rounded-lg shadow-sm font-sans">
                      <div className="text-sm text-gray-500">Amount to Pay</div>
                      <div className="text-xl font-bold text-indigo-600">
                        GH₵{form.watch("paymentAmount")?.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {hostel?.allowPartialPayment && (
                    <div className="mb-6 space-y-3">
                      <Label className="text-sm font-semibold text-gray-700">Choose Payment Option</Label>
                      <RadioGroup
                        value={paymentType}
                        onValueChange={(v: "full" | "partial") => setPaymentType(v)}
                        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                      >
                        <div>
                          <RadioGroupItem
                            value="full"
                            id="full"
                            className="sr-only"
                          />
                          <Label
                            htmlFor="full"
                            className={cn(
                              "flex flex-col items-start p-4 border-2 rounded-xl cursor-pointer transition-all",
                              paymentType === "full"
                                ? "border-indigo-600 bg-indigo-50 shadow-sm"
                                : "border-gray-200 hover:border-indigo-200 bg-white"
                            )}
                          >
                            <div className="flex items-center justify-between w-full mb-1">
                              <span className="font-bold">Full Payment</span>
                              {paymentType === "full" && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                            </div>
                            <span className="text-xs text-gray-500 italic">Pay the entire amount now</span>
                            <span className="mt-2 text-lg font-bold text-indigo-700">GH₵{totalAmount.toLocaleString()}</span>
                          </Label>
                        </div>

                        <div>
                          <RadioGroupItem
                            value="partial"
                            id="partial"
                            className="sr-only"
                          />
                          <Label
                            htmlFor="partial"
                            className={cn(
                              "flex flex-col items-start p-4 border-2 rounded-xl cursor-pointer transition-all",
                              paymentType === "partial"
                                ? "border-indigo-600 bg-indigo-50 shadow-sm"
                                : "border-gray-200 hover:border-indigo-200 bg-white"
                            )}
                          >
                            <div className="flex items-center justify-between w-full mb-1">
                              <span className="font-bold">Partial Deposit</span>
                              {paymentType === "partial" && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                            </div>
                            <span className="text-xs text-gray-500 italic">Pay {hostel.partialPaymentPercentage}% deposit now</span>
                            <span className="mt-2 text-lg font-bold text-indigo-700">GH₵{partialAmount.toLocaleString()}</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  <div className="p-3 mb-6 border border-yellow-200 rounded-lg bg-yellow-50 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-yellow-800 leading-relaxed font-sans">
                      {paymentType === "full"
                        ? "You are paying the full amount for your booking. No further balance will be owed for this room."
                        : `You are paying a ${hostel?.partialPaymentPercentage}% deposit. The remaining GH₵${(totalAmount - partialAmount).toLocaleString()} must be paid upon arrival or via your dashboard.`
                      }
                    </p>
                  </div>
                  {/* Hidden field so RHF knows about it */}
                  <input type="hidden" {...form.register("paymentAmount", { valueAsNumber: true })} />
                  <div className="space-y-6">
                    {mutation.isSuccess && (
                      <Alert className="text-green-700 border-green-500 bg-green-50">
                        <CheckCircle2 className="w-4 h-4" />
                        <AlertTitle>Payment Successful!</AlertTitle>
                        <AlertDescription>Your payment has been processed successfully.</AlertDescription>
                      </Alert>
                    )}
                    {mutation.isError && (
                      <Alert variant="destructive">
                        <AlertCircle className="w-4 h-4" />
                        <AlertTitle>Payment Failed</AlertTitle>
                        <AlertDescription>
                          There was an error processing your payment. Please try again.
                        </AlertDescription>
                      </Alert>
                    )}
                    <Button
                      type="submit"
                      disabled={mutation.isPending}
                      className="w-full py-6 text-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    >
                      {mutation.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5 mr-2" />
                          Pay GH₵{form.getValues("paymentAmount")?.toLocaleString()}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex items-center justify-between px-6 py-4 text-sm text-gray-500 bg-gray-50">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Payment due: {new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Flag className="w-4 h-4" />
            <span>Ghana</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
export default PaymentSummaryForm