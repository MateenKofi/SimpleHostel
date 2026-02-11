"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { ArrowLeft, Loader2, ChevronLeft, ChevronRight, Eye, EyeOff, User, Phone, GraduationCap, Heart, Lock, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ResidentFormInputs = z.infer<typeof PublicResidentFormSchema>;

const ResidentForm = () => {
  const setResident = useAddedResidentStore((state) => state.setResident);
  const calendarYear = useSelectedCalendarYearStore((state) => state.calendarYear);
  const { room } = useSelectedRoomStore();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

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

      try {
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
      } catch (error) {
        throw error;
      }
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
    <div className="flex flex-col items-center justify-center p-6 min-h-svh bg-slate-50 dark:bg-zinc-950 md:p-10">
      <SEOHelmet
        title="Add Resident - Fuse"
        description="Add a new resident to the system."
        keywords="add resident, Fuse, hostel"
      />

      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 flex items-center px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>

      <div className="w-full max-w-lg md:max-w-xl">
        <Card className="w-full overflow-hidden border-none shadow-xl bg-white dark:bg-zinc-900">
          {/* Progress Bar */}
          <div className="h-2 bg-slate-100 dark:bg-zinc-800">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                <User size={32} />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">Resident Registration</CardTitle>
            <CardDescription className="text-base text-slate-500">
              {step === 0 && "Let's start with your basic information"}
              {step === 1 && "Tell us who to contact in case of emergency"}
              {step === 2 && "Review your information before submitting"}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-10 pt-4">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><User size={18} /></span>
                          <Input id="name" placeholder="John Doe" className="pl-10 h-11" {...register("name")} />
                        </div>
                        {errors.name && touchedFields.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={18} /></span>
                          <Input id="email" type="email" placeholder="john@example.com" className="pl-10 h-11" {...register("email")} />
                        </div>
                        {errors.email && touchedFields.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Phone size={18} /></span>
                          <Input id="phone" placeholder="024XXXXXXX" className="pl-10 h-11" {...register("phone")} />
                        </div>
                        {errors.phone && touchedFields.phone && <p className="text-xs text-red-500 font-medium">{errors.phone.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gender" className="text-sm font-medium">Gender</Label>
                        <Select
                          value={watch("gender")}
                          onValueChange={(val) => setValue("gender", val as "MALE" | "FEMALE", { shouldValidate: true })}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MALE">Male</SelectItem>
                            <SelectItem value="FEMALE">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.gender && touchedFields.gender && <p className="text-xs text-red-500 font-medium">{errors.gender.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="studentId" className="text-sm font-medium">Student ID</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><User size={18} className="opacity-50" /></span>
                          <Input id="studentId" placeholder="ID123456" className="pl-10 h-11" {...register("studentId")} />
                        </div>
                        {errors.studentId && touchedFields.studentId && <p className="text-xs text-red-500 font-medium">{errors.studentId.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="course" className="text-sm font-medium">Course</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><GraduationCap size={18} className="opacity-50" /></span>
                          <Input id="course" placeholder="Computer Science" className="pl-10 h-11" {...register("course")} />
                        </div>
                        {errors.course && touchedFields.course && <p className="text-xs text-red-500 font-medium">{errors.course.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={18} /></span>
                          <Input
                            id="password"
                            type={isPasswordVisible ? "text" : "password"}
                            placeholder="********"
                            className="pl-10 h-11 pr-10"
                            {...register("password")}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-3 flex items-center"
                            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                          >
                            {isPasswordVisible ? <EyeOff className="w-5 h-5 text-slate-400" /> : <Eye className="w-5 h-5 text-slate-400" />}
                          </button>
                        </div>
                        {errors.password && touchedFields.password && <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={18} /></span>
                          <Input
                            id="confirmPassword"
                            type={isConfirmPasswordVisible ? "text" : "password"}
                            placeholder="********"
                            className="pl-10 h-11 pr-10"
                            {...register("confirmPassword")}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-3 flex items-center"
                            onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                          >
                            {isConfirmPasswordVisible ? <EyeOff className="w-5 h-5 text-slate-400" /> : <Eye className="w-5 h-5 text-slate-400" />}
                          </button>
                        </div>
                        {errors.confirmPassword && touchedFields.confirmPassword && <p className="text-xs text-red-500 font-medium">{errors.confirmPassword.message}</p>}
                      </div>
                    </div>
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
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactName" className="text-sm font-medium">Emergency Contact Name</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Heart size={18} /></span>
                        <Input id="emergencyContactName" placeholder="Emergency contact full name" className="pl-10 h-11" {...register("emergencyContactName")} />
                      </div>
                      {errors.emergencyContactName && touchedFields.emergencyContactName && <p className="text-xs text-red-500 font-medium">{errors.emergencyContactName.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactPhone" className="text-sm font-medium">Emergency Contact Phone</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Phone size={18} /></span>
                        <Input id="emergencyContactPhone" placeholder="Emergency Contact Number" className="pl-10 h-11" {...register("emergencyContactPhone")} />
                      </div>
                      {errors.emergencyContactPhone && touchedFields.emergencyContactPhone && <p className="text-xs text-red-500 font-medium">{errors.emergencyContactPhone.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="relationship" className="text-sm font-medium">Relationship</Label>
                      <Input id="relationship" placeholder="e.g. Parent, Guardian" className="h-11" {...register("relationship")} />
                      {errors.relationship && touchedFields.relationship && <p className="text-xs text-red-500 font-medium">{errors.relationship.message}</p>}
                    </div>
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
                      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Personal Information</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-50 dark:bg-zinc-800 rounded-lg">
                          <p className="text-xs text-slate-500">Full Name</p>
                          <p className="font-medium text-sm">{watch("name")}</p>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-zinc-800 rounded-lg">
                          <p className="text-xs text-slate-500">Email</p>
                          <p className="font-medium text-sm">{watch("email")}</p>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-zinc-800 rounded-lg">
                          <p className="text-xs text-slate-500">Phone</p>
                          <p className="font-medium text-sm">{watch("phone")}</p>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-zinc-800 rounded-lg">
                          <p className="text-xs text-slate-500">Gender</p>
                          <p className="font-medium text-sm">{watch("gender")}</p>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-zinc-800 rounded-lg">
                          <p className="text-xs text-slate-500">Student ID</p>
                          <p className="font-medium text-sm">{watch("studentId")}</p>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-zinc-800 rounded-lg">
                          <p className="text-xs text-slate-500">Course</p>
                          <p className="font-medium text-sm">{watch("course")}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Emergency Contact</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-50 dark:bg-zinc-800 rounded-lg">
                          <p className="text-xs text-slate-500">Contact Name</p>
                          <p className="font-medium text-sm">{watch("emergencyContactName")}</p>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-zinc-800 rounded-lg">
                          <p className="text-xs text-slate-500">Contact Phone</p>
                          <p className="font-medium text-sm">{watch("emergencyContactPhone")}</p>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-zinc-800 rounded-lg col-span-2">
                          <p className="text-xs text-slate-500">Relationship</p>
                          <p className="font-medium text-sm">{watch("relationship")}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 border border-slate-200 dark:border-zinc-700 rounded-lg bg-slate-50 dark:bg-zinc-800">
                      <input
                        id="terms"
                        type="checkbox"
                        required
                        className="mt-0.5 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <div className="text-sm">
                        <label htmlFor="terms" className="font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                          I agree to the Hostel's Rules & Regulations
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">
                          By checking this, you acknowledge that you have read and will abide by the code of conduct.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8">
                {step > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-12 text-base font-semibold border-2"
                    onClick={prevStep}
                    disabled={AddResidentMutation.isPending}
                  >
                    <ChevronLeft className="mr-2 h-5 w-5" /> Back
                  </Button>
                )}
                {step < 2 ? (
                  <Button
                    type="button"
                    className="flex-1 h-12 text-base font-semibold shadow-lg shadow-primary/20"
                    onClick={nextStep}
                  >
                    Continue <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="flex-1 h-12 text-base font-semibold shadow-lg shadow-primary/20"
                    disabled={AddResidentMutation.isPending}
                  >
                    {AddResidentMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
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
