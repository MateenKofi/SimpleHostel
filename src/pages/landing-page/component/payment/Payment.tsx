'use client'

import { useState } from 'react'
import { CreditCard, Smartphone, DollarSign, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import 'daisyui/dist/full.css'

const Payment = () => {
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('')

  const handlePayment = async () => {
    // Implement payment logic here
    console.log('Processing payment...')
  }

  // Placeholder values
  const roomNumber = '101'
  const basePrice = 100
  const isPartialPayment = false
  const totalAmount = isPartialPayment ? basePrice * 0.7 : basePrice

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle>Complete Your Payment</CardTitle>
        <div className="border steps">
          <div className={`step ${step >= 1 ? 'step-neutral' : ''}`} onClick={() => setStep(1)}>Summary</div>
          <div className={`step ${step >= 2 ? 'step-neutral' : ''}`} onClick={() => setStep(2)}>Payment Method</div>
        </div>
        
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Room {roomNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Partial Payment (70%)</span>
              <Switch
                checked={isPartialPayment}
                onCheckedChange={() => console.log('Toggle partial payment')}
              />
            </div>
            <div className="text-2xl font-bold">₵{totalAmount.toFixed(2)}</div>
            <Button className="w-full" onClick={() => setStep(2)}>
              Continue to Payment
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <RadioGroup onValueChange={setPaymentMethod} className="grid grid-cols-2 gap-4">
              <div>
                <RadioGroupItem value="card" id="card" className="peer sr-only" />
                <Label
                  htmlFor="card"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
                >
                  <CreditCard className="mb-3 h-6 w-6" />
                  Card
                </Label>
              </div>
              <div>
                <RadioGroupItem value="momo" id="momo" className="peer sr-only" />
                <Label
                  htmlFor="momo"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
                >
                  <Smartphone className="mb-3 h-6 w-6" />
                  MoMo
                </Label>
              </div>
            </RadioGroup>

            {paymentMethod === 'momo' && (
              <div className="space-y-2">
                <Label htmlFor="momoNumber">MoMo Phone Number</Label>
                <Input
                  id="momoNumber"
                  type="tel"
                  placeholder="Enter MoMo phone number"
                  pattern="[0-9]{10}"
                  maxLength={10}
                />
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" type="text" placeholder="MM/YY" maxLength={5} />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" type="text" placeholder="123" maxLength={3} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        {step === 2 && (
          <Button className="w-full" onClick={handlePayment} disabled={!paymentMethod}>
            Pay ₵{totalAmount.toFixed(2)}
            <DollarSign className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default Payment