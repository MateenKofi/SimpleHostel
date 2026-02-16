import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader, User, Phone, Briefcase } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { addStaff } from "@/api/staff";
import { toast } from "sonner";
import dayjs from "dayjs";
import UploadSingleImage from "@/components/UploadSingleImage";
import type { ApiError } from "@/types/dtos";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";

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

interface StaffFormData {
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: string;
  staffType: string;
  middleName?: string;
  dateOfBirth: string;
  nationality: string;
  gender: string;
  religion: string;
  maritalStatus: string;
  ghanaCardNumber: string;
  residence: string;
  qualification: string;
  block?: string;
  dateOfAppointment: string;
}

const AddStaff: React.FC = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState<string | File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StaffFormData>();

  const hostelId = localStorage.getItem("hostelId");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: StaffFormData) => {
      try {
        const formData = new FormData();
        formData.append("hostelId", hostelId || "");
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("phone", data.phone);
        if (data.password) {
          formData.append("password", data.password);
        }
        formData.append("role", "staff"); // User role
        formData.append("maritalStatus", data.maritalStatus?.toUpperCase());
        formData.append("religion", data.religion?.toUpperCase());
        formData.append("gender", data.gender?.toUpperCase());
        formData.append("nationality", data.nationality);
        formData.append("dateOfBirth", data.dateOfBirth);
        formData.append("middleName", data.middleName || "");
        formData.append("ghanaCardNumber", data.ghanaCardNumber);
        formData.append("residence", data.residence);
        formData.append("qualification", data.qualification);
        formData.append("staffRole", data.role); // Staff profile role/job title
        formData.append("block", data.block || "");
        formData.append("dateOfAppointment", data.dateOfAppointment);
        formData.append("type", data.staffType?.toUpperCase());
        if (image) {
          formData.append("photo", image);
        }

        const responseData = await addStaff(formData);
        queryClient.invalidateQueries({ queryKey: ["staffs"] });
        toast.success("Staff added successfully");
        reset();
        setImage(null);
        navigate("/dashboard/staff-management");
        return responseData;
      } catch (error: unknown) {
        const err = error as ApiError;
        const errorMessage = err.response?.data?.message || "Failed to add staff";
        toast.error(errorMessage);
        throw error;
      }
    },
  });

  const onSubmit = (data: StaffFormData) => {
    const formattedDOB = dayjs(data.dateOfBirth).format(
      "YYYY-MM-DDTHH:mm:ss[Z]"
    );
    const formattedDateOfAppointment = dayjs(data.dateOfAppointment).format(
      "YYYY-MM-DDTHH:mm:ss[Z]"
    );
    mutation.mutate({
      ...data,
      dateOfBirth: formattedDOB,
      dateOfAppointment: formattedDateOfAppointment,
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageHeader
        title="Add Staff"
        subtitle="Add a new staff member to your hostel"
        icon={User}
        showBackButton={true}
      />

      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-4xl mx-auto w-full"
        >
          {/* Photo Upload Section */}
          <div className="bg-card border border-border rounded-lg shadow-sm p-4 md:p-6 mb-6">
            <div className="flex flex-col items-center justify-center">
              <UploadSingleImage image={image} setImage={setImage} />
              <p className="mt-2 text-sm text-muted-foreground text-center">
                Upload a profile photo for the staff member
              </p>
            </div>
          </div>

          {/* Personal Details */}
          <div className="bg-card border border-border rounded-lg shadow-sm p-4 md:p-6 mb-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Personal Details</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-foreground">
                  Full Name <span className="text-destructive">*</span>
                </label>
                <input
                  {...register("name", {
                    required: "Full name is required",
                  })}
                  type="text"
                  className="w-full p-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter full name"
                />
                {errors.name && (
                  <span className="text-xs text-destructive">
                    {errors.name.message?.toString()}
                  </span>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-foreground">
                  Middle Name
                </label>
                <input
                  {...register("middleName")}
                  type="text"
                  className="w-full p-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter middle name"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-foreground">
                  Date of Birth <span className="text-destructive">*</span>
                </label>
                <input
                  {...register("dateOfBirth", {
                    required: "Date of birth is required",
                  })}
                  type="date"
                  className="w-full p-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {errors.dateOfBirth && (
                  <span className="text-xs text-destructive">
                    {errors.dateOfBirth.message?.toString()}
                  </span>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-foreground">
                  Nationality <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  {...register("nationality", {
                    required: "Nationality is required",
                  })}
                  className="w-full p-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g. Ghanaian"
                />
                {errors.nationality && (
                  <span className="text-xs text-destructive">
                    {errors.nationality.message?.toString()}
                  </span>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-foreground">
                  Gender <span className="text-destructive">*</span>
                </label>
                <select
                  {...register("gender", { required: "Gender is required" })}
                  className="w-full p-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">-- Select Gender --</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
                {errors.gender && (
                  <span className="text-xs text-destructive">
                    {errors.gender.message?.toString()}
                  </span>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-foreground">
                  Religion <span className="text-destructive">*</span>
                </label>
                <select
                  {...register("religion", { required: "Religion is required" })}
                  className="w-full p-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">-- Select Religion --</option>
                  <option value="CHRISTIAN">Christian</option>
                  <option value="MUSLIM">Muslim</option>
                  <option value="TRADITIONALIST">Traditionalist</option>
                </select>
                {errors.religion && (
                  <span className="text-xs text-destructive">
                    {errors.religion.message?.toString()}
                  </span>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-foreground">
                  Marital Status <span className="text-destructive">*</span>
                </label>
                <select
                  {...register("maritalStatus", {
                    required: "Marital status is required",
                  })}
                  className="w-full p-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">-- Select Marital Status --</option>
                  <option value="SINGLE">Single</option>
                  <option value="MARRIED">Married</option>
                  <option value="DIVORCED">Divorced</option>
                  <option value="WIDOWED">Widowed</option>
                </select>
                {errors.maritalStatus && (
                  <span className="text-xs text-destructive">
                    {errors.maritalStatus.message?.toString()}
                  </span>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-foreground">
                  Ghana Card Number <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  {...register("ghanaCardNumber", {
                    required: "Ghana card number is required",
                  })}
                  className="w-full p-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="GHA-XXXX-XXXX-XXXX"
                />
                {errors.ghanaCardNumber && (
                  <span className="text-xs text-destructive">
                    {errors.ghanaCardNumber.message?.toString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-card border border-border rounded-lg shadow-sm p-4 md:p-6 mb-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
              <Phone className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Contact Details</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-foreground">
                  Phone Number <span className="text-destructive">*</span>
                </label>
                <input
                  {...register("phone", {
                    required: "Phone number is required",
                  })}
                  type="tel"
                  className="w-full p-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="024 123 4567"
                />
                {errors.phone && (
                  <span className="text-xs text-destructive">
                    {errors.phone.message?.toString()}
                  </span>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-foreground">
                  Email <span className="text-destructive">*</span>
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
                  className="w-full p-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="someone@example.com"
                />
                {errors.email && (
                  <span className="text-xs text-destructive">
                    {errors.email.message?.toString()}
                  </span>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-foreground">
                  Residence <span className="text-destructive">*</span>
                </label>
                <input
                  {...register("residence", {
                    required: "Residence is required",
                  })}
                  type="text"
                  className="w-full p-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="City, Region"
                />
                {errors.residence && (
                  <span className="text-xs text-destructive">
                    {errors.residence.message?.toString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="bg-card border border-border rounded-lg shadow-sm p-4 md:p-6 mb-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
              <Briefcase className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Job Details</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-foreground">
                  Role/Position <span className="text-destructive">*</span>
                </label>
                <select
                  {...register("role", {
                    required: "Role is required",
                  })}
                  className="w-full p-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">-- Select Role --</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <span className="text-xs text-destructive">
                    {errors.role.message?.toString()}
                  </span>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-foreground">
                  Staff Type <span className="text-destructive">*</span>
                </label>
                <select
                  {...register("staffType", {
                    required: "Staff type is required",
                  })}
                  className="w-full p-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">-- Select Staff Type --</option>
                  <option value="ADMIN">Admin</option>
                  <option value="OTHERS">Others</option>
                </select>
                {errors.staffType && (
                  <span className="text-xs text-destructive">
                    {errors.staffType.message?.toString()}
                  </span>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-foreground">
                  Qualification <span className="text-destructive">*</span>
                </label>
                <input
                  {...register("qualification", {
                    required: "Qualification is required",
                  })}
                  type="text"
                  className="w-full p-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Degree, Certificate, etc."
                />
                {errors.qualification && (
                  <span className="text-xs text-destructive">
                    {errors.qualification.message?.toString()}
                  </span>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-foreground">
                  Block (Optional)
                </label>
                <input
                  {...register("block")}
                  type="text"
                  className="w-full p-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g. A, B, C"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-foreground">
                  Date of Appointment <span className="text-destructive">*</span>
                </label>
                <input
                  {...register("dateOfAppointment", {
                    required: "Date of appointment is required",
                  })}
                  type="date"
                  className="w-full p-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {errors.dateOfAppointment && (
                  <span className="text-xs text-destructive">
                    {errors.dateOfAppointment.message?.toString()}
                  </span>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-foreground">
                  Password (Optional)
                </label>
                <input
                  {...register("password")}
                  type="password"
                  className="w-full p-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Leave blank for auto-generated"
                />
                {errors.password && (
                  <span className="text-xs text-destructive">
                    {errors.password.message?.toString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end sticky bottom-0 bg-background p-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={mutation.isPending}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full sm:w-auto"
            >
              {mutation.isPending ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Adding Staff...
                </>
              ) : (
                <>
                  <User className="w-4 h-4 mr-2" />
                  Add Staff Member
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddStaff;
