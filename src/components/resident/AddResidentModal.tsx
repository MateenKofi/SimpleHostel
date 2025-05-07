import Modal from "../Modal";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Resident } from "../../helper/types/types";
import { useNavigate } from "react-router-dom";
import {  useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Loader } from "lucide-react";

type AddResidentModalProps = {
  onClose: () => void;
};
type ResidentForm = Omit<Resident, "paymentMethod">;

const AddResidentModal = ({ onClose }: AddResidentModalProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResidentForm>();

  const AddResidentMutation = useMutation({
    mutationFn: async (data: ResidentForm) => {
      const payload = {
        name: data.name,
        studentId: data.studentId,
        course: data.course,
        phone: data.phone || "",
        email: data.email,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone || "",
        relationship: data.relationship,
        gender: data.gender.toUpperCase(),
        hostelId: localStorage.getItem("hostelId") || "",
        calendarYearId: "d37b0e5a-0f52-4488-a1ec-cfc00c19310a",
      };

      const response = await axios.post(`/api/residents/add`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return response.data;
    },
    onSuccess: (response) => {
      const residentId = response?.data?.id;
      if(residentId) {
        localStorage.setItem("residentId", residentId);
      }
      toast.success("Room added successfully");
      queryClient.invalidateQueries({ queryKey: [" "] });
      reset();
      toast.success("Resident added successfully");
      onClose();
      navigate("/dashboard/room-assignment");

    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage =
        error.response?.data?.message || "Failed to Update User Details";
      toast.error(errorMessage);
    },
  });
  
  const onSubmit = (formData: ResidentForm) => {
  AddResidentMutation.mutate(formData);
  };

  return (
    <Modal modalId="add_resident_modal" onClose={onClose}>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-400">Add Resident </h1>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-6"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium text-gray-400">
            Full Name*
          </label>
          <input
            {...register("name", { required: "Full name is required" })}
            type="text"
            id="name"
            placeholder="Enter full name"
            className="border rounded-md p-2"
          />
          {errors.name && (
            <span className="text-red-500 text-sm">
              {errors.name.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="studentId" className="text-sm font-medium text-gray-400">
            Student ID*
          </label>
          <input
            {...register("studentId", { required: "Student ID is required" })}
            type="text"
            id="studentId"
            placeholder="Enter student ID"
            className="border rounded-md p-2"
          />
          {errors.studentId && (
            <span className="text-red-500 text-sm">
              {errors.studentId.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="course" className="text-sm font-medium text-gray-400">
            Course*
          </label>
          <input
            {...register("course", { required: "Course is required" })}
            type="text"
            id="course"
            placeholder="Enter course name"
            className="border rounded-md p-2"
          />
          {errors.course && (
            <span className="text-red-500 text-sm">
              {errors.course.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium text-gray-400">
            Email*
          </label>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            type="email"
            id="email"
            placeholder="Enter email address"
            className="border rounded-md p-2"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="phone" className="text-sm font-medium text-gray-400">
            Phone Number*
          </label>
          <input
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^\d{10}$/,
                message: "Phone number must be 10 digits",
              },
            })}
            type="tel"
            id="phone"
            placeholder="Enter phone number"
            className="border rounded-md p-2"
          />
          {errors.phone && (
            <span className="text-red-500 text-sm">{errors.phone.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="gender" className="text-sm font-medium text-gray-400">
            Gender*
          </label>
          <select
            {...register("gender", { required: "Gender is required" })}
            id="gender"
            className="border rounded-md p-2"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {errors.gender && (
            <span className="text-red-500 text-sm">{errors.gender.message}</span>
          )}
        </div>

        <div className="border-t pt-4 mt-2">
          <h2 className="text-lg font-semibold mb-4">Emergency Contact</h2>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="emergencyContactName"
              className="text-sm font-medium text-gray-400"
            >
              Contact Name*
            </label>
            <input
              {...register("emergencyContactName", {
                required: "Emergency contact name is required",
              })}
              type="text"
              id="emergencyContactName"
              placeholder="Enter emergency contact name"
              className="border rounded-md p-2"
            />
            {errors.emergencyContactName && (
              <span className="text-red-500 text-sm">
                {errors.emergencyContactName.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1 mt-4">
            <label
              htmlFor="emergencyContactPhone"
              className="text-sm font-medium text-gray-400"
            >
              Contact Phone*
            </label>
            <input
              {...register("emergencyContactPhone", {
                required: "Emergency contact phone is required",
                pattern: {
                  value: /^\d{10}$/,
                  message: "Phone number must be 10 digits",
                },
              })}
              type="tel"
              id="emergencyContactPhone"
              placeholder="Enter emergency contact phone"
              className="border rounded-md p-2"
            />
            {errors.emergencyContactPhone && (
              <span className="text-red-500 text-sm">
                {errors.emergencyContactPhone.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1 mt-4">
            <label
              htmlFor="relationship"
              className="text-sm font-medium text-gray-400"
            >
              Relationship*
            </label>
            <input
              {...register("relationship", {
                required: "Relationship is required",
              })}
              type="text"
              id="relationship"
              placeholder="Enter relationship (e.g. Parent, Sibling)"
              className="border rounded-md p-2"
            />
            {errors.relationship && (
              <span className="text-red-500 text-sm">
                {errors.relationship.message}
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-red-500 text-white bg-red-600"
          >
            Cancel
          </button> 
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            {AddResidentMutation.isPending ? (
                <span className="w-full flex gap-2 items-center">
                <Loader className="animate-spin" size={16} />
                <span className="ml-2">Adding Resident...</span>
                </span>
            ):(
                <span>Add Resident</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddResidentModal;