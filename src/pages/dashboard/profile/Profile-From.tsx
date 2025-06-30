import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleFadingArrowUp, ImageUp, Loader, RefreshCcw } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import LogoLoader from "@/components/loaders/logoLoader";
import { useModal } from "@components/Modal";
import ChangePassword from "@/components/changepassword/ChangePasswordModal";
import SEOHelmet from "@/components/SEOHelmet";

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
      const response = await axios.get(`/api/users/get/${userId}`);
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
        .put(`/api/users/update/${userId}`, formData,{
        headers:{
          "Content-Type":'multipart/form-data',
        }
      })
        .then((res) => {
          refectUser();
          toast.success("User Details Updated Successfully");
          queryClient.invalidateQueries({ queryKey: ["userProfile"] });
          return res.data;
        })
        .catch((error) => {
          if (axios.isAxiosError(error)) {
            const errorMessage =
              error.response?.data?.error || "Failed to update user details";
            toast.error(errorMessage);
          }
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
      <div className='flex flex-col items-center '>
        <h2 className='font-serif text-xl italic'>Error loading data</h2>
        <p className='text-xs'>Try reloading data</p>
      <button className='mt-4 btn btn-sm btn-black' onClick={()=>refectUser()}>
        <RefreshCcw/>
        Try Again
        </button>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50 md:p-6 lg:p-8">
      <SEOHelmet
      title="Profile - Fuse"
      description="Manage your profile settings and personal information."
      keywords="profile, settings, Fuse"
      />
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="p-3 border rounded-md shadow-md">
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="mt-2 text-xs italic font-thin text-gray-400">
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
            <div className="flex items-start mb-4 space-x-4">
              <div className="relative w-fit">
                <img
                  src={image || User?.imageUrl || '/logo.png'}
                  alt="Profile"
                  className="object-cover w-24 h-24 rounded-full"
                />
                <label className="flex gap-2 mt-2 text-sm text-blue-600 cursor-pointer">
                  <span className="px-2 py-1 text-xs text-white bg-black rounded">
                  {!(image || User?.imageUrl) ? (<span className="flex items-center gap-1">
                    <ImageUp/> Upload
                  </span>) : (<span className="flex items-center gap-1">
                    <CircleFadingArrowUp/> Update
                  </span>)}
                  </span>
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
                    <p className="text-sm text-red-600">
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
                    <p className="text-sm text-red-600">
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
                  <p className="text-sm text-red-600">{errors.email.message}</p>
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
                  "Save Changes"
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
