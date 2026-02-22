import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
    currentStep: number;
    steps: { title: string }[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
    return (
        <div className="flex items-center justify-center w-full mb-8">
            <div className="flex items-center w-full max-w-2xl px-4">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = currentStep > stepNumber;
                    const isActive = currentStep === stepNumber;

                    return (
                        <React.Fragment key={step.title}>
                            <div className="flex flex-col items-center relative z-10">
                                <div
                                    className={cn(
                                        "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
                                        isCompleted
                                            ? "bg-primary border-primary text-white"
                                            : isActive
                                                ? "bg-white border-primary text-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                                                : "bg-white border-gray-300 text-gray-400"
                                    )}
                                >
                                    {isCompleted ? (
                                        <Check className="w-6 h-6" />
                                    ) : (
                                        <span className="text-sm font-bold">{stepNumber}</span>
                                    )}
                                </div>
                                <span
                                    className={cn(
                                        "absolute -bottom-6 text-xs font-semibold whitespace-nowrap transition-all duration-300",
                                        isActive ? "text-primary" : "text-gray-400"
                                    )}
                                >
                                    {step.title}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="flex-1 h-[2px] mx-2 bg-gray-200 relative -top-3">
                                    <div
                                        className={cn(
                                            "h-full bg-primary transition-all duration-500",
                                            isCompleted ? "w-full" : "w-0"
                                        )}
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default StepIndicator;
