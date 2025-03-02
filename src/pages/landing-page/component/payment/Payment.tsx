"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CreditCard, Loader2, Phone, CheckCircle2, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { toast } from "react-hot-toast"

const momoProviders = [
  { value: "mtn", label: "MTN Mobile Money" },
  { value: "vodafone", label: "Vodafone Cash" },
  { value: "airteltigo", label: "AirtelTigo Money" },
] as const

const cardFormSchema = z
  .object({
    paymentMethod: z.enum(["card", "momo"]),
    // Card Fields
    cardNumber: z
      .string()
      .regex(/^\d{16}$/, "Card number must be 16 digits")
      .optional(),
    cardHolder: z.string().min(3, "Cardholder name is required").optional(),
    expiryDate: z
      .string()
      .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Invalid expiry date (MM/YY)")
      .optional(),
    cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits").optional(),
    // MoMo Fields
    provider: z.string().optional(),
    momoNumber: z
      .string()
      .regex(/^\d{10}$/, "Mobile money number must be 10 digits")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.paymentMethod === "card") {
        return data.cardNumber && data.cardHolder && data.expiryDate && data.cvv
      }
      return data.provider && data.momoNumber
    },
    {
      message: "Please fill in all required fields",
      path: ["paymentMethod"],
    }
  )

interface PaymentFormProps {
  amount: number
  description: string
}

const PaymentForm = ({ amount, description }: PaymentFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "success" | "error"
  >("idle")

  const form = useForm<z.infer<typeof cardFormSchema>>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      paymentMethod: "momo", 
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cvv: "",
      provider: "",
      momoNumber: "",
      
    },
  })

  const paymentMethod = form.watch("paymentMethod")

  useEffect(() => {
    form.reset({
      paymentMethod,
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cvv: "",
      provider: "",
      momoNumber: "",
    })
  }, [paymentMethod, form])

  async function onSubmit(values: z.infer<typeof cardFormSchema>) {
    setIsSubmitting(true)
    setPaymentStatus("idle")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate success (in a real app, handle actual payment processing here)
      setPaymentStatus("success")
      toast("Payment successful!", { icon: "✅" })
    } catch (error) {
      setPaymentStatus("error")
      toast("Payment failed. Please try again.", { icon: "❌" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Payment Details</CardTitle>
        <CardDescription>
          Complete your payment using your preferred method.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Summary */}
        <div className="rounded-lg bg-muted p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Amount:</span>
            <span className="font-semibold">GH₵ {amount?.toLocaleString()}</span>
          </div>
          <Separator />
          <div className="text-sm text-muted-foreground">{description}</div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Payment Method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value} // Controlled RadioGroup
                      className="grid grid-cols-2 gap-4"
                    >
                      {/* MoMo Option */}
                      <div>
                        <RadioGroupItem
                          value="momo"
                          id="momo"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="momo"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-gray-900 hover:text-white peer-data-[state=checked]:bg-black peer-data-[state=checked]:text-white [&:has([data-state=checked])]:border-primary cursor-pointer"
                        >
                          <Phone className="mb-3 h-6 w-6" />
                          Mobile Money
                        </Label>
                      </div>
                      {/* Card Option */}
                      <div>
                        <RadioGroupItem
                          value="card"
                          id="card"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="card"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-gray-900 hover:text-white peer-data-[state=checked]:bg-black peer-data-[state=checked]:text-white [&:has([data-state=checked])]:border-primary cursor-pointer"
                        >
                          <CreditCard className="mb-3 h-6 w-6" />
                          Card Payment
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {paymentMethod === "momo" ? (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Money Provider</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select provider" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {momoProviders.map((provider) => (
                            <SelectItem
                              key={provider.value}
                              value={provider.value}
                            >
                              {provider.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="momoNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Money Number</FormLabel>
                      <FormControl>
                        <Input placeholder="0XX XXX XXXX" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the mobile number registered with your Mobile Money
                        account
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Alert className="bg-muted">
                  <AlertDescription className="text-sm">
                    You will receive a prompt on your phone to complete the
                    payment. Please enter your Mobile Money PIN to confirm the
                    transaction.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <Input placeholder="1234 5678 9012 3456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cardHolder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cardholder Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Input placeholder="MM/YY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVV</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="123"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {paymentStatus === "success" && (
              <Alert className="bg-success-50 border-success-500">
                <CheckCircle2 className="h-4 w-4 text-success-500" />
                <AlertTitle>Payment Successful!</AlertTitle>
                <AlertDescription>
                  Your payment has been processed successfully.
                </AlertDescription>
              </Alert>
            )}

            {paymentStatus === "error" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Payment Failed</AlertTitle>
                <AlertDescription>
                  There was an error processing your payment. Please try again.
                </AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>Pay GH₵{amount?.toLocaleString()}</>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default PaymentForm