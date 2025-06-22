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

const roles = [
  "Manager",
  "Receptionist",
  "Cleaner",
  "Cook",
  "Security",
  "Accountant",
  "Maintenance",
  "Supervisor",
  "Other"
];

const AddStaff: React.FC = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState<string | File | null>(null);
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
        formData.append("maritalStatus", data.maritalStatus?.toUpperCase());
        formData.append("religion", data.religion?.toUpperCase());
        formData.append("gender", data.gender?.toUpperCase());
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
        formData.append("type", data.staffType?.toUpperCase());
        if (image) {
          formData.append("photo", image);
        }

        const response = await axios.post(`/api/staffs/add`, formData,{
          headers: {
            "Content-Type": "multipart/form-data",
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
    <div className="flex w-full justify-cente">
      <div className="w-[90%] mx-auto">
        <div className="flex items-center justify-between p-4 bg-white rounded-lg my6">
          <h1 className="text-2xl font-bold">Add Staff</h1>
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
          <div className="max-w-sm min" >
            <UploadSingleImage image={image} setImage={setImage} />
          </div>

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
                <option value="Male">Male</option>
                <option value="Female">Female</option>
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
                <option value="Christian">Christian</option>
                <option value="Muslim">Muslim</option>
                <option value="Traditionalist">Traditionalist</option>
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
                <option value="">-- Select Marital Status -- </option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
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
               <select
                {...register("staffType", {
                  required: "Staff type is required",
                })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">-- Select Staff Type -- </option>
                <option value="ADMIN">Admin</option>
                <option value="OTHERS">Others</option>
                </select>
                {errors.staffType && (
                  <span className="text-sm text-red-500">
                    {errors.staffType.message?.toString()}
                  </span>
                )}
                
              </div>
              <div>
                <label htmlFor="role">Role</label>
                <select
                  {...register("role", {
                    required: "Role is required",
                  })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">-- Select Role --</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <span className="text-sm text-red-500">
                    {errors.role.message?.toString()}
                  </span>
                )}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Block(optional)</label>
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
