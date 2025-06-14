import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Modal from "../Modal";
import { Loader } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button";

interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

interface ChangePasswordProps {
  onClose: () => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ onClose }) => {
  const userId = localStorage.getItem("userId");
  const resetPasswordForm = useForm<ResetPasswordFormValues>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: { password: string }) => {
      await axios.put(
        `/api/users/update/${userId}`,
        { password: data.password },
      ).then((response)=>{
        onClose()
        return response.data
      }).catch((error)=>{
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.error || "Failed to Update Password";
          toast.error(errorMessage);
        }
      })
    
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
    <Modal modalId="change_password" onClose={onClose}>
      <h2 className="mb-6 text-lg font-semibold text-gray-500">Change Password</h2>
      <form onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)}>
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
    </Modal>
  );
};

export default ChangePassword;
