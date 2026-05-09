import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Calendar } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import Modal from "../Modal";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateCalendarYear } from "@/api/calendar";
import type { ApiError } from "@/types/dtos";
import { CalendarYearT } from "@/helper/types/types";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import moment from "moment";

interface EditCalendarYearModalProps {
  onClose: () => void;
  calendarYear: CalendarYearT;
  refetch: () => void;
}

interface FormValues {
  name: string;
}

const EditCalendarYearModal = ({ onClose, calendarYear, refetch }: EditCalendarYearModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: {
      name: calendarYear?.name || "",
    },
  });

  useEffect(() => {
    if (calendarYear?.name) {
      setValue("name", calendarYear.name);
    }
  }, [calendarYear, setValue]);

  const updateMutation = useMutation({
    mutationFn: async (data: FormValues & { id: string }) => {
      try {
        await updateCalendarYear(data.id, { name: data.name });
        refetch();
        onClose();
        toast.success("Calendar Year updated successfully");
        reset();
      } catch (error: unknown) {
        const err = error as ApiError;
        const errorMessage = err.response?.data?.message || "Failed to update Calendar Year";
        toast.error(errorMessage);
        throw error;
      }
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    updateMutation.mutate({ ...data, id: calendarYear.id });
  };

  const isLoading = updateMutation.isPending || isSubmitting;
  const startDateValue = calendarYear?.startDate ? moment(calendarYear.startDate).format("MMMM DD, YYYY") : "N/A";
  const endDateValue = calendarYear?.endDate ? moment(calendarYear.endDate).format("MMMM DD, YYYY") : "Not Ended";

  return (
    <Modal modalId="edit-calendar-year-modal" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <h1 className="text-xl font-semibold">Edit Calendar Year</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Update the calendar year name. Use the "End Year" button in the actions menu to end an active year.
          </p>
        </motion.div>

        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Year Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            maxLength={50}
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={`transition-all duration-200 ${
              errors.name
                ? "border-destructive focus:border-destructive focus:ring-destructive/50"
                : "focus:ring-primary/50"
            }`}
            {...register("name", {
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
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                id="name-error"
                className="text-xs text-destructive flex items-center gap-1"
                role="alert"
              >
                <span className="w-1 h-1 rounded-full bg-destructive" />
                {errors.name.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-sm font-medium text-muted-foreground">
              Start Date
            </Label>
            <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50 border">
              <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-sm font-medium truncate">{startDateValue}</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate" className="text-sm font-medium text-muted-foreground">
              End Date
            </Label>
            <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50 border">
              <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-sm font-medium truncate">{endDateValue}</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
          Dates cannot be edited directly. Use the "End Year" button in the actions menu to end an active year.
        </p>

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
                Updating...
              </>
            ) : (
              "Update Year"
            )}
          </Button>
        </motion.div>
      </form>
    </Modal>
  );
};

export default EditCalendarYearModal;
