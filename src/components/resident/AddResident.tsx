"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { ArrowLeft, Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
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
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { addResident } from "@/api/residents";
import { ResidentFormSchema, AdminResidentFormSchema } from "@/schemas/ResidentForm.schema";
import { z } from "zod";
import { useAddedResidentStore } from "@/stores/useAddedResidentStore";

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
    formState: { errors },
    reset,
  } = useForm<AddResidentInputs>({
    resolver: zodResolver(AdminResidentFormSchema),
  });

  const AddResidentMutation = useMutation({
    mutationFn: async (resident_data: AddResidentInputs) => {
      const formData = new FormData();
      formData.append("name", resident_data.name);
      formData.append("studentId", resident_data.studentId);
      formData.append("course", resident_data.course);
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
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Failed to Add Resident";
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
      <Card className="w-full max-w-2xl mx-auto my-4 shadow-lg">
        <CardHeader className="space-y-1 text-white bg-black rounded-t-lg">
          <div className="flex items-center gap-2">
            <UserPlus className="w-6 h-6" />
            <CardTitle className="text-2xl font-bold">Add Resident</CardTitle>
          </div>
          <CardDescription className="text-primary-foreground/80">
            Fill out the form below to add a new resident.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="font-medium">Full Name*</label>
                <Input placeholder="Enter full name" {...register("name")} />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="font-medium">Student ID*</label>
                  <Input
                    placeholder="Enter student ID"
                    {...register("studentId")}
                  />
                  {errors.studentId && (
                    <p className="text-sm text-red-500">
                      {errors.studentId.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-medium">Course*</label>
                  <Input placeholder="Enter course" {...register("course")} />
                  {errors.course && (
                    <p className="text-sm text-red-500">
                      {errors.course.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="font-medium">Email*</label>
                  <Input
                    type="email"
                    placeholder="Enter email"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-medium">Phone Number*</label>
                  <Input
                    placeholder="Enter phone number"
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Gender Select with Controller */}
              <div>
                <label className="font-medium">Gender*</label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.gender && (
                  <p className="text-sm text-red-500">
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Emergency Contact</h3>
              <Separator className="my-2" />

              <div>
                <label className="font-medium">Contact Name*</label>
                <Input
                  placeholder="Enter emergency contact name"
                  {...register("emergencyContactName")}
                />
                {errors.emergencyContactName && (
                  <p className="text-sm text-red-500">
                    {errors.emergencyContactName.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="font-medium">Contact Phone*</label>
                  <Input
                    placeholder="Enter contact phone"
                    {...register("emergencyContactPhone")}
                  />
                  {errors.emergencyContactPhone && (
                    <p className="text-sm text-red-500">
                      {errors.emergencyContactPhone.message}
                    </p>
                  )}
                </div>

                {/* Relationship Select with Controller */}
                <div>
                  <label className="font-medium">Relationship*</label>
                  <Controller
                    name="relationship"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
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
                  {errors.relationship && (
                    <p className="text-sm text-red-500">
                      {errors.relationship.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <CardFooter className="px-0 pt-2 pb-0">
              <Button
                type="submit"
                className="w-full"
                disabled={AddResidentMutation.isPending}
              >
                {AddResidentMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding Resident...
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
