import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { initPayment } from "@/api/payments"
import { getHostelById } from "@/api/hostels"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Loader2,
  ChevronLeft,
  User,
  Home,
  CreditCard,
  Calendar,
  GraduationCap,
  Mail,
  Phone,
  Users,
  Flag,
  BadgeCent,
  BadgeCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useAuthStore } from "@/stores/useAuthStore"
import { useSelectedRoomStore } from "@/stores/useSelectedRoomStore"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { UserDto, ApiError } from "@/types/dtos"
import { paymentFormSchema, type PaymentInputs } from "@/schemas/paymentSchema"

// Helper functions to get user properties from UserDto (logged-in user)
const getUserName = (user: UserDto | null): string => user?.name || "";
const getUserEmail = (user: UserDto | null): string => user?.email || "";
const getUserPhone = (user: UserDto | null): string => user?.phone || "";
const getUserStudentId = (user: UserDto | null): string | null =>
  user?.residentProfile?.studentId || null;
const getUserCourse = (user: UserDto | null): string | null =>
  user?.residentProfile?.course || null;
const getUserGender = (user: UserDto | null): string | null => user?.gender || null;

const PaymentSummaryForm = () => {
  const navigate = useNavigate()
  const room = useSelectedRoomStore((s) => s.room)
  const user = useAuthStore((s) => s.user)

  const totalAmount = room?.price || 0

  const [paymentType, setPaymentType] = useState<"full" | "partial">("full")

  // All hooks must be called before any early returns
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

  // Redirect effect - must be before early return
  useEffect(() => {
    if (!room || !user) {
      toast.error("Booking information not found. Please start the booking process again.")
      navigate("/find-hostel")
    }
  }, [room, user, navigate])

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
        const payload = {
          roomId: room?.id || "",
          residentId: user?.residentProfile?.id || user?.id || "",
          initialPayment: data.paymentAmount,
        }

        const resData = await initPayment(payload)

        // Guide says: Returns a authorizationUrl (Paystack checkout page) and a reference.
        if (resData?.authorizationUrl) {
          toast(resData.message || "Redirecting to payment...")
          window.location.href = resData.authorizationUrl;
        } else if (resData?.paymentUrl?.authorizationUrl) {
          // Fallback for previous structure if backend hasn't fully switched but we are pushing for v1
          toast(resData.message || "Redirecting to payment...")
          window.location.href = resData.paymentUrl.authorizationUrl;
        } else {
          toast.error("Payment initiation failed: No authorization URL received")
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

  // Early return after all hooks
  if (!room || !user) {
    return null
  }

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
    <div className="min-h-screen px-4 py-8 bg-muted/50 sm:px-6 lg:px-8">
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
          <div className="p-6 border-b bg-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border border-border">
                  <AvatarFallback className="text-xl bg-primary/10 text-primary font-bold">
                    {getInitials(getUserName(user) || "Resident")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{getUserName(user)}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-sm">{getUserStudentId(user) || "Student ID"}</span>
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
                  <h3 className="font-semibold text-foreground">Resident Details</h3>
                </div>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground flex items-center gap-2">
                      <GraduationCap className="w-3.5 h-3.5" /> Course
                    </dt>
                    <dd className="font-medium text-right">{getUserCourse(user) || "-"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5" /> Email
                    </dt>
                    <dd className="font-medium text-right">{getUserEmail(user) || "-"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5" /> Phone
                    </dt>
                    <dd className="font-medium text-right">{getUserPhone(user) || "-"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground flex items-center gap-2">
                      <Users className="w-3.5 h-3.5" /> Gender
                    </dt>
                    <dd className="font-medium text-right">{getUserGender(user) || "-"}</dd>
                  </div>
                </dl>
              </div>

              {/* Room Information */}
              {room && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <Home className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-foreground">Room Details</h3>
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
                    <p className="text-muted-foreground text-sm">Complete your booking payment</p>
                  </div>

                  <div className="bg-muted p-6 rounded-xl border space-y-4">
                    <div className="flex justify-between items-end pb-4 border-b">
                      <span className="text-sm font-medium text-muted-foreground">Total Room Fees</span>
                      <span className="text-2xl font-bold">GH₵{totalAmount?.toLocaleString()}</span>
                    </div>

                    {hostel?.allowPartialPayment && (
                      <div className="py-4">
                        <div className="flex items-start space-x-3 p-4 border rounded-lg bg-muted/50 hover:bg-muted transition-colors">
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
                              className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-foreground"
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
                      <span className="font-bold text-foreground">Amount Due Now</span>
                      <span className="text-3xl font-bold text-primary">
                        GH₵{form.watch("paymentAmount")?.toLocaleString()}
                      </span>
                    </div>
                  </div>

                 

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
          <CardFooter className="bg-muted border-t p-4 px-8 flex justify-between text-xs text-muted-foreground">
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