"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, User, Mail, Phone, MapPin, BadgeCheck, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import SEOHelmet from "@/components/SEOHelmet"
import { useAddedResidentStore } from "@/stores/useAddedResidentStore"
import type { ResidentDto } from "@/types/dtos"
import { getResidentById } from "@/api/residents"

const ViewResident = () => {
  const navigate = useNavigate()
  const { resident: storedResident, setResident } = useAddedResidentStore()

  // Fetch fresh resident data by ID
  const { data: resident, isLoading, isError } = useQuery<ResidentDto>({
    queryKey: ["resident", storedResident?.id],
    queryFn: async () => {
      if (!storedResident?.id) {
        throw new Error("No resident ID provided")
      }
      const response = await getResidentById(storedResident.id)
      return response.data
    },
    enabled: !!storedResident?.id,
  })

  useEffect(() => {
    if (!storedResident?.id) {
      // If no resident is stored, redirect back to resident management
      navigate("/dashboard/resident-management")
    }
  }, [storedResident, navigate])

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "checked_in":
        return "default"
      case "inactive":
      case "checked_out":
        return "secondary"
      case "pending":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "checked_in":
        return "Active"
      case "inactive":
      case "checked_out":
        return "Inactive"
      case "pending":
        return "Pending"
      default:
        return status
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-10 rounded" />
          <div className="flex-1">
            <Skeleton className="h-7 w-40 mb-2" />
            <Skeleton className="h-4 w-56" />
          </div>
          <Skeleton className="h-10 w-28" />
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid gap-6 md:grid-cols-3 items-start">
          {/* Left Column - Profile Card */}
          <div className="md:col-span-1 space-y-4">
            <Card className="h-fit">
              <CardHeader className="text-center space-y-3">
                <Skeleton className="h-24 w-24 rounded-full mx-auto" />
                <Skeleton className="h-6 w-32 mx-auto" />
                <Skeleton className="h-4 w-24 mx-auto" />
                <Skeleton className="h-6 w-20 mx-auto mt-2" />
              </CardHeader>
              <Separator />
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 flex-1" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 flex-1" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Tabs Content */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="space-y-4">
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Personal Info Section */}
                <div className="space-y-4">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-56" />
                  <div className="grid grid-cols-2 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-5 w-full max-w-[150px]" />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Room Section */}
                <div className="space-y-4">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-48" />
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-5 w-full max-w-[120px]" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (isError || !resident) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Resident Not Found</h2>
        <p className="text-muted-foreground mb-4 text-center">
          Unable to load resident details. The resident may have been deleted or you may not have permission to view this information.
        </p>
        <Button onClick={() => navigate("/dashboard/resident-management")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Residents
        </Button>
      </div>
    )
  }

  const user = resident.user

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <SEOHelmet
        title={`View Resident - ${user?.name || "Resident"}`}
        description="View resident details and information"
      />

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/dashboard/resident-management")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Resident Details</h1>
          <p className="text-muted-foreground text-sm">
            View and manage resident information
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setResident(resident)
              navigate("/dashboard/edit-resident")
            }}
          >
            Edit Resident
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 items-start">
        {/* Left Column - Profile Card */}
        <div className="md:col-span-1">
          <Card className="h-fit">
            <CardHeader className="text-center">
              <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-primary" />
                )}
              </div>
              <CardTitle>{user?.name || resident.name || "N/A"}</CardTitle>
              <CardDescription>{resident.studentId || "No Student ID"}</CardDescription>
              <div className="flex justify-center mt-3">
                <Badge variant={getStatusVariant(resident.status)}>
                  {getStatusLabel(resident.status)}
                </Badge>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="truncate">{user?.email || resident.email || "N/A"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{user?.phone || resident.phone || "N/A"}</span>
              </div>
              {user?.gender && (
                <div className="flex items-center gap-3 text-sm">
                  <BadgeCheck className="w-4 h-4 text-muted-foreground" />
                  <span className="capitalize">{user.gender}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Details Tabs */}
        <div className="md:col-span-2">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="accommodation">Accommodation</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
            </TabsList>

            {/* Personal Info Tab */}
            <TabsContent value="personal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Resident's personal details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                      <p className="font-medium">{user?.name || resident.name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Student ID</p>
                      <p className="font-medium font-mono">{resident.studentId || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Email</p>
                      <p className="font-medium text-sm">{user?.email || resident.email || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Phone</p>
                      <p className="font-medium">{user?.phone || resident.phone || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Gender</p>
                      <p className="font-medium capitalize">{user?.gender || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Course</p>
                      <p className="font-medium">{resident.course || "N/A"}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Account Status</p>
                    <Badge variant={user?.accountStatus === "active" ? "default" : "secondary"} className="capitalize">
                      {user?.accountStatus || "Unknown"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Accommodation Tab */}
            <TabsContent value="accommodation" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Room Assignment</CardTitle>
                  <CardDescription>Current accommodation details</CardDescription>
                </CardHeader>
                <CardContent>
                  {resident.room ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">{resident.room.roomNumber || resident.roomNumber}</p>
                            <p className="text-sm text-muted-foreground">
                              {resident.room.block && `Block ${resident.room.block}`}
                              {resident.room.floor && `, Floor ${resident.room.floor}`}
                            </p>
                          </div>
                        </div>
                        <Badge>Assigned</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Room Type</p>
                          <p className="font-medium capitalize">{resident.room.type || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Capacity</p>
                          <p className="font-medium">
                            {resident.room.currentResidentCount || 0} / {resident.room.maxCap || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Check-in Date</p>
                          <p className="font-medium">{formatDate(resident.checkInDate)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Check-out Date</p>
                          <p className="font-medium">{formatDate(resident.checkOutDate)}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-muted/30 rounded-lg">
                      <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                      <p className="text-muted-foreground">No room assigned</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() => {
                          setResident(resident)
                          navigate("/dashboard/room-assignment")
                        }}
                      >
                        Assign Room
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Roommates */}
              {resident.roommates && resident.roommates.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Roommates</CardTitle>
                    <CardDescription>Other residents in the same room</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {resident.roommates.map((roommate) => (
                        <div
                          key={roommate.id}
                          className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{roommate.user?.name || roommate.name}</p>
                            <p className="text-xs text-muted-foreground">{roommate.studentId || "No ID"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Payment Tab */}
            <TabsContent value="payment" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                  <CardDescription>Room fees and payment status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Room Price</p>
                      <p className="font-semibold text-lg">
                        {resident.roomPrice
                          ? `GH₵ ${Number(resident.roomPrice).toLocaleString()}`
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Amount Paid</p>
                      <p className="font-semibold text-lg text-emerald-600">
                        {resident.amountPaid
                          ? `GH₵ ${Number(resident.amountPaid).toLocaleString()}`
                          : "GH₵ 0"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Balance Owed</p>
                      <p className={`font-semibold text-lg ${resident.balanceOwed && resident.balanceOwed > 0 ? "text-destructive" : "text-emerald-600"}`}>
                        {resident.balanceOwed !== undefined && resident.balanceOwed !== null
                          ? `GH₵ ${Number(resident.balanceOwed).toLocaleString()}`
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Payment Status</p>
                      <Badge variant={resident.balanceOwed === 0 ? "default" : "destructive"}>
                        {resident.balanceOwed === 0 ? "Fully Paid" : "Payment Due"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default ViewResident
