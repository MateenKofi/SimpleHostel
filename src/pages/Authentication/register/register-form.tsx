import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader } from "lucide-react";

const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "First name must be at least 2 characters." })
      .max(50, { message: "First name must be less than 50 characters." }),
    email: z.string().email({ message: "Enter a valid email address." }),
    phoneNumber: z
      .string()
      .min(10, { message: "Enter a valid phone number." })
      .max(20, { message: "Phone number is too long." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
        message: "Password must include letters and numbers.",
      }),
    confirmPassword: z.string().min(8, { message: "Confirm your password." }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  });

interface SignupFormData {
  name:string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm = ({ className, ...props }: React.ComponentProps<"div">) => {
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const registerResidentMutation = useMutation({
    mutationFn: async (formValues: SignupFormData) => {
      const payload = {
       name:formValues.name,
        email: formValues.email,
        password: formValues.password,
        phoneNumber: formValues.phoneNumber,
        role: "resident",
      };

      const response = await axios.post("/api/users/signup", payload);
      return response.data;
    },
  });

  const handleRegistration = async (values: SignupFormData) => {
    try {
      await registerResidentMutation.mutateAsync(values);
      toast.success("Account created successfully. Please log in.");
      reset();
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "Failed to create account.";
        toast.error(errorMessage);
        return;
      }
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-svh bg-muted md:p-10">
      <div className="w-full max-w-sm md:max-w-md">
        <div className={cn("w-full flex flex-col items-center gap-6", className)} {...props}>
          <Card className="w-full overflow-hidden border">
            <CardHeader className="text-center">
              <img src="/logo.png" alt="Fuse" className="object-cover w-20 h-20 mx-auto" />
              <CardTitle className="text-2xl">Create a resident account</CardTitle>
              <CardDescription>Join Fuse to manage your hostel experience.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 px-6 pb-8">
              <form className="space-y-4" onSubmit={handleSubmit(handleRegistration)}>
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter full name here" {...register("name")} />
                  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="jane@example.com" {...register("email")} />
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input id="phoneNumber" type="tel" placeholder="08012345678" {...register("phoneNumber")} />
                  {errors.phoneNumber && (
                    <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="********"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                      {isPasswordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={isConfirmPasswordVisible ? "text" : "password"}
                      placeholder="********"
                      {...register("confirmPassword")}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                    >
                      {isConfirmPasswordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={registerResidentMutation.isPending}>
                  {registerResidentMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <Loader className="w-4 h-4 animate-spin" /> Creating account...
                    </span>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </form>

              <p className="text-xs text-center text-muted-foreground">
                Already have an account? <Link className="underline" to="/login">Log in</Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
