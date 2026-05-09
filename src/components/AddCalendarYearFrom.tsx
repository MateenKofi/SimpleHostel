import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { SubmitHandler, useForm } from "react-hook-form"
import Modal from "./Modal"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { startCalendarYear } from "@/api/calendar"
import type { ApiError } from "@/types/dtos"
import { motion, AnimatePresence } from "framer-motion"

interface AddCalendarYearFormProps {
  onClose: () => void;
  refectCurrentYear: () => void;
  refectHistoricalYears: () => void;
}

interface FormValues {
  yearName: string;
}

const AddCalendarYearForm = ({ onClose, refectCurrentYear, refectHistoricalYears }: AddCalendarYearFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: { yearName: "" },
  });

  const yearNameValue = watch("yearName", "");

  const hostelId = localStorage.getItem("hostelId");

  const AddCalendarYearMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      try {
        const payload = {
          name: data.yearName,
          hostelId: hostelId || "",
        };
        await startCalendarYear(payload);
        refectCurrentYear();
        refectHistoricalYears();
        onClose();
        toast.success("Academic Year created successfully. You can activate it from the table.");
        reset();
      } catch (error: unknown) {
        const err = error as ApiError;
        const errorMessage = err.response?.data?.message || "Failed to add Academic Year";
        toast.error(errorMessage);
        throw error;
      }
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    AddCalendarYearMutation.mutate(data);
  };

  const isLoading = AddCalendarYearMutation.isPending || isSubmitting;

  return (
    <Modal modalId="add-calendar-year-modal" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <h1 className="text-xl font-semibold">Create New Calendar Year</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter a name for the new calendar year. This will create an inactive year that you can activate later.
          </p>
        </motion.div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="yearName" className="text-sm font-medium">
              Year Name <span className="text-destructive">*</span>
            </Label>
            <span className="text-xs text-muted-foreground">
              {yearNameValue.length}/50
            </span>
          </div>
          <Input
            id="yearName"
            placeholder="e.g., Academic Year 2024-2025"
            maxLength={50}
            aria-invalid={errors.yearName ? "true" : "false"}
            aria-describedby={errors.yearName ? "yearName-error" : undefined}
            className={`transition-all duration-200 ${
              errors.yearName
                ? "border-destructive focus:border-destructive focus:ring-destructive/50"
                : "focus:ring-primary/50"
            }`}
            {...register("yearName", {
              required: "Year name is required",
              minLength: { value: 3, message: "Year name must be at least 3 characters" },
              maxLength: { value: 50, message: "Year name must be less than 50 characters" },
              pattern: {
                value: /^[A-Za-z0-9\s\-]+$/i,
                message: "Only letters, numbers, spaces, and hyphens are allowed",
              },
              onChange: (e) => {
                e.target.value = e.target.value.trim();
              },
            })}
          />
          <AnimatePresence mode="wait">
            {errors.yearName && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                id="yearName-error"
                className="text-xs text-destructive flex items-center gap-1"
                role="alert"
              >
                <span className="w-1 h-1 rounded-full bg-destructive" />
                {errors.yearName.message}
              </motion.p>
            )}
          </AnimatePresence>
          <p className="text-xs text-muted-foreground">
            Use a clear naming convention like "Academic Year 2024-2025" or "2024"
          </p>
        </div>

        <motion.div
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
        >
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Year"
            )}
          </Button>
        </motion.div>
      </form>
    </Modal>
  )
}

export default AddCalendarYearForm
