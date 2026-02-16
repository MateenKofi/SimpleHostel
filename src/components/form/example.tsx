/**
 * FORM COMPONENTS USAGE EXAMPLE
 *
 * This file demonstrates how to use the custom form components
 * with react-hook-form and zod validation.
 */

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import {
  TextInput,
  PasswordInput,
  CustomTextarea,
  SelectInput,
  DatePicker,
  DateRangePicker,
  FormButton,
  ImageUpload,
  SingleImageUpload,
  type ImageFile,
} from "@/components/form"
import { User, Mail, Phone, MapPin } from "lucide-react"

// ============================================
// 1. Define your Zod schema
// ============================================
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address is required"),
  country: z.string().min(1, "Please select a country"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  birthDate: z.date({
    required_error: "Please select your birth date",
  }),
  bookingRange: z.object({
    from: z.date({
      required_error: "Check-in date is required",
    }),
    to: z.date({
      required_error: "Check-out date is required",
    }),
  }).refine((data) => data.to > data.from, {
    message: "Check-out date must be after check-in date",
    path: ["to"],
  }),
  images: z.array(z.any()).min(1, "Please upload at least one image"),
  profilePhoto: z.any().optional(),
})

type FormData = z.infer<typeof formSchema>

// ============================================
// 2. Country options for SelectInput
// ============================================
const countryOptions = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "ng", label: "Nigeria" },
  { value: "gh", label: "Ghana" },
  { value: "ke", label: "Kenya" },
]

// ============================================
// 3. Example Form Component
// ============================================
export function ExampleForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      country: "",
      password: "",
      bio: "",
      images: [],
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)

    try {
      // Handle form submission
      console.log("Form data:", data)

      // Example: Upload images and get URLs
      // const imageUrls = await uploadImages(data.images)

      // Example: Submit to API
      // await apiClient.post("/submit", data)
    } catch (error) {
      console.error("Submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Input with Icon */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TextInput
                    {...field}
                    label="Full Name"
                    placeholder="Enter your full name"
                    leftIcon={User}
                    helperText="Your legal name as shown on ID"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Input with Icon */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TextInput
                    {...field}
                    type="email"
                    label="Email Address"
                    placeholder="you@example.com"
                    leftIcon={Mail}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Input with Icon */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TextInput
                    {...field}
                    type="tel"
                    label="Phone Number"
                    placeholder="+1 234 567 8900"
                    leftIcon={Phone}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Country Select with Icon */}
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <SelectInput
                    {...field}
                    onValueChange={field.onChange}
                    label="Country"
                    placeholder="Select your country"
                    leftIcon={MapPin}
                    options={countryOptions}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Address Input - Full Width */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TextInput
                  {...field}
                  label="Street Address"
                  placeholder="123 Main Street, Apt 4B"
                  leftIcon={MapPin}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Input */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PasswordInput
                  {...field}
                  label="Password"
                  placeholder="Create a strong password"
                  helperText="Must be at least 8 characters"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bio Textarea with Character Count */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <CustomTextarea
                  {...field}
                  label="About You"
                  placeholder="Tell us a little about yourself..."
                  maxLength={500}
                  showCount
                  rows={4}
                  helperText="This will be shown on your profile"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date Picker */}
        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  label="Date of Birth"
                  placeholder="Select your birth date"
                  helperText="You must be at least 18 years old"
                  fromDate={
                    new Date(
                      new Date().setFullYear(new Date().getFullYear() - 100)
                    )
                  }
                  toDate={
                    new Date(
                      new Date().setFullYear(new Date().getFullYear() - 18)
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date Range Picker */}
        <FormField
          control={form.control}
          name="bookingRange"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DateRangePicker
                  value={field.value}
                  onChange={field.onChange}
                  label="Booking Dates"
                  placeholder="Select check-in and check-out dates"
                  numberOfMonths={2}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Single Image Upload */}
        <FormField
          control={form.control}
          name="profilePhoto"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <SingleImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  label="Profile Photo"
                  helperText="A clear photo of your face"
                  maxSize={5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Multiple Images Upload */}
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  label="Property Photos"
                  helperText="Upload photos of your property"
                  maxImages={5}
                  maxSize={5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button with Loading State */}
        <div className="flex gap-4">
          <FormButton
            type="submit"
            loading={isSubmitting}
            loadingText="Submitting..."
            className="flex-1"
          >
            Submit Application
          </FormButton>

          <FormButton
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isSubmitting}
          >
            Reset
          </FormButton>
        </div>
      </form>
    </Form>
  )
}

// ============================================
// STANDALONE USAGE (without react-hook-form)
// ============================================
export function StandaloneExample() {
  const [email, setEmail] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  const handleSubmit = async () => {
    setError("")
    if (!email.includes("@")) {
      setError("Please enter a valid email")
      return
    }

    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setLoading(false)
  }

  return (
    <div className="space-y-4 p-6 border rounded-lg">
      <TextInput
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        leftIcon={Mail}
        error={error}
        helperText="We'll never share your email"
      />

      <PasswordInput
        label="Password"
        placeholder="Enter your password"
      />

      <SelectInput
        label="Country"
        placeholder="Select your country"
        options={countryOptions}
      />

      <DatePicker
        label="Start Date"
        placeholder="When do you want to start?"
      />

      <FormButton
        loading={loading}
        loadingText="Processing..."
        onClick={handleSubmit}
        className="w-full"
      >
        Continue
      </FormButton>
    </div>
  )
}
