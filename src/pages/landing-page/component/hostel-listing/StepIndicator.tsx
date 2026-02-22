/**
 * Enhanced Step Indicator for Hostel Listing
 * Features: Better visual design, smooth animations, clear progress tracking
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
    <div className="w-full max-w-3xl mx-auto mb-8">
      {/* Progress Bar */}
      <div className="relative h-2 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full overflow-hidden mb-8">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-forest-green-500 to-forest-green-400 transition-all duration-500 ease-out"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
      </div>

      {/* Steps */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-4 md:gap-0">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isActive = currentStep === stepNumber;
          const isClickable = onStepClick && (isCompleted || (index + 1 === currentStep + 1));

          return (
            <div
              key={step.title}
              className={cn(
                "flex flex-col md:flex-row items-start gap-3 md:gap-4 flex-1 cursor-default transition-all duration-300",
                isClickable && "cursor-pointer hover:opacity-80"
              )}
              onClick={() => isClickable && onStepClick?.(stepNumber)}
            >
              {/* Step Circle */}
              <div className="relative z-10 flex-shrink-0">
                <div
                  className={cn(
                    "w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm",
                    isCompleted
                      ? "bg-gradient-to-br from-forest-green-500 to-forest-green-600 border-forest-green-500 text-white shadow-forest-green-200"
                      : isActive
                        ? "bg-white border-forest-green-500 text-forest-green-600 shadow-[0_0_20px_rgba(var(--primary),0.15)]"
                        : "bg-white border-slate-300 text-slate-400"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6 md:w-7 md:h-7" />
                  ) : (
                    <span className="text-base md:text-lg font-bold">{stepNumber}</span>
                  )}
                </div>

                {/* Active Indicator Dot */}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-forest-green-500 rounded-full animate-pulse" />
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 pt-1 md:pt-2">
                <h3
                  className={cn(
                    "font-semibold text-sm md:text-base transition-colors duration-300",
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

              {/* Connector Line (Desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex flex-1 items-center px-2 relative top-6">
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
  );
};

export default StepIndicator;
