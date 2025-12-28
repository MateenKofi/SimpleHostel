import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AllocationDetails } from "@/helper/types/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, Download } from "lucide-react";
import SEOHelmet from "@/components/SEOHelmet";

const AllocationDetailsPage = () => {
    const { data: allocation, isLoading, isError } = useQuery<AllocationDetails>({
        queryKey: ["allocationDetails"],
        queryFn: async () => {
            const response = await axios.get("/api/residents/allocation-details");
            return response.data.data;
        },
    });

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isError || !allocation || (!allocation.roomNumber && !allocation.hostelName)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 p-6 text-center">
                <div className="p-6 bg-yellow-50 rounded-full dark:bg-yellow-900/20">
                    <FileText className="w-12 h-12 text-yellow-500" />
                </div>
                <h2 className="text-2xl font-bold">No Allocation Yet</h2>
                <p className="text-muted-foreground max-w-md">
                    You haven't been allocated to a room yet or your details are still being processed.
                    Please check back later or contact the management.
                </p>
                <Button onClick={() => window.location.reload()}>Refresh</Button>
            </div>
        );
    }

    const safeFormatDate = (date: string | null) => {
        if (!date) return "N/A";
        const d = new Date(date);
        return isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString();
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <SEOHelmet
                title="Allocation Details - Fuse"
                description="View your room allocation details and hostel rules."
            />

            <div className="mb-6 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 italic">Allocation Details</h1>
                <p className="text-gray-500 dark:text-gray-400">Review your residency information and download important documents.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Personal & Room Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Resident Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="font-medium">{allocation.residentName || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Student ID</p>
                            <p className="font-medium">{allocation.studentId || 'N/A'}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Room Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Hostel</p>
                            <p className="font-medium">{allocation.hostelName || 'N/A'}</p>
                            <p className="text-xs text-gray-500">{allocation.hostelAddress || ''}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Room Number</p>
                                <p className="font-medium">{allocation.roomNumber || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Room Type</p>
                                <p className="font-medium capitalize">{allocation.roomType || 'N/A'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stay Duration */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Stay Duration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Check-In</p>
                                <p className="font-medium">{safeFormatDate(allocation.checkInDate)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Check-Out</p>
                                <p className="font-medium">{safeFormatDate(allocation.checkOutDate)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Documents */}
                <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="text-primary flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Hostel Rules & Regulations
                        </CardTitle>
                        <CardDescription>
                            Please download and read the rules carefully.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {allocation.rulesUrl ? (
                            <Button asChild className="w-full gap-2">
                                <a href={allocation.rulesUrl} target="_blank" rel="noopener noreferrer">
                                    <Download className="w-4 h-4" />
                                    Download Rules PDF
                                </a>
                            </Button>
                        ) : (
                            <div className="text-center p-4 border border-dashed rounded-md text-gray-400">
                                No rules document available.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AllocationDetailsPage;
