import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader, Plus } from "lucide-react"
import { UseFormRegister, UseFormHandleSubmit } from "react-hook-form"

interface AddCalendarYearFormProps {
  onSubmit: (data: { yearName: string }) => void
  isPending: boolean
  register: UseFormRegister<{ yearName: string }>
  handleSubmit: UseFormHandleSubmit<{ yearName: string }>
}

const AddCalendarYearForm = ({ onSubmit, isPending, register, handleSubmit }: AddCalendarYearFormProps) => (
  <form onSubmit={handleSubmit(onSubmit)} className="flex justify-between items-center mb-8">
    <h1 className="text-3xl font-bold">Calendar Year Management</h1>
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Start New Year
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start New Calendar Year</DialogTitle>
          <DialogDescription>
            Enter a name for the new calendar year. This will create a new active year.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Year Name</Label>
            <Input id="name" {...register("yearName")} placeholder="e.g., Academic Year 2024-2025" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader className="animate-spin" /> : "Create Year"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </form>
)

export default AddCalendarYearForm