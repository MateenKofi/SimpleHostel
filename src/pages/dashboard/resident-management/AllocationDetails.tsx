import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, Download, Users, User } from "lucide-react";
import SEOHelmet from "@/components/SEOHelmet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Interfaces based on API V1 response
interface Amenity {
    id: string;
    name: string;
    price: number;
}

interface Hostel {
    id: string;
    name: string;
    address: string;
    rulesUrl: string | null;
    manager: string;
    phone: string;
    email: string;
}

interface Room {
    id: string;
    number: string;
    type: string;
    floor: string;
    block: string;
    price: number;
    amenities: Amenity[];
    hostel: Hostel;
}

interface ResidentProfile {
    id: string;
    studentId: string | null;
    checkInDate: string | null;
    checkOutDate: string | null;
    room: Room;
}

interface Roommate {
    id: string;
    user: {
        name: string;
        email: string;
        avatar?: string;
    };
}

interface RoomDetailsResponse {
    resident: ResidentProfile;
    room: Room; // Redundant but present in API
    roommates: Roommate[];
}

const AllocationDetailsPage = () => {
    const { data, isLoading, isError } = useQuery<RoomDetailsResponse>({
        queryKey: ["resident-room-details"],
        queryFn: async () => {
            const response = await axios.get("/api/v1/resident/room");
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

    const { resident, roommates } = data || {};
    const room = resident?.room;
    const hostel = room?.hostel;

    if (isError || !resident || !room) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 p-6 text-center">
                <div className="p-6 bg-yellow-50 rounded-full dark:bg-yellow-900/20">
                    <FileText className="w-12 h-12 text-yellow-500" />
                </div>
                <h2 className="text-2xl font-bold">No Allocation Yet</h2>
                <p className="text-muted-foreground max-w-md">
                    You haven't been allocated to a room yet or your details are still being processed.
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

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
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
                            <p className="text-sm text-muted-foreground">Student ID</p>
                            <p className="font-medium">{resident.studentId || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Dates</p>
                            <div className="flex gap-4">
                                <div>
                                    <span className="text-xs text-muted-foreground">In: </span>
                                    <span className="font-medium">{safeFormatDate(resident.checkInDate)}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-muted-foreground">Out: </span>
                                    <span className="font-medium">{safeFormatDate(resident.checkOutDate)}</span>
                                </div>
                            </div>
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
                            <p className="font-medium">{hostel?.name || 'N/A'}</p>
                            <p className="text-xs text-gray-500">{hostel?.address || ''}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Room Number</p>
                                <p className="font-medium text-xl">{room.number || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Room Type</p>
                                <p className="font-medium capitalize">{room.type || 'N/A'}</p>
                            </div>
                            {room.block && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Block</p>
                                    <p className="font-medium">{room.block}</p>
                                </div>
                            )}
                            {room.floor && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Floor</p>
                                    <p className="font-medium">{room.floor}</p>
                                </div>
                            )}
                        </div>
                        {room.amenities && room.amenities.length > 0 && (
                            <div className="pt-2">
                                <p className="text-sm text-muted-foreground mb-1">Amenities</p>
                                <div className="flex flex-wrap gap-1">
                                    {room.amenities.map(a => (
                                        <span key={a.id} className="text-xs bg-secondary px-2 py-1 rounded-md">{a.name}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Roommates */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Roommates
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {roommates && roommates.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {roommates.map((mate) => (
                                    <div key={mate.id} className="flex items-center gap-3 p-3 border rounded-lg bg-card">
                                        <Avatar>
                                            <AvatarFallback>{getInitials(mate.user.name)}</AvatarFallback>
                                        </Avatar>
                                        <div className="overflow-hidden">
                                            <p className="font-medium text-sm truncate">{mate.user.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{mate.user.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 text-muted-foreground">
                                <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p>No roommates assigned yet.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Documents */}
                <Card className="border-primary/20 bg-primary/5 md:col-span-2">
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
                        {hostel?.rulesUrl ? (
                            <Button asChild className="w-full sm:w-auto gap-2">
                                <a href={hostel.rulesUrl} target="_blank" rel="noopener noreferrer">
                                    <Download className="w-4 h-4" />
                                    Download Rules PDF
                                </a>
                            </Button>
                        ) : (
                            <div className="text-center p-4 border border-dashed rounded-md text-gray-400 bg-white dark:bg-zinc-800">
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
