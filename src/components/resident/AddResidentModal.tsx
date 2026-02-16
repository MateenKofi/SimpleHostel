import Modal from "../Modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ResidentDto } from "@/types/dtos";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addResident } from "@/api/residents";
import { Loader, User, Mail, Phone, IdCard, GraduationCap, UserCircle, Users } from "lucide-react";
import { useAddedResidentStore } from "@/stores/useAddedResidentStore";
import { AdminResidentFormSchema } from "@/schemas/ResidentForm.schema";
import { z } from "zod";
import type { ApiError } from "@/types/dtos";
import { TextInput, SelectInput } from "@/components/form";

type AddResidentModalProps = {
  onClose: () => void;
};

type ResidentForm = z.infer<typeof AdminResidentFormSchema>;

const AddResidentModal = ({ onClose }: AddResidentModalProps) => {
  const navigate = useNavigate();
  const setResident = useAddedResidentStore((state) => state.setResident);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResidentForm>({
    resolver: zodResolver(AdminResidentFormSchema),
  });
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
        gender: (data.gender || "").toUpperCase(),
        hostelId: hostelId,
        calendarYearId: calendarYearId,
      };

      return await addResident(payload);
    },
    onSuccess: (response) => {
      const resident = response?.data;
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
    onError: (error: ApiError) => {
      const errorMessage =
        error?.response?.data?.message || error?.message || "Failed to add resident";
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
        <TextInput
          {...register("name")}
          label="Full Name *"
          placeholder="Enter full name"
          leftIcon={User}
          error={errors.name?.message}
        />

        <TextInput
          {...register("studentId")}
          label="Student ID *"
          placeholder="Enter student ID"
          leftIcon={IdCard}
          error={errors.studentId?.message}
        />

        <TextInput
          {...register("course")}
          label="Course *"
          placeholder="Enter course name"
          leftIcon={GraduationCap}
          error={errors.course?.message}
        />

        <TextInput
          {...register("email")}
          type="email"
          label="Email *"
          placeholder="Enter email address"
          leftIcon={Mail}
          error={errors.email?.message}
        />

        <TextInput
          {...register("phone")}
          type="tel"
          label="Phone Number *"
          placeholder="Enter phone number"
          leftIcon={Phone}
          error={errors.phone?.message}
        />

        <SelectInput
          {...register("gender")}
          label="Gender *"
          placeholder="Select gender"
          options={[
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" },
          ]}
          error={errors.gender?.message}
        />

        <div className="pt-4 mt-2 border-t">
          <h2 className="mb-4 text-lg font-semibold">Emergency Contact</h2>

          <TextInput
            {...register("emergencyContactName")}
            label="Contact Name *"
            placeholder="Enter emergency contact name"
            leftIcon={UserCircle}
            error={errors.emergencyContactName?.message}
          />

          <div className="mt-4">
            <TextInput
              {...register("emergencyContactPhone")}
              type="tel"
              label="Contact Phone *"
              placeholder="Enter emergency contact phone"
              leftIcon={Phone}
              error={errors.emergencyContactPhone?.message}
            />
          </div>

          <div className="mt-4">
            <TextInput
              {...register("relationship")}
              label="Relationship *"
              placeholder="Enter relationship (e.g. Parent, Sibling)"
              leftIcon={Users}
              error={errors.relationship?.message}
            />
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