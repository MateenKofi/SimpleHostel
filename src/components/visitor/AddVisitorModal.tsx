"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { UserPlus, Mail, Phone, User, Info, Users } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getHostelResidents } from "@/api/residents";
import { addVisitor } from "@/api/visitors";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { VisitorFormSchema, type VisitorFormInputs } from "@/schemas/VisitorForm.schema";
import type { ApiError } from "@/types/dtos";
import type { ResidentDto } from "@/types/dtos";

interface AddVisitorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddVisitorModal = ({ open, onOpenChange }: AddVisitorModalProps) => {
  const queryClient = useQueryClient();
  const hostelId = localStorage.getItem("hostelId") || "";

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, touchedFields },
    reset,
  } = useForm<VisitorFormInputs>({
    resolver: zodResolver(VisitorFormSchema),
  });

  // Fetch residents for dropdown
  const { data: residents, isLoading: isLoadingResidents } = useQuery({
    queryKey: ["residents", hostelId],
    queryFn: async () => {
      if (!hostelId) return [];
      const responseData = await getHostelResidents(hostelId);
      return responseData?.data ?? [];
    },
    enabled: !!hostelId && open,
  });

  // Add visitor mutation
  const addVisitorMutation = useMutation({
    mutationFn: async (visitor_data: VisitorFormInputs) => {
      const responseData = await addVisitor({
        name: visitor_data.name,
        phone: visitor_data.phone,
        email: visitor_data.email,
        residentId: visitor_data.residentId,
      });
      return responseData;
    },
    onSuccess: () => {
      toast.success("Visitor added successfully!");
      reset();
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["visitors"] });
      queryClient.refetchQueries({ queryKey: ["visitors"] });
    },
    onError: (err: ApiError) => {
      const errorMessage = err.response?.data?.message || "Failed to add visitor";
      toast.error(errorMessage);
    },
  });

  const onSubmit: SubmitHandler<VisitorFormInputs> = (values) => {
    addVisitorMutation.mutate(values);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!addVisitorMutation.isPending) {
      onOpenChange(newOpen);
      if (!newOpen) {
        reset();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <UserPlus className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Add New Visitor</DialogTitle>
              <DialogDescription>
                Fill in the visitor details to check them in.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Visitor Name */}
          <div>
            <label htmlFor="name" className="font-medium text-sm text-foreground">
              Visitor Name*
            </label>
            <div className="relative mt-2">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="Enter visitor's full name"
                className="h-10 pl-10"
                {...register("name")}
              />
            </div>
            {touchedFields.name && errors.name && (
              <p className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="font-medium text-sm text-foreground">
              Email Address*
            </label>
            <div className="relative mt-2">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="visitor@example.com"
                className="h-10 pl-10"
                {...register("email")}
              />
            </div>
            {touchedFields.email && errors.email && (
              <p className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="font-medium text-sm text-foreground">
              Phone Number*
            </label>
            <div className="relative mt-2">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="phone"
                placeholder="Enter phone number"
                className="h-10 pl-10"
                {...register("phone")}
              />
            </div>
            {touchedFields.phone && errors.phone && (
              <p className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Resident Select */}
          <div>
            <label htmlFor="residentId" className="font-medium text-sm text-foreground">
              Visiting Resident*
            </label>
            <Controller
              name="residentId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="h-10 mt-2">
                    {isLoadingResidents ? (
                      <SelectValue placeholder="Loading residents..." />
                    ) : (
                      <SelectValue placeholder="Select a resident" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {residents?.map((resident: ResidentDto) => (
                      <SelectItem
                        key={resident.id}
                        value={resident.id}
                        disabled={!resident.roomId}
                      >
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>
                            {resident.user?.name || resident.name}
                            {resident.room ? (
                              <span className="text-muted-foreground">
                                {" "}
                                - {resident.room.block && `Block ${resident.room.block}, `}
                                {resident.room.number || resident.roomNumber}
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-xs">
                                {" "}
                                (No room assigned)
                              </span>
                            )}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                    {!residents?.length && !isLoadingResidents && (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        No residents found
                      </div>
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            {touchedFields.residentId && errors.residentId && (
              <p className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                {errors.residentId.message}
              </p>
            )}
          </div>

          {/* Purpose (Optional) */}
          <div>
            <label htmlFor="purpose" className="font-medium text-sm text-foreground">
              Purpose of Visit
              <span className="text-muted-foreground font-normal ml-1">(optional)</span>
            </label>
            <Textarea
              id="purpose"
              placeholder="What is the purpose of this visit?"
              className="mt-2 resize-none"
              rows={2}
              {...register("purpose")}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={addVisitorMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={addVisitorMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {addVisitorMutation.isPending ? "Adding..." : "Add Visitor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddVisitorModal;
