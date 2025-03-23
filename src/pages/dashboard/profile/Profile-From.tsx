"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";

interface PersonalInfoFormValues {
  name: string;
  email: string;
  phoneNumber: string;
}

interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

const ProfileForm = () => {
  const queryClient = useQueryClient();
  const userId = localStorage.getItem("userId");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [image, setImage] = useState<string | null>(null);

  const personalInfoForm = useForm<PersonalInfoFormValues>({
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
    },
  });

  const resetPasswordForm = useForm<ResetPasswordFormValues>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { setValue, register, formState: { errors } } = personalInfoForm;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await axios.get(`/api/users/get/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setValue("name", response?.data?.name);
      setValue("email", response?.data?.email);
      setValue("phoneNumber", response?.data?.phoneNumber);
      setImage(response?.data?.imageUrl);
      return response?.data;
    },
  });

  const updatePersonalInfoMutation = useMutation({
    mutationFn: async (data: PersonalInfoFormValues) => {
      const formData = new FormData();
      formData.append("name", data.name.toUpperCase());
      formData.append("email", data.email);
      formData.append("phoneNumber", data.phoneNumber);
      if (uploadedImage) {
        formData.append("photo", uploadedImage);
      }
      const response = await axios.put(`/api/users/update/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response?.data;
    },
    onSuccess: () => {
      toast.success("User Details Updated Successfully");
      queryClient.invalidateQueries({ queryKey: ["user", "userProfile"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to Update User Details";
      toast.error(errorMessage);
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
      queryClient.invalidateQueries({ queryKey: ["user", "userProfile"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to Update Password";
      toast.error(errorMessage);
    },
  });

  const handleUpdatePersonalInfo: SubmitHandler<PersonalInfoFormValues> = (formData) => {
    updatePersonalInfoMutation.mutate(formData);
  };

  const handleResetPassword: SubmitHandler<ResetPasswordFormValues> = (formData) => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    resetPasswordMutation.mutate({ password: formData.password });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-[70dvh] grid place-items-center">
        <img src="/logo.png" alt="Loading" className="w-20 h-20 animate-ping" />
      </div>
    );
  }

  if (isError) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold">Account Settings</h1>

        {/* Reset Password Form */}
        <Card className="p-6">
          <h2 className="mb-6 text-lg font-semibold">Reset Password</h2>
          <form onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)}>
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
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
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
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
              {resetPasswordMutation.isPending ? <Loader className="animate-spin" /> : "Reset Password"}
            </Button>
          </form>
        </Card>

        {/* Personal Information Form */}
        <Card className="p-6">
          <h2 className="mb-6 text-lg font-semibold">Personal Information</h2>
          <form onSubmit={personalInfoForm.handleSubmit(handleUpdatePersonalInfo)}>
            <div className="flex mb-4 items-start space-x-4">
              <div className="relative w-fit">
                <img
                  src={image || data?.imageUrl}
                  alt="Profile"
                  className="h-24 w-24 rounded-full object-cover"
                />
                <label className="mt-2 flex gap-2 text-sm text-blue-600 cursor-pointer">
                  Update
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>
            <div className="grid gap-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="userName">User Name</Label>
                  <Input
                    id="userName"
                    {...register("name", { required: "User Name is required" })}
                  />
                  {errors.name && (
                    <p className="text-red-600 text-sm">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    {...register("phoneNumber", {
                      required: "Phone Number is required",
                    })}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-600 text-sm">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm">{errors.email.message}</p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-4 my-4">
              <Button type="submit">
                {updatePersonalInfoMutation.isPending ? (
                  <Loader className="animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ProfileForm;
