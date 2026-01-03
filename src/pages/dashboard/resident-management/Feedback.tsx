"use client"

import { useForm, SubmitHandler } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { submitFeedback } from "@/api/residents"
import { Loader, Star, Send, MessageSquare } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import toast from "react-hot-toast"
import { useState } from "react"
import SEOHelmet from "@/components/SEOHelmet"

interface CreateFeedbackDto {
    rating: number
    comment: string
    category: string
}

import NoHostelAssigned from "@/components/resident/NoHostelAssigned"

const Feedback = () => {
    const [rating, setRating] = useState(0)
    // Check for hostel assignment
    const hostelId = localStorage.getItem("hostelId")
    const isInvalidHostelId = !hostelId || hostelId === 'undefined' || hostelId === 'null'

    if (isInvalidHostelId) {
        return <NoHostelAssigned />
    }

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreateFeedbackDto>()

    const feedbackMutation = useMutation({
        mutationFn: async (data: CreateFeedbackDto) => {
            return await submitFeedback(data)
        },
        onSuccess: () => {
            toast.success("Thank you for your feedback!")
            reset()
            setRating(0)
        },
        onError: (error: any) => {
            const msg = error.response?.data?.message || "Failed to submit feedback"
            toast.error(msg)
        }
    })

    const onSubmit: SubmitHandler<CreateFeedbackDto> = (data) => {
        if (rating === 0) {
            toast.error("Please provide a rating")
            return
        }
        feedbackMutation.mutate({ ...data, rating })
    }

    return (
        <div className="container max-w-2xl py-6 mx-auto">
            <SEOHelmet
                title="Give Feedback - Fuse"
                description="Rate your hostel experience and suggest improvements."
            />

            <div className="flex flex-col gap-2 mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight">We Value Your Feedback</h1>
                <p className="text-muted-foreground">Help us improve your hostel experience.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        Share your thoughts
                    </CardTitle>
                    <CardDescription>
                        Rate our services and let us know what we can do better.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6">

                        {/* Star Rating */}
                        <div className="flex flex-col items-center gap-2">
                            <Label>Rate your experience</Label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className={`transition-all hover:scale-110 focus:outline-none ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                        onClick={() => setRating(star)}
                                    >
                                        <Star className="w-8 h-8 fill-current" />
                                    </button>
                                ))}
                            </div>
                            <p className="text-sm font-medium text-muted-foreground">
                                {rating === 1 && "Poor"}
                                {rating === 2 && "Fair"}
                                {rating === 3 && "Good"}
                                {rating === 4 && "Very Good"}
                                {rating === 5 && "Excellent"}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select onValueChange={(val) => setValue('category', val)} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="service">General Service</SelectItem>
                                    <SelectItem value="cleanliness">Cleanliness</SelectItem>
                                    <SelectItem value="facilities">Facilities (Gym, Wifi, etc.)</SelectItem>
                                    <SelectItem value="staff">Staff Behavior</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="comment">Comments & Suggestions</Label>
                            <Textarea
                                id="comment"
                                placeholder="What did you like? What can we improve?"
                                className="min-h-[100px]"
                                {...register("comment", { required: "Please provide a comment" })}
                            />
                            {errors.comment && <p className="text-sm text-red-500">{errors.comment.message}</p>}
                        </div>

                    </CardContent>
                    <CardFooter className="justify-end bg-gray-50 dark:bg-zinc-900/50 p-4">
                        <Button type="submit" disabled={feedbackMutation.isPending} className="w-full sm:w-auto">
                            {feedbackMutation.isPending ? (
                                <>
                                    <Loader className="w-4 h-4 mr-2 animate-spin" /> Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4 mr-2" /> Submit Feedback
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

export default Feedback
