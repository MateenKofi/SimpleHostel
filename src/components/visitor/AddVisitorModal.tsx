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
import Select from "react-select";
import type { StylesConfig } from "react-select";
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

  // Fetch residents for dropdown (only active residents)
  const { data: residents, isLoading: isLoadingResidents } = useQuery({
    queryKey: ["residents", hostelId],
    queryFn: async () => {
      if (!hostelId) return [];
      const responseData = await getHostelResidents(hostelId);
      // Filter to only show active residents
      const allResidents = responseData?.data ?? [];
      return allResidents.filter((resident: ResidentDto) => resident.checkInDate !== null && resident.status === "active");
    },
    enabled: !!hostelId && open,
  });

  interface ResidentOption {
    value: string;
    label: string;
    subLabel: string;
    isDisabled: boolean;
  }

  const residentOptions: ResidentOption[] = residents?.map((resident: ResidentDto) => ({
    value: resident.id,
    label: resident.user?.name || resident.name || "Unknown",
    subLabel: resident.room
      ? `${resident.room.block ? `Block ${resident.room.block}, ` : ""}Room ${resident.room.number || resident.roomNumber}`
      : "No room assigned",
    isDisabled: !resident.roomId,
  })) ?? [];

  const selectStyles: StylesConfig<ResidentOption, false> = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "hsl(var(--background))",
      borderColor: state.isFocused ? "hsl(var(--ring))" : "hsl(var(--input))",
      boxShadow: state.isFocused ? "0 0 0 1px hsl(var(--ring))" : "none",
      "&:hover": {
        borderColor: "hsl(var(--ring))",
      },
      minHeight: "40px",
      borderRadius: "calc(var(--radius) - 2px)",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "hsl(var(--popover))",
      border: "1px solid hsl(var(--border))",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      zIndex: 100,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "hsl(var(--muted))" : "transparent",
      color: "hsl(var(--foreground))",
      cursor: state.isDisabled ? "not-allowed" : "pointer",
      opacity: state.isDisabled ? 0.5 : 1,
      fontSize: "0.875rem",
      display: "flex",
      alignItems: "center",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "hsl(var(--foreground))",
    }),
    input: (provided) => ({
      ...provided,
      color: "hsl(var(--foreground))",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "hsl(var(--muted-foreground))",
      fontSize: "0.875rem",
    }),
    menuList: (provided) => ({
      ...provided,
      padding: "4px",
    }),
  };

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
            <div className="mt-2">
              <Controller
                name="residentId"
                control={control}
                render={({ field }) => (
                  <Select<ResidentOption, false>
                    options={residentOptions}
                    value={residentOptions.find((o) => o.value === field.value) || null}
                    onChange={(option) => field.onChange(option?.value)}
                    isLoading={isLoadingResidents}
                    isDisabled={isLoadingResidents}
                    placeholder={isLoadingResidents ? "Loading residents..." : "Search resident..."}
                    noOptionsMessage={({ inputValue }) =>
                      inputValue
                        ? "No residents match your search"
                        : residents?.length === 0
                          ? "No residents found"
                          : "Type to search..."
                    }
                    isOptionDisabled={(option) => option.isDisabled}
                    styles={selectStyles}
                    formatOptionLabel={(option, { context }) => {
                      if (context === "value") {
                        return <span>{option.label}</span>;
                      }
                      return (
                        <div className="flex items-center gap-2 py-0.5">
                          <Users className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <span>{option.label}</span>
                          <span className="text-muted-foreground text-xs ml-auto">
                            {option.subLabel}
                          </span>
                        </div>
                      );
                    }}
                  />
                )}
              />
            </div>
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
