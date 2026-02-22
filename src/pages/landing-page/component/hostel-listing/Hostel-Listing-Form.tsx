import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LucideCircleArrowOutUpRight, ArrowLeft, ArrowRight, Check } from "lucide-react";
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
import { addHostel } from "@/api/hostels";
import { RegionDropdown } from "react-country-region-selector";
import SuccessfulListing from "@/components/SuccessfulListing";
import UploadMultipleImages from "@/components/UploadMultipleImages";
import SEOHelmet from "@/components/SEOHelmet";
import UploadSingleImage from "@/components/UploadSingleImage";
import type { ApiError } from "@/types/dtos";
import { hostelListingFormSchema, type HostelListingFormValues } from "@/schemas/hostelListingSchema";
import StepIndicator from "./StepIndicator";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const steps = [
  { title: "Basic Info" },
  { title: "Media" },
  { title: "Manager Details" },
];

const HostelListingForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState<File[]>([]);
  const [region, setRegion] = useState("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [logo, setLogo] = useState<string | File | null>(null);

  const form = useForm<HostelListingFormValues>({
    resolver: zodResolver(hostelListingFormSchema),
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
    mutationFn: async (data: HostelListingFormValues) => {
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
        formData.append("photos", image);
      });
      if (logo) {
        formData.append("logo", logo);
      }

      try {
        const responseData = await addHostel(formData);
        toast.success("Hostel Listed successfully");
        setSubmitted(true);
        return responseData;
      } catch (error: unknown) {
        setSubmitted(false);
        const err = error as ApiError;
        const errorMessage = err.response?.data?.error || err.response?.data?.message || "Failed to List Hostel";
        toast.error(errorMessage);
        throw error;
      }
    },
  });

  const onSubmit = async (data: HostelListingFormValues) => {
    if (images.length === 0) {
      toast.error("Please upload at least one hostel image");
      return;
    }
    if (!logo) {
      toast.error("Please upload a hostel logo");
      return;
    }
    AddListingMutation.mutate(data);
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof HostelListingFormValues)[] = [];
    if (currentStep === 1) {
      fieldsToValidate = ["hostelName", "location", "address"];
    } else if (currentStep === 3) {
      fieldsToValidate = ["managerName", "ghanaCard", "email", "phone"];
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      if (currentStep === 2) {
        if (!logo) {
          toast.error("Hostel logo is required");
          return;
        }
        if (images.length === 0) {
          toast.error("At least one hostel image is required");
          return;
        }
      }
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen p-4 md:p-8 bg-slate-50/50">
      <SEOHelmet
        title="List Your Hostel - Fuse"
        description="List your hostel on Fuse and reach more students."
        keywords="list hostel, Fuse, student accommodation"
      />

      <div className="w-full max-w-4xl space-y-6">
        <div className="text-center space-y-2 mb-4">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl text-slate-900 font-foreground">
            List Your Hostel
          </h1>
          <p className="text-slate-500 max-w-lg mx-auto">
            Join Ghana's largest student accommodation network and reach thousands of students today.
          </p>
        </div>

        {submitted ? (
          <Card className="border-none shadow-xl bg-white overflow-hidden">
            <CardContent className="p-0">
              <SuccessfulListing />
            </CardContent>
          </Card>
        ) : (
          <>
            <StepIndicator currentStep={currentStep} steps={steps} />

            <Card className="border-none shadow-xl bg-white overflow-hidden mt-8">
              <CardContent className="p-6 md:p-10">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {currentStep === 1 && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="border-l-4 border-primary pl-4 mb-6">
                          <h2 className="text-xl font-bold text-slate-900">Basic Information</h2>
                          <p className="text-sm text-slate-500 italic">Tell us the key details about your hostel</p>
                        </div>

                        <FormField
                          control={form.control}
                          name="hostelName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 font-semibold">Hostel Name*</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter the official name of your hostel"
                                  {...field}
                                  className="h-12 border-slate-200 focus:border-primary focus:ring-primary transition-all rounded-lg"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel className="text-slate-700 font-semibold mb-1">Region/Location*</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <RegionDropdown
                                      country={"Ghana"}
                                      onChange={(val) => {
                                        setRegion(val);
                                        field.onChange(val);
                                      }}
                                      value={region}
                                      className="w-full h-12 px-4 py-2 bg-white border border-slate-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900"
                                      name="region-field"
                                    />
                                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                    </div>
                                  </div>
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
                                <FormLabel className="text-slate-700 font-semibold">Address*</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="GC-123-4567 or Street Name"
                                    {...field}
                                    className="h-12 border-slate-200 focus:border-primary focus:ring-primary transition-all rounded-lg"
                                  />
                                </FormControl>
                                <FormDescription className="text-[10px] text-slate-400">
                                  Use Ghana Post GPS address if available.
                                </FormDescription>
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
                              <FormLabel className="text-slate-700 font-semibold">Description (Optional)</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="What makes your hostel unique? Mention amenities like WiFi, shuttle, security etc."
                                  className="min-h-[120px] border-slate-200 focus:border-primary focus:ring-primary transition-all rounded-lg resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <a
                          href="https://www.google.com/maps"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
                        >
                          Find your coordinates on Google Maps
                          <LucideCircleArrowOutUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </a>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="border-l-4 border-primary pl-4 mb-6">
                          <h2 className="text-xl font-bold text-slate-900">Visual Media</h2>
                          <p className="text-sm text-slate-500 italic">High quality photos attract more students</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                          <div className="space-y-4">
                            <div className="space-y-1">
                              <h3 className="font-bold text-slate-800">Hostel Logo*</h3>
                              <p className="text-xs text-slate-400 italic">Square or transparent PNG recommended</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-center">
                              <UploadSingleImage image={logo} setImage={setLogo} />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="space-y-1">
                              <h3 className="font-bold text-slate-800">Hostel Gallery*</h3>
                              <p className="text-xs text-slate-400 italic">Upload at least 3 photos (max 5)</p>
                            </div>
                            <div className="bg-slate-50 rounded-2xl border border-slate-100 min-h-[150px]">
                              <UploadMultipleImages images={images} setImages={setImages} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="border-l-4 border-primary pl-4 mb-6">
                          <h2 className="text-xl font-bold text-slate-900">Management Details</h2>
                          <p className="text-sm text-slate-500 italic">Required for verification and communication</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="managerName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-slate-700 font-semibold">Manager's Full Name*</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="John Doe"
                                    {...field}
                                    className="h-12 border-slate-200 focus:border-primary focus:ring-primary transition-all rounded-lg"
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
                                <FormLabel className="text-slate-700 font-semibold">Ghana Card Number*</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="GHA-123456789-0"
                                    {...field}
                                    className="h-12 border-slate-200 focus:border-primary focus:ring-primary transition-all rounded-lg"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-slate-700 font-semibold">Contact Email*</FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="manager@hostel.com"
                                    {...field}
                                    className="h-12 border-slate-200 focus:border-primary focus:ring-primary transition-all rounded-lg"
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
                                <FormLabel className="text-slate-700 font-semibold">Phone Number*</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="024 123 4567"
                                    {...field}
                                    className="h-12 border-slate-200 focus:border-primary focus:ring-primary transition-all rounded-lg"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100/50 mt-4 flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold">!</span>
                          </div>
                          <p className="text-xs text-blue-700 leading-relaxed">
                            Your credentials will be handled securely. Verification typically takes 24-48 hours after submission.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={prevStep}
                        disabled={currentStep === 1 || AddListingMutation.isPending}
                        className={cn(
                          "h-12 px-6 font-semibold text-slate-600 hover:bg-slate-50 rounded-xl transition-all",
                          currentStep === 1 && "opacity-0 pointer-events-none"
                        )}
                      >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Previous
                      </Button>

                      {currentStep < steps.length ? (
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="h-12 px-8 font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                        >
                          Next Step
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          disabled={AddListingMutation.isPending}
                          className="h-12 px-10 font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                        >
                          {AddListingMutation.isPending ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Listing Hostel...
                            </>
                          ) : (
                            <>
                              Submit Application
                              <Check className="w-5 h-5 ml-2" />
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <div className="text-center pt-8">
              <p className="text-xs text-slate-400">
                By submitting your application, you agree to our{" "}
                <a href="/terms" className="text-primary font-medium hover:underline underline-offset-4">Terms of Service</a>
                {" "}and{" "}
                <a href="/privacy" className="text-primary font-medium hover:underline underline-offset-4">Privacy Policy</a>.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HostelListingForm;
