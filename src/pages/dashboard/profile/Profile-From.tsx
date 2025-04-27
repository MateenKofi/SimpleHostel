import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, RefreshCcw } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import LogoLoader from "@/components/loaders/logoLoader";
import { useModal } from "@components/Modal";
import ChangePassword from "@/components/chnagepassword/ChangePassword";

interface PersonalInfoFormValues {
  name: string;
  email: string;
  phoneNumber: string;
}

const ProfileForm = () => {
  const queryClient = useQueryClient();
  const userId = localStorage.getItem("userId");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [image, setImage] = useState<string | null>(null);

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
      const response = await axios.get(`/api/users/get/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response?.data;
    },
  });

  useEffect(() => {
    if (User) {
      setValue("name", User.name);
      setValue("email", User.email);
      setValue("phoneNumber", User.phoneNumber);
    }
  }, [User, setValue]);

  const updatePersonalInfoMutation = useMutation({
    mutationFn: async (data: PersonalInfoFormValues) => {
      const formData = new FormData();
      formData.append("name", data.name.toUpperCase());
      formData.append("email", data.email);
      formData.append("phoneNumber", data.phoneNumber);
      if (uploadedImage) {
        formData.append("photo", uploadedImage);
      }
      await axios
        .put(`/api/users/update/${userId}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          refectUser();
          toast.success("User Details Updated Successfully");
          queryClient.invalidateQueries({ queryKey: ["userProfile"] });
          return res.data;
        })
        .catch((err) => {
          const errorMessage =
            err.response?.data?.message || "Failed to update user details";
          toast.error(errorMessage);
        });
    },
  });

  const handleUpdatePersonalInfo: SubmitHandler<PersonalInfoFormValues> = (
    formData
  ) => {
    updatePersonalInfoMutation.mutate(formData);
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
    return <LogoLoader />;
  }

  if (isError) {
    return  <div className='w-full h-[70dvh] grid place-items-center text-red-500'>
      <div className=' flex flex-col items-center'>
        <h2 className='text-xl font-serif italic'>Error loading data</h2>
        <p className='text-xs'>Try reloading data</p>
      <button className='btn btn-sm btn-black mt-4' onClick={()=>refectUser()}>
        <RefreshCcw/>
        Try Again
        </button>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="border shadow-md rounded-md p-3">
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-gray-400 italic text-xs font-thin mt-2">
            Manage your account settings and update your personal information
            here. Changes you make will be reflected across your profile.
          </p>
        </div>
        {/* Personal Information Form */}
        <Card className="p-6">
          <h2 className="mb-6 text-lg font-semibold">Personal Information</h2>
          <form
            onSubmit={personalInfoForm.handleSubmit(handleUpdatePersonalInfo)}
          >
            <div className="flex mb-4 items-start space-x-4">
              <div className="relative w-fit">
                <img
                  src={image || User?.imageUrl}
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
                    <p className="text-red-600 text-sm">
                      {errors.name.message}
                    </p>
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
                  })}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm">{errors.email.message}</p>
                )}
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
                  "Update"
                )}
              </Button>
            </div>
          </form>
            <ChangePassword onClose={closeChangePassword} />
        </Card>
      </div>
    </div>
  );
};

export default ProfileForm;
