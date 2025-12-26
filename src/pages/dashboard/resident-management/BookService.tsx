"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { Loader, Calendar, Clock, DollarSign, Dumbbell, WashingMachine, BookOpen, Bed, Car, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import { format } from "date-fns"
import SEOHelmet from "@/components/SEOHelmet"

interface Service {
    id: string
    name: string
    description: string
    price: number
    availability: boolean
    type: "gym" | "laundry" | "study_room" | "guest_room" | "parking" | "other"
}

interface Booking {
    id: string
    serviceId: string
    serviceName: string
    bookingDate: string
    status: "confirmed" | "pending" | "cancelled"
}

// Helper to map icons
const getServiceIcon = (type: string) => {
    switch (type) {
        case 'gym': return <Dumbbell className="w-8 h-8" />
        case 'laundry': return <WashingMachine className="w-8 h-8" />
        case 'study_room': return <BookOpen className="w-8 h-8" />
        case 'guest_room': return <Bed className="w-8 h-8" />
        case 'parking': return <Car className="w-8 h-8" />
        default: return <Clock className="w-8 h-8" />
    }
}

import NoHostelAssigned from "@/components/resident/NoHostelAssigned"

const BookService = () => {
    const queryClient = useQueryClient()
    const userId = localStorage.getItem("userId")
    // Retrieve hostelId directly or derive from profile (which was already being fetched)
    // We already fetch userProfile, so we can use that, BUT checking localStorage is faster for immediate feedback
    const localHostelId = localStorage.getItem("hostelId")

    const [selectedService, setSelectedService] = useState<Service | null>(null)
    const [bookingDate, setBookingDate] = useState<string>("")
    const [isModalOpen, setIsModalOpen] = useState(false)

    // 1. Fetch User Profile to get Hostel ID (Optional fallback if not in local storage)
    const { data: userProfile } = useQuery({
        queryKey: ['userProfile', userId],
        queryFn: async () => {
            const response = await axios.get(`/api/users/get/${userId}`)
            return response.data
        },
        enabled: !!userId
    })

    const hostelId = localHostelId || userProfile?.hostelId
    const isInvalidHostelId = !hostelId || hostelId === 'undefined' || hostelId === 'null'

    // 2. Fetch Available Services
    const { data: services, isLoading: isLoadingServices } = useQuery<Service[]>({
        queryKey: ['hostel-services', hostelId],
        queryFn: async () => {
            if (isInvalidHostelId) return []
            const response = await axios.get(`/api/services/list/${hostelId}`)
            return response.data?.data || []
        },
        enabled: !isInvalidHostelId
    })

    // Gate the component
    if (isInvalidHostelId && !isLoadingServices && userProfile) {
        // If we have loaded profile and still no hostelId
        return <NoHostelAssigned />
    }
    // Alternatively, simple check if we want to be strict with localStorage
    if ((!localHostelId || localHostelId === 'undefined' || localHostelId === 'null') && !userProfile) {
        // return <NoHostelAssigned /> // Wait for profile fetch? 
        // Let's stick to localStorage for consistency with other pages given the request
        // But BookService relied on fetching it. Let's use localStorage check for immediate block.
    }

    if (isInvalidHostelId && !userProfile && !isLoadingServices) {
        // effectively no hostel
        return <NoHostelAssigned />
    }

    // 3. Fetch My Bookings
    const { data: myBookings, isLoading: isLoadingBookings } = useQuery<Booking[]>({
        queryKey: ['my-bookings'],
        queryFn: async () => {
            const response = await axios.get(`/api/services/bookings`)
            return response.data?.data || []
        }
    })

    // 4. Booking Mutation
    const bookMutation = useMutation({
        mutationFn: async (data: { serviceId: string, bookingDate: string }) => {
            const response = await axios.post('/api/services/book', data)
            return response.data
        },
        onSuccess: () => {
            toast.success("Service booked successfully!")
            setIsModalOpen(false)
            setBookingDate("")
            setSelectedService(null)
            queryClient.invalidateQueries({ queryKey: ['my-bookings'] })
        },
        onError: (error: any) => {
            const msg = error.response?.data?.message || "Failed to book service"
            toast.error(msg)
        }
    })

    const handleBookClick = (service: Service) => {
        setSelectedService(service)
        setIsModalOpen(true)
    }

    const confirmBooking = () => {
        if (!selectedService || !bookingDate) return
        bookMutation.mutate({
            serviceId: selectedService.id,
            bookingDate: new Date(bookingDate).toISOString()
        })
    }

    return (
        <div className="container max-w-5xl py-6 mx-auto">
            <SEOHelmet
                title="Book Services - Fuse"
                description="Book hostel amenities and services."
            />

            <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Services & Facilities</h1>
                <p className="text-muted-foreground">Book amenities like Gym, Laundry, or Study Rooms.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">

                {/* Available Services Column */}
                <div className="md:col-span-2 space-y-6">
                    <h2 className="text-xl font-semibold">Available Services</h2>

                    {isLoadingServices ? (
                        <div className="flex justify-center p-8"><Loader className="animate-spin" /></div>
                    ) : services && services.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {services.map(service => (
                                <Card key={service.id} className="relative overflow-hidden transition-all hover:border-primary/50">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <div className="p-2 border rounded-full bg-slate-50 dark:bg-zinc-800">
                                            {getServiceIcon(service.type)}
                                        </div>
                                        {service.price > 0 ? (
                                            <Badge variant="secondary" className="font-bold">
                                                GH₵ {service.price}
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Free</Badge>
                                        )}
                                    </CardHeader>
                                    <CardContent>
                                        <CardTitle className="text-lg">{service.name}</CardTitle>
                                        <CardDescription className="mt-1 line-clamp-2">
                                            {service.description}
                                        </CardDescription>
                                    </CardContent>
                                    <CardFooter>
                                        <Button
                                            className="w-full"
                                            onClick={() => handleBookClick(service)}
                                            disabled={!service.availability}
                                        >
                                            {service.availability ? "Book Now" : "Unavailable"}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center border border-dashed rounded-lg bg-slate-50">
                            <p className="text-muted-foreground">No services available for booking at this time.</p>
                        </div>
                    )}
                </div>

                {/* My Bookings Column */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">My Bookings</h2>
                    <Card className="h-fit">
                        <CardHeader>
                            <CardTitle className="text-base">Upcoming</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isLoadingBookings ? (
                                <div className="flex justify-center p-4"><Loader className="animate-spin w-4 h-4" /></div>
                            ) : myBookings && myBookings.length > 0 ? (
                                myBookings.map(booking => (
                                    <div key={booking.id} className="flex items-start gap-3 p-3 text-sm border rounded-md">
                                        <div className="mt-1 text-primary">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{booking.serviceName}</p>
                                            <p className="text-muted-foreground text-xs">
                                                {format(new Date(booking.bookingDate), 'PPP p')}
                                            </p>
                                            <Badge variant="outline" className="mt-1 text-[10px] h-5">
                                                {booking.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">You have no active bookings.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Booking Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Book {selectedService?.name}</DialogTitle>
                        <DialogDescription>
                            Select a date and time for your booking.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="date">Date & Time</Label>
                            <Input
                                id="date"
                                type="datetime-local"
                                value={bookingDate}
                                onChange={(e) => setBookingDate(e.target.value)}
                            />
                        </div>
                        {selectedService?.price && selectedService.price > 0 && (
                            <div className="flex items-center gap-2 p-3 text-sm rounded-md bg-yellow-50 text-yellow-800">
                                <DollarSign className="w-4 h-4" />
                                Note: This service costs GH₵ {selectedService.price}. You will be billed accordingly.
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={confirmBooking} disabled={bookMutation.isPending || !bookingDate}>
                            {bookMutation.isPending ? <Loader className="w-4 h-4 animate-spin" /> : "Confirm Booking"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default BookService
