/**
 * SECURE Password Reset Page
 * Handles the token-based password reset confirmation
 * Access via: /reset-password?token=xxx
 */

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader, Eye, EyeOff, Lock, ShieldCheck, AlertCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { confirmPasswordReset, validateResetToken } from "@/api/auth.secure";
import { toast } from "sonner";
import type { ApiError } from "@/types/dtos";

type ResetPasswordFormData = {
  newPassword: string;
  confirmPassword: string;
};

// Password strength indicator
const PasswordStrength = ({ password }: { password: string }) => {
  const [strength, setStrength] = useState(0);
  const [label, setLabel] = useState("");
  const [color, setColor] = useState("");

  useEffect(() => {
    if (!password) {
      setStrength(0);
      setLabel("");
      setColor("");
      return;
    }

    let score = 0;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    setStrength(score);

    const labels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
    const colors = [
      "",
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-green-500",
      "bg-emerald-600",
    ];

    setLabel(labels[score]);
    setColor(colors[score]);
  }, [password]);

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i <= strength ? color : "bg-gray-200 dark:bg-gray-700"
            )}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Password strength: <span className={cn("font-medium", strength >= 4 ? "text-green-600" : "")}>{label}</span>
      </p>
    </div>
  );
};

const ResetPasswordSecure = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>();

  const newPassword = watch("newPassword", "");

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      toast.error("Invalid reset link. Please request a new one.");
      return;
    }

    validateResetToken(token)
      .then((response) => {
        setTokenValid(response.data.valid);
        if (!response.data.valid) {
          toast.error("This reset link has expired or is invalid.");
        }
      })
      .catch(() => {
        setTokenValid(false);
        toast.error("Invalid reset link. Please request a new one.");
      });
  }, [token]);

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordFormData) => {
      try {
        await confirmPasswordReset({
          token: token!,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        });

        toast.success("Password reset successfully! Please log in with your new password.");

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (error: unknown) {
        const err = error as ApiError;
        const errorMessage =
          err.response?.data?.message || "Failed to reset password";
        toast.error(errorMessage);
        throw error;
      }
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    await resetPasswordMutation.mutateAsync(data);
  };

  // Loading state while validating token
  if (tokenValid === null) {
    return (
      <div className="flex flex-col items-center justify-center p-6 min-h-svh bg-muted md:p-10">
        <Card className="w-full max-w-sm md:max-w-md">
          <CardContent className="p-8 text-center">
            <Loader className="animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Validating reset link...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Invalid token state
  if (tokenValid === false) {
    return (
      <div className="flex flex-col items-center justify-center p-6 min-h-svh bg-muted md:p-10">
        <Card className="w-full max-w-sm md:max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-xl font-bold mb-2">Invalid or Expired Link</h1>
            <p className="text-muted-foreground mb-6">
              This password reset link is no longer valid. It may have expired already.
            </p>
            <div className="space-y-2">
              <Button onClick={() => navigate("/forget-password")} className="w-full">
                Request New Reset Link
              </Button>
              <Button variant="outline" onClick={() => navigate("/login")} className="w-full">
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Reset form
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-svh bg-muted md:p-10">
      <div className="w-full max-w-sm md:max-w-md">
        <div className={cn("w-full flex flex-col items-center gap-6")}>
          <Card className="w-full overflow-hidden border">
            <CardContent className="grid p-0">
              <form
                className="p-6 md:p-8"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <ShieldCheck className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">Create New Password</h1>
                    <p className="text-balance text-muted-foreground">
                      Enter your new password below
                    </p>
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                    <p className="font-medium">Password requirements:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li className={cn(newPassword.length >= 12 ? "text-green-600" : "")}>
                        • At least 12 characters
                      </li>
                      <li className={cn(/[A-Z]/.test(newPassword) ? "text-green-600" : "")}>
                        • Uppercase and lowercase letters
                      </li>
                      <li className={cn(/\d/.test(newPassword) ? "text-green-600" : "")}>
                        • At least one number
                      </li>
                      <li className={cn(/[^a-zA-Z0-9]/.test(newPassword) ? "text-green-600" : "")}>
                        • At least one special character
                      </li>
                    </ul>
                  </div>

                  {/* New Password */}
                  <div className="grid gap-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        {...register("newPassword", {
                          required: "New password is required",
                          minLength: {
                            value: 12,
                            message: "Password must be at least 12 characters",
                          },
                          validate: {
                            hasUpper: (v) =>
                              /[A-Z]/.test(v) ||
                              "Must contain at least one uppercase letter",
                            hasLower: (v) =>
                              /[a-z]/.test(v) ||
                              "Must contain at least one lowercase letter",
                            hasNumber: (v) =>
                              /\d/.test(v) ||
                              "Must contain at least one number",
                            hasSpecial: (v) =>
                              /[^a-zA-Z0-9]/.test(v) ||
                              "Must contain at least one special character",
                          },
                        })}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="text-sm text-destructive">{errors.newPassword.message}</p>
                    )}
                    <PasswordStrength password={newPassword} />
                  </div>

                  {/* Confirm Password */}
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        {...register("confirmPassword", {
                          required: "Please confirm your password",
                          validate: (value) =>
                            value === newPassword || "Passwords do not match",
                        })}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={resetPasswordMutation.isPending}
                  >
                    {resetPasswordMutation.isPending ? (
                      <>
                        <Loader className="animate-spin mr-2" />
                        Resetting...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      ← Back to Login
                    </button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordSecure;
