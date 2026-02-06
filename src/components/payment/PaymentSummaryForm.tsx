import { z } from "zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { initPayment } from "@/api/payments"
import { getHostelById } from "@/api/hostels"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
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
import type { UserDto, ResidentDto, ApiError } from "@/types/dtos"

const paymentFormSchema = z.object({
  paymentAmount: z.number().min(1, "Payment amount must be greater than 0"),
})
type PaymentInputs = z.infer<typeof paymentFormSchema>

// Helper function to get resident properties from union type
const getResidentName = (resident: UserDto | ResidentDto): string => resident.name || "";
const getResidentEmail = (resident: UserDto | ResidentDto): string => resident.email || "";
const getResidentPhone = (resident: UserDto | ResidentDto): string => resident.phone || "";
const getResidentStudentId = (resident: UserDto | ResidentDto): string | null => {
  if ("studentId" in resident) return resident.studentId;
  return resident.residentProfile?.studentId || null;
};
const getResidentCourse = (resident: UserDto | ResidentDto): string | null => {
  if ("course" in resident) return resident.course;
  return resident.residentProfile?.course || null;
};
const getResidentGender = (resident: UserDto | ResidentDto): string | null => {
  // UserDto has gender directly, ResidentDto has it in user property (legacy)
  if ("userId" in resident) {
    // This is ResidentDto, but it doesn't have user populated in this context
    // Return null since gender is not available
    return null;
  }
  // This is UserDto which has gender directly
  return resident.gender || null;
};

const PaymentSummaryForm = () => {
  const navigate = useNavigate()
  const room = useSelectedRoomStore((s) => s.room)
  const resident = useAddedResidentStore((s) => s.resident)

  // Redirect if required data is missing
  if (!room || !resident) {
    toast.error("Booking information not found. Please start the booking process again.")
    navigate("/find-hostel")
    return null
  }

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
      } catch (error: unknown) {
        const err = error as ApiError;
        const errorMessage = err.response?.data?.message || err.response?.data?.error || "An unexpected error occurred"
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
    <div className="min-h-screen px-4 py-8 bg-gray-50/50 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-transparent hover:text-primary -ml-3"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Booking
        </Button>

        <Card className="overflow-hidden border shadow-sm">
          {/* Header Section */}
          <div className="p-6 border-b bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border border-gray-100">
                  <AvatarFallback className="text-xl bg-primary/10 text-primary font-bold">
                    {getInitials(getResidentName(resident))}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{getResidentName(resident)}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-sm">{getResidentStudentId(resident) || "Student ID"}</span>
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="w-fit px-3 py-1.5 text-sm capitalize">
                {room?.status || "Pending"}
              </Badge>
            </div>
          </div>

          <CardContent className="p-6 md:p-8 space-y-8">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Resident Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <User className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-gray-900">Resident Details</h3>
                </div>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground flex items-center gap-2">
                      <GraduationCap className="w-3.5 h-3.5" /> Course
                    </dt>
                    <dd className="font-medium text-right">{getResidentCourse(resident) || "-"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5" /> Email
                    </dt>
                    <dd className="font-medium text-right">{getResidentEmail(resident) || "-"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5" /> Phone
                    </dt>
                    <dd className="font-medium text-right">{getResidentPhone(resident) || "-"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground flex items-center gap-2">
                      <Users className="w-3.5 h-3.5" /> Gender
                    </dt>
                    <dd className="font-medium text-right">{getResidentGender(resident) || "-"}</dd>
                  </div>
                </dl>
              </div>

              {/* Room Information */}
              {room && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <Home className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-gray-900">Room Details</h3>
                  </div>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground flex items-center gap-2">
                        <BadgeCheck className="w-3.5 h-3.5" /> Room No
                      </dt>
                      <dd className="font-bold text-lg">{room.number}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground flex items-center gap-2">
                        <Home className="w-3.5 h-3.5" /> Block
                      </dt>
                      <dd className="font-medium">{room.block}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground flex items-center gap-2">
                        <Users className="w-3.5 h-3.5" /> Type
                      </dt>
                      <dd className="font-medium capitalize">{room.type}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground flex items-center gap-2">
                        <BadgeCent className="w-3.5 h-3.5" /> Price
                      </dt>
                      <dd className="font-medium text-primary">GH₵{room.price.toLocaleString()}</dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>

            {/* Payment Summary */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 pt-8 border-t">
                <div className="space-y-6 max-w-xl mx-auto">
                  <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold">Payment Summary</h2>
                    <p className="text-muted-foreground text-sm">Choose your preferred payment method</p>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-xl border space-y-4">
                    <div className="flex justify-between items-end pb-4 border-b">
                      <span className="text-sm font-medium text-muted-foreground">Total Room Fees</span>
                      <span className="text-2xl font-bold">GH₵{totalAmount?.toLocaleString()}</span>
                    </div>

                    {hostel?.allowPartialPayment && (
                      <div className="py-4">
                        <div className="flex items-start space-x-3 p-4 border rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                          <Checkbox
                            id="partial-payment"
                            checked={paymentType === "partial"}
                            onCheckedChange={(checked) => {
                              setPaymentType(checked ? "partial" : "full")
                            }}
                            className="mt-1"
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor="partial-payment"
                              className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-gray-900"
                            >
                              Make a Partial Deposit
                            </label>
                            <p className="text-sm text-muted-foreground">
                              Pay a {hostel.partialPaymentPercentage}% deposit (GH₵{partialAmount.toLocaleString()}) now and the rest later.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2">
                      <span className="font-bold text-gray-900">Amount Due Now</span>
                      <span className="text-3xl font-bold text-primary">
                        GH₵{form.watch("paymentAmount")?.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Alert className={cn(
                    "border-l-4",
                    paymentType === "full" ? "border-l-green-500 bg-green-50/50" : "border-l-yellow-500 bg-yellow-50/50"
                  )}>
                    <AlertCircle className={cn(
                      "h-4 w-4",
                      paymentType === "full" ? "text-green-600" : "text-yellow-600"
                    )} />
                    <AlertTitle>Note</AlertTitle>
                    <AlertDescription className="text-xs text-muted-foreground mt-1">
                      {paymentType === "full"
                        ? "You are clearing all fees for this room."
                        : `You are paying a deposit. The remaining balance of GH₵${(totalAmount - partialAmount).toLocaleString()} will be recorded against your account.`
                      }
                    </AlertDescription>
                  </Alert>

                  {/* Hidden field so RHF knows about it */}
                  <input type="hidden" {...form.register("paymentAmount", { valueAsNumber: true })} />

                  <Button
                    type="submit"
                    size="lg"
                    disabled={mutation.isPending}
                    className="w-full text-lg font-semibold h-12"
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Proceed to Pay
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="bg-gray-50 border-t p-4 px-8 flex justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Flag className="w-3.5 h-3.5" />
              <span>Secured Transaction</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
export default PaymentSummaryForm