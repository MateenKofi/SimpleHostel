import { ArrowRight, Check, ChevronLeft } from "lucide-react";
import { FormButton } from "@/components/form";
import { cn } from "@/lib/utils";

interface FormNavigationProps {
    currentStep: number;
    totalSteps: number;
    isPending: boolean;
    onNext: (e?: React.MouseEvent) => void;
    onPrev: (e?: React.MouseEvent) => void;
    onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export const FormNavigation = ({
    currentStep,
    totalSteps,
    isPending,
    onNext,
    onPrev,
    onSubmit,
}: FormNavigationProps) => {
    return (
        <div className="sticky bottom-0 left-0 right-0 z-10 pt-4 md:pt-6 -mx-4 md:mx-0 px-4 md:px-0 pb-4 md:pb-0 bg-white md:bg-transparent border-t md:border-t-0 border-border">
            <div className="flex items-center justify-between gap-3">
                <FormButton
                    key="prev-button"
                    type="button"
                    variant="ghost"
                    onClick={onPrev}
                    disabled={currentStep === 1 || isPending}
                    className={cn(
                        "h-11 md:h-12 px-4 md:px-6 font-semibold text-muted-foreground hover:bg-muted rounded-xl transition-all",
                        currentStep === 1 && "invisible"
                    )}
                >
                    <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 mr-1" />
                    <span className="hidden sm:inline">Previous</span>
                </FormButton>

                {currentStep < totalSteps ? (
                    <FormButton
                        key="next-button"
                        type="button"
                        onClick={onNext}
                        disabled={isPending}
                        className="h-11 md:h-12 px-6 md:px-8 font-bold bg-gradient-to-r from-primary to-forest-green-500 hover:from-forest-green-700 hover:to-forest-green-600 text-primary-foreground rounded-xl shadow-lg shadow-forest-green-200 transition-all active:scale-[0.98]"
                    >
                        Next
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-1 md:ml-2" />
                    </FormButton>
                ) : (
                    <FormButton
                        key="submit-button"
                        type="button"
                        onClick={onSubmit}
                        loading={isPending}
                        loadingText="Submitting..."
                        className="h-11 md:h-12 px-6 md:px-10 font-bold bg-gradient-to-r from-primary to-forest-green-500 hover:from-forest-green-700 hover:to-forest-green-600 text-primary-foreground rounded-xl shadow-lg shadow-forest-green-200 transition-all active:scale-[0.98]"
                    >
                        <Check className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                        <span className="hidden sm:inline">Submit Application</span>
                        <span className="sm:hidden">Submit</span>
                    </FormButton>
                )}
            </div>
        </div>
    );
};
