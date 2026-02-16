import { useMutation } from "@tanstack/react-query";
import { updateUser } from "@/api/users";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import Modal from "../Modal";
import { Loader } from "lucide-react";
import { PasswordInput } from "@/components/form";
import { Button } from "@/components/ui/button";
import type { ApiError } from "@/types/dtos";

interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

interface ChangePasswordProps {
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordProps> = ({ onClose }) => {
  const userId = localStorage.getItem("userId");
  const resetPasswordForm = useForm<ResetPasswordFormValues>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: { password: string }) => {
      await updateUser(userId!, { password: data.password });
      onClose();
    },
    onSuccess: () => {
      toast.success("Password Updated Successfully");
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || "Failed to Update Password";
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
    <Modal modalId="change_password" onClose={onClose}>
      <h2 className="mb-6 text-lg font-semibold text-gray-500">Change Password</h2>
      <form onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)}>
        <PasswordInput
          id="password"
          label="New Password"
          placeholder="Enter new password"
          error={resetPasswordForm.formState.errors.password?.message}
          {...resetPasswordForm.register("password", {
            required: "Password is required",
          })}
        />
        <PasswordInput
          id="confirmPassword"
          label="Confirm New Password"
          placeholder="Confirm new password"
          error={resetPasswordForm.formState.errors.confirmPassword?.message}
          {...resetPasswordForm.register("confirmPassword", {
            required: "Please confirm your password",
          })}
        />
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

export default ChangePasswordModal;
