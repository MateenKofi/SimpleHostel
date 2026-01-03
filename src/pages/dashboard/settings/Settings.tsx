import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Loader,
  LucideCircleArrowOutUpRight,
  Settings2,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getHostelById, updateHostel, updatePaymentSettings } from "@/api/hostels";
import CustomeRefetch from "@/components/CustomeRefetch";
import ImageUpload from "@/components/ImageUpload";
import UploadSingleImage from "@/components/UploadSingleImage";
import SEOHelmet from "@/components/SEOHelmet";
import SettingsSkeleton from "@/components/loaders/SettingsLoader";
import { TextField } from "@/components/TextField";

// Validation schema
const formSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  address: z.string().min(5),
  location: z.string().min(2),
  manager: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  ghCard: z.string().min(5),
  allowPartialPayment: z.boolean().default(false),
  partialPaymentPercentage: z.coerce.number().min(0).max(100).default(50),
});

const Settings = () => {
  const [images, setImages] = useState<File[]>([]);
  const [defaultImages, setDefaultImages] = useState<string[]>([]);
  const [logo, setLogo] = useState<string | File | null>(null);
  const [previewLogo, setPreviewLogo] = useState<string>("");
  const hostelId = localStorage.getItem("hostelId");

  const {
    data: hostelData,
    isLoading,
    isError,
    refetch: refetchHostel,
  } = useQuery({
    queryKey: ["hostel"],
    queryFn: async () => {
      if (!hostelId) return null;
      const response = await getHostelById(hostelId);
      return response.data;
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      location: "",
      manager: "",
      email: "",
      phone: "",
      ghCard: "",
      allowPartialPayment: false,
      partialPaymentPercentage: 50,
    },
  });

  useEffect(() => {
    if (hostelData) {
      form.reset(hostelData);
      setPreviewLogo(hostelData.logoUrl);
      const hostelImages = hostelData.HostelImages?.map(
        (hostelImage: { imageUrl: string }) => {
          return hostelImage.imageUrl;
        }
      );
      setDefaultImages(hostelImages || []);
    }
  }, [hostelData, form]);


  const handleRemoveDefaultImage = (index: number) => {
    setDefaultImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImagesChange = (newImages: File[]) => {
    const imageArray = Array.from(newImages).map((image) => {
      const file = new File([image], image.name, { type: image.type });
      return file;
    });
    setImages(imageArray);
  };

  const updateMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const formData = new FormData();
      formData.append("name", data.name.toUpperCase());
      formData.append("description", data.description || "");
      formData.append("address", data.address.toUpperCase());
      formData.append("email", data.email);
      formData.append("phone", data.phone);

      images.forEach((image) => {
        if (image instanceof File) {
          formData.append("photos", image);
        }
      });
      if (logo) {
        formData.append("logo", logo);
      }

      try {
        if (!hostelId) throw new Error("Hostel ID not found");
        const responseData = await updateHostel(hostelId, formData);
        toast.success("Hostel updated successfully");
        return responseData;
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to Update Hostel";
        toast.error(errorMessage);
        throw error;
      }
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateMutation.mutate(values);
  };

  const paymentSettingsMutation = useMutation({
    mutationFn: async (data: { allowPartialPayment: boolean; partialPaymentPercentage: number }) => {
      try {
        if (!hostelId) throw new Error("Hostel ID not found");
        await updatePaymentSettings(hostelId, data);
        toast.success("Payment settings updated successfully");
        refetchHostel();
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to update payment settings");
      }
    }
  });

  const onPaymentSettingsSubmit = (values: z.infer<typeof formSchema>) => {
    paymentSettingsMutation.mutate({
      allowPartialPayment: values.allowPartialPayment,
      partialPaymentPercentage: values.partialPaymentPercentage,
    });
  };

  if (isLoading) return <SettingsSkeleton />;
  if (isError) return <CustomeRefetch refetch={refetchHostel} />;

  return (
    <div className="container max-w-5xl px-4 py-10 mx-auto">
      <SEOHelmet
        title="Settings - Fuse"
        description="Manage your hostel settings and information."
        keywords="settings, hostel, information, management"
      />
      <h1 className="mb-6 text-3xl font-bold tracking-tight">
        Hostel Settings
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* General Info */}
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>
                Manage your hostel’s basic details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Hostel logo*/}
              <div className="flex items-center space-x-2">
                <UploadSingleImage
                  image={logo}
                  setImage={setLogo}
                  previewImage={previewLogo}
                />
              </div>
              <div className="grid w-full grid-cols-1 gap-6">
                <TextField label="Hostel Name" id="name" register={form.register('name')} error={form.formState.errors.name} />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="min-h-[120px]" />
                    </FormControl>
                    <FormDescription>
                      Write a vivid portrait of your hostel.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <TextField id="address" label="Address" register={form.register('address')} error={form.formState.errors.address} placeholder="Enter address" />
              <a
                href="https://www.google.com/maps"
                target="_blank"
                className="mt-4 italic tracking-tighter text-blue-400 underline "
              >
                <p className="flex items-center gap-1">
                  {" "}
                  Get Google Map Location Here{" "}
                  <LucideCircleArrowOutUpRight size={12} />
                </p>
              </a>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>How can residents reach you?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <TextField id="email" label="Email" register={form.register('email')} error={form.formState.errors.email} />
                <TextField id="phone" label="Phone" register={form.register('phone')} error={form.formState.errors.phone} />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Hostel Images</CardTitle>
              <CardDescription>
                Max 3 pictures to paint your story.
              </CardDescription>
            </CardHeader>
            <CardContent className="mx-10">
              {hostelData.HostelImages?.length < 1 ? (
                <div className="p-10 text-center border rounded-lg">
                  <p className="text-muted-foreground">No images yet.</p>
                  <ImageUpload onImagesChange={handleImagesChange} />
                </div>
              ) : (
                <>
                  <span className="text-sm text-muted-foreground">
                    {3 - hostelData?.HostelImages?.length} slots left
                  </span>
                  <ImageUpload
                    onImagesChange={handleImagesChange}
                    defaultImages={defaultImages}
                    onRemoveDefaultImage={handleRemoveDefaultImage}
                  />
                </>
              )}
            </CardContent>
          </Card>

          {/* Payment Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-blue-600" />
                <div>
                  <CardTitle>Payment Settings</CardTitle>
                  <CardDescription>Configure booking payment options</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="allowPartialPayment"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Allow Partial Payment</FormLabel>
                      <FormDescription>
                        Enable residents to pay a deposit instead of full amount during booking.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch("allowPartialPayment") && (
                <div className="p-4 border border-blue-100 rounded-lg bg-blue-50/50">
                  <FormField
                    control={form.control}
                    name="partialPaymentPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Partial Payment Percentage (%)</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            <Input
                              type="number"
                              className="w-32 bg-white"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              min={0}
                              max={100}
                            />
                            <span className="text-sm text-muted-foreground">
                              The resident will pay {field.value}% of the total price as deposit.
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={() => onPaymentSettingsSubmit(form.getValues())}
                  disabled={paymentSettingsMutation.isPending}
                  variant="outline"
                >
                  {paymentSettingsMutation.isPending ? (
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    "Update Payment Settings"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <span className="flex gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span> Saving changes</span>
                </span>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default Settings;
