import { useState } from "react";
import { useForm } from "react-hook-form";
import {useNavigate} from 'react-router-dom'
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
    fullName: z.string().min(2, {
        message: "Full name must be at least 2 characters.",
    }),
    studentId: z.string().min(2, {
        message: "Student ID must be at least 2 characters.",
    }),
    course: z.string().min(2, {
        message: "Course must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    phone: z.string().min(10, {
        message: "Please enter a valid phone number.",
    }),
    emergencyContactName: z.string().min(2, {
        message: "Contact name must be at least 2 characters.",
    }),
    emergencyContactPhone: z.string().min(10, {
        message: "Please enter a valid phone number.",
    }),
    relationship: z.string().min(2, {
        message: "Relationship must be at least 2 characters.",
    }),
});

const ResidentForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            studentId: "",
            course: "",
            email: "",
            phone: "",
            emergencyContactName: "",
            emergencyContactPhone: "",
            relationship: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsSubmitting(true);
            console.log(values);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            form.reset();
            setIsSubmitted(true);
            navigate('/payment')
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="h-[90dvh] w-full flex justify-center items-center overflow-y-hidden">
            <div className="h-5/6 grid grid-cols-2 gap-4 w-4/5 bg-white shadow-lg rounded-md overflow-hidden">
                {/* Left Section: Form Fields */}
                <div className="p-6 overflow-y-scroll">
                    <h1 className="text-2xl font-bold mb-6">Resident Information</h1>
                    
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                {/* Full Name */}
                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter full name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* Student ID */}
                                <FormField
                                    control={form.control}
                                    name="studentId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Student ID*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter student ID" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* Course */}
                                <FormField
                                    control={form.control}
                                    name="course"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Course*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter course" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* Email */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email*</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="Enter email address" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* Phone Number */}
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter phone number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* Emergency Contact Name */}
                                <FormField
                                    control={form.control}
                                    name="emergencyContactName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Emergency Contact Name*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter contact name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* Emergency Contact Phone */}
                                <FormField
                                    control={form.control}
                                    name="emergencyContactPhone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Emergency Contact Phone*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter contact phone" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* Relationship */}
                                <FormField
                                    control={form.control}
                                    name="relationship"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Relationship*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter relationship" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        "Submit"
                                    )}
                                </Button>
                            </form>
                        </Form>
                </div>
                {/* Right Section: Static Image */}
                <div className="hidden md:block">
                    <img
                        src="https://images.unsplash.com/photo-1626265774643-f1943311a86b?auto=format&fit=crop&w=600&q=80"
                        alt="Resident Form"
                        className="object-cover w-full h-full"
                    />
                </div>
            </div>
        </div>
    );
}
export default ResidentForm;