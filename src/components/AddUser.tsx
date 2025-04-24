import React, { useState } from "react";
import Modal from "./Modal";
import { SubmitHandler, useForm } from "react-hook-form";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
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
        .post("/api/users/signup", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }, 
        })
        .then((res) => {
          toast.success("User Added successfully");
         handleClose()
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
      <h2 className="text-gray-400 font-sans font-bold text-2xl mb-3">
        Add User
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col gap-2">
            <div>
                {imagePreview && (
            <img
              src={imagePreview}
              alt="preview"
              className="w-40 h-40 rounded-2xl object-cover"
            />
          )}
            </div>
          <Label htmlFor="photo" className="text-gray-500">
            <span className="text-gray-500 cursor-pointer flex items-center gap-2">
                {imagePreview ? <RefreshCcw/> : <ImagePlus/>}
            uploade Image</span>
          </Label>
          <Input
            type="file"
            id="photo"
            accept="image/*"
            {...register("photo")}
            onChange={handleImage}
            className="text-gray-500 hidden"
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
            className="border border-gray-300 rounded-md p-2"
          >
            <option value=""> -- select option --</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
        </div>
        <div className="flex gap-2 justify-end items-center">
          <Button
            onClick={()=> handleClose()}
            type="button"
            className="bg-red-500 rounded-md text-white"
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-black rounded-md text-white">
            Add User
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddUser;
