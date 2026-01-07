import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { registerResident } from "@/api/residents";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Eye,
  EyeOff,
  Loader,
  User,
  Phone,
  Mail,
  Lock,
  Heart,
  ChevronRight,
  ChevronLeft,
  GraduationCap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { registrationSchema, type RegistrationFormValues } from "@/schemas/registrationSchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

const RegisterForm = ({ className, ...props }: React.ComponentProps<"div">) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    trigger,
    setValue,
    watch,
    reset,
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    mode: "onBlur",
  });

  const registerMutation = useMutation({
    mutationFn: async (values: RegistrationFormValues) => {
      // Consolidate name if needed (though we now use a single name field)
      // Omit confirmPassword before sending
      const { confirmPassword, ...payload } = values;
      return await registerResident(payload);
    },
    onSuccess: () => {
      toast.success("Registration successful! Please log in.");
      reset();
      navigate("/login");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
    }
  });

  const nextStep = async () => {
    let fieldsToValidate: (keyof RegistrationFormValues)[] = [];
    if (step === 0) {
      fieldsToValidate = ["name", "email", "phone", "gender", "studentId", "course"];
    } else if (step === 1) {
      fieldsToValidate = ["emergencyContactName", "emergencyContactPhone", "emergencyContactRelationship"];
    }

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const onSubmit = (values: RegistrationFormValues) => {
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
                            onValueChange={(val) => setValue("gender", val as any, { shouldValidate: true })}
                          >
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.gender && touchedFields.gender && <p className="text-xs text-red-500 font-medium">{errors.gender.message}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="studentId" className="text-sm font-medium text-slate-500">Student ID (Optional)</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><User size={18} className="opacity-50" /></span>
                            <Input id="studentId" placeholder="ID123456" className="pl-10 h-11" {...register("studentId")} />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="course" className="text-sm font-medium text-slate-500">Course (Optional)</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><GraduationCap size={18} className="opacity-50" /></span>
                            <Input id="course" placeholder="Computer Science" className="pl-10 h-11" {...register("course")} />
                          </div>
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
                        <Label htmlFor="emergencyContactRelationship" className="text-sm font-medium text-slate-500">Relationship (Optional)</Label>
                        <Input id="emergencyContactRelationship" placeholder="e.g. Parent, Guardian" className="h-11" {...register("emergencyContactRelationship")} />
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
