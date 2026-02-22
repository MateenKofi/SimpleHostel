/**
 * Enhanced Hostel Listing Form
 * Improved UI/UX with better visual design, smooth transitions, and validation feedback
 */

import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  LucideCircleArrowOutUpRight,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  Info,
  Upload,
  Building2,
  User,
  Image as ImageIcon,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  {
    title: "Basic Info",
    description: "Tell us about your hostel",
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    title: "Media",
    description: "Showcase your hostel",
    icon: <ImageIcon className="w-5 h-5" />,
  },
  {
    title: "Management",
    description: "Contact details",
    icon: <User className="w-5 h-5" />,
  },
];

const HostelListingForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState<File[]>([]);
  const [region, setRegion] = useState("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [logo, setLogo] = useState<string | File | null>(null);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

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
    mode: "onTouched", // Validate on blur for better UX
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
      formData.append("ghanaCard", data.ghanaCard);
      images.forEach((image: File) => {
        formData.append("photos", image);
      });
      if (logo) {
        formData.append("logo", logo);
      }

      const responseData = await addHostel(formData);
      toast.success("Hostel Listed successfully");
      setSubmitted(true);
      return responseData;
    },
    });

  const onSubmit = async (data: HostelListingFormValues) => {
    // Custom validations
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
      // Step 1: Validate basic info fields
      fieldsToValidate = ["hostelName", "location", "address"];
    } else if (currentStep === 2) {
      // Step 2: No form fields to validate, just check uploads
      if (!logo) {
        toast.error("Hostel logo is required");
        return;
      }
      if (images.length === 0) {
        toast.error("At least one hostel image is required");
        return;
      }
    } else if (currentStep === 3) {
      // Step 3: Validate management details fields
      fieldsToValidate = ["managerName", "ghanaCard", "email", "phone"];
    }

    // Only validate form fields if there are fields to check for the current step
    if (fieldsToValidate.length > 0) {
      const isValid = await form.trigger(fieldsToValidate);
      if (!isValid) {
        toast.error("Please fill in all required fields");
        return;
      }
    }

    setDirection('forward');
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const prevStep = () => {
    setDirection('backward');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const goToStep = async (step: number) => {
    // Allow going back to any previous step
    if (step < currentStep) {
      setDirection('backward');
      setCurrentStep(step);
      return;
    }

    // Allow going to the next step only if current step is valid
    if (step === currentStep + 1) {
      await nextStep();
    }
  };

  // Variants for step transitions
  const variants = {
    enter: (direction: 'forward' | 'backward') => ({
      x: direction === 'forward' ? 50 : -50,
      opacity: 0,
    }),
    center: {
      zIndex: 0,
      x: 0,
      opacity: 1,
    },
    exit: (direction: 'forward' | 'backward') => ({
      x: direction === 'forward' ? -50 : 50,
      opacity: 0,
    }),
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen p-4 md:p-8 bg-gradient-to-br from-slate-50 via-forest-green-50/20 to-slate-100/50">
      <SEOHelmet
        title="List Your Hostel - Fuse"
        description="List your hostel on Fuse and reach more students."
        keywords="list hostel, Fuse, student accommodation"
      />

      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-2"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-forest-green-100 text-forest-green-700 rounded-full text-sm font-semibold mb-2">
            <Building2 className="w-4 h-4" />
            <span>Hostel Partner Program</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 font-foreground">
            List Your Hostel
          </h1>
          <p className="text-slate-600 max-w-lg mx-auto text-sm md:text-base">
            Join Ghana's largest student accommodation network and reach thousands of students today.
          </p>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-none shadow-2xl bg-white overflow-hidden">
              <CardContent className="p-0">
                <SuccessfulListing />
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <>
            {/* Enhanced Step Indicator */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <StepIndicator
                currentStep={currentStep}
                steps={steps}
                onStepClick={goToStep}
              />
            </motion.div>

            {/* Form Card */}
            <Card className="border-none shadow-2xl bg-white overflow-hidden">
              <CardContent className="p-6 md:p-10">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <AnimatePresence mode="wait" custom={direction}>
                      {/* Step 1: Basic Info */}
                      {currentStep === 1 && (
                        <motion.div
                          key="step1"
                          variants={variants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.3 }}
                          className="space-y-6"
                        >
                          {/* Step Header */}
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest-green-500 to-forest-green-600 flex items-center justify-center text-white shadow-lg shadow-forest-green-200">
                              <Building2 className="w-5 h-5" />
                            </div>
                            <div>
                              <h2 className="text-xl font-bold text-slate-900">Basic Information</h2>
                              <p className="text-sm text-slate-500">Tell us about your hostel</p>
                            </div>
                          </div>

                          {/* Hostel Name */}
                          <FormField
                            control={form.control}
                            name="hostelName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-slate-700 font-semibold flex items-center gap-2">
                                  Hostel Name
                                  <span className="text-forest-green-600">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter the official name of your hostel"
                                    {...field}
                                    className="h-12 border-slate-200 focus:border-forest-green-500 focus:ring-forest-green-500/20 transition-all rounded-lg"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Region and Address */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="location"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel className="text-slate-700 font-semibold flex items-center gap-2">
                                    Region/Location
                                    <span className="text-forest-green-600">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <RegionDropdown
                                        country={"Ghana"}
                                        onChange={(val) => {
                                          setRegion(val);
                                          field.onChange(val);
                                        }}
                                        value={region}
                                        className="w-full h-12 px-4 py-2 bg-white border border-slate-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-forest-green-500/20 focus:border-forest-green-500 transition-all text-slate-900"
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
                                  <FormLabel className="text-slate-700 font-semibold flex items-center gap-2">
                                    Address
                                    <span className="text-forest-green-600">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="GC-123-4567 or Street Name"
                                      {...field}
                                      className="h-12 border-slate-200 focus:border-forest-green-500 focus:ring-forest-green-500/20 transition-all rounded-lg"
                                    />
                                  </FormControl>
                                  <FormDescription className="text-xs text-slate-400">
                                    Ghana Post GPS address recommended
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* Description */}
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-slate-700 font-semibold">Description</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="What makes your hostel unique? Mention amenities like WiFi, shuttle, security, study areas, etc."
                                    className="min-h-[100px] border-slate-200 focus:border-forest-green-500 focus:ring-forest-green-500/20 transition-all rounded-lg resize-none"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Helpful Tip */}
                          <div className="flex items-start gap-3 p-4 bg-forest-green-50 rounded-xl border border-forest-green-100">
                            <div className="w-6 h-6 rounded-full bg-forest-green-100 text-forest-green-600 flex items-center justify-center flex-shrink-0">
                              <Info className="w-3.5 h-3.5" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-forest-green-800">
                                Pro Tip
                              </p>
                              <p className="text-xs text-forest-green-600 leading-relaxed">
                                Detailed descriptions help students understand what makes your hostel special. Mention unique features like 24/7 security, study rooms, or proximity to campus.
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 2: Media */}
                      {currentStep === 2 && (
                        <motion.div
                          key="step2"
                          variants={variants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.3 }}
                          className="space-y-6"
                        >
                          {/* Step Header */}
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest-green-500 to-forest-green-600 flex items-center justify-center text-white shadow-lg shadow-forest-green-200">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <h2 className="text-xl font-bold text-slate-900">Visual Media</h2>
                              <p className="text-sm text-slate-500">Showcase your hostel</p>
                            </div>
                          </div>

                          {/* Upload Areas */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Logo Upload */}
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-slate-800">Hostel Logo</h3>
                                <span className="px-2 py-0.5 bg-forest-green-100 text-forest-green-700 text-xs font-semibold rounded-full">
                                  Required
                                </span>
                              </div>
                              <p className="text-xs text-slate-500">Square or transparent PNG recommended (min 200x200px)</p>
                              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <UploadSingleImage image={logo} setImage={setLogo} />
                              </div>
                            </div>

                            {/* Gallery Upload */}
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-slate-800">Hostel Gallery</h3>
                                <span className="px-2 py-0.5 bg-forest-green-100 text-forest-green-700 text-xs font-semibold rounded-full">
                                  Required
                                </span>
                              </div>
                              <p className="text-xs text-slate-500">Upload 3-5 high-quality photos (max 5MB each)</p>
                              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 shadow-sm min-h-[200px]">
                                <UploadMultipleImages images={images} setImages={setImages} />
                              </div>

                              {/* Image Count Indicator */}
                              {images.length > 0 && (
                                <div className="flex items-center justify-between px-2 py-2 bg-slate-50 rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <Upload className="w-4 h-4 text-slate-400" />
                                    <span className="text-xs text-slate-600 font-medium">
                                      {images.length} / 5 uploaded
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setImages([])}
                                    className="text-xs text-forest-green-600 hover:text-forest-green-700 font-medium"
                                  >
                                    Clear all
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Upload Guidelines */}
                          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <div className="flex items-start gap-3">
                              <ShieldCheck className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                              <div className="space-y-1">
                                <p className="text-sm font-semibold text-blue-800">Upload Guidelines</p>
                                <ul className="text-xs text-blue-700 space-y-1">
                                  <li>• Use bright, well-lit photos</li>
                                  <li>• Show rooms, common areas, and amenities</li>
                                  <li>• Avoid blurry or dark images</li>
                                  <li>• First image will be the cover photo</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 3: Management Details */}
                      {currentStep === 3 && (
                        <motion.div
                          key="step3"
                          variants={variants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.3 }}
                          className="space-y-6"
                        >
                          {/* Step Header */}
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest-green-500 to-forest-green-600 flex items-center justify-center text-white shadow-lg shadow-forest-green-200">
                              <User className="w-5 h-5" />
                            </div>
                            <div>
                              <h2 className="text-xl font-bold text-slate-900">Management Details</h2>
                              <p className="text-sm text-slate-500">Contact for verification</p>
                            </div>
                          </div>

                          {/* Name and Ghana Card */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="managerName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-slate-700 font-semibold flex items-center gap-2">
                                    Manager's Full Name
                                    <span className="text-forest-green-600">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="John Doe"
                                      {...field}
                                      className="h-12 border-slate-200 focus:border-forest-green-500 focus:ring-forest-green-500/20 transition-all rounded-lg"
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
                                  <FormLabel className="text-slate-700 font-semibold flex items-center gap-2">
                                    Ghana Card Number
                                    <span className="text-forest-green-600">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="GHA-123456789-0"
                                      {...field}
                                      className="h-12 border-slate-200 focus:border-forest-green-500 focus:ring-forest-green-500/20 transition-all rounded-lg uppercase"
                                    />
                                  </FormControl>
                                  <FormDescription className="text-xs text-slate-400">
                                    Format: GHA-123456789-0
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* Email and Phone */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-slate-700 font-semibold flex items-center gap-2">
                                    Contact Email
                                    <span className="text-forest-green-600">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="email"
                                      placeholder="manager@hostel.com"
                                      {...field}
                                      className="h-12 border-slate-200 focus:border-forest-green-500 focus:ring-forest-green-500/20 transition-all rounded-lg"
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
                                  <FormLabel className="text-slate-700 font-semibold flex items-center gap-2">
                                    Phone Number
                                    <span className="text-forest-green-600">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="024 123 4567"
                                      {...field}
                                      className="h-12 border-slate-200 focus:border-forest-green-500 focus:ring-forest-green-500/20 transition-all rounded-lg"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* Security Notice */}
                          <div className="bg-gradient-to-r from-forest-green-50 to-teal-green-50 rounded-xl p-4 border border-forest-green-100">
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 rounded-full bg-forest-green-100 text-forest-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <ShieldCheck className="w-3.5 h-3.5" />
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-semibold text-forest-green-800">
                                  Secure & Confidential
                                </p>
                                <p className="text-xs text-forest-green-700 leading-relaxed">
                                  Your information is encrypted and will only be used for verification purposes.
                                  We'll contact you within 24-48 hours after submission.
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={prevStep}
                        disabled={currentStep === 1 || AddListingMutation.isPending}
                        className={cn(
                          "h-12 px-6 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all",
                          currentStep === 1 && "invisible"
                        )}
                      >
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        Previous
                      </Button>

                      {currentStep < steps.length ? (
                        <Button
                          type="button"
                          onClick={nextStep}
                          disabled={AddListingMutation.isPending}
                          className="h-12 px-8 font-bold bg-gradient-to-r from-forest-green-600 to-forest-green-500 hover:from-forest-green-700 hover:to-forest-green-600 text-white rounded-xl shadow-lg shadow-forest-green-200 transition-all hover:shadow-xl hover:scale-[1.02]"
                        >
                          Next Step
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          disabled={AddListingMutation.isPending}
                          className="h-12 px-10 font-bold bg-gradient-to-r from-forest-green-600 to-forest-green-500 hover:from-forest-green-700 hover:to-forest-green-600 text-white rounded-xl shadow-lg shadow-forest-green-200 transition-all hover:shadow-xl hover:scale-[1.02]"
                        >
                          {AddListingMutation.isPending ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Check className="w-5 h-5 mr-2" />
                              Submit Application
                            </>
                          )}
                        </Button>
                      )}
                    </div>

                    {/* Step Progress Bar (Mobile) */}
                    <div className="md:hidden pt-4">
                      <div className="flex justify-between text-xs text-slate-500 mb-2">
                        <span>Step {currentStep} of {steps.length}</span>
                        <span>{Math.round((currentStep / steps.length) * 100)}% complete</span>
                      </div>
                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-forest-green-500 to-forest-green-400 transition-all duration-500"
                          style={{ width: `${(currentStep / steps.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Terms */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center pt-6"
            >
              <p className="text-xs text-slate-400">
                By submitting your application, you agree to our{" "}
                <a href="/terms" className="text-forest-green-600 font-medium hover:underline underline-offset-4">
                  Terms of Service
                </a>
                {" "}and{" "}
                <a href="/privacy" className="text-forest-green-600 font-medium hover:underline underline-offset-4">
                  Privacy Policy
                </a>
                .
              </p>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default HostelListingForm;
