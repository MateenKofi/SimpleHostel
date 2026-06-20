import { Building2, Info } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { TextInput, CustomTextarea } from "@/components/form";
import { HostelListingFormValues } from "@/schemas/hostelListingSchema";
import { LocationPicker } from "@/components/maps/LocationPicker";

interface BasicInfoStepProps {
    form: UseFormReturn<HostelListingFormValues>;
}

export const BasicInfoStep = ({ form }: BasicInfoStepProps) => {
    const hasLocation = form.watch("latitude") && form.watch("longitude");
    const hasRegion = form.watch("location");

    return (
        <div className="space-y-6">
            {/* Step Header */}
            <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest-green-500 to-forest-green-600 flex items-center justify-center text-white shadow-lg shadow-forest-green-200 flex-shrink-0">
                    <Building2 className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                    <h2 className="text-lg md:text-xl font-bold text-foreground">Basic Information</h2>
                    <p className="text-xs md:text-sm text-muted-foreground">Tell us about your hostel</p>
                </div>
            </div>

            <TextInput
                label="Hostel Name"
                placeholder="Enter the official name of your hostel"
                {...form.register("hostelName")}
                leftIcon={Building2}
                required
                error={form.formState.errors.hostelName?.message}
            />

            {/* Address */}
            <div className="hidden">
                <TextInput
                    label="Address"
                    placeholder="GC-123-4567 or Street Name"
                    {...form.register("address")}
                    helperText="Ghana Post GPS address recommended"
                    required
                    error={form.formState.errors.address?.message}
                />
            </div>

            {/* Description */}
            <CustomTextarea
                label="Description"
                placeholder="What makes your hostel unique? Mention amenities like WiFi, shuttle, security, study areas, etc."
                {...form.register("description")}
                maxLength={1000}
                showCount
                rows={3}
                error={form.formState.errors.description?.message}
            />

            {/* Helpful Tip */}
            <div className="flex items-start gap-3 p-3 md:p-4 bg-forest-green-50 rounded-xl border border-forest-green-100">
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

{/* Location Picker */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium leading-none">
                        Pinpoint Location on Map <span className="text-forest-green-600">*</span>
                    </label>
                    <LocationPicker
                        latitude={form.watch("latitude")}
                        longitude={form.watch("longitude")}
                        onLocationChange={(lat: number, lng: number) => {
                            form.setValue("latitude", lat, { shouldValidate: true });
                            form.setValue("longitude", lng, { shouldValidate: true });
                        }}
                        onAddressChange={(address: string) => {
                            form.setValue("address", address, { shouldValidate: true });
                        }}
                        onRegionDetected={(region) => {
                            form.setValue("location", region, { shouldValidate: true });
                        }}
                    />
                    {hasLocation && !hasRegion && (
                        <p className="text-xs font-medium text-destructive">
                            Please select a location within Ghana to enable region filtering
                        </p>
                    )}
                    {(form.formState.errors.latitude || form.formState.errors.longitude) && (
                        <p className="text-xs font-medium text-destructive">
                            {form.formState.errors.latitude?.message || form.formState.errors.longitude?.message}
                        </p>
                    )}
                </div>
        </div>
    );
};
