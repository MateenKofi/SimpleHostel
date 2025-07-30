import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader } from "lucide-react"
import { SubmitHandler, useForm } from "react-hook-form"
import Modal from "./Modal"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import axios from "axios"

interface AddCalendarYearFormProps {
  onClose: () => void;
  refectCurrentYear: () => void;
  refectHistoricalYears: () => void;
}

interface FormValues {
  yearName: string;
}

const AddCalendarYearForm = ({ onClose, refectCurrentYear, refectHistoricalYears }: AddCalendarYearFormProps) => {
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const hostelId = localStorage.getItem("hostelId");

  // Mutation for adding calendar year
  const AddCalendarYearMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const payload = {
        name: data.yearName,
        hostelId: hostelId || "",
      };
      await axios
        .post(`/api/calendar/start`, payload)
        .then((res) => {
          refectCurrentYear();
          refectHistoricalYears();
          onClose();
          toast.success("Academic Year added successfully");
          reset();
          return res.data;
        })
        .catch((error) => {
          let errorMessage = "Failed to add Academic Year";
          if (axios.isAxiosError(error)) {
            errorMessage = error.response?.data?.message || errorMessage;
          } else {
            errorMessage = (error as Error).message || errorMessage;
          }
          toast.error(errorMessage);
        });
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    AddCalendarYearMutation.mutate(data);
  };

  return (
    <Modal modalId="add-calendar-year-modal" onClose={onClose} >
      <form onSubmit={handleSubmit(onSubmit)}>
         <div>
          <h1>Start New Calendar Year</h1>
          <p className="text-sm text-muted-foreground">
            Enter a name for the new calendar year. This will create a new active year.
          </p>
          </div>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Year Name</Label>
            <Input id="name" {...register("yearName")} placeholder="e.g., Academic Year 2024-2025" />
          </div>
          <Button
            type="submit"
            disabled={AddCalendarYearMutation.isPending}
            
          >
            {AddCalendarYearMutation.isPending ? <Loader className="animate-spin" /> : "Create Year"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default AddCalendarYearForm
