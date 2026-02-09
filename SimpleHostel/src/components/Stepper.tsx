// components/Stepper.tsx
'use client'

import { HelpCircle, Info, Check, X, Star, Circle } from 'lucide-react'

interface StepperProps {
  currentStep: number
}

const steps = [
  { id: 1, icon: <HelpCircle className="h-5 w-5" />, label: 'Step 1' },
  { id: 2, icon: <Info className="h-5 w-5" />, label: 'Step 2' },
  { id: 3, icon: <Check className="h-5 w-5" />, label: 'Step 3' },
  { id: 4, icon: <X className="h-5 w-5" />, label: 'Step 4' },
  { id: 5, icon: <Star className="h-5 w-5" />, label: 'Step 5' },
  { id: 6, icon: <Circle className="h-5 w-5" />, label: 'Step 6' },
  { id: 7, icon: <Circle className="h-5 w-5" />, label: 'Step 7' },
]

const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
  return (
    <div className="flex items-center space-x-4">
      {steps.map((step, index) => (
        <div key={step.id} className="flex flex-col items-center">
          <div
            className={`flex items-center justify-center h-8 w-8 rounded-full ${
              index + 1 <= currentStep ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'
            }`}
          >
            {step.icon}
          </div>
          <span className="text-xs mt-2 text-gray-500">{step.label}</span>
        </div>
      ))}
    </div>
  )
}

export default Stepper
