import { User, ShieldCheck, Mail, Phone } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { TextInput } from "@/components/form";
import { HostelListingFormValues } from "@/schemas/hostelListingSchema";

interface ManagementStepProps {
    form: UseFormReturn<HostelListingFormValues>;
}

export const ManagementStep = ({ form }: ManagementStepProps) => {
    return (
        <div className="space-y-6">
            {/* Step Header */}
            <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest-green-500 to-forest-green-600 flex items-center justify-center text-white shadow-lg shadow-forest-green-200 flex-shrink-0">
                    <User className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                    <h2 className="text-lg md:text-xl font-bold text-foreground">Management Details</h2>
                    <p className="text-xs md:text-sm text-muted-foreground">Contact for verification</p>
                </div>
            </div>

            {/* Name and Ghana Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <TextInput
                    label="Manager's Full Name"
                    placeholder="John Doe"
                    {...form.register("managerName")}
                    leftIcon={User}
                    required
                    error={form.formState.errors.managerName?.message}
                />

                <TextInput
                    label="Ghana Card Number"
                    placeholder="GHA-123456789-0"
                    {...form.register("ghanaCard")}
                    leftIcon={ShieldCheck}
                    helperText="Format: GHA-123456789-0"
                    required
                    containerClassName="uppercase"
                    error={form.formState.errors.ghanaCard?.message}
                />
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <TextInput
                    label="Contact Email"
                    type="email"
                    placeholder="manager@hostel.com"
                    {...form.register("email")}
                    leftIcon={Mail}
                    required
                    error={form.formState.errors.email?.message}
                />

                <TextInput
                    label="Phone Number"
                    placeholder="024 123 4567"
                    {...form.register("phone")}
                    leftIcon={Phone}
                    required
                    error={form.formState.errors.phone?.message}
                />
            </div>

            {/* Security Notice */}
            <div className="bg-gradient-to-r from-forest-green-50 to-teal-green-50 rounded-xl p-3 md:p-4 border border-forest-green-100">
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
        </div>
    );
};
