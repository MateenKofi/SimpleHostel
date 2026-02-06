import React, { useState } from "react";
import Modal from "./Modal";
import { SubmitHandler, useForm } from "react-hook-form";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signupUser } from "@/api/auth";
import { toast } from "sonner";
import UploadSingleImage from "./UploadSingleImage";
import { TextField } from "./TextField";
import type { ApiError } from "@/types/dtos";

type AddUserProps = {
  onClose: () => void;
};

type AddUserFormData = {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: string;
  photo: File;
};

const AddUser = ({ onClose }: AddUserProps) => {
  const querclient = useQueryClient()
  const [image, setImage] = useState<File | string | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddUserFormData>();

  const AddUserMutation = useMutation({
    mutationFn: async (data: AddUserFormData) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("role", data.role);
      if (image) {
        formData.append("photo", image);
      }
      try {
        await signupUser(formData);
        toast.success("User Added successfully");
        handleClose();
        querclient.invalidateQueries({ queryKey: ['AllUsers'] });
      } catch (error: unknown) {
        const err = error as ApiError;
        const errorMessage = err.response?.data?.message || "Failed to add user";
        toast.error(errorMessage);
        throw error;
      }
    },
  });

  const handleClose = () => {
    setImage(null);
    onClose();
    reset();
  }
  const onSubmit: SubmitHandler<AddUserFormData> = (data) => {
    AddUserMutation.mutate(data);
  };
  return (
    <Modal modalId="add_user" onClose={() => handleClose()}>
      <h2 className="mb-3 font-sans text-2xl font-bold text-gray-400">
        Add User
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="w-fit">
          <UploadSingleImage image={image} setImage={setImage} />
        </div>
        <div className="flex flex-col gap-2">
          <TextField id="name" label="Name" register={register('name')} error={errors.name} />
        </div>
        <div className="flex flex-col gap-2">
          <TextField id="email" label="Email" register={register('email')} error={errors.email} />
        </div>
        <div className="flex flex-col gap-2">
          <TextField id="phoneNumber" label="Phone Number" register={register('phoneNumber')} error={errors.phoneNumber} />
        </div>
        <div className="flex flex-col gap-2">
          <TextField id="password" label="Password" type="password" register={register('password', { required: "Password is required" })} error={errors.password} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="role" className="text-gray-500">
            Role
          </Label>
          <select
            id="role"
            {...register("role", { required: "Role is required" })}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value=""> -- select option --</option>
            <option value="ADMIN">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button
            onClick={() => handleClose()}
            type="button"
            className="text-white bg-red-500 rounded-md"
          >
            Cancel
          </Button>
          <Button type="submit" className="text-white bg-black rounded-md">
            Add User
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddUser;
