"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { Loader, Plus, Trash2, Edit, Dumbbell, WashingMachine, BookOpen, Bed, Car, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import toast from "react-hot-toast"
import SEOHelmet from "@/components/SEOHelmet"

interface Service {
    id: string
    name: string
    description: string
    price: number
    availability: boolean
    type: "gym" | "laundry" | "study_room" | "guest_room" | "parking" | "other"
}

// Helper to map icons
const getServiceIcon = (type: string) => {
    switch (type) {
        case 'gym': return <Dumbbell className="w-5 h-5" />
        case 'laundry': return <WashingMachine className="w-5 h-5" />
        case 'study_room': return <BookOpen className="w-5 h-5" />
        case 'guest_room': return <Bed className="w-5 h-5" />
        case 'parking': return <Car className="w-5 h-5" />
        default: return <Clock className="w-5 h-5" />
    }
}

const ServiceManagement = () => {
    const queryClient = useQueryClient()
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newService, setNewService] = useState({
        name: "",
        description: "",
        price: 0,
        type: "other",
        availability: true
    })

    // Fetch Services - assuming generic list endpoint works for admin too or specific admin endpoint
    // Using the one resident uses but unrestricted or verified by token role
    // NOTE: The API guide mentions POST /api/services/create, assuming GET /api/services/list/:hostelId exists
    // We need hostelId. Using generic generic or fetching from admin profile.
    const userId = localStorage.getItem("userId")
    const { data: userProfile } = useQuery({
        queryKey: ['adminProfile', userId],
        queryFn: async () => {
            const response = await axios.get(`/api/users/get/${userId}`)
            return response.data
        }
    })
    const hostelId = userProfile?.hostelId

    const { data: services, isLoading } = useQuery<Service[]>({
        queryKey: ['admin-services', hostelId],
        queryFn: async () => {
            // If hostelId is missing, might need a generic 'my hostel' services endpoint
            // Fallback to empty if not ready
            if (!hostelId) return []
            const response = await axios.get(`/api/services/list/${hostelId}`)
            return response.data?.data || []
        },
        enabled: !!hostelId
    })

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            const payload = { ...data, hostelId }
            const response = await axios.post('/api/services/create', payload)
            return response.data
        },
        onSuccess: () => {
            toast.success("Service created successfully")
            setIsCreateOpen(false)
            setNewService({ name: "", description: "", price: 0, type: "other", availability: true })
            queryClient.invalidateQueries({ queryKey: ['admin-services'] })
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to create service")
        }
    })

    // Toggle Availability Mutation (Placeholder - assuming API supports update or we use create to overwrite)
    // Real implementation would likely be PUT /api/services/:id

    // Delete Mutation (Placeholder)
    // DELETE /api/services/:id

    const handleCreate = () => {
        if (!newService.name || !hostelId) return
        createMutation.mutate(newService)
    }

    return (
        <div className="p-6">
            <SEOHelmet
                title="Service Management - Fuse"
                description="Manage hostel services and facilities."
            />

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Service Management</h1>
                    <p className="text-muted-foreground">Add and manage services available to residents.</p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Add Service
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Existing Services</CardTitle>
                    <CardDescription>
                        Services listed here are visible to residents for booking.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center p-8"><Loader className="animate-spin" /></div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Start</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {services && services.length > 0 ? (
                                    services.map((service) => (
                                        <TableRow key={service.id}>
                                            <TableCell>{getServiceIcon(service.type)}</TableCell>
                                            <TableCell className="font-medium">{service.name}</TableCell>
                                            <TableCell className="capitalize">{service.type.replace('_', ' ')}</TableCell>
                                            <TableCell>GH₵ {service.price}</TableCell>
                                            <TableCell>
                                                <div className={`flex items-center gap-2 ${service.availability ? 'text-green-600' : 'text-gray-400'}`}>
                                                    <div className={`w-2 h-2 rounded-full ${service.availability ? 'bg-green-600' : 'bg-gray-400'}`} />
                                                    {service.availability ? "Active" : "Inactive"}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" disabled>
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" disabled>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            No services found. Add one to get started.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Service</DialogTitle>
                        <DialogDescription>Create a new service residents can book.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Service Name</Label>
                            <Input id="name" value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} placeholder="e.g. Main Gym" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="type">Type</Label>
                            <Select onValueChange={(val) => setNewService({ ...newService, type: val as any })} defaultValue={newService.type}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="gym">Gym</SelectItem>
                                    <SelectItem value="laundry">Laundry</SelectItem>
                                    <SelectItem value="study_room">Study Room</SelectItem>
                                    <SelectItem value="guest_room">Guest Room</SelectItem>
                                    <SelectItem value="parking">Parking</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="price">Price (GH₵)</Label>
                            <Input id="price" type="number" value={newService.price} onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) })} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="desc">Description</Label>
                            <Textarea id="desc" value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} placeholder="Details about this service..." />
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch id="avail" checked={newService.availability} onCheckedChange={(c) => setNewService({ ...newService, availability: c })} />
                            <Label htmlFor="avail">Available for booking immediately</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreate} disabled={createMutation.isPending || !newService.name}>
                            {createMutation.isPending ? <Loader className="w-4 h-4 animate-spin" /> : "Create Service"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ServiceManagement
