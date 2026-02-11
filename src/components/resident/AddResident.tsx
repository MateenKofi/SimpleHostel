"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import {
  ArrowLeft,
  Loader2,
  UserPlus,
  Mail,
  Phone,
  GraduationCap,
  Heart,
  User,
  UserCircle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { addResident } from "@/api/residents";
import { AdminResidentFormSchema } from "@/schemas/ResidentForm.schema";
import { z } from "zod";
import { useAddedResidentStore } from "@/stores/useAddedResidentStore";
import type { ApiError } from "@/types/dtos";

type AddResidentInputs = z.infer<typeof AdminResidentFormSchema>;

const AddResident = () => {
  const setResident = useAddedResidentStore((state) => state.setResident);
  const calendarYearId = localStorage.getItem("calendarYear") || "";
  const hostelId = localStorage.getItem("hostelId") || "";

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, touchedFields },
    reset,
  } = useForm<AddResidentInputs>({
    resolver: zodResolver(AdminResidentFormSchema),
  });

  const AddResidentMutation = useMutation({
    mutationFn: async (resident_data: AddResidentInputs) => {
      const formData = new FormData();
      formData.append("name", resident_data.name);
      formData.append("studentId", resident_data.studentId || "");
      formData.append("course", resident_data.course || "");
      formData.append("phone", resident_data.phone || "");
      formData.append("email", resident_data.email);
      formData.append(
        "emergencyContactName",
        resident_data.emergencyContactName
      );
      formData.append(
        "emergencyContactPhone",
        resident_data.emergencyContactPhone || ""
      );
      formData.append("relationship", resident_data.relationship);
      formData.append("gender", resident_data.gender.toUpperCase());
      formData.append("hostelId", hostelId);
      formData.append("calendarYearId", calendarYearId);

      try {
        const responseData = await addResident(formData);
        reset();
        setResident(responseData?.data);
        setTimeout(() => {
          navigate("/dashboard/room-assignment");
        }, 50);
        return responseData;
      } catch (error: unknown) {
        const err = error as ApiError;
        const errorMessage = err.response?.data?.message || "Failed to Add Resident";
        toast.error(errorMessage);
        throw error;
      }
    },
  });

  const onSubmit: SubmitHandler<AddResidentInputs> = (values) => {
    AddResidentMutation.mutate(values);
  };

  return (
    <div className="flex flex-col items-start justify-between w-full py-4 mx-auto border">
      <div className="w-full max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center px-4 py-2 text-white rounded-md y-2 bg-primary"
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          Back
        </button>
      </div>
      <Card className="w-full max-w-2xl mx-auto my-4 shadow-lg border-border/50">
        <CardHeader className="space-y-1 bg-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center gap-2">
            <UserPlus className="w-6 h-6" />
            <CardTitle className="text-2xl font-bold">Add Resident</CardTitle>
          </div>
          <CardDescription className="text-primary-foreground/80">
            Fill out the form below to add a new resident.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <UserCircle className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
              </div>

              {/* Full Name Field */}
              <div>
                <label htmlFor="name" className="font-medium text-sm text-foreground">
                  Full Name*
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Enter full name"
                    className="h-11 pl-10"
                    {...register("name")}
                  />
                </div>
                {touchedFields.name && errors.name && (
                  <p className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="studentId" className="font-medium text-sm text-foreground">
                    Student ID*
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
                    <Input
                      id="studentId"
                      placeholder="Enter student ID"
                      className="h-11 pl-10"
                      {...register("studentId")}
                    />
                  </div>
                  {touchedFields.studentId && errors.studentId && (
                    <p className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" />
                      {errors.studentId.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="course" className="font-medium text-sm text-foreground">
                    Course*
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="course"
                      placeholder="Enter course"
                      className="h-11 pl-10"
                      {...register("course")}
                    />
                  </div>
                  {touchedFields.course && errors.course && (
                    <p className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" />
                      {errors.course.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="email" className="font-medium text-sm text-foreground">
                    Email*
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email"
                      className="h-11 pl-10"
                      {...register("email")}
                    />
                  </div>
                  {touchedFields.email && errors.email && (
                    <p className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="font-medium text-sm text-foreground">
                    Phone Number*
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      placeholder="Enter phone number"
                      className="h-11 pl-10"
                      {...register("phone")}
                    />
                  </div>
                  {touchedFields.phone && errors.phone && (
                    <p className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" />
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Gender Select with Controller */}
              <div>
                <label htmlFor="gender" className="font-medium text-sm text-foreground">
                  Gender*
                </label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {touchedFields.gender && errors.gender && (
                  <p className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" />
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>
            {/* End Personal Information Section */}

            {/* Emergency Contact Section */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <Heart className="w-5 h-5 text-destructive" />
                <h3 className="text-lg font-semibold text-foreground">Emergency Contact</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="emergencyContactName" className="font-medium text-sm text-foreground">
                    Contact Name*
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="emergencyContactName"
                      placeholder="Enter emergency contact name"
                      className="h-11 pl-10"
                      {...register("emergencyContactName")}
                    />
                  </div>
                  {touchedFields.emergencyContactName && errors.emergencyContactName && (
                    <p className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" />
                      {errors.emergencyContactName.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="emergencyContactPhone" className="font-medium text-sm text-foreground">
                      Contact Phone*
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="emergencyContactPhone"
                        placeholder="Enter contact phone"
                        className="h-11 pl-10"
                        {...register("emergencyContactPhone")}
                      />
                    </div>
                    {touchedFields.emergencyContactPhone && errors.emergencyContactPhone && (
                      <p className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                        <Info className="w-3.5 h-3.5" />
                        {errors.emergencyContactPhone.message}
                      </p>
                    )}
                  </div>

                  {/* Relationship Select with Controller */}
                  <div>
                    <label htmlFor="relationship" className="font-medium text-sm text-foreground">
                      Relationship*
                    </label>
                    <Controller
                      name="relationship"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="parent">Parent</SelectItem>
                            <SelectItem value="sibling">Sibling</SelectItem>
                            <SelectItem value="spouse">Spouse</SelectItem>
                            <SelectItem value="child">Child</SelectItem>
                            <SelectItem value="guardian">Guardian</SelectItem>
                            <SelectItem value="friend">Friend</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {touchedFields.relationship && errors.relationship && (
                      <p className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                        <Info className="w-3.5 h-3.5" />
                        {errors.relationship.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* End Emergency Contact Section */}

            <CardFooter className="px-0 pt-4 pb-0">
              <Button
                type="submit"
                className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 font-medium"
                disabled={AddResidentMutation.isPending}
              >
                {AddResidentMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Resident Profile...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Resident
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddResident;
