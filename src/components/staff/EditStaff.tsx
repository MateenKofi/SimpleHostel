import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader, User, Phone, Briefcase, Mail, MapPin, Calendar, IdCard, Home, GraduationCap, UserCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getStaffById, updateStaff } from "@/api/staff";
import { toast } from "sonner";
import dayjs from "dayjs";
import CustomeRefetch from "../CustomRefetch";
import UploadSingleImage from "../UploadSingleImage";
import type { ApiError } from "@/types/dtos";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { TextInput, SelectInput } from "@/components/form";

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
  } = useForm<StaffFormData>();

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
      setValue("name", staff_details.user?.name || "");
      setValue("middleName", staff_details.middleName || "");
      setValue("email", staff_details.user?.email || "");
      setValue("phone", staff_details.user?.phone || "");
      setValue("gender", staff_details.user?.gender || "");
      setValue(
        "dateOfBirth",
        staff_details.dateOfBirth
          ? dayjs(staff_details.dateOfBirth).format("YYYY-MM-DD")
          : ""
      );
      setValue("nationality", staff_details.nationality || "");
      setValue("maritalStatus", staff_details.maritalStatus || "");
      setValue("religion", staff_details.religion || "");
      setValue("ghanaCardNumber", staff_details.ghanaCardNumber || "");
      setValue("residence", staff_details.residence || "");
      setValue("qualification", staff_details.qualification || "");
      setValue("role", staff_details.role || "");
      setValue("block", staff_details.block || "");
      setValue(
        "dateOfAppointment",
        staff_details.dateOfAppointment
          ? dayjs(staff_details.dateOfAppointment).format("YYYY-MM-DD")
          : ""
      );
      setValue("staffType", "OTHERS"); // Default value

      if (staff_details.passportUrl) {
        setImage(staff_details.passportUrl);
      }
    }
  }, [staff_details, setValue]);

  const EditStaffMutation = useMutation({
    mutationFn: async (data: StaffFormData) => {
      try {
        const formData = new FormData();
        formData.append("hostelId", hostelId || "");
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("phone", data.phone);
        formData.append("maritalStatus", data.maritalStatus?.toUpperCase());
        formData.append("religion", data.religion?.toUpperCase());
        formData.append("gender", data.gender?.toUpperCase());
        formData.append("nationality", data.nationality);
        formData.append("dateOfBirth", data.dateOfBirth);
        formData.append("middleName", data.middleName || "");
        formData.append("ghanaCardNumber", data.ghanaCardNumber);
        formData.append("residence", data.residence);
        formData.append("qualification", data.qualification);
        formData.append("staffRole", data.role);
        formData.append("block", data.block || "");
        formData.append("dateOfAppointment", data.dateOfAppointment);
        formData.append("type", data.staffType?.toUpperCase());

        if (image) {
          formData.append("photo", image);
        }

        await updateStaff(staffId!, formData);
        queryClient.invalidateQueries({ queryKey: ["staff_details"] });
        queryClient.invalidateQueries({ queryKey: ["staffs"] });
        toast.success("Staff updated successfully");
        reset();
        navigate(-1);
      } catch (error: unknown) {
        const err = error as ApiError;
        const errorMessage = err.response?.data?.message || err.message || "Failed to update staff";
        toast.error(errorMessage);
        throw error;
      }
    },
  });

  const onSubmit = (data: StaffFormData) => {
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
    <div className="min-h-screen bg-background flex flex-col">
      <PageHeader
        title="Edit Staff"
        subtitle="Update staff member information"
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
              <UploadSingleImage setImage={setImage} image={image} />
              <p className="mt-2 text-sm text-muted-foreground text-center">
                Update the profile photo for the staff member
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
              <TextInput
                {...register("name", {
                  required: "Full name is required",
                })}
                label="Full Name *"
                placeholder="Enter full name"
                leftIcon={User}
                error={errors.name?.message?.toString()}
              />

              <TextInput
                {...register("middleName")}
                label="Middle Name"
                placeholder="Enter middle name"
                leftIcon={UserCircle}
              />

              <TextInput
                {...register("dateOfBirth", {
                  required: "Date of birth is required",
                })}
                type="date"
                label="Date of Birth *"
                leftIcon={Calendar}
                error={errors.dateOfBirth?.message?.toString()}
              />

              <TextInput
                {...register("nationality", {
                  required: "Nationality is required",
                })}
                label="Nationality *"
                placeholder="e.g. Ghanaian"
                leftIcon={MapPin}
                error={errors.nationality?.message?.toString()}
              />

              <SelectInput
                {...register("gender", { required: "Gender is required" })}
                label="Gender *"
                placeholder="Select Gender"
                options={[
                  { value: "MALE", label: "Male" },
                  { value: "FEMALE", label: "Female" },
                ]}
                error={errors.gender?.message?.toString()}
              />

              <SelectInput
                {...register("religion", { required: "Religion is required" })}
                label="Religion *"
                placeholder="Select Religion"
                options={[
                  { value: "CHRISTIAN", label: "Christian" },
                  { value: "MUSLIM", label: "Muslim" },
                  { value: "TRADITIONALIST", label: "Traditionalist" },
                ]}
                error={errors.religion?.message?.toString()}
              />

              <SelectInput
                {...register("maritalStatus", {
                  required: "Marital status is required",
                })}
                label="Marital Status *"
                placeholder="Select Marital Status"
                options={[
                  { value: "SINGLE", label: "Single" },
                  { value: "MARRIED", label: "Married" },
                  { value: "DIVORCED", label: "Divorced" },
                  { value: "WIDOWED", label: "Widowed" },
                ]}
                error={errors.maritalStatus?.message?.toString()}
              />

              <TextInput
                {...register("ghanaCardNumber", {
                  required: "Ghana card number is required",
                })}
                label="Ghana Card Number *"
                placeholder="GHA-XXXX-XXXX-XXXX"
                leftIcon={IdCard}
                error={errors.ghanaCardNumber?.message?.toString()}
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-card border border-border rounded-lg shadow-sm p-4 md:p-6 mb-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
              <Phone className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Contact Details</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <TextInput
                {...register("phone", {
                  required: "Phone number is required",
                })}
                type="tel"
                label="Phone Number *"
                placeholder="Enter Phone Number"
                leftIcon={Phone}
                error={errors.phone?.message?.toString()}
              />
              <TextInput
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                type="email"
                label="Email *"
                placeholder="someone@something.com"
                leftIcon={Mail}
                error={errors.email?.message?.toString()}
              />
              <TextInput
                {...register("residence", {
                  required: "Residence is required",
                })}
                label="Residence *"
                placeholder="Enter Residence"
                leftIcon={Home}
                error={errors.residence?.message?.toString()}
              />
            </div>
          </div>

          {/* Job Details */}
          <div className="bg-card border border-border rounded-lg shadow-sm p-4 md:p-6 mb-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
              <Briefcase className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Job Details</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <SelectInput
                {...register("role", { required: "Role is required" })}
                label="Role/Position *"
                placeholder="Select Role"
                leftIcon={Briefcase}
                options={roles.map((role) => ({ value: role, label: role }))}
                error={errors.role?.message?.toString()}
              />

              <SelectInput
                {...register("staffType", { required: "Staff type is required" })}
                label="Staff Type *"
                placeholder="Select Staff Type"
                options={[
                  { value: "ADMIN", label: "Admin" },
                  { value: "OTHERS", label: "Others" },
                ]}
                error={errors.staffType?.message?.toString()}
              />

              <TextInput
                {...register("qualification", {
                  required: "Qualification is required",
                })}
                label="Qualification *"
                placeholder="Enter Qualification"
                leftIcon={GraduationCap}
                error={errors.qualification?.message?.toString()}
              />

              <TextInput
                {...register("block")}
                label="Block (Optional)"
                placeholder="Enter Block"
              />

              <TextInput
                {...register("dateOfAppointment", {
                  required: "Date of appointment is required",
                })}
                type="date"
                label="Date of Appointment *"
                leftIcon={Calendar}
                error={errors.dateOfAppointment?.message?.toString()}
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end sticky bottom-0 bg-background p-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={EditStaffMutation.isPending}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={EditStaffMutation.isPending}
              className="w-full sm:w-auto"
            >
              {EditStaffMutation.isPending ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <User className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditStaff;
