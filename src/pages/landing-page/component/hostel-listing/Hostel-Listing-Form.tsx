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
      images.forEach((image) => {
        formData.append("photo", image);
      });

      try {
        const res = await axios.post("/api/hostels/add", formData, {
          headers: {
            "Content-type": "multipart/form-data",
          },
        });
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
    <div className="min-h-screen w-full p-4 md:p-8 flex justify-center items-center">
      <SEOHelmet
        title="List Your Hostel - Fuse"
        description="List your hostel on Fuse and reach more students."
        keywords="list hostel, Fuse, student accommodation"
      />
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-md overflow-hidden">
        <div className="p-4 md:p-6 overflow-y-auto max-h-[80vh] md:max-h-none">
          <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
            List Your Hostel
          </h1>
          {submitted ? (
            <SuccessfulListing />
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className=" w-full space-y-4 flex flex-col md:flex-row gap-10 p-4"
              >
                <div className="w-full">
                  <p className="text-gray-400 italic">
                    Please fill out the hostel information below:
                  </p>
                  <div className="w-full flex flex-col gap-2">
                    <span className="font-semibold">Hostel Image*</span>
                    <p className="text-gray-400 italic">
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
                            className="region rounded-md bg-white p-1"
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
                <div className="w-full flex flex-col gap-2">
                  <div>
                    <p className="text-gray-400 italic">
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
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

