import { useState } from "react";
import axios from "axios";
import toast from 'react-hot-toast';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, X, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation } from '@tanstack/react-query';
import axiosInstance from "../../../../api/axiosInstance";
import {PhoneCall} from 'lucide-react'

const formSchema = z.object({
  hostelImage: z.string().optional(),
  description: z.string().optional(),
  hostelName: z.string().min(2, {
    message: "Hostel name must be at least 2 characters.",
  }),
  location: z.string().nonempty({
    message: "Please select a location.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  managerName: z.string().min(2, {
    message: "Manager name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  ghanaCard: z.string().nonempty({
    message: "Please enter a valid Ghana Card number.",
  }),
});

const HostelListingForm = () => {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hostelImage: "",
      hostelName: "",
      description: "",
      location: "",
      address: "",
      managerName: "",
      email: "",
      phone: "",
      ghanaCard: "",
    },
  });

  const AddListingMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const formData = new FormData();
      formData.append('name', data.hostelName.toUpperCase());
      formData.append('description', data.description || '');
      formData.append('location', data.location.toUpperCase());
      formData.append('address', data.address.toUpperCase());
      formData.append('manager', data.managerName.toUpperCase());
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('ghCard', data.ghanaCard);
      if (imageFile) {
        formData.append('photo', imageFile);
      }
      const response = await axiosInstance.post('/api/hostels/add', formData, {
        headers: { 
          'Content-type': 'multipart/form-data',
          'Access-Control-Allow-Origin': '*',
          'Accept': '*/*',
         },
      });
      return response.data;
      console.log(response?.data);
    },
    onSuccess: (data) => {
      console.log('Success:', data);
      setIsSubmitted(true);
      toast.success('Hostel Listed successfully');
    },
    onError: (error: any) => {
      console.error('Error:', error);
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message || 'Failed to List Hostel';
        toast.error(errorMessage);
      } else {
        toast.error('Failed to List Hostel');
      }
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    AddListingMutation.mutate(data, {
      onSettled: () => {
        setIsSubmitting(false);
      },
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImageFile(null);
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center p-4 md:p-8">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-4 bg-white shadow-lg rounded-md overflow-hidden">
        {/* Left Section: Form Fields and Image Upload */}
        <div className="p-4 md:p-6 overflow-y-auto max-h-[80vh] md:max-h-none">
          <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">List Your Hostel</h1>
          {isSubmitted ? (
            <Card className="bg-green-100">
              <CardHeader>
                <CardTitle>Success!</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Your Hostel Has been listed successfully.</p>
                <p>
                 Your hostel will be Reviewed and approved with 24 hours <strong>Fuse</strong> will get in toruch.</p>
                <p>
                  Or you can call us at: <strong>
                  <a
              className="btn btn-error text-white btn-sm mt-2"
              href="tel:+233543983427"
            >
              <PhoneCall className="mr-2 h-4 w-4" />
              Contact Admin
            </a>
                  </strong>
                </p>
              </CardContent>
            </Card>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Image Upload Section */}
                <div
                  className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors w-full max-w-xs mx-auto"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleImageDrop}
                  onClick={() => document.getElementById("imageUpload")?.click()}
                >
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  {image ? (
                    <div className="relative">
                      <img
                        src={image || "/placeholder.svg"}
                        alt="Hostel"
                        className="mx-auto rounded-lg h-48 w-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            document.getElementById("imageUpload")?.click();
                          }}
                        >
                          <Edit2 className="h-2 w-2" />
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage();
                          }}
                        >
                          <X className="h-2 w-2" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      <p>Drag and drop your hostel image here, or click to select</p>
                      <p className="text-sm">(Optional)</p>
                    </div>
                  )}
                </div>
                {/* Hostel Name */}
                <FormField
                  control={form.control}
                  name="hostelName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hostel Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter hostel name" {...field} className="uppercase" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe your hostel..." className="resize-none" {...field} />
                      </FormControl>
                      <FormDescription>Provide a brief description of your hostel.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Location */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="uppercase">
                            <SelectValue placeholder="Select a location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="accra">Accra</SelectItem>
                          <SelectItem value="kumasi">Kumasi</SelectItem>
                          <SelectItem value="sunyani">Sunyani</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Address */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address*</FormLabel>
                      <FormControl>
                        <Input placeholder="BS-0016-9897" {...field} className="uppercase" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Manager's Name */}
                <FormField
                  control={form.control}
                  name="managerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manager's Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter manager's name" {...field} className="uppercase" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Ghana Card */}
                 <FormField
                  control={form.control}
                  name="ghanaCard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ghana Card No.*</FormLabel>
                      <FormControl>
                        <Input placeholder="GHA-xxxxxxxxxxx" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email*</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Phone Number */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Listing"
                  )}
                </Button>
              </form>
            </Form>
          )}
        </div>
        {/* Right Section: Static Image */}
        <div className="hidden md:block relative">
          <img
            src="https://images.unsplash.com/photo-1520277739336-7bf67edfa768?auto=format&fit=crop&w=1920&q=80"
            alt="Hostel Preview"
            className="w-full h-full object-cover absolute inset-0"
          />
        </div>
      </div>
    </div>
  );
};

export default HostelListingForm;