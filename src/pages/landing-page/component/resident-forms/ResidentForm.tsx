"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { ArrowLeft, ChevronLeft, ChevronRight, User, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useSelectedRoomStore } from "@/stores/useSelectedRoomStore";
import { useMutation } from "@tanstack/react-query";
import { registerResident } from "@/api/residents";
import { PublicResidentFormSchema } from "@/schemas/ResidentForm.schema";
import { z } from "zod";
import { useSelectedCalendarYearStore } from "@/stores/useSelectedCalendarYearStore";
import { useAddedResidentStore } from "@/stores/useAddedResidentStore";
import type { ApiError } from "@/types/dtos";
import SEOHelmet from "@/components/SEOHelmet";
import {
  TextInput,
  PasswordInput,
  SelectInput,
  FormButton,
} from "@/components/form";

type ResidentFormInputs = z.infer<typeof PublicResidentFormSchema>;

const ResidentForm = () => {
  const setResident = useAddedResidentStore((state) => state.setResident);
  const calendarYear = useSelectedCalendarYearStore((state) => state.calendarYear);
  const { room } = useSelectedRoomStore();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    trigger,
    setValue,
    watch,
    reset,
  } = useForm<ResidentFormInputs>({
    resolver: zodResolver(PublicResidentFormSchema),
    mode: "onBlur",
  });

  const AddResidentMutation = useMutation({
    mutationFn: async (resident_data: ResidentFormInputs) => {
      const formData = new FormData();
      formData.append("name", resident_data.name);
      formData.append("studentId", resident_data.studentId ?? "");
      formData.append("course", resident_data.course ?? "");
      formData.append("phone", resident_data.phone || "");
      formData.append("email", resident_data.email);
      formData.append("password", resident_data.password);
      formData.append("emergencyContactName", resident_data.emergencyContactName);
      formData.append("emergencyContactPhone", resident_data.emergencyContactPhone || "");
      formData.append("relationship", resident_data.relationship);
      formData.append("gender", resident_data.gender.toUpperCase());
      formData.append("hostelId", room?.hostelId || "");
      formData.append("calendarYearId", calendarYear?.id || "");
      formData.append("roomId", room?.id || "");

      const responseData = await registerResident(formData);
      reset();
      setResident(responseData?.data);
      setTimeout(() => {
        if (room?.id) {
          navigate("/payment");
        } else {
          toast.success("Registration successful! Please login to continue.");
          navigate("/login");
        }
      }, 50);
      return responseData;
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || "Failed to Add Resident";
      toast.error(errorMessage);
    }
  });

  const nextStep = async () => {
    let fieldsToValidate: (keyof ResidentFormInputs)[] = [];
    if (step === 0) {
      fieldsToValidate = ["name", "email", "phone", "gender", "studentId", "course", "password", "confirmPassword"];
    } else if (step === 1) {
      fieldsToValidate = ["emergencyContactName", "emergencyContactPhone", "relationship"];
    }

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const onSubmit: SubmitHandler<ResidentFormInputs> = (values) => {
    if (room && room.gender !== values.gender) {
      toast.error("Gender does not match selected room gender");
      toast.error("Make sure you select room according to your gender");
      return;
    }
    AddResidentMutation.mutate(values);
  };

  const progress = ((step + 1) / 3) * 100;

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-6 min-h-svh bg-slate-50 dark:bg-zinc-950">
      <SEOHelmet
        title="Add Resident - Best Suit"
        description="Add a new resident to the system."
        keywords="add resident, Best Suit, hostel"
      />

      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center px-3 py-2 md:px-4 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        <span className="hidden sm:inline">Back</span>
      </button>

      <div className="w-full max-w-lg md:max-w-xl">
        <Card className="w-full overflow-hidden border-none shadow-xl bg-card">
          {/* Progress Bar */}
          <div className="h-2 bg-muted">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <CardHeader className="text-center pb-2 px-4 md:px-8 pt-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                <User size={28} />
              </div>
            </div>
            <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight">Resident Registration</CardTitle>
            <CardDescription className="text-sm md:text-base text-muted-foreground">
              {step === 0 && "Let's start with your basic information"}
              {step === 1 && "Tell us who to contact in case of emergency"}
              {step === 2 && "Review your information before submitting"}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-4 md:px-8 pb-6 md:pb-10 pt-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                {/* Step 1: Personal Information */}
                {step === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <TextInput
                      label="Full Name"
                      placeholder="John Doe"
                      leftIcon={User}
                      error={touchedFields.name ? errors.name?.message : undefined}
                      {...register("name")}
                    />

                    <TextInput
                      label="Email Address"
                      type="email"
                      placeholder="john@example.com"
                      error={touchedFields.email ? errors.email?.message : undefined}
                      {...register("email")}
                    />

                    <TextInput
                      label="Phone Number"
                      placeholder="024XXXXXXX"
                      error={touchedFields.phone ? errors.phone?.message : undefined}
                      {...register("phone")}
                    />

                    <SelectInput
                      label="Gender"
                      placeholder="Select gender"
                      options={[
                        { value: "MALE", label: "Male" },
                        { value: "FEMALE", label: "Female" },
                      ]}
                      value={watch("gender")}
                      onValueChange={(val) => setValue("gender", val as "MALE" | "FEMALE", { shouldValidate: true })}
                      error={touchedFields.gender ? errors.gender?.message : undefined}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextInput
                        label="Student ID"
                        placeholder="ID123456"
                        error={touchedFields.studentId ? errors.studentId?.message : undefined}
                        {...register("studentId")}
                      />

                      <TextInput
                        label="Course"
                        placeholder="Computer Science"
                        error={touchedFields.course ? errors.course?.message : undefined}
                        {...register("course")}
                      />
                    </div>

                    <PasswordInput
                      label="Password"
                      placeholder="********"
                      error={touchedFields.password ? errors.password?.message : undefined}
                      {...register("password")}
                    />

                    <PasswordInput
                      label="Confirm Password"
                      placeholder="********"
                      error={touchedFields.confirmPassword ? errors.confirmPassword?.message : undefined}
                      {...register("confirmPassword")}
                    />
                  </motion.div>
                )}

                {/* Step 2: Emergency Contact */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <TextInput
                      label="Emergency Contact Name"
                      placeholder="Emergency contact full name"
                      leftIcon={Heart}
                      error={touchedFields.emergencyContactName ? errors.emergencyContactName?.message : undefined}
                      {...register("emergencyContactName")}
                    />

                    <TextInput
                      label="Emergency Contact Phone"
                      placeholder="Emergency Contact Number"
                      error={touchedFields.emergencyContactPhone ? errors.emergencyContactPhone?.message : undefined}
                      {...register("emergencyContactPhone")}
                    />

                    <TextInput
                      label="Relationship"
                      placeholder="e.g. Parent, Guardian"
                      error={touchedFields.relationship ? errors.relationship?.message : undefined}
                      {...register("relationship")}
                    />
                  </motion.div>
                )}

                {/* Step 3: Review & Submit */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Personal Information</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground">Full Name</p>
                          <p className="font-medium text-sm">{watch("name")}</p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground">Email</p>
                          <p className="font-medium text-sm">{watch("email")}</p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground">Phone</p>
                          <p className="font-medium text-sm">{watch("phone")}</p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground">Gender</p>
                          <p className="font-medium text-sm">{watch("gender")}</p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground">Student ID</p>
                          <p className="font-medium text-sm">{watch("studentId")}</p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground">Course</p>
                          <p className="font-medium text-sm">{watch("course")}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Emergency Contact</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground">Contact Name</p>
                          <p className="font-medium text-sm">{watch("emergencyContactName")}</p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground">Contact Phone</p>
                          <p className="font-medium text-sm">{watch("emergencyContactPhone")}</p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg col-span-2">
                          <p className="text-xs text-muted-foreground">Relationship</p>
                          <p className="font-medium text-sm">{watch("relationship")}</p>
                        </div>
                      </div>
                    </div>

                    <label className="flex items-start space-x-3 p-4 border border-border rounded-lg bg-muted cursor-pointer">
                      <input
                        id="terms"
                        type="checkbox"
                        required
                        className="mt-0.5 w-4 h-4 text-primary border-input rounded focus:ring-primary"
                      />
                      <div className="text-sm">
                        <span className="font-medium text-foreground">
                          I agree to the Hostel's Rules & Regulations
                        </span>
                        <p className="text-muted-foreground">
                          By checking this, you acknowledge that you have read and will abide by the code of conduct.
                        </p>
                      </div>
                    </label>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex gap-3 md:gap-4 mt-6 md:mt-8">
                {step > 0 && (
                  <FormButton
                    type="button"
                    variant="outline"
                    className="flex-1 h-11 md:h-12 text-sm md:text-base font-semibold border-2"
                    onClick={prevStep}
                    disabled={AddResidentMutation.isPending}
                  >
                    <ChevronLeft className="mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5" /> <span className="hidden sm:inline">Back</span>
                  </FormButton>
                )}
                {step < 2 ? (
                  <FormButton
                    type="button"
                    className="flex-1 h-11 md:h-12 text-sm md:text-base font-semibold"
                    onClick={nextStep}
                  >
                    Continue <ChevronRight className="ml-1 md:ml-2 h-4 w-4 md:h-5 md:w-5" />
                  </FormButton>
                ) : (
                  <FormButton
                    type="submit"
                    className="flex-1 h-11 md:h-12 text-sm md:text-base font-semibold"
                    loading={AddResidentMutation.isPending}
                    loadingText="Creating Account..."
                  >
                    Create Account
                  </FormButton>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResidentForm;
