/**
 * Enhanced Hostel Listing Form
 * Improved UI/UX with better visual design, smooth transitions, and validation feedback
 */

import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  Image as ImageIcon,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FormButton,
  type ImageFile,
} from "@/components/form";
import { useMutation } from "@tanstack/react-query";
import { addHostel } from "@/api/hostels";
import SuccessfulListing from "@/components/SuccessfulListing";
import SEOHelmet from "@/components/SEOHelmet";
import { hostelListingFormSchema, type HostelListingFormValues } from "@/schemas/hostelListingSchema";
import StepIndicator from "./StepIndicator";
import { Card, CardContent } from "@/components/ui/card";
import {
  BasicInfoStep,
  MediaStep,
  ManagementStep,
  FormNavigation,
  ListingFormHeader,
} from "./parts";

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
  const [images, setImages] = useState<ImageFile[]>([]);
  const [region, setRegion] = useState("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [logo, setLogo] = useState<ImageFile | null>(null);
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
    mode: "onSubmit", // Only validate on submit to prevent premature errors
    reValidateMode: "onSubmit",
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

      images.forEach((img: ImageFile) => {
        if (img.file) {
          formData.append("photos", img.file);
        }
      });

      if (logo?.file) {
        formData.append("logo", logo.file);
      } else if (logo?.url) {
        formData.append("logo", logo.url);
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

  const nextStep = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Guard: Don't do anything if we're already on the last step
    if (currentStep >= steps.length) return;

    let fieldsToValidate: (keyof HostelListingFormValues)[] = [];

    if (currentStep === 1) {
      // Step 1: Validate basic info fields
      fieldsToValidate = ["hostelName", "location", "address"];
    } else if (currentStep === 2) {
      // Step 2: Custom validation for uploads
      if (!logo) {
        toast.error("Hostel logo is required");
        return;
      }
      if (images.length === 0) {
        toast.error("At least one hostel image is required");
        return;
      }
      // No schema fields to validate for Step 2 specifically
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

  const prevStep = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
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
    <div className="flex flex-col items-center w-full min-h-screen bg-gradient-to-br from-slate-50 via-forest-green-50/20 to-slate-100/50">
      <SEOHelmet
        title="List Your Hostel - Fuse"
        description="List your hostel on Fuse and reach more students."
        keywords="list hostel, Fuse, student accommodation"
      />

      <div className="w-full max-w-4xl space-y-4 p-3 md:p-6 md:space-y-6">
        {/* Header */}
        <ListingFormHeader />

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
            <Card className="border-none shadow-lg md:shadow-2xl bg-white overflow-hidden rounded-2xl md:rounded-3xl">
              <CardContent className="p-4 md:p-6 lg:p-10">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
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
                      >
                        <BasicInfoStep
                          form={form}
                          region={region}
                          onRegionChange={setRegion}
                        />
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
                      >
                        <MediaStep
                          logo={logo}
                          setLogo={setLogo}
                          images={images}
                          setImages={setImages}
                        />
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
                      >
                        <ManagementStep form={form} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <FormNavigation
                    currentStep={currentStep}
                    totalSteps={steps.length}
                    isPending={AddListingMutation.isPending}
                    onNext={nextStep}
                    onPrev={prevStep}
                    onSubmit={form.handleSubmit(onSubmit)}
                  />
                </form>
              </CardContent>
            </Card>

            {/* Terms */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center pt-4 md:pt-6 pb-4 md:pb-0"
            >
              <p className="text-xs text-muted-foreground px-4">
                By submitting your application, you agree to our{" "}
                <a href="/terms" className="text-primary font-medium hover:underline underline-offset-4">
                  Terms of Service
                </a>
                {" "}and{" "}
                <a href="/privacy" className="text-primary font-medium hover:underline underline-offset-4">
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
