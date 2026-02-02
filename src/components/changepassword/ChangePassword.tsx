import { useMutation } from "@tanstack/react-query";
import { updateUser } from "@/api/users";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

const ChangePassword = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const resetPasswordForm = useForm<ResetPasswordFormValues>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: { password: string }) => {
      try {
        await updateUser(userId!, { password: data.password });
        toast.success("Password updated successfully");
        navigate('/login');
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Failed to Update Password";
        toast.error(errorMessage);
        throw error;
      }
    },
  });

  const handleResetPassword: SubmitHandler<ResetPasswordFormValues> = (
    formData
  ) => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    resetPasswordMutation.mutate({ password: formData.password });
  };

  return (
    <div className="grid w-full h-screen place-items-center">
      <div className="max-w-xl p-4 mx-auto border rounded-md min-w-[600px]">
        <h2 className="mb-6 text-lg font-semibold text-gray-500">Change Password</h2>
        <form onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="text-gray-500">New Password</label>
            <Input
              id="password"
              type="password"
              className="text-gray-500"
              {...resetPasswordForm.register("password", {
                required: "Password is required",
              })}
            />
            {resetPasswordForm.formState.errors.password && (
              <p className="text-sm text-red-600">
                {resetPasswordForm.formState.errors.password?.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-gray-500">Confirm New Password</label>
            <Input
              id="confirmPassword"
              type="password"
              className="text-gray-500"
              {...resetPasswordForm.register("confirmPassword", {
                required: "Please confirm your password",
              })}
            />
            {resetPasswordForm.formState.errors.confirmPassword && (
              <p className="text-sm text-red-600">
                {resetPasswordForm.formState.errors.confirmPassword?.message}
              </p>
            )}
          </div>
          <Button className="w-full mt-4" type="submit">
            {resetPasswordMutation.isPending ? (
              <Loader className="animate-spin" />
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
