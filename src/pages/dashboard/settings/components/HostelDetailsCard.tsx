import { UseFormReturn } from "react-hook-form";
import { Loader, Building2, Phone, Image as ImageIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { TextField } from "@/components/TextField";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUpload from "@/components/ImageUpload";
import UploadSingleImage from "@/components/UploadSingleImage";
import { LocationPickerInput } from "@/components/maps/LocationPicker";
import { settingsFormSchema, type SettingsFormValues } from "@/schemas/settingsSchema";

interface HostelDetailsCardProps {
  form: UseFormReturn<SettingsFormValues>;
  logo: string | File | null;
  setLogo: (value: string | File | null) => void;
  previewLogo: string;
  images: File[];
  setImages: (value: File[]) => void;
  defaultImages: string[];
  setDefaultImages: (value: string[]) => void;
  handleImagesChange: (images: File[]) => void;
  handleRemoveDefaultImage: (index: number) => void;
  isPending: boolean;
  onSubmit: (values: SettingsFormValues) => void;
}

export function HostelDetailsCard({
  form,
  logo,
  setLogo,
  previewLogo,
  images,
  setImages,
  defaultImages,
  setDefaultImages,
  handleImagesChange,
  handleRemoveDefaultImage,
  isPending,
  onSubmit,
}: HostelDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          <div>
            <CardTitle>Hostel Details</CardTitle>
            <CardDescription>Your hostel's essential information</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Basic Information Sub-section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Building2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">Basic Information</span>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Hostel Logo</p>
            <p className="text-xs text-muted-foreground">
              Upload a square logo. PNG with transparent background recommended.
            </p>
            <UploadSingleImage
              image={logo}
              setImage={setLogo}
              previewImage={previewLogo}
            />
          </div>

          <div className="grid w-full grid-cols-1 gap-6">
            <TextField
              label="Hostel Name"
              id="name"
              register={form.register("name")}
              error={form.formState.errors.name}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} className="min-h-[100px]" />
                </FormControl>
                <FormDescription>
                  Write a vivid portrait of your hostel.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <LocationPickerInput
            label="Hostel Address & Location"
            latitude={form.watch("latitude")}
            longitude={form.watch("longitude")}
            address={form.watch("address")}
            onLocationChange={(lat, lng) => {
              form.setValue("latitude", lat, { shouldDirty: true });
              form.setValue("longitude", lng, { shouldDirty: true });
            }}
            onAddressChange={(addr) => {
              form.setValue("address", addr, { shouldValidate: true, shouldDirty: true });
            }}
            error={form.formState.errors.address?.message}
          />
        </div>

        <Separator className="my-6" />

        {/* Contact Information Sub-section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Phone className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">Contact Information</span>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <TextField
              id="email"
              label="Email"
              register={form.register("email")}
              error={form.formState.errors.email}
            />
            <TextField
              id="phone"
              label="Phone"
              register={form.register("phone")}
              error={form.formState.errors.phone}
            />
          </div>
        </div>

        <Separator className="my-6" />

        {/* Hostel Images Sub-section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">Gallery</span>
            </div>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {defaultImages.length + images.length}/3 used
            </span>
          </div>

          <p className="text-xs text-muted-foreground">Max 3 pictures to paint your story.</p>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {3 - (defaultImages.length + images.length)} slot
              {3 - (defaultImages.length + images.length) !== 1 ? "s" : ""} remaining
            </span>
          </div>
          <ImageUpload
            onImagesChange={handleImagesChange}
            defaultImages={defaultImages}
            onRemoveDefaultImage={handleRemoveDefaultImage}
          />
        </div>

        <div className="flex justify-end pt-4 mt-4 border-t">
          <Button
            type="submit"
            disabled={isPending}
            className="shadow-md"
            onClick={() => onSubmit(form.getValues())}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader className="w-4 h-4 animate-spin" />
                Saving changes...
              </span>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}