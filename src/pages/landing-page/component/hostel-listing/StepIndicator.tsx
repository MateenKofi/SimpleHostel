/**
 * Enhanced Step Indicator for Hostel Listing
 * Mobile-first design with horizontal scrollable steps on small screens
 */
import React from "react";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  steps: { title: string; description?: string; icon?: React.ReactNode }[];
  onStepClick?: (step: number) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps, onStepClick }) => {
  return (
    <div className="w-full mb-4 md:mb-8">
      {/* Mobile: Compact horizontal step indicator */}
      <div className="md:hidden">
        {/* Progress Bar with Steps */}
        <div className="relative h-1.5 bg-slate-200 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-forest-green-500 to-forest-green-400 transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Horizontal scrollable step pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = currentStep > stepNumber;
            const isActive = currentStep === stepNumber;
            const isClickable = onStepClick && (isCompleted || (index + 1 === currentStep + 1));

            return (
              <button
                key={step.title}
                type="button"
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0",
                  isCompleted && "bg-forest-green-100 text-forest-green-700",
                  isActive && "bg-forest-green-600 text-white shadow-md shadow-forest-green-200",
                  !isCompleted && !isActive && "bg-slate-100 text-slate-500",
                  isClickable && "cursor-pointer hover:scale-[1.02]",
                  !isClickable && "cursor-default"
                )}
                onClick={() => isClickable && onStepClick?.(stepNumber)}
                disabled={!isClickable}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <span className="w-5 h-5 flex items-center justify-center bg-current/10 rounded-full text-[10px] font-bold">
                    {stepNumber}
                  </span>
                )}
                <span>{step.title}</span>
              </button>
            );
          })}
        </div>

        {/* Current step description */}
        <div className="mt-3 text-center">
          <p className="text-xs text-slate-500">
            Step {currentStep} of {steps.length}
          </p>
        </div>
      </div>

      {/* Desktop: Full step indicator with circles */}
      <div className="hidden md:block max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="relative h-2 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full overflow-hidden mb-8">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-forest-green-500 to-forest-green-400 transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="flex items-start justify-between gap-0">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = currentStep > stepNumber;
            const isActive = currentStep === stepNumber;
            const isClickable = onStepClick && (isCompleted || (index + 1 === currentStep + 1));

            return (
              <div
                key={step.title}
                className={cn(
                  "flex flex-row items-center gap-4 flex-1 cursor-default transition-all duration-300",
                  isClickable && "cursor-pointer hover:opacity-80"
                )}
                onClick={() => isClickable && onStepClick?.(stepNumber)}
              >
                {/* Step Circle */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className={cn(
                      "w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm",
                      isCompleted
                        ? "bg-gradient-to-br from-forest-green-500 to-forest-green-600 border-forest-green-500 text-white shadow-forest-green-200"
                        : isActive
                          ? "bg-white border-forest-green-500 text-forest-green-600 shadow-[0_0_20px_rgba(var(--primary),0.15)]"
                          : "bg-white border-slate-300 text-slate-400"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-7 h-7" />
                    ) : (
                      <span className="text-lg font-bold">{stepNumber}</span>
                    )}
                  </div>

                  {/* Active Indicator Dot */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-forest-green-500 rounded-full animate-pulse" />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 pt-2">
                  <h3
                    className={cn(
                      "font-semibold text-base transition-colors duration-300",
                      isActive ? "text-forest-green-700" : "text-slate-700"
                    )}
                  >
                    {step.title}
                  </h3>
                  {step.description && (
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                      {step.description}
                    </p>
                  )}
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex flex-1 items-center px-2 relative top-6">
                    <ChevronRight
                      className={cn(
                        "w-5 h-5 transition-colors duration-300",
                        isCompleted ? "text-forest-green-500" : "text-slate-300"
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
