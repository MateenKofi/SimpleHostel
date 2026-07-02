import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader, User, Phone, Briefcase, Mail, MapPin, Calendar, IdCard, Home, UserCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getStaffById, updateStaff } from "@/api/staff";
import { toast } from "sonner";
import dayjs from "dayjs";
import CustomeRefetch from "../CustomRefetch";
import UploadSingleImage from "../UploadSingleImage";
import type { ApiError } from "@/types/dtos";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { TextInput, SelectInput } from "@/components/form";
import { staffSchema, type StaffFormData } from "@/schemas/staffSchema";

const roles = [
  "HOSTEL_MANAGER",
  "WARDEN",
  "CHIEF_WARDEN"
];

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
    control,
    formState: { errors },
    reset,
    setError,
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    mode: "onChange",
  });

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
        
        const nameParts = data.name.trim().split(/\s+/);
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || firstName;
        
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("email", data.email);
        formData.append("phoneNumber", data.phone);
        formData.append("maritalStatus", data.maritalStatus.toUpperCase());
        formData.append("religion", data.religion.toUpperCase());
        formData.append("gender", data.gender.toUpperCase());
        formData.append("nationality", data.nationality);
        formData.append("dateOfBirth", data.dateOfBirth);
        formData.append("middleName", data.middleName || "");
        formData.append("ghanaCardNumber", data.ghanaCardNumber);
        formData.append("residence", data.residence);
        formData.append("qualification", data.qualification);
        formData.append("role", data.role);
        formData.append("block", data.block || "");
        formData.append("dateOfAppointment", data.dateOfAppointment);
        formData.append("type", data.staffType.toUpperCase());

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
        
        // Map backend unique constraint errors to form fields
        if (errorMessage.toLowerCase().includes("email")) {
          setError("email", { message: "Email already registered" });
        } else if (errorMessage.toLowerCase().includes("ghana card")) {
          setError("ghanaCardNumber", { message: "Ghana Card number already registered" });
        } else if (errorMessage.toLowerCase().includes("phone")) {
          setError("phone", { message: "Phone number already registered" });
        }

        toast.error(errorMessage);
        throw error;
      }
    },
  });

  const onSubmit = (data: StaffFormData) => {
    const formattedDOB = dayjs(data.dateOfBirth).toISOString();
    const formattedDateOfAppointment = dayjs(data.dateOfAppointment).toISOString();
    
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
        backgroundImage="https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?auto=format&fit=crop&w=1200&q=80"
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
                {...register("name")}
                label="Full Name *"
                placeholder="Enter full name"
                leftIcon={User}
                error={errors.name?.message}
              />

              <TextInput
                {...register("middleName")}
                label="Middle Name"
                placeholder="Enter middle name"
                leftIcon={UserCircle}
                error={errors.middleName?.message}
              />

              <TextInput
                {...register("dateOfBirth")}
                type="date"
                label="Date of Birth *"
                leftIcon={Calendar}
                error={errors.dateOfBirth?.message}
              />

              <TextInput
                {...register("nationality")}
                label="Nationality *"
                placeholder="e.g. Ghanaian"
                leftIcon={MapPin}
                error={errors.nationality?.message}
              />

              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    label="Gender *"
                    placeholder="Select Gender"
                    options={[
                      { value: "MALE", label: "Male" },
                      { value: "FEMALE", label: "Female" },
                    ]}
                    error={errors.gender?.message}
                    value={field.value}
                    onValueChange={field.onChange}
                    name={field.name}
                  />
                )}
              />

              <Controller
                name="religion"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    label="Religion *"
                    placeholder="Select Religion"
                    options={[
                      { value: "CHRISTIAN", label: "Christian" },
                      { value: "MUSLIM", label: "Muslim" },
                      { value: "TRADITIONALIST", label: "Traditionalist" },
                    ]}
                    error={errors.religion?.message}
                    value={field.value}
                    onValueChange={field.onChange}
                    name={field.name}
                  />
                )}
              />

              <Controller
                name="maritalStatus"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    label="Marital Status *"
                    placeholder="Select Marital Status"
                    options={[
                      { value: "SINGLE", label: "Single" },
                      { value: "MARRIED", label: "Married" },
                      { value: "DIVORCED", label: "Divorced" },
                      { value: "WIDOWED", label: "Widowed" },
                    ]}
                    error={errors.maritalStatus?.message}
                    value={field.value}
                    onValueChange={field.onChange}
                    name={field.name}
                  />
                )}
              />

              <TextInput
                {...register("ghanaCardNumber")}
                label="Ghana Card Number *"
                placeholder="GHA-XXXX-XXXX-XXXX"
                leftIcon={IdCard}
                error={errors.ghanaCardNumber?.message}
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
                {...register("phone")}
                type="tel"
                label="Phone Number *"
                placeholder="024 123 4567"
                leftIcon={Phone}
                error={errors.phone?.message}
              />
              <TextInput
                {...register("email")}
                type="email"
                label="Email *"
                placeholder="someone@example.com"
                leftIcon={Mail}
                error={errors.email?.message}
              />
              <TextInput
                {...register("residence")}
                label="Residence *"
                placeholder="Enter Residence"
                leftIcon={Home}
                error={errors.residence?.message}
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
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    label="Role/Position *"
                    placeholder="Select Role"
                    leftIcon={Briefcase}
                    options={roles.map((role) => ({ value: role, label: role }))}
                    error={errors.role?.message}
                    value={field.value}
                    onValueChange={field.onChange}
                    name={field.name}
                  />
                )}
              />

              <Controller
                name="staffType"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    label="Staff Type *"
                    placeholder="Select Staff Type"
                    options={[
                      { value: "ADMIN", label: "Admin" },
                      { value: "OTHERS", label: "Others" },
                    ]}
                    error={errors.staffType?.message}
                    value={field.value}
                    onValueChange={field.onChange}
                    name={field.name}
                  />
                )}
              />

              <Controller
                name="qualification"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    label="Qualification *"
                    placeholder="Select Qualification"
                    options={[
                      { value: "WASCE", label: "WASCE (High School)" },
                      { value: "BECE", label: "BECE (JHS)" },
                      { value: "TVET", label: "TVET / Certificate" },
                      { value: "HND", label: "HND" },
                      { value: "DIPLOMA", label: "Diploma" },
                      { value: "BSC", label: "Bachelor's Degree (BSc)" },
                      { value: "MSC", label: "Master's Degree (MSc)" },
                      { value: "PHD", label: "Doctorate (PhD)" },
                    ]}
                    error={errors.qualification?.message}
                    value={field.value}
                    onValueChange={field.onChange}
                    name={field.name}
                  />
                )}
              />

              <TextInput
                {...register("block")}
                label="Block (Optional)"
                placeholder="Enter Block"
                error={errors.block?.message}
              />

              <TextInput
                {...register("dateOfAppointment")}
                type="date"
                label="Date of Appointment *"
                leftIcon={Calendar}
                error={errors.dateOfAppointment?.message}
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
