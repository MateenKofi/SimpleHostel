"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Home, Info, MapPin, Users, Building, AlertCircle, Wifi, Tv, Refrigerator, Wind, Mail } from "lucide-react"
import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getRoomDetails } from "@/api/rooms"
import ViewRoomSkeleton from "@components/loaders/ViewRoomSkeleton"
import { Room, RoomResident } from "@/helper/types/types"
import { cn } from "@/lib/utils"

type BadgeVariant = "default" | "secondary" | "destructive" | "outline"

const ViewRoom = () => {
  const { id: paramId } = useParams<{ id: string }>()
  const roomId = paramId?.replace(/^:/, "")
  const navigate = useNavigate()
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const { data: room, isLoading, isError, error } = useQuery<Room>({
    queryKey: ['room_details', roomId],
    queryFn: async () => {
      return await getRoomDetails(roomId!)
    },
    enabled: !!roomId
  })

  // Get images from room data - check all possible image properties
  const roomImages = room?.RoomImage || room?.RoomImages || room?.roomImages || room?.images || []

  // Residents are now included in the room response
  const roomResidents: RoomResident[] = room?.residents || []

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Get status badge variant based on room status
  const getStatusVariant = (status: string): BadgeVariant => {
    switch (status?.toLowerCase()) {
      case "available":
        return "default"
      case "occupied":
        return "secondary"
      case "maintenance":
        return "destructive"
      default:
        return "outline"
    }
  }

  // Get gender badge class with themed colors
  const getGenderClass = (gender: string) => {
    switch (gender?.toUpperCase()) {
      case "MALE":
        return "bg-blue-500/10 text-blue-700 border-blue-200"
      case "FEMALE":
        return "bg-pink-500/10 text-pink-700 border-pink-200"
      case "MIXED":
        return "bg-purple-500/10 text-purple-700 border-purple-200"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  // Get amenity icon based on name
  const getAmenityIcon = (name: string) => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes("wifi")) return Wifi
    if (lowerName.includes("tv")) return Tv
    if (lowerName.includes("fridge") || lowerName.includes("refrigerator")) return Refrigerator
    if (lowerName.includes("ac") || lowerName.includes("air") || lowerName.includes("cool")) return Wind
    return Home
  }

  // Error state
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <Card className="border-destructive">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold">Failed to load room</h3>
            <p className="text-sm text-muted-foreground mb-4">{error?.message || 'Please try again'}</p>
            <Button onClick={() => navigate('/dashboard/room-management')}>
              Back to Rooms
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return <ViewRoomSkeleton />
  }

  return (
    <div className="container max-w-5xl px-4 py-6 mx-auto">
      {/* Back button */}
      <Button variant="ghost" onClick={() => navigate('/dashboard/room-management')} className="mb-4">
        ← Back to rooms
      </Button>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left column - Room images */}
        <div className="md:col-span-2">
          <Card className="overflow-hidden">
            {roomImages.length > 0 ? (
              <div className="relative">
                <div className="relative overflow-hidden aspect-video">
				  <img
                    src={roomImages[activeImageIndex]?.imageUrl || "/placeholder.svg?height=400&width=600"}
                    alt={`${room?.roomNumber ?? "Room"} - Image ${activeImageIndex + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Thumbnails */}
                {roomImages.length > 1 && (
                  <div className="flex gap-2 p-2 overflow-x-auto">
                    {roomImages.map((image, index) => (
                      <div
                        key={image.id}
                        className={cn(
                          "w-20 h-20 relative cursor-pointer rounded-md overflow-hidden border-2 transition-colors",
                          index === activeImageIndex ? "border-primary" : "border-transparent hover:border-muted-foreground"
                        )}
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <img
                          src={image.imageUrl || "/placeholder.svg"}
                          alt={`${room?.roomNumber ?? "Room"} thumbnail ${index + 1}`}
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
                  <CardTitle className="text-2xl">{room?.roomNumber}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    Block {room?.block}, Floor {room?.floor}
                  </CardDescription>
                </div>
                <Badge variant={getStatusVariant(room?.status || "UNKNOWN")}>
                  {room?.status || "UNKNOWN"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">GH₵{room?.price?.toLocaleString()}</h3>
                <p className="text-sm text-muted-foreground">per calendar year</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Capacity</span>
                  <span className="flex items-center font-medium">
                    <Users className="w-4 h-4 mr-1" />
                    {room?.maxCap} students
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Gender</span>
                  <Badge className={cn("w-fit border", getGenderClass(room?.gender || "UNKNOWN"))}>
                    {room?.gender || "UNKNOWN"}
                  </Badge>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Current Occupancy</span>
                  <span className="font-medium">
                    {room?.currentResidentCount}/{room?.maxCap}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Last Updated</span>
                  <span className="text-sm font-medium">{room?.updatedAt ? formatDate(room.updatedAt) : "Unknown date"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hostel Information Card */}
          {room?.hostel && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Hostel Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  {room.hostel.logoUrl ? (
                    <img src={room.hostel.logoUrl} alt={room.hostel.name} className="h-12 w-12 rounded-full object-cover" />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                      <Building className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{room.hostel.name}</p>
                    <p className="text-sm text-muted-foreground">{room.hostel.location || room.hostel.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Room details tabs */}
      <Tabs defaultValue="description" className="mt-6">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="students">
            Students
            {roomResidents && roomResidents.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {roomResidents.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history">Assignment History</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="p-4 mt-2 border rounded-md bg-card">
          <div className="space-y-4">
            <div>
              <h3 className="flex items-center text-lg font-semibold">
                <Info className="w-5 h-5 mr-2" />
                About this room
              </h3>
              <p className="mt-2 text-muted-foreground">{room?.description || "No description available."}</p>
            </div>

            {/* Amenities Section */}
            {room?.amenities && room.amenities.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map((amenity) => {
                      const Icon = getAmenityIcon(amenity.name)
                      return (
                        <Badge key={amenity.id} variant="outline" className="gap-1.5 py-1.5 px-3">
                          <Icon className="w-3.5 h-3.5" />
                          {amenity.name}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              </>
            )}

            <Separator />

            <div>
              <h3 className="text-lg font-semibold">Room Details</h3>
              <div className="grid grid-cols-1 gap-4 mt-2 sm:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium">Room Type</h4>
                  <p className="text-sm text-muted-foreground capitalize">{room?.type || "Not specified"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Created On</h4>
                  <p className="text-sm text-muted-foreground">{room?.createdAt ? formatDate(room.createdAt) : "Unknown date"}</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="students" className="p-4 mt-2 border rounded-md bg-card">
          {roomResidents && roomResidents.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Emergency Contact</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roomResidents.map((resident: RoomResident) => (
                    <TableRow key={resident.id}>
                      <TableCell className="font-medium">{resident.name || "N/A"}</TableCell>
                      <TableCell>
                        {resident.email ? (
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm">{resident.email}</span>
                          </div>
                        ) : "N/A"}
                      </TableCell>
                      <TableCell>{resident.phone || "N/A"}</TableCell>
                      <TableCell>
                        <Badge className={cn("border", getGenderClass(resident.gender || "UNKNOWN"))}>
                          {resident.gender || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>{resident.studentId || "N/A"}</TableCell>
                      <TableCell>{resident.course || "N/A"}</TableCell>
                      <TableCell>
                        {resident.emergencyContactName ? (
                          <div className="text-sm">
                            <p>{resident.emergencyContactName}</p>
                            {resident.emergencyContactPhone && (
                              <p className="text-muted-foreground">{resident.emergencyContactPhone}</p>
                            )}
                          </div>
                        ) : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={resident.status === "active" ? "default" : "secondary"} className="capitalize">
                          {resident.status || "Unknown"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="w-12 h-12 text-muted-foreground mb-3 opacity-50" />
              <h3 className="text-lg font-semibold mb-1">No residents assigned</h3>
              <p className="text-sm text-muted-foreground">This room currently has no residents.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="p-4 mt-2 border rounded-md bg-card">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Info className="w-12 h-12 text-muted-foreground mb-3 opacity-50" />
            <h3 className="text-lg font-semibold mb-1">Assignment History</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Historical resident assignment data will be displayed here when available.
              This feature shows past residents with their check-in and check-out dates.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ViewRoom
