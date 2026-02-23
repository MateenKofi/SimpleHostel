import { Building2, Info } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { RegionDropdown } from "react-country-region-selector";
import { TextInput, CustomTextarea } from "@/components/form";
import { HostelListingFormValues } from "@/schemas/hostelListingSchema";
import { cn } from "@/lib/utils";

interface BasicInfoStepProps {
    form: UseFormReturn<HostelListingFormValues>;
    region: string;
    onRegionChange: (val: string) => void;
}

export const BasicInfoStep = ({ form, region, onRegionChange }: BasicInfoStepProps) => {
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

            {/* Region and Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Region/Location <span className="text-forest-green-600">*</span>
                    </label>
                    <div className="relative">
                        <RegionDropdown
                            country={"Ghana"}
                            onChange={(val) => {
                                onRegionChange(val);
                                form.setValue("location", val, { shouldValidate: true });
                            }}
                            value={region}
                            className={cn(
                                "flex h-11 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
                                form.formState.errors.location ? "border-destructive focus-visible:ring-destructive" : "border-input"
                            )}
                            name="region-field"
                        />
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    {form.formState.errors.location && (
                        <p className="text-xs font-medium text-destructive">
                            {form.formState.errors.location.message}
                        </p>
                    )}
                </div>

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
        </div>
    );
};
