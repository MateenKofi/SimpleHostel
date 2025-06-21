import { useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { RegionDropdown } from "react-country-region-selector";
import SuccessfulListing from "@/components/SuccessfulListing";
import UploadMultipleImages from "@/components/UploadMultipleImages";
import SEOHelmet from "@/components/SEOHelmet";
import UploadSingleImage from "@/components/UploadSingleImage";

const formSchema = z.object({
  hostelImage: z.string().optional(),
  description: z.string().optional(),
  hostelName: z.string().min(2, {
    message: "Hostel name must be at least 2 characters.",
  }),
  location: z.string().nonempty({
    message: "Please select a location.",
  }),
  address: z.string().nonempty({
    message:
      "Address must follow the format XX-XXX-XXXX. Adress from Ghana post code",
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
  ghanaCard: z.string().regex(/^GHA-\d{9}-\d$/, {
    message: "Ghana Card must follow the format GHA-xxxxxxxxx-x.",
  }),
});

const HostelListingForm = () => {
  const [images, setImages] = useState<File[]>([]);
  const [region, setRegion] = useState("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [logo, setLogo] = useState<string | File | null>(null);


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
      formData.append("name", data.hostelName.toUpperCase());
      formData.append("description", data.description || "");
      formData.append("location", region.toUpperCase());
      formData.append("address", data.address.toUpperCase());
      formData.append("manager", data.managerName.toUpperCase());
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("ghCard", data.ghanaCard);
      images.forEach((image: File) => {
        console.log("image from append image", image);
        formData.append("photo", image);
      });
      if (logo) {
        formData.append("logo", logo);
      }

      try {
        const res = await axios.post("/api/hostels/add", formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Hostel Listed successfully");
        setSubmitted(true);
        return res.data;
      } catch (error) {
        setSubmitted(false);
        if (axios.isAxiosError(error) && error.response) {
          const errorMessage =
            error.response.data.error || "Failed to List Hostel";
          toast.error(errorMessage);
        } else {
          toast.error("Failed to List Hostel");
        }
      }
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    AddListingMutation.mutate(data);
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen p-4 md:p-8">
      <SEOHelmet
        title="List Your Hostel - Fuse"
        description="List your hostel on Fuse and reach more students."
        keywords="list hostel, Fuse, student accommodation"
      />
      <div className="w-full max-w-4xl overflow-hidden bg-white rounded-md shadow-lg">
        <div className="p-4 md:p-6 overflow-y-auto max-h-[80vh] md:max-h-none">
          <h1 className="mb-4 text-xl font-bold md:text-2xl md:mb-6">
            List Your Hostel
          </h1>
          {submitted ? (
            <SuccessfulListing />
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col w-full gap-10 p-4 space-y-4 md:flex-row"
              >
                <div className="w-full">
                  <p className="italic text-gray-400">
                    Please fill out the hostel information below:
                  </p>
                  <div className="flex flex-col w-full gap-2">
                    <span className="font-semibold">Hostel Logo*</span>

                    <UploadSingleImage image={logo} setImage={setLogo} />
                  </div>
                  <div className="flex flex-col w-full gap-2">
                    <span className="font-semibold">Hostel Image*</span>
                    <p className="italic text-gray-400">
                      Upload images of your hostel, at most 3 images are
                      required
                    </p>
                    <UploadMultipleImages
                      images={images}
                      setImages={setImages}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="hostelName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hostel Name*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter hostel name"
                            {...field}
                            className="Capitalize"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your hostel..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a brief description of your hostel.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location*</FormLabel>
                        <FormControl>
                          <RegionDropdown
                            country={"Ghana"}
                            onChange={(val) => {
                              setRegion(val);
                              field.onChange(val);
                            }}
                            value={region}
                            className="p-1 bg-white rounded-md region"
                            name="region-field"
                            style={{
                              width: "100%",
                              color: "black",
                              padding: 4,
                              fontSize: 16,
                              borderRadius: 4,
                              border: "1px solid #ccc",
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. 21-23 Boundary Rd, East Legon, Accra, Ghana"
                            {...field}
                            className="Capitalize"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col w-full gap-2">
                  <div>
                    <p className="italic text-gray-400">
                      Please fill out the manager's information below:
                    </p>
                    <FormField
                      control={form.control}
                      name="managerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Manager's Name*</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter manager's name"
                              {...field}
                              className="capitalize"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ghanaCard"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ghana Card No.*</FormLabel>
                          <FormControl>
                            <Input placeholder="GHA-xxxxxxxxx-x" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email*</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter email address"
                              {...field}
                            />
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
                          <FormLabel>Phone Number*</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter phone number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={AddListingMutation.isPending}
                    >
                      {AddListingMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostelListingForm;
