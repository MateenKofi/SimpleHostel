import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Modal from "../Modal";
import { Loader } from "lucide-react";
import { Button } from "react-day-picker";
import { Input } from "../ui/input";

interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

const ChangePassword = () => {
    const userId = localStorage.getItem("userId");
  const resetPasswordForm = useForm<ResetPasswordFormValues>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const resetPasswordMutation = useMutation({
    mutationFn: async (data: { password: string }) => {
      const response = await axios.put(
        `/api/users/update/${userId}`,
        { password: data.password },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response?.data;
    },
    onSuccess: () => {
      toast.success("Password Updated Successfully");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage =
        error.response?.data?.message || "Failed to Update Password";
      toast.error(errorMessage);
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
    <Modal modalId="change_password" onClose={() => {}}>
      <h2 className="mb-6 text-lg font-semibold">Reset Password</h2>
      <form onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)}>
        <div className="space-y-2">
          <label htmlFor="password">New Password</label>
          <Input
            id="password"
            type="password"
            {...resetPasswordForm.register("password", {
              required: "Password is required",
            })}
          />
          {resetPasswordForm.formState.errors.password && (
            <p className="text-red-600 text-sm">
              {resetPasswordForm.formState.errors.password.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <Input
            id="confirmPassword"
            type="password"
            {...resetPasswordForm.register("confirmPassword", {
              required: "Please confirm your password",
            })}
          />
          {resetPasswordForm.formState.errors.confirmPassword && (
            <p className="text-red-600 text-sm">
              {resetPasswordForm.formState.errors.confirmPassword.message}
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
    </Modal>
  );
};

export default ChangePassword;
