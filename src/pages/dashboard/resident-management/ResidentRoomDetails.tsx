"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home, Info, MapPin, Users, Phone, Mail } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getResidentRoomDetails } from "@/api/residents"
import ViewRoomSkeleton from "@components/loaders/ViewRoomSkeleton"
import { ResidentDto } from "@/types/dtos"
import { PageHeader } from "@/components/layout/PageHeader"

// Define interface for images if needed for legacy compatibility
interface ImageObject {
    id: string;
    imageUrl: string;
}

const ResidentRoomDetails = () => {
    const navigate = useNavigate()
    const [activeImageIndex, setActiveImageIndex] = useState(0)

    // Single endpoint to fetch resident's room details
    const { data: roomData, isLoading: isRoomLoading } = useQuery({
        queryKey: ['resident-room'],
        queryFn: async () => {
            const responseData = await getResidentRoomDetails();
            return responseData?.data || null
        }
    })

    const room = roomData?.Room || (roomData as any)?.room
    const roommates = roomData?.roommates || []

    // Format date to a readable format
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    // Get status color based on room status
    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case "available":
                return "bg-green-100 text-green-800 hover:bg-green-100"
            case "occupied":
                return "bg-orange-100 text-orange-800 hover:bg-orange-100"
            case "maintenance":
                return "bg-red-100 text-red-800 hover:bg-red-100"
            default:
                return "bg-gray-100 text-gray-800 hover:bg-gray-100"
        }
    }

    // Get gender badge color
    const getGenderColor = (gender: string) => {
        switch (gender?.toUpperCase()) {
            case "MALE":
                return "bg-blue-100 text-blue-800 hover:bg-blue-100"
            case "FEMALE":
                return "bg-pink-100 text-pink-800 hover:bg-pink-100"
            case "MIXED":
                return "bg-purple-100 text-purple-800 hover:bg-purple-100"
            default:
                return "bg-gray-100 text-gray-800 hover:bg-gray-100"
        }
    }

    if (isRoomLoading) {
        return <ViewRoomSkeleton />
    }

    if (!room) {
        return (
            <div className="container max-w-5xl px-4 py-6 mx-auto">
                <PageHeader
                    title="My Room"
                    icon={Home}
                    showBackButton={true}
                    sticky={true}
                />
                <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                    <div className="p-6 bg-yellow-50 rounded-full">
                        <Home className="w-12 h-12 text-yellow-500" />
                    </div>
                    <h2 className="text-2xl font-bold">No Room Assigned</h2>
                    <p className="text-muted-foreground text-center max-w-md">
                        You have not been assigned to a room yet. Please check your request status or contact the hostel administration.
                    </p>
                    <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
                </div>
            </div>
        )
    }

    // Determine images to show (prefer RoomImage objects, then images strings, then hostel images)
    const displayImages: ImageObject[] = room.RoomImage ||
        (room.images?.map((url: string, idx: number) => ({ id: `img-${idx}`, imageUrl: url })) || []) ||
        (room.hostel?.images?.map((url: string, idx: number) => ({ id: `hostel-img-${idx}`, imageUrl: url })) || [])

    return (
        <div className="container max-w-5xl px-4 py-6 mx-auto">
            <PageHeader
                title="My Room"
                icon={Home}
                showBackButton={true}
                sticky={true}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Left column - Room images */}
                <div className="md:col-span-2">
                    <Card className="overflow-hidden">
                        {displayImages.length > 0 ? (
                            <div className="relative">
                                <div className="relative overflow-hidden aspect-video">
                                    <img
                                        src={displayImages[activeImageIndex]?.imageUrl || "/placeholder.svg?height=400&width=600"}
                                        alt={`${room.roomNumber} - Image ${activeImageIndex + 1}`}
                                        className="object-cover w-full h-full"
                                    />
                                </div>

                                {/* Thumbnails */}
                                {displayImages.length > 1 && (
                                    <div className="flex gap-2 p-2 overflow-x-auto">
                                        {displayImages.map((image, index) => (
                                            <div
                                                key={image.id}
                                                className={`w-20 h-20 relative flex-shrink-0 cursor-pointer rounded-md overflow-hidden border-2 ${index === activeImageIndex ? "border-primary" : "border-transparent"}`}
                                                onClick={() => setActiveImageIndex(index)}
                                            >
                                                <img
                                                    src={image.imageUrl || "/placeholder.svg"}
                                                    alt={`${room.roomNumber} thumbnail ${index + 1}`}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="relative flex items-center justify-center aspect-video bg-muted">
                                <Home className="w-24 h-24 text-muted-foreground opacity-20" />
                                <p className="absolute text-muted-foreground">No images available</p>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Right column - Room details */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-2xl">{room.roomNumber || room.number}</CardTitle>
                                    <CardDescription className="flex items-center mt-1">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        Block {room.block || "N/A"}, Floor {room.floor || "N/A"}
                                    </CardDescription>
                                </div>
                                <Badge className={getStatusColor(room.status || "UNKNOWN")}>{room.status || "UNKNOWN"}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold">GH₵{room.price?.toLocaleString()}</h3>
                                <p className="text-sm text-muted-foreground">per calendarYear</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <span className="text-sm text-muted-foreground">Capacity</span>
                                    <span className="flex items-center font-medium">
                                        <Users className="w-4 h-4 mr-1" />
                                        {room.maxCap} students
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-muted-foreground">Gender</span>
                                    <Badge className={`w-fit ${getGenderColor(room.gender || "UNKNOWN")}`}>{room.gender || "UNKNOWN"}</Badge>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-muted-foreground">Occupancy</span>
                                    <span className="font-medium">
                                        {room.currentResidentCount}/{room.maxCap}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-muted-foreground">Last Updated</span>
                                    <span className="text-xs font-medium">{room.updatedAt ? formatDate(room.updatedAt) : "Unknown date"}</span>
                                </div>
                            </div>

                            {/* Roommates Section if available */}
                            {roommates && roommates.length > 0 && (
                                <>
                                    <Separator className="my-4" />
                                    <div>
                                        <h4 className="text-sm font-medium mb-3">Roommates</h4>
                                        <div className="grid gap-3">
                                            {roommates.map((mate: ResidentDto) => (
                                                <div key={mate.id} className="flex flex-col gap-2 p-3 border rounded-md bg-slate-50 dark:bg-zinc-900">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center justify-center w-8 h-8 text-xs font-bold rounded-full bg-primary/10 text-primary">
                                                            {mate.user?.name?.charAt(0) || 'R'}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium">{mate.user?.name || "Resident"}</p>
                                                            {mate.course && <p className="text-[11px] text-muted-foreground">{mate.course}</p>}
                                                        </div>
                                                    </div>
                                                    <div className="pl-11 space-y-1 text-xs text-muted-foreground">
                                                        {mate.user?.phone && (
                                                            <div className="flex items-center gap-2">
                                                                <Phone className="w-3 h-3" />
                                                                <span>{mate.user.phone}</span>
                                                            </div>
                                                        )}
                                                        {mate.user?.email && (
                                                            <div className="flex items-center gap-2">
                                                                <Mail className="w-3 h-3" />
                                                                <span>{mate.user.email}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default ResidentRoomDetails