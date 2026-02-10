"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Loader2, UserPen, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { updateResident, getResidentById } from "@/api/residents";
import { ResidentFormSchema } from "@/schemas/ResidentForm.schema";
import { z } from "zod";
import { useAddedResidentStore } from "@/stores/useAddedResidentStore";
import { useEffect } from "react";
import type { ApiError, ResidentDto, UserDto } from "@/types/dtos";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const iconContainerInfo = "p-2.5 rounded-xl bg-gradient-to-br from-forest-green-50 to-forest-green-100/50";

type EditResidentInputs = z.infer<typeof ResidentFormSchema>;

const EditResident = () => {
  const { resident: storedResident, setResident } = useAddedResidentStore();
  const hostelId = localStorage.getItem("hostelId") || "";
  const navigate = useNavigate();

  const form = useForm<EditResidentInputs>({
    resolver: zodResolver(ResidentFormSchema),
    defaultValues: {
      name: "",
      studentId: "",
      course: "",
      phone: "",
      email: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      relationship: "",
      gender: "",
    },
  });

  // Fetch resident data by ID if we have a stored resident with ID
  const { data: residentData, isLoading: isLoadingResident } = useQuery({
    queryKey: ["resident", storedResident?.id],
    queryFn: async () => {
      if (!storedResident?.id) return null;
      const response = await getResidentById(storedResident.id);
      return response?.data;
    },
    enabled: !!storedResident?.id,
  });

  // Use fetched data or stored resident
  const resident = residentData || storedResident;

  useEffect(() => {
    if (resident) {
      // Check if it's a ResidentDto (has userId) or UserDto (no userId)
      const isResidentDto = (resident as any).userId !== undefined;

      form.reset({
        name: isResidentDto
          ? (resident as ResidentDto)?.name || (resident as ResidentDto)?.user?.name || ""
          : (resident as UserDto)?.name || "",
        studentId: isResidentDto ? (resident as ResidentDto)?.studentId || "" : "",
        course: isResidentDto ? (resident as ResidentDto)?.course || "" : "",
        phone: isResidentDto
          ? (resident as ResidentDto)?.phone || (resident as ResidentDto)?.user?.phone || ""
          : (resident as UserDto)?.phone || "",
        email: isResidentDto
          ? (resident as ResidentDto)?.email || (resident as ResidentDto)?.user?.email || ""
          : (resident as UserDto)?.email || "",
        emergencyContactName: isResidentDto ? (resident as ResidentDto)?.emergencyContactName || "" : "",
        emergencyContactPhone: isResidentDto ? (resident as ResidentDto)?.emergencyContactPhone || "" : "",
        relationship: isResidentDto
          ? (resident as ResidentDto)?.emergencyContactRelationship || (resident as ResidentDto)?.relationship || ""
          : "",
        gender: isResidentDto
          ? ((resident as ResidentDto)?.gender || (resident as ResidentDto)?.user?.gender || "")?.toUpperCase()
          : ((resident as UserDto)?.gender || "")?.toUpperCase(),
      });
    }
  }, [resident, form]);

  const EditResidentMutation = useMutation({
    mutationFn: async (resident_data: EditResidentInputs) => {
      const payload = {
        name: resident_data.name,
        studentId: resident_data.studentId || undefined,
        course: resident_data.course || undefined,
        phone: resident_data.phone || undefined,
        email: resident_data.email,
        emergencyContactName: resident_data.emergencyContactName || undefined,
        emergencyContactPhone: resident_data.emergencyContactPhone || undefined,
        emergencyContactRelationship: resident_data.relationship || undefined,
        gender: resident_data.gender.toUpperCase(),
        hostelId: hostelId || undefined,
      };

      try {
        const residentId = (resident as any)?.id || (resident as any)?.userId;
        const responseData = await updateResident(residentId, payload);
        toast.success("Resident updated successfully");
        form.reset();
        setResident(responseData?.data);
        setTimeout(() => {
          navigate("/dashboard/resident-management");
        }, 50);
        return responseData;
      } catch (error: unknown) {
        const err = error as ApiError;
        const errorMessage = err.response?.data?.message || "Failed to update Resident";
        toast.error(errorMessage);
        throw error;
      }
    },
  });

  const onSubmit: SubmitHandler<EditResidentInputs> = (values) => {
    EditResidentMutation.mutate(values);
  };

  if (isLoadingResident && !resident) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <PageHeader
          title="Edit Resident"
          subtitle="Update resident information"
          icon={UserPen}
          showBackButton
        />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading resident information...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PageHeader
        title="Edit Resident"
        subtitle="Update resident information and details"
        icon={UserPen}
        showBackButton
      />

      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={iconContainerInfo}>
                      <UserPen className="w-5 h-5 text-forest-green-700" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Personal Information</CardTitle>
                      <CardDescription className="text-xs">
                        Basic details about the resident
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="studentId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Student ID</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter student ID" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="course"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Course</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter course" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MALE">Male</SelectItem>
                            <SelectItem value="FEMALE">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50">
                      <AlertCircle className="w-5 h-5 text-amber-700" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Emergency Contact</CardTitle>
                      <CardDescription className="text-xs">
                        Person to contact in case of emergency
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-2">
                  <FormField
                    control={form.control}
                    name="emergencyContactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter emergency contact name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="emergencyContactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter contact phone" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="relationship"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Relationship</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Parent, Sibling" {...field} />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Relationship to the resident
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={EditResidentMutation.isPending}
                >
                  {EditResidentMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <UserPen className="w-4 h-4 mr-2" />
                      Update Resident
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
};

export default EditResident;
