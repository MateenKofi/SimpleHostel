import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import Modal from "../Modal";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateCalendarYear } from "@/api/calendar";
import type { ApiError } from "@/types/dtos";
import { CalendarYearT } from "@/helper/types/types";
import { useEffect } from "react";

interface EditCalendarYearModalProps {
  onClose: () => void;
  calendarYear: CalendarYearT;
  refetch: () => void;
}

interface FormValues {
  name: string;
}

const EditCalendarYearModal = ({ onClose, calendarYear, refetch }: EditCalendarYearModalProps) => {
  const { register, handleSubmit, reset, setValue } = useForm<FormValues>({
    defaultValues: {
      name: calendarYear?.name || "",
    },
  });

  // Update form when calendarYear changes
  useEffect(() => {
    if (calendarYear?.name) {
      setValue("name", calendarYear.name);
    }
  }, [calendarYear, setValue]);

  // Mutation for updating calendar year
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

  return (
    <Modal modalId="edit-calendar-year-modal" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h1>Edit Calendar Year</h1>
          <p className="text-sm text-muted-foreground">
            Update the calendar year name. Use the "End Year" button in the actions menu to end an active year.
          </p>
        </div>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Year Name</Label>
            <Input
              id="name"
              {...register("name", { required: "Year name is required" })}
              placeholder="e.g., Academic Year 2024-2025"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={calendarYear?.startDate ? new Date(calendarYear.startDate).toISOString().split('T')[0] : ""}
              disabled
              className="bg-muted"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={calendarYear?.endDate ? new Date(calendarYear.endDate).toISOString().split('T')[0] : ""}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Dates cannot be edited directly. Use the "End Year" button to end an active year.
            </p>
          </div>
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="w-full"
          >
            {updateMutation.isPending ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Year"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditCalendarYearModal;
