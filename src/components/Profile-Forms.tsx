import React from "react";
import CustomeRefetch from "./CustomeRefetch";
import LogoLoader from "./loaders/logoLoader";
import { TextField } from "@/components/TextField";
import { Loader } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserById, updateUser } from "@/api/users";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useModal } from "@components/Modal";
import ChangePassword from "@/components/changepassword/ChangePasswordModal";
import { Button } from "@/components/ui/button";
import UploadSingleImage from "./UploadSingleImage";

interface PersonalInfoFormValues {
  name: string;
  email: string;
  phoneNumber: string;
}

const ProfileForms = () => {
  const queryClient = useQueryClient();
  const userId = localStorage.getItem("userId");
  const [image, setImage] = useState<File | string | null>(null);

  const { open: openChangePassword, close: closeChangePassword } =
    useModal("change_password");

  const personalInfoForm = useForm<PersonalInfoFormValues>();

  const {
    setValue,
    register,
    formState: { errors },
  } = personalInfoForm;

  const {
    data: User,
    isLoading,
    isError,
    refetch: refectUser,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      return await getUserById(userId!);
    },
  });

  useEffect(() => {
    if (User) {
      setValue("name", User.name);
      setValue("email", User.email);
      setValue("phoneNumber", User.phone);
    }
  }, [User, setValue]);

  const updatePersonalInfoMutation = useMutation({
    mutationFn: async (data: PersonalInfoFormValues) => {
      try {
        const formData = new FormData();
        formData.append("name", data.name.toUpperCase());
        formData.append("email", data.email);
        formData.append("phoneNumber", data.phoneNumber);
        if (image) {
          formData.append("photo", image);
        }
        await updateUser(userId!, formData);
        refectUser();
        toast.success("User Details Updated Successfully");
        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Failed to update user details";
        toast.error(errorMessage);
        throw error;
      }
    },
  });

  const handleUpdatePersonalInfo: SubmitHandler<PersonalInfoFormValues> = (
    formData
  ) => {
    updatePersonalInfoMutation.mutate(formData);
  };


  if (isLoading) {
    return <LogoLoader />;
  }

  if (isError) {
    return <CustomeRefetch refetch={refectUser} />;
  }

  return (
    <div>
      {" "}
      <form onSubmit={personalInfoForm.handleSubmit(handleUpdatePersonalInfo)}>
        <div className="flex items-start mb-4 space-x-4">
          <div className="flex items-center justify-center h-56 ">
            <UploadSingleImage image={image} setImage={setImage} previewImage={User?.imageUrl} />
          </div>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="User Name"
              id="userName"
              className='capitalize'
              register={register("name", {
                required: "User Name is required",
              })}
              error={errors.name}
            />
            <TextField
              label="Phone Number"
              id="phoneNumber"
              className='capitalize'
              register={register("phoneNumber", {
                required: "Phone Number is required",
              })}
              error={errors.phoneNumber}
            />
          </div>
          <div className="space-y-2">
            <TextField
              label="Email Address"
              id="email"
              register={register("email", {
                required: "Email Address is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                },
              })}
              error={errors.email}
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 my-4">
          <Button type="button" onClick={openChangePassword}>
            change Password
          </Button>
          <Button type="submit">
            {updatePersonalInfoMutation.isPending ? (
              <Loader className="animate-spin" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
      <ChangePassword onClose={closeChangePassword} />
    </div>
  );
};

export default ProfileForms;
