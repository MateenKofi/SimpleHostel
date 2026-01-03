import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Loader } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getStaffById, updateStaff } from "@/api/staff";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import CustomeRefetch from "../CustomeRefetch";
import UploadSingleImage from "../UploadSingleImage";
import { Staff } from "@/helper/types/types";

const EditStaff: React.FC = () => {
  const { id: staffId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [image, setImage] = useState<string | File | null>(null);
  const hostelId = localStorage.getItem("hostelId");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<Staff>();

  const {
    data: staff_details,
    isLoading: detailsLoading,
    isError,
    refetch: refetchStaffDetails,
  } = useQuery({
    queryKey: ["staff_details", staffId],
    queryFn: async () => {
      const responseData = await getStaffById(staffId!);
      return responseData.data;
    },
  });

  useEffect(() => {
    if (staff_details) {
      setValue("firstName", staff_details.firstName);
      setValue("middleName", staff_details.middleName || "");
      setValue("lastName", staff_details.lastName);
      setValue("gender", staff_details.gender);
      setValue(
        "dateOfBirth",
        dayjs(staff_details.dateOfBirth).format("YYYY-MM-DD")
      );
      setValue("nationality", staff_details.nationality);
      setValue("maritalStatus", staff_details.maritalStatus);
      setValue("religion", staff_details.religion);
      setValue("ghanaCardNumber", staff_details.ghanaCardNumber);
      setValue("phoneNumber", staff_details.phoneNumber);
      setValue("email", staff_details.email);
      setValue("residence", staff_details.residence);
      setValue("qualification", staff_details.qualification);
      setValue("role", staff_details.role);
      setValue("block", staff_details.block);
      setValue(
        "dateOfAppointment",
        dayjs(staff_details.dateOfAppointment).format("YYYY-MM-DD")
      );

      if (staff_details.passportUrl) {
        setImage(staff_details.passportUrl);
      }
    }
  }, [staff_details, setValue]);

  const EditStaffMutation = useMutation({
    mutationFn: async (data: Staff) => {
      try {
        const formData = new FormData();
        formData.append("hostelId", hostelId || "");
        formData.append("maritalStatus", data.maritalStatus);
        formData.append("religion", data.religion);
        formData.append("gender", data.gender);
        formData.append("nationality", data.nationality);
        formData.append("dateOfBirth", data.dateOfBirth);
        formData.append("lastName", data.lastName);
        formData.append("middleName", data.middleName || "");
        formData.append("firstName", data.firstName);
        formData.append("ghanaCardNumber", data.ghanaCardNumber);
        formData.append("phoneNumber", data.phoneNumber);
        formData.append("email", data.email);
        formData.append("residence", data.residence);
        formData.append("qualification", data.qualification);
        formData.append("role", data.role);
        formData.append("block", data.block);
        formData.append("dateOfAppointment", data.dateOfAppointment);

        if (image) {
          formData.append("photo", image);
        }

        await updateStaff(staffId!, formData);
        queryClient.invalidateQueries({ queryKey: ["staff_details"] });
        toast.success("Staff updated successfully");
        reset();
        navigate(-1);
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || "Failed to update staff";
        toast.error(errorMessage);
        throw error;
      }
    },
  });

  const onSubmit = (data: Staff) => {
    const dateOfBirthValid = dayjs(
      data.dateOfBirth,
      "YYYY-MM-DD",
      true
    ).isValid();
    const dateOfAppointmentValid = dayjs(
      data.dateOfAppointment,
      "YYYY-MM-DD",
      true
    ).isValid();

    if (!dateOfBirthValid || !dateOfAppointmentValid) {
      toast.error(
        "Date of birth and Date of appointment must be in the format YYYY-MM-DD"
      );
      return;
    }

    const formattedDOB = dayjs(data.dateOfBirth).format(
      "YYYY-MM-DDTHH:mm:ss[Z]"
    );
    const formattedDateOfAppointment = dayjs(data.dateOfAppointment).format(
      "YYYY-MM-DDTHH:mm:ss[Z]"
    );
    EditStaffMutation.mutate({
      ...data,
      dateOfBirth: formattedDOB,
      dateOfAppointment: formattedDateOfAppointment,
    });
  };

  if (detailsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    return <CustomeRefetch refetch={refetchStaffDetails} />;
  }

  return (
    <div className="flex justify-center w-full min-h-screen ">
      <div className="w-[90%]">
        <div className="flex items-center justify-between p-4 mt-6 mb-6 bg-white rounded-lg">
          <h1 className="text-2xl font-bold">Edit Staff</h1>
          <button
            onClick={() => navigate(-1)}
            className="flex gap-2 px-4 py-2 text-white bg-black rounded-md"
          >
            <ChevronLeft />
            <span>Back</span>
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full p-6 space-y-6 bg-white rounded-lg shadow-sm"
        >
          {/* Image Upload Section */}
          <div className="overflow-hidden w-fit">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Upload Image
            </label>
            <UploadSingleImage setImage={setImage} image={image} />
          </div>

          {/* Personal Details */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium">
                First Name
              </label>
              <input
                {...register("firstName", {
                  required: "First name is required",
                })}
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <span className="text-sm text-red-500">
                  {errors.firstName.message?.toString()}
                </span>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Middle Name
              </label>
              <input
                {...register("middleName")}
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Enter your middle name"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Last Name
              </label>
              <input
                {...register("lastName", { required: "Last name is required" })}
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <span className="text-sm text-red-500">
                  {errors.lastName.message?.toString()}
                </span>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Date of Birth
              </label>
              <input
                {...register("dateOfBirth", {
                  required: "Date of birth is required",
                })}
                type="date"
                className="w-full p-2 border rounded-md"
              />
              {errors.dateOfBirth && (
                <span className="text-sm text-red-500">
                  {errors.dateOfBirth.message?.toString()}
                </span>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Nationality
              </label>
              <input
                type="text"
                {...register("nationality", {
                  required: "Nationality is required",
                })}
                className="w-full p-2 border rounded-md"
                placeholder="Enter Nationality"
              />
              {errors.nationality && (
                <span className="text-sm text-red-500">
                  {errors.nationality.message?.toString()}
                </span>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Gender</label>
              <select
                {...register("gender", { required: "Gender is required" })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">-- Select Gender --</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
              {errors.gender && (
                <span className="text-sm text-red-500">
                  {errors.gender.message?.toString()}
                </span>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Religion</label>
              <select
                {...register("religion", { required: "Religion is required" })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">-- Select Religion --</option>
                <option value="CHRISTIAN">Christian</option>
                <option value="MUSLIM">Muslim</option>
                <option value="TRADITIONALIST">Traditionalist</option>
              </select>
              {errors.religion && (
                <span className="text-sm text-red-500">
                  {errors.religion.message?.toString()}
                </span>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Marital Status
              </label>
              <select
                {...register("maritalStatus", {
                  required: "Marital status is required",
                })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">-- Select Marital Status --</option>
                <option value="SINGLE">Single</option>
                <option value="MARRIED">Married</option>
                <option value="DIVORCED">Divorced</option>
                <option value="WIDOWED">Widowed</option>
              </select>
              {errors.maritalStatus && (
                <span className="text-sm text-red-500">
                  {errors.maritalStatus.message?.toString()}
                </span>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Ghana Card Number
              </label>
              <input
                type="text"
                {...register("ghanaCardNumber", {
                  required: "Ghana card number is required",
                })}
                className="w-full p-2 border rounded-md"
                placeholder="GHA-XXXX-XXXX-XXXX"
              />
              {errors.ghanaCardNumber && (
                <span className="text-sm text-red-500">
                  {errors.ghanaCardNumber.message?.toString()}
                </span>
              )}
            </div>
          </div>

          {/* Contact Details */}
          <div className="mt-6">
            <h2 className="mb-4 text-lg font-semibold">Contact Details</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Phone Number
                </label>
                <input
                  {...register("phoneNumber", {
                    required: "Phone number is required",
                  })}
                  type="tel"
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter Phone Number"
                />
                {errors.phoneNumber && (
                  <span className="text-sm text-red-500">
                    {errors.phoneNumber.message?.toString()}
                  </span>
                )}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Email</label>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  type="email"
                  className="w-full p-2 border rounded-md"
                  placeholder="someone@something.com"
                />
                {errors.email && (
                  <span className="text-sm text-red-500">
                    {errors.email.message?.toString()}
                  </span>
                )}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Residence
                </label>
                <input
                  {...register("residence", {
                    required: "Residence is required",
                  })}
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter Residence"
                />
                {errors.residence && (
                  <span className="text-sm text-red-500">
                    {errors.residence.message?.toString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="mt-6">
            <h2 className="mb-4 text-lg font-semibold">Job Details</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Qualification
                </label>
                <input
                  {...register("qualification", {
                    required: "Qualification is required",
                  })}
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter Qualification"
                />
                {errors.qualification && (
                  <span className="text-sm text-red-500">
                    {errors.qualification.message?.toString()}
                  </span>
                )}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Staff Type
                </label>
                <input
                  {...register("role", { required: "Staff type is required" })}
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter Staff Type"
                />
                {errors.role && (
                  <span className="text-sm text-red-500">
                    {errors.role.message?.toString()}
                  </span>
                )}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Block</label>
                <input
                  {...register("block", { required: "Block is required" })}
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter Block"
                />
                {errors.block && (
                  <span className="text-sm text-red-500">
                    {errors.block.message?.toString()}
                  </span>
                )}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Date of Appointment
                </label>
                <input
                  {...register("dateOfAppointment", {
                    required: "Date of appointment is required",
                  })}
                  type="date"
                  className="w-full p-2 border rounded-md"
                />
                {errors.dateOfAppointment && (
                  <span className="text-sm text-red-500">
                    {errors.dateOfAppointment.message?.toString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-black rounded-md"
            >
              {EditStaffMutation.isPending ? (
                <Loader className="animate-spin" />
              ) : (
                "Submit Update"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStaff;
