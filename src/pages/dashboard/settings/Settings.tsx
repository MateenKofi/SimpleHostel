import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Building, Loader, Mail, MapPin, Phone } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import CustomeRefetch from "@/components/CustomeRefetch";
import ImageUpload from "@/components/ImageUpload";
import UploadSingleImage from "@/components/UploadSingleImage";
import SEOHelmet from "@/components/SEOHelmet";
// import { images } from "@/helper/types/types"

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
});

const Settings = () => {
  const [images, setImages] = useState<File[]>([]);
  const [defaultImages, setDefaultImages] = useState<string[]>([]);
  const [logo, setLogo] = useState<string  | File | null>(null);
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
      const resp = await axios.get(`/api/hostels/get/${hostelId}`);
      return resp.data.data;
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

  // Remove a default image from the UI
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
        formData.append("photos", image);
      });
      if (logo) {
        formData.append("logo", logo);
      }


      try {
        const res = await axios.put(
          `/api/hostels/update/${hostelId}`,
          formData,
         
        );
        toast.success("Hostel Listed successfully");
        return res.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const errorMessage =
            error.response.data.error || "Failed to Update Hostel";
          toast.error(errorMessage);
        } else {
          toast.error("Failed to Update Hostel");
        }
      }
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateMutation.mutate(values);
  };

  if (isLoading) return <p>Loading settings...</p>;
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
               <UploadSingleImage image={logo} setImage={setLogo} previewImage={previewLogo}/>
              </div>
              <div className="grid w-full grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hostel Name</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Building className="w-4 h-4 text-muted-foreground" />
                          <Input {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <Input {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>How can folks reach you?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <Input {...field} type="email" />
                        </div>
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
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <Input {...field} type="tel" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
