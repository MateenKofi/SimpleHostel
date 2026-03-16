import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { registerResident } from "@/api/residents";
import { verifyReservationCode, claimReservation } from "@/api/reservations";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { ApiError, ReservationDto } from "@/types/dtos";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader,
  User,
  Phone,
  Mail,
  Heart,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Ticket,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { registrationSchema, type RegistrationFormValues } from "@/schemas/registrationSchema";
import { TextInput, SelectInput, PasswordInput, EmailInput } from "@/components/form";
import { PasswordStrengthIndicator } from "@/components/form/PasswordStrengthIndicator";

const RegisterForm = ({ className, ...props }: React.ComponentProps<"div">) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [stepSubmitted, setStepSubmitted] = useState<Set<number>>(new Set());

  // Reservation code handling
  const [reservationCode, setReservationCode] = useState("");
  const [reservationData, setReservationData] = useState<ReservationDto | null>(null);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    trigger,
    setValue,
    watch,
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    mode: "onBlur",
  });

  const registerMutation = useMutation({
    mutationFn: async (values: RegistrationFormValues) => {
      // Omit confirmPassword before sending
      const { confirmPassword, ...payload } = values;
      const registrationResponse = await registerResident(payload);

      // If reservation code exists, claim it
      if (reservationCode && reservationData) {
        try {
          await claimReservation({ secretCode: reservationCode, residentId: registrationResponse.data.id });
          toast.success("Reservation claimed successfully!");
        } catch (error) {
          console.error("Failed to claim reservation:", error);
          toast.error("Registration successful but failed to claim reservation. Please contact support.");
        }
      }

      return registrationResponse;
    },
    onSuccess: () => {
      toast.success("Registration successful! Please log in.");
      // Navigate first, don't reset to avoid flicker
      navigate("/login");
    },
    onError: (error: ApiError) => {
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
    }
  });

  const handleVerifyReservationCode = async () => {
    if (!reservationCode.trim()) {
      toast.error("Please enter a reservation code");
      return;
    }

    setIsVerifyingCode(true);
    try {
      const response = await verifyReservationCode(reservationCode.trim());
      setReservationData(response.data);

      // Pre-fill form with reservation data
      if (response.data.name) setValue("name", response.data.name);
      if (response.data.email) setValue("email", response.data.email);
      if (response.data.phone) setValue("phone", response.data.phone);

      toast.success("Reservation verified! Your details have been pre-filled.");
    } catch (error: unknown) {
      const errorMessage = (error as ApiError)?.response?.data?.message || "Invalid reservation code";
      toast.error(errorMessage);
      setReservationData(null);
    } finally {
      setIsVerifyingCode(false);
    }
  };

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

  const onFormError = (errors: any) => {
    // Determine which step has the first error and switch to it
    const errorFields = Object.keys(errors);

    const step0Fields = ["name", "email", "phone", "gender", "studentId", "course"];
    const step1Fields = ["emergencyContactName", "emergencyContactPhone", "emergencyContactRelationship"];
    const step2Fields = ["password", "confirmPassword"];

    if (errorFields.some(f => step0Fields.includes(f))) {
      setStep(0);
    } else if (errorFields.some(f => step1Fields.includes(f))) {
      setStep(1);
    } else if (errorFields.some(f => step2Fields.includes(f))) {
      setStep(2);
    }

    toast.error("Please fix the errors in the form.");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent form submission on Enter unless we are on the final step
    if (e.key === "Enter") {
      if (step < 2) {
        e.preventDefault();
        nextStep();
      }
    }
  };

  const onSubmit = (values: RegistrationFormValues) => {
    registerMutation.mutate(values);
  };

  const progress = ((step + 1) / 3) * 100;

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-svh bg-slate-50 dark:bg-zinc-950 md:p-10">
      <div className="w-full max-w-lg md:max-w-xl">
        <div className={cn("w-full flex flex-col items-center gap-6", className)} {...props}>
          {/* Reservation Code Card */}
          <Card className="w-full border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Ticket className="w-5 h-5 text-primary" />
                <Label htmlFor="reservation-code" className="text-sm font-semibold">
                  Have a Reservation Code?
                </Label>
              </div>
              <div className="flex gap-2">
                <Input
                  id="reservation-code"
                  placeholder="e.g., RES-AB12CD34"
                  value={reservationCode}
                  onChange={(e) => {
                    setReservationCode(e.target.value.toUpperCase());
                    // Clear reservation data if code changes
                    if (reservationData) setReservationData(null);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                  disabled={isVerifyingCode || registerMutation.isPending}
                  className="flex-1 font-mono tracking-widest"
                  maxLength={20}
                />
                <Button
                  onClick={handleVerifyReservationCode}
                  disabled={isVerifyingCode || !reservationCode || registerMutation.isPending}
                  variant="outline"
                  size="default"
                  type="button"
                >
                  {isVerifyingCode ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    "Verify"
                  )}
                </Button>
              </div>
              {reservationData && (
                <Alert className="mt-3 bg-emerald-50 border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <AlertDescription className="text-emerald-900 text-sm">
                    Reservation verified! Room: <strong>{reservationData.room?.number}</strong>
                    {reservationData.calendarYear?.name && (
                      <> ({reservationData.calendarYear.name})</>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

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
              <form onSubmit={handleSubmit(onSubmit, onFormError)} onKeyDown={handleKeyDown}>
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
                            error={(stepSubmitted.has(step) || isSubmitted) ? errors.name?.message : undefined}
                            {...register("name")}
                          />
                        </div>

                        <div className="space-y-2">
                          <EmailInput
                            id="email"
                            label="Email Address"
                            placeholder="example@email.com"
                            leftIcon={Mail}
                            error={(stepSubmitted.has(step) || isSubmitted) ? errors.email?.message : undefined}
                            {...register("email")}
                          />
                        </div>

                        <div className="space-y-2">
                          <TextInput
                            id="phone"
                            label="Phone Number"
                            placeholder="024XXXXXXX"
                            leftIcon={Phone}
                            error={(stepSubmitted.has(step) || isSubmitted) ? errors.phone?.message : undefined}
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
                            error={(stepSubmitted.has(step) || isSubmitted) ? errors.gender?.message : undefined}
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
                          error={(stepSubmitted.has(step) || isSubmitted) ? errors.emergencyContactName?.message : undefined}
                          {...register("emergencyContactName")}
                        />
                      </div>

                      <div className="space-y-2">
                        <TextInput
                          id="emergencyContactPhone"
                          label="Emergency Contact Phone"
                          placeholder="Emergency Contact Number"
                          leftIcon={Phone}
                          error={(stepSubmitted.has(step) || isSubmitted) ? errors.emergencyContactPhone?.message : undefined}
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
                          error={(stepSubmitted.has(step) || isSubmitted) ? errors.password?.message : undefined}
                          {...register("password")}
                        />
                        <PasswordStrengthIndicator password={watch("password") || ""} />
                      </div>

                      <div className="space-y-2">
                        <PasswordInput
                          id="confirmPassword"
                          label="Confirm Password"
                          placeholder="********"
                          error={(stepSubmitted.has(step) || isSubmitted) ? errors.confirmPassword?.message : undefined}
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
