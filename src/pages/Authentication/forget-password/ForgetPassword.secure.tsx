/**
 * SECURE Forget Password Page
 * Uses token-based password reset instead of emailing passwords
 */

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TextInput } from "@/components/form";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader, Mail, CheckCircle2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { requestPasswordReset } from "@/api/auth.secure";
import { toast } from "sonner";
import type { ApiError } from "@/types/dtos";

type ForgetPasswordFormData = {
  email: string;
};

const ForgetPasswordSecure = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetPasswordFormData>();
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);
  const [sentToEmail, setSentToEmail] = useState("");

  const forgetPasswordMutation = useMutation({
    mutationFn: async (data: { email: string }) => {
      try {
        const result = await requestPasswordReset(data);

        // Show success regardless of whether email exists
        // (prevents user enumeration)
        setEmailSent(true);
        setSentToEmail(data.email);

        toast.success(
          "If an account exists with this email, a password reset link has been sent."
        );

        return result;
      } catch (error: unknown) {
        const err = error as ApiError;
        const errorMessage =
          err.response?.data?.message || "Failed to request password reset";
        toast.error(errorMessage);
        throw error;
      }
    },
  });

  const onSubmit = async (data: ForgetPasswordFormData) => {
    await forgetPasswordMutation.mutateAsync(data);
  };

  // Success state UI
  if (emailSent) {
    return (
      <div className="flex flex-col items-center justify-center p-6 min-h-svh bg-muted md:p-10">
        <div className="w-full max-w-sm md:max-w-md">
          <Card className="w-full overflow-hidden border">
            <CardContent className="grid p-0">
              <div className="p-6 md:p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold mb-2">Check Your Email</h1>
                <p className="text-muted-foreground mb-6">
                  We've sent a password reset link to{" "}
                  <span className="font-medium">{sentToEmail}</span>
                </p>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <p>
                    The link will expire in 1 hour for your security.
                  </p>
                  <p>
                    Didn't receive the email? Check your spam folder or{" "}
                    <button
                      onClick={() => {
                        setEmailSent(false);
                        forgetPasswordMutation.reset();
                      }}
                      className="text-primary hover:underline"
                    >
                      try again
                    </button>
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-6"
                  onClick={() => navigate("/login")}
                >
                  Back to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Form state UI
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
                    <div className="relative mb-4">
                      <img
                        src="/logo.png"
                        alt="Fuse"
                        className="object-cover h-20 w-22"
                      />
                    </div>
                    <h1 className="text-2xl font-bold">Forgot Password?</h1>
                    <p className="text-balance text-muted-foreground">
                      Enter your email to receive a secure password reset link
                    </p>
                  </div>

                  <TextInput
                    label="Email Address"
                    type="email"
                    placeholder="example@gmail.com"
                    leftIcon={Mail}
                    error={errors.email?.message}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={forgetPasswordMutation.isPending}
                  >
                    {forgetPasswordMutation.isPending ? (
                      <>
                        <Loader className="animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
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

          <div className="text-balance text-center text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <a href="/terms-and-conditions" className="underline hover:text-foreground">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy-policy" className="underline hover:text-foreground">
              Privacy Policy
            </a>
            .
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordSecure;
