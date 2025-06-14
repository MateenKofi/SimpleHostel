import Modal from "../Modal";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Resident } from "../../helper/types/types";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Loader } from "lucide-react";
import { useAddedResidentStore } from "@/controllers/AddedResident";

type AddResidentModalProps = {
  onClose: () => void;
};
type ResidentForm = Omit<Resident, "paymentMethod">;

const AddResidentModal = ({ onClose }: AddResidentModalProps) => {
  const navigate = useNavigate();
  const setResident = useAddedResidentStore((state) => state.setResident);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResidentForm>();
  const calendarYearId = localStorage.getItem("calendarYear") || "";
  const hostelId = localStorage.getItem("hostelId") || "";

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
        hostelId: hostelId,
        calendarYearId: calendarYearId,
      };

      try {
        const response = await axios.post(`/api/residents/add`, payload);

        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message || "Failed to add resident";
          console.error("Error adding resident:", errorMessage);
          throw new Error(errorMessage); // Re-throw the error to be handled in `onError`
        } else {
          console.error("Unexpected error:", error);
          throw new Error("An unexpected error occurred");
        }
      }
    },
    onSuccess: (response) => {
      const resident = response?.data?.data;
      if (resident) {
        setResident(resident);
      } else {
        console.error("No resident data found in response");
      }
      reset();
      toast.success("Resident added successfully");
      queryClient.invalidateQueries({ queryKey: [" "] });
      setTimeout(() => {
        onClose();
        navigate("/dashboard/room-assignment");
      }, 50);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage =
        error.response?.data?.message || "Failed to add resident";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (formData: ResidentForm) => {
    AddResidentMutation.mutate(formData);
  };

  return (
    <Modal modalId="add_resident_modal" onClose={onClose}>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-400">Add Resident</h1>
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
            className="p-2 border rounded-md"
          />
          {errors.name && (
            <span className="text-sm text-red-500">{errors.name.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="studentId"
            className="text-sm font-medium text-gray-400"
          >
            Student ID*
          </label>
          <input
            {...register("studentId", { required: "Student ID is required" })}
            type="text"
            id="studentId"
            placeholder="Enter student ID"
            className="p-2 border rounded-md"
          />
          {errors.studentId && (
            <span className="text-sm text-red-500">
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
            className="p-2 border rounded-md"
          />
          {errors.course && (
            <span className="text-sm text-red-500">{errors.course.message}</span>
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
            className="p-2 border rounded-md"
          />
          {errors.email && (
            <span className="text-sm text-red-500">{errors.email.message}</span>
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
            className="p-2 border rounded-md"
          />
          {errors.phone && (
            <span className="text-sm text-red-500">{errors.phone.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="gender" className="text-sm font-medium text-gray-400">
            Gender*
          </label>
          <select
            {...register("gender", { required: "Gender is required" })}
            id="gender"
            className="p-2 border rounded-md"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {errors.gender && (
            <span className="text-sm text-red-500">{errors.gender.message}</span>
          )}
        </div>

        <div className="pt-4 mt-2 border-t">
          <h2 className="mb-4 text-lg font-semibold">Emergency Contact</h2>

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
              className="p-2 border rounded-md"
            />
            {errors.emergencyContactName && (
              <span className="text-sm text-red-500">
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
              className="p-2 border rounded-md"
            />
            {errors.emergencyContactPhone && (
              <span className="text-sm text-red-500">
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
              className="p-2 border rounded-md"
            />
            {errors.relationship && (
              <span className="text-sm text-red-500">
                {errors.relationship.message}
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-white bg-red-600 border rounded-md hover:bg-red-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white rounded-md bg-primary hover:bg-primary/90"
          >
            {AddResidentMutation.isPending ? (
              <span className="flex items-center w-full gap-2">
                <Loader className="animate-spin" size={16} />
                <span className="ml-2">Adding Resident...</span>
              </span>
            ) : (
              <span>Add Resident</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddResidentModal;