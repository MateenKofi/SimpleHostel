import { z } from "zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "react-hot-toast"
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
  DollarSign,
  Receipt,
  BadgeCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form} from "@/components/ui/form"
import { useAddedResidentStore } from "@/controllers/AddedResident"
import { useSelectedRoomStore } from "@/controllers/SelectedRoomStore"
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
  const room = useSelectedRoomStore((s) => s.room)!
  const resident = useAddedResidentStore((s) => s.resident)!
  const totalAmount = room.price

  const form = useForm<PaymentInputs>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      paymentAmount: totalAmount,
    },
  })

  useEffect(() => {
    form.setValue("paymentAmount", totalAmount, { shouldValidate: true })
  }, [totalAmount, form])

  const mutation = useMutation({
    mutationFn: async (data: PaymentInputs) => {
      try {
        const payload = {
          residentId: resident.id,
          roomId: room.id,
          initialPayment: data.paymentAmount,
        }
        const res = await axios.post("/api/payments/init", payload)
        toast(res.data.message || "Redirecting to payment...");
        window.location.href = res.data.paymentUrl.authorizationUrl;
        navigate('/')
        return res.data
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.message || "An unexpected error occurred")
        }
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
              {room?.status || "PENDING"}
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
                      <DollarSign className="w-4 h-4 text-gray-500" />
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
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <div className="text-sm text-gray-500">Total Amount</div>
                      <div className="text-xl font-bold text-gray-900">GH₵{totalAmount?.toLocaleString()}</div>
                    </div>
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <div className="text-sm text-gray-500">Balance Owed</div>
                      <div className="text-xl font-bold text-red-600">
                        GH₵{(totalAmount - (resident?.amountPaid || 0))?.toLocaleString()}
                      </div>
                    </div>
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