import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Loader } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Staff } from "../../helper/types/types";
import axios from "axios";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import UploadSingleImage from "../UploadSingleImage";

const AddStaff: React.FC = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Staff>();
  const hostelId = localStorage.getItem("hostelId");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: Staff) => {
      try {
        const formData = new FormData();
        formData.append("hostelId", hostelId || "");
        formData.append("maritalStatus", data.maritalStatus.toUpperCase());
        formData.append("religion", data.religion.toUpperCase());
        formData.append("gender", data.gender.toUpperCase());
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
        formData.append("role", data.role.toUpperCase());
        formData.append("block", data.block);
        formData.append("dateOfAppointment", data.dateOfAppointment);
        if (image) {
          formData.append("photo", image);
        }

        const response = await axios.post(`/api/staffs/add`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        queryClient.invalidateQueries({ queryKey: ["staffs"] });
        toast.success("Staff added successfully");
        reset();
        navigate(-1);
        return response.data;
      } catch (error) {
        let errorMessage = "Failed to add staff";
        if (axios.isAxiosError(error)) {
          errorMessage = error.response?.data?.message || "Failed to add staff";
        } else {
          errorMessage = (error as Error).message || "Failed to add staff";
        }
        toast.error(errorMessage);
      }
    },
  });

  const onSubmit = (data: Staff) => {
    const formattedDOB = dayjs(data.dateOfBirth).format(
      "YYYY-MM-DDTHH:mm:ss[Z]"
    );
    const formateedDateOfAppointment = dayjs(data.dateOfAppointment).format(
      "YYYY-MM-DDTHH:mm:ss[Z]"
    );
    mutation.mutate({
      ...data,
      dateOfBirth: formattedDOB,
      dateOfAppointment: formateedDateOfAppointment,
    });
  };

  return (
    <div className="w-full h-screen flex justify-cente">
      <div className="w-[90%] ">
        <div className="flex items-center justify-between mb-6 mt-6 bg-white p-4 rounded-lg">
          <h1 className="text-2xl font-bold">Add Staff</h1>
          <button
            onClick={() => navigate(-1)}
            className="flex gap-2 px-4 py-2 bg-black text-white rounded-md"
          >
            <ChevronLeft />
            <span>Back</span>
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full space-y-6 p-6 rounded-lg shadow-sm bg-white"
        >
          <div className="max-w-sm min" >
            <UploadSingleImage image={image} setImage={setImage} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
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
                <span className="text-red-500 text-sm">
                  {errors.firstName.message?.toString()}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
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
              <label className="block text-sm font-medium mb-1">
                Last Name
              </label>
              <input
                {...register("lastName", { required: "Last name is required" })}
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <span className="text-red-500 text-sm">
                  {errors.lastName.message?.toString()}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
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
                <span className="text-red-500 text-sm">
                  {errors.dateOfBirth.message?.toString()}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
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
                <span className="text-red-500 text-sm">
                  {errors.nationality.message?.toString()}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                {...register("gender", { required: "Gender is required" })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">-- Select Gender --</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.gender && (
                <span className="text-red-500 text-sm">
                  {errors.gender.message?.toString()}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Religion</label>
              <select
                {...register("religion", { required: "Religion is required" })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">-- Select Religion --</option>
                <option value="Christian">Christian</option>
                <option value="Muslim">Muslim</option>
                <option value="Traditionalist">Traditionalist</option>
              </select>
              {errors.religion && (
                <span className="text-red-500 text-sm">
                  {errors.religion.message?.toString()}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Marital Status
              </label>
              <select
                {...register("maritalStatus", {
                  required: "Marital status is required",
                })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">-- Select Marital Status -- </option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
              {errors.maritalStatus && (
                <span className="text-red-500 text-sm">
                  {errors.maritalStatus.message?.toString()}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
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
                <span className="text-red-500 text-sm">
                  {errors.ghanaCardNumber.message?.toString()}
                </span>
              )}
            </div>
          </div>

          {/* Contact Details */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Contact Details</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
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
                  <span className="text-red-500 text-sm">
                    {errors.phoneNumber.message?.toString()}
                  </span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
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
                  <span className="text-red-500 text-sm">
                    {errors.email.message?.toString()}
                  </span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
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
                  <span className="text-red-500 text-sm">
                    {errors.residence.message?.toString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Job Details</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
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
                  <span className="text-red-500 text-sm">
                    {errors.qualification.message?.toString()}
                  </span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Staff Type
                </label>
                <input
                  {...register("role", { required: "Staff type is required" })}
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter Staff Type"
                />
                {errors.staffType && (
                  <span className="text-red-500 text-sm">
                    {errors.staffType.message?.toString()}
                  </span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Block</label>
                <input
                  {...register("block", { required: "Block is required" })}
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter Block"
                />
                {errors.block && (
                  <span className="text-red-500 text-sm">
                    {errors.block.message?.toString()}
                  </span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
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
                  <span className="text-red-500 text-sm">
                    {errors.dateOfAppointment.message?.toString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-md"
            >
              {mutation.isPending ? (
                <Loader className="animate-spin" />
              ) : (
                " Submit Forms"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaff;
