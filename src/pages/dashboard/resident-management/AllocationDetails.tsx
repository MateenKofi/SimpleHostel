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

    if (isError || !allocation) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-xl font-semibold text-red-500">Failed to load allocation details</h2>
                <p className="text-gray-500">Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <SEOHelmet
                title="Allocation Details - Fuse"
                description="View your room allocation details and hostel rules."
            />

            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Allocation Details</h1>
                <p className="text-gray-500 dark:text-gray-400">Review your residency information and download important documents.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Personal & Room Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Resident Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="font-medium">{allocation.residentName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Student ID</p>
                            <p className="font-medium">{allocation.studentId}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Room Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Hostel</p>
                            <p className="font-medium">{allocation.hostelName}</p>
                            <p className="text-xs text-gray-500">{allocation.hostelAddress}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Room Number</p>
                                <p className="font-medium">{allocation.roomNumber}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Room Type</p>
                                <p className="font-medium capitalize">{allocation.roomType}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stay Duration */}
                <Card>
                    <CardHeader>
                        <CardTitle>Stay Duration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Check-In</p>
                                <p className="font-medium">{new Date(allocation.checkInDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Check-Out</p>
                                <p className="font-medium">{new Date(allocation.checkOutDate).toLocaleDateString()}</p>
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
