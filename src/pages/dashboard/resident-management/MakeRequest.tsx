"use client"

import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getResidentRequests, createResidentRequest } from "@/api/residents"
import { Loader, Plus, Wrench, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TextField } from "@/components/TextField"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"
import { format } from "date-fns"

// Types based on the API guide
type RequestType = "maintenance" | "room_change" | "item_replacement" | "misconduct" | "emergency" | "other"
type RequestPriority = "low" | "medium" | "high" | "critical"

interface CreateMaintenanceRequestDto {
    type: RequestType
    subject: string
    description: string
    priority: RequestPriority
    images?: string[] // Optional array of URLs
}

interface MaintenanceRequest extends CreateMaintenanceRequestDto {
    id: string
    status: "pending" | "in-progress" | "resolved" | "rejected"
    createdAt: string
    updatedAt: string
}

import NoHostelAssigned from "@/components/resident/NoHostelAssigned"

const MakeRequest = () => {
    const [activeTab, setActiveTab] = useState("new-request")
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CreateMaintenanceRequestDto>({
        defaultValues: {
            priority: "low",
            type: "maintenance"
        }
    })
    const queryClient = useQueryClient()

    // Check for hostel assignment
    const hostelId = localStorage.getItem("hostelId")
    // Alternatively can fetch user profile if localStorage is unreliable, but assuming it's set on login

    // Check if hostelId is valid (not null, undefined, "undefined", or "null")
    const isInvalidHostelId = !hostelId || hostelId === 'undefined' || hostelId === 'null'

    if (isInvalidHostelId) {
        return <NoHostelAssigned />
    }

    // Fetch Requests History
    const { data: requestHistory, isLoading: isLoadingHistory } = useQuery<MaintenanceRequest[]>({
        queryKey: ['maintenance-requests'],
        queryFn: async () => {
            const responseData = await getResidentRequests()
            return responseData?.data || []
        },
        // Fallback or error handling can be better, but for now standard query
    })

    // Mutation for creating request
    const createRequestMutation = useMutation({
        mutationFn: async (data: CreateMaintenanceRequestDto) => {
            return await createResidentRequest(data)
        },
        onSuccess: () => {
            toast.success("Request submitted successfully!")
            reset()
            setActiveTab("history")
            queryClient.invalidateQueries({ queryKey: ['maintenance-requests'] })
        },
        onError: (error: any) => {
            const msg = error.response?.data?.message || "Failed to submit request"
            toast.error(msg)
        }
    })

    const onSubmit: SubmitHandler<CreateMaintenanceRequestDto> = (data) => {
        // Map frontend types to backend expected types
        let payload = { ...data }

        if (data.type === 'misconduct') {
            // @ts-ignore - casting to fit backend expected string if strictly typed
            payload.type = 'other'
            payload.subject = `Misconduct Report: ${data.subject}`
        } else if (data.type === 'emergency') {
            // @ts-ignore
            payload.type = 'other'
            payload.priority = 'critical'
            payload.subject = `EMERGENCY: ${data.subject}`
        }

        createRequestMutation.mutate(payload)
    }

    // Helper for status colors
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <Badge variant="outline" className="border-yellow-500 text-yellow-600 bg-yellow-50"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>
            case 'in-progress': return <Badge variant="outline" className="border-blue-500 text-blue-600 bg-blue-50"><Wrench className="w-3 h-3 mr-1" /> In Progress</Badge>
            case 'resolved': return <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50"><CheckCircle className="w-3 h-3 mr-1" /> Resolved</Badge>
            case 'rejected': return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" /> Rejected</Badge>
            default: return <Badge variant="secondary">{status}</Badge>
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical': return 'text-red-600 font-bold'
            case 'high': return 'text-orange-600 font-bold'
            case 'medium': return 'text-blue-600'
            default: return 'text-gray-600'
        }
    }

    return (
        <div className="container max-w-4xl py-6 mx-auto">
            <div className="flex flex-col gap-2 mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Requests & Reporting</h1>
                <p className="text-muted-foreground">Submit maintenance requests, report issues, or ask for room changes.</p>
                <div className="mt-2">
                    <Button
                        variant="destructive"
                        className="w-full sm:w-auto"
                        onClick={() => {
                            setValue('type', 'emergency')
                            setValue('priority', 'critical')
                            setValue('subject', 'EMERGENCY REPORT')
                            setActiveTab('new-request')
                            toast('Emergency Report Started. Please describe the situation immediately.', { icon: '🚨' })
                        }}
                    >
                        <AlertCircle className="w-4 h-4 mr-2" /> REPORT EMERGENCY
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="new-request">New Request</TabsTrigger>
                    <TabsTrigger value="history">Request History</TabsTrigger>
                </TabsList>

                <TabsContent value="new-request" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Submit a New Request</CardTitle>
                            <CardDescription>
                                Please provide detailed information to help us resolve your issue quickly.
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Request Type</Label>
                                        <Select
                                            onValueChange={(value) => setValue('type', value as RequestType)}
                                            defaultValue="maintenance"
                                            value={watch('type')}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="maintenance">Maintenance Issue</SelectItem>
                                                <SelectItem value="room_change">Room Change Request</SelectItem>
                                                <SelectItem value="item_replacement">Item Replacement</SelectItem>
                                                <SelectItem value="misconduct">Report Misconduct/Roommate Issue</SelectItem>
                                                <SelectItem value="emergency">Emergency</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="priority">Priority</Label>
                                        <Select
                                            onValueChange={(value) => setValue('priority', value as RequestPriority)}
                                            defaultValue="low"
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select priority" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">Low - Can wait a few days</SelectItem>
                                                <SelectItem value="medium">Medium - Needs attention soon</SelectItem>
                                                <SelectItem value="high">High - Affects daily living</SelectItem>
                                                <SelectItem value="critical">Critical - Emergency/Safety Hazard</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <TextField
                                    label="Subject"
                                    id="subject"
                                    placeholder="e.g., Leaking Faucet, Broken Fan..."
                                    register={register("subject", { required: "Subject is required" })}
                                    error={errors.subject}
                                />

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe the issue in detail..."
                                        className="min-h-[120px]"
                                        {...register("description", { required: "Description is required" })}
                                    />
                                    {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                                </div>

                                {/* Image upload placeholder - can be enhanced later with actual upload component */}
                                <div className="p-4 border border-dashed rounded-md bg-muted/50">
                                    <p className="text-sm text-center text-muted-foreground">
                                        (Optional) Image upload functionality would go here.
                                        <br />For now, please describe the issue clearly.
                                    </p>
                                </div>

                            </CardContent>
                            <CardFooter className="flex justify-end bg-gray-50 dark:bg-zinc-900/50 p-4">
                                <Button type="submit" disabled={createRequestMutation.isPending}>
                                    {createRequestMutation.isPending ? (
                                        <>
                                            <Loader className="w-4 h-4 mr-2 animate-spin" /> Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4 mr-2" /> Submit Request
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>

                <TabsContent value="history" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Requests</CardTitle>
                            <CardDescription>
                                Track the status of your submitted requests.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoadingHistory ? (
                                <div className="flex justify-center py-8">
                                    <Loader className="w-8 h-8 animate-spin text-primary" />
                                </div>
                            ) : requestHistory && requestHistory.length > 0 ? (
                                <div className="space-y-4">
                                    {requestHistory.map((req, index) => (
                                        <div key={req.id || index} className="flex flex-col p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h4 className="font-semibold">{req.subject}</h4>
                                                    <span className="text-xs text-muted-foreground capitalize">{req.type.replace('_', ' ')}</span>
                                                </div>
                                                {getStatusBadge(req.status)}
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                                                {req.description}
                                            </p>
                                            <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
                                                <div className="flex items-center gap-2">
                                                    <span>Priority: <span className={getPriorityColor(req.priority)}>{req.priority.toUpperCase()}</span></span>
                                                </div>
                                                <span>Submitted: {req.createdAt ? format(new Date(req.createdAt), 'PPP') : 'N/A'}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
                                        <CheckCircle className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <h3 className="text-lg font-medium">No requests found</h3>
                                    <p className="text-muted-foreground mt-1">You haven't submitted any requests yet.</p>
                                    <Button variant="link" onClick={() => setActiveTab('new-request')} className="mt-2">
                                        Create your first request
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default MakeRequest
