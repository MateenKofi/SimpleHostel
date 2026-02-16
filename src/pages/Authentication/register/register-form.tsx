import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { registerResident } from "@/api/residents";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { ApiError } from "@/types/dtos";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Loader,
  User,
  Phone,
  Mail,
  Heart,
  ChevronRight,
  ChevronLeft,
  GraduationCap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { registrationSchema, type RegistrationFormValues } from "@/schemas/registrationSchema";
import { TextInput, SelectInput, PasswordInput } from "@/components/form";

const RegisterForm = ({ className, ...props }: React.ComponentProps<"div">) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [stepSubmitted, setStepSubmitted] = useState<Set<number>>(new Set());

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
    watch,
    reset,
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    mode: "onChange",
  });

  const registerMutation = useMutation({
    mutationFn: async (values: RegistrationFormValues) => {
      // Omit confirmPassword before sending
      const { ...payload } = values;
      return await registerResident(payload);
    },
    onSuccess: () => {
      toast.success("Registration successful! Please log in.");
      reset();
      navigate("/login");
    },
    onError: (error: ApiError) => {
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
    }
  });

  const nextStep = async () => {
    // Mark current step as submitted so errors show if validation fails
    setStepSubmitted((prev) => new Set(prev).add(step));

    let fieldsToValidate: (keyof RegistrationFormValues)[] = [];
    if (step === 0) {
      fieldsToValidate = ["name", "email", "phone", "gender", "studentId", "course"];
    } else if (step === 1) {
      fieldsToValidate = ["emergencyContactName", "emergencyContactPhone", "emergencyContactRelationship"];
    }

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setStep((s) => s + 1);
    }
  };

  const prevStep = () => setStep((s) => s - 1);

  const onSubmit = (values: RegistrationFormValues) => {
    // Mark step 2 as submitted so errors show if validation fails
    setStepSubmitted((prev) => new Set(prev).add(2));
    registerMutation.mutate(values);
  };

  const progress = ((step + 1) / 3) * 100;

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-svh bg-slate-50 dark:bg-zinc-950 md:p-10">
      <div className="w-full max-w-lg md:max-w-xl">
        <div className={cn("w-full flex flex-col items-center gap-6", className)} {...props}>
          <Card className="w-full overflow-hidden border-none shadow-xl bg-white dark:bg-zinc-900">
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
                {step === 2 && "Secure your account with a strong password"}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-10 pt-4">
              <form onSubmit={handleSubmit(onSubmit)}>
                <AnimatePresence mode="wait">
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
                          <TextInput
                            id="name"
                            label="Full Name"
                            placeholder="John Doe"
                            leftIcon={User}
                            error={stepSubmitted.has(step) ? errors.name?.message : undefined}
                            {...register("name")}
                          />
                        </div>

                        <div className="space-y-2">
                          <TextInput
                            id="email"
                            type="email"
                            label="Email Address"
                            placeholder="john@example.com"
                            leftIcon={Mail}
                            error={stepSubmitted.has(step) ? errors.email?.message : undefined}
                            {...register("email")}
                          />
                        </div>

                        <div className="space-y-2">
                          <TextInput
                            id="phone"
                            label="Phone Number"
                            placeholder="024XXXXXXX"
                            leftIcon={Phone}
                            error={stepSubmitted.has(step) ? errors.phone?.message : undefined}
                            {...register("phone")}
                          />
                        </div>

                        <div className="space-y-2">
                          <SelectInput
                            label="Gender"
                            placeholder="Select gender"
                            options={[
                              { label: "Male", value: "male" },
                              { label: "Female", value: "female" },
                              { label: "Other", value: "other" },
                            ]}
                            value={watch("gender")}
                            onValueChange={(val) => setValue("gender", val as "male" | "female" | "other", { shouldValidate: true })}
                            error={stepSubmitted.has(step) ? errors.gender?.message : undefined}
                          />
                        </div>

                        <div className="space-y-2">
                          <TextInput
                            id="studentId"
                            label="Student ID (Optional)"
                            placeholder="ID123456"
                            leftIcon={User}
                            {...register("studentId")}
                          />
                        </div>

                        <div className="space-y-2">
                          <TextInput
                            id="course"
                            label="Course (Optional)"
                            placeholder="Computer Science"
                            leftIcon={GraduationCap}
                            {...register("course")}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

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
                        <TextInput
                          id="emergencyContactName"
                          label="Emergency Contact Name"
                          placeholder="Emergency contact full name"
                          leftIcon={Heart}
                          error={stepSubmitted.has(step) ? errors.emergencyContactName?.message : undefined}
                          {...register("emergencyContactName")}
                        />
                      </div>

                      <div className="space-y-2">
                        <TextInput
                          id="emergencyContactPhone"
                          label="Emergency Contact Phone"
                          placeholder="Emergency Contact Number"
                          leftIcon={Phone}
                          error={stepSubmitted.has(step) ? errors.emergencyContactPhone?.message : undefined}
                          {...register("emergencyContactPhone")}
                        />
                      </div>

                      <div className="space-y-2">
                        <TextInput
                          id="emergencyContactRelationship"
                          label="Relationship (Optional)"
                          placeholder="e.g. Parent, Guardian"
                          {...register("emergencyContactRelationship")}
                        />
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <PasswordInput
                          id="password"
                          label="Password"
                          placeholder="********"
                          error={stepSubmitted.has(step) ? errors.password?.message : undefined}
                          {...register("password")}
                        />
                      </div>

                      <div className="space-y-2">
                        <PasswordInput
                          id="confirmPassword"
                          label="Confirm Password"
                          placeholder="********"
                          error={stepSubmitted.has(step) ? errors.confirmPassword?.message : undefined}
                          {...register("confirmPassword")}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-4 mt-8">
                  {step > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 h-12 text-base font-semibold border-2"
                      onClick={prevStep}
                      disabled={registerMutation.isPending}
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
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader className="mr-2 h-5 w-5 animate-spin" /> Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  )}
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-zinc-800 text-center">
                <p className="text-sm text-slate-500">
                  Already have an account?{" "}
                  <Link to="/login" className="font-bold text-primary hover:underline">
                    Log in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
