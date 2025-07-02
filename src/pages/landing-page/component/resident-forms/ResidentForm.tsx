"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
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
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useSelectedRoomStore } from "@/controllers/SelectedRoomStore";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ResidentFormSchema } from "@/schemas/ResidentForm.schema";
import { z } from "zod";
import { useSelectedCalendarYearStore } from "@/controllers/SelectedCalendarYear";
import { useAddedResidentStore } from "@/controllers/AddedResident";
import SEOHelmet from "@/components/SEOHelmet";


type ResidentFormInputs = z.infer<typeof ResidentFormSchema>;

const ResidentForm = () => {
  const setResident = useAddedResidentStore((state)=> state.setResident)

  const calendarYear = useSelectedCalendarYearStore(
    (state) => state.calendarYear
  );

  const { room } = useSelectedRoomStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResidentFormInputs>({
    resolver: zodResolver(ResidentFormSchema),
  });

  const AddResidentMutation = useMutation({
    mutationFn: async (resident_data: ResidentFormInputs) => {
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
      formData.append("hostelId", room?.hostelId || "");
      formData.append("calendarYearId", calendarYear?.id || "");
      formData.append("roomId", room?.id || "");

      try {
        const response = await axios.post(`/api/residents/register`, formData);
        reset();
        setResident(response.data?.data);
        setTimeout(() => {
          navigate("/payment");
        }, 50);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response);
          console.log('error message',error?.response?.data);
          const errorMessage =
            error.response?.data?.message || "Failed to Add Resident";
          toast.error(errorMessage);
        } else {
          toast.error("An unexpected error occurred");
        }
      }
    },
  });

  const onSubmit: SubmitHandler<ResidentFormInputs> = (values) => {
    if (room?.gender === values.gender) {
      AddResidentMutation.mutate(values);
    }
    else {
      toast.error("Gender does not match selected room gender");
      toast.error("Make sure you select room according to your gender");
    }
  };

  return (
    <div className='py-4'>
      <SEOHelmet
        title="Add Resident - Fuse"
        description="Add a new resident to the system."
        keywords="add resident, Fuse, hostel" 
      />
      <div className="w-full max-w-2xl mx-auto">
              <button onClick={() => navigate(-1)} className="flex items-center px-4 py-2 text-white rounded-md y-2 bg-primary">
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
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="font-medium">Phone Number*</label>
                <Input
                  placeholder="Enter phone number"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>
            </div>
            <div>
              <label className="font-medium">Gender*</label>
              <select
                {...register("gender")}
                className="w-full px-3 py-2 text-gray-500 bg-white border rounded"
              >
                <option>-- Select Gender --</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
              {errors.gender && (
                <p className="text-sm text-red-500">{errors.gender.message}</p>
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

              <div>
                <label className="font-medium">Relationship*</label>
                <Input
                  placeholder="e.g. Parent, Sibling"
                  {...register("relationship")}
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

export default ResidentForm;
