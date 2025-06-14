import React, { useState } from "react";
import Modal from "./Modal";
import { SubmitHandler, useForm } from "react-hook-form";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutation,useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { ImagePlus, RefreshCcw } from "lucide-react";

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
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { register, handleSubmit,reset } = useForm<AddUserFormData>();
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
      await axios
        .post("/api/users/signup", formData)
        .then((res) => {
          toast.success("User Added successfully");
         handleClose()
            querclient.invalidateQueries({queryKey:['AllUsers']})
          return res.data;
        })
        .catch((error) => {
          const errorMessage =
            error.response?.data?.message || "Failed to add user";
          toast.error(errorMessage);
        });
    },
  });

  const handleImage = (even: React.ChangeEvent<HTMLInputElement>) => {
    const file = even.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleClose = () => {
    setImage(null);
    setImagePreview(null);
    onClose();
    reset();
    }
  const onSubmit: SubmitHandler<AddUserFormData> = (data) => {
    AddUserMutation.mutate(data);
  };
  return (
    <Modal modalId="add_user" onClose={()=> handleClose()}>
      <h2 className="mb-3 font-sans text-2xl font-bold text-gray-400">
        Add User
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col gap-2">
            <div>
                {imagePreview && (
            <img
              src={imagePreview}
              alt="preview"
              className="object-cover w-40 h-40 rounded-2xl"
            />
          )}
            </div>
          <Label htmlFor="photo" className="text-gray-500">
            <span className="flex items-center gap-2 text-gray-500 cursor-pointer">
                {imagePreview ? <RefreshCcw/> : <ImagePlus/>}
            uploade Image</span>
          </Label>
          <Input
            type="file"
            id="photo"
            accept="image/*"
            {...register("photo")}
            onChange={handleImage}
            className="hidden text-gray-500"
          />
        
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="text-gray-500">
            Name
          </Label>
          <Input
            type="text"
            id="name"
            {...register("name", { required: "Name is required" })}
            className="text-gray-500"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="text-gray-500">
            Email
          </Label>
          <Input
            type="email"
            id="email"
            {...register("email", { required: "Email is required" })}
            className="text-gray-500"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="phoneNumber" className="text-gray-500">
            Phone Number
          </Label>
          <Input
            type="text"
            id="phoneNumber"
            {...register("phoneNumber", {
              required: "Phone Number is required",
            })}
            className="text-gray-500"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password" className="text-gray-500">
            Password
          </Label>
          <Input
            type="text"
            id="password"
            {...register("password", { required: "Password is required" })}
            className="text-gray-500"
          />
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
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button
            onClick={()=> handleClose()}
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
