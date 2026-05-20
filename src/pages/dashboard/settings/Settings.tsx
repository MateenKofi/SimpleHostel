import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Settings2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { ApiError } from "@/types/dtos";

import { Form } from "@/components/ui/form";
import SEOHelmet from "@/components/SEOHelmet";
import SettingsSkeleton from "@/components/loaders/SettingsLoader";
import CustomeRefetch from "@/components/CustomRefetch";
import {
  getHostelById,
  updateHostel,
  updatePaymentSettings,
  updateHostelRules,
  updateHostelDocuments,
} from "@/api/hostels";
import { settingsFormSchema, type SettingsFormValues } from "@/schemas/settingsSchema";
import {
  HostelDetailsCard,
  PaymentSettingsCard,
  RulesRegulationsCard,
  OfficialDocumentsCard,
} from "./components";

const Settings = () => {
  const [images, setImages] = useState<File[]>([]);
  const [defaultImages, setDefaultImages] = useState<string[]>([]);
  const [logo, setLogo] = useState<string | File | null>(null);
  const [previewLogo, setPreviewLogo] = useState<string>("");
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [stampFile, setStampFile] = useState<File | null>(null);
  const [rulesFile, setRulesFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string>("");
  const [stampPreview, setStampPreview] = useState<string>("");
  const [openSections, setOpenSections] = useState({
    payment: false,
    rules: false,
    documents: false,
  });
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

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
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
      latitude: undefined,
      longitude: undefined,
    },
  });

  useEffect(() => {
    if (hostelData) {
      form.reset(hostelData);
      setPreviewLogo(hostelData.logoUrl);
      setSignaturePreview(hostelData.signatureUrl || "");
      setStampPreview(hostelData.stampUrl || "");
      setDefaultImages(hostelData.images || []);
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
    mutationFn: async (data: SettingsFormValues) => {
      const formData = new FormData();
      formData.append("name", data.name.toUpperCase());
      formData.append("description", data.description || "");
      formData.append("address", data.address.toUpperCase());
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      if (data.latitude !== undefined) formData.append("latitude", data.latitude.toString());
      if (data.longitude !== undefined) formData.append("longitude", data.longitude.toString());

      formData.append("remainingImages", JSON.stringify(defaultImages));

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
      } catch (error: unknown) {
        const err = error as ApiError;
        const errorMessage =
          err.response?.data?.error || err.response?.data?.message || "Failed to Update Hostel";
        toast.error(errorMessage);
        throw error;
      }
    },
  });

  const rulesMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!hostelId) throw new Error("Hostel ID not found");
      const formData = new FormData();
      formData.append("rules", file);
      return await updateHostelRules(hostelId, formData);
    },
    onSuccess: () => {
      toast.success("Rules & Regulations updated successfully");
      refetchHostel();
      setRulesFile(null);
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Failed to update rules");
    },
  });

  const paymentSettingsMutation = useMutation({
    mutationFn: async (data: { allowPartialPayment: boolean; partialPaymentPercentage: number }) => {
      try {
        if (!hostelId) throw new Error("Hostel ID not found");
        await updatePaymentSettings(hostelId, data);
        toast.success("Payment settings updated successfully");
        refetchHostel();
      } catch (error: unknown) {
        const err = error as ApiError;
        toast.error(err.response?.data?.message || "Failed to update payment settings");
      }
    },
  });

  const documentsMutation = useMutation({
    mutationFn: async () => {
      if (!hostelId) throw new Error("Hostel ID not found");
      const formData = new FormData();
      if (signatureFile) formData.append("signature", signatureFile);
      if (stampFile) formData.append("stamp", stampFile);

      if (!signatureFile && !stampFile)
        throw new Error("Please select at least one document to upload");

      return await updateHostelDocuments(hostelId, formData);
    },
    onSuccess: () => {
      toast.success("Documents updated successfully");
      refetchHostel();
      setSignatureFile(null);
      setStampFile(null);
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Failed to update documents");
    },
  });

  const handleHostelDetailsSubmit = (values: SettingsFormValues) => {
    updateMutation.mutate(values);
  };

  const handlePaymentSettingsSubmit = (values: SettingsFormValues) => {
    paymentSettingsMutation.mutate({
      allowPartialPayment: values.allowPartialPayment,
      partialPaymentPercentage: values.partialPaymentPercentage,
    });
  };

  const handleRulesUpload = (file: File) => {
    rulesMutation.mutate(file);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Hostel Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your hostel's information, media, and configuration settings.
        </p>
      </div>
      <div className="mb-6 p-4 rounded-lg bg-primary/5 border border-primary/10">
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-primary" />
          Hostel Details are always visible. Payment, Rules & Documents are collapsible to reduce
          clutter.
        </p>
      </div>

      <Form {...form}>
        <form className="space-y-8">
          <HostelDetailsCard
            form={form}
            logo={logo}
            setLogo={setLogo}
            previewLogo={previewLogo}
            images={images}
            setImages={setImages}
            defaultImages={defaultImages}
            setDefaultImages={setDefaultImages}
            handleImagesChange={handleImagesChange}
            handleRemoveDefaultImage={handleRemoveDefaultImage}
            isPending={updateMutation.isPending}
            onSubmit={handleHostelDetailsSubmit}
          />

          <PaymentSettingsCard
            form={form}
            isOpen={openSections.payment}
            onOpenChange={(open) => setOpenSections((prev) => ({ ...prev, payment: open }))}
            mutation={paymentSettingsMutation}
            onSubmit={handlePaymentSettingsSubmit}
          />

          <RulesRegulationsCard
            hostelData={hostelData}
            isOpen={openSections.rules}
            onOpenChange={(open) => setOpenSections((prev) => ({ ...prev, rules: open }))}
            mutation={rulesMutation}
          />

          <OfficialDocumentsCard
            signatureFile={signatureFile}
            setSignatureFile={setSignatureFile}
            stampFile={stampFile}
            setStampFile={setStampFile}
            signaturePreview={signaturePreview}
            stampPreview={stampPreview}
            isOpen={openSections.documents}
            onOpenChange={(open) => setOpenSections((prev) => ({ ...prev, documents: open }))}
            mutation={documentsMutation}
          />
        </form>
      </Form>
    </div>
  );
};

export default Settings;