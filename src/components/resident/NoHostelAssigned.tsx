"use client"

import { useNavigate } from "react-router-dom"
import { Building2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const NoHostelAssigned = () => {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
            <Card className="w-full max-w-md text-center border-dashed border-2">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <div className="p-4 bg-primary/10 rounded-full">
                            <Building2 className="w-10 h-10 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">No Hostel Assigned</CardTitle>
                    <CardDescription>
                        You need to be assigned to a hostel room to access this feature.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        It looks like you haven't booked a room yet. Browse our available hostels and find your perfect space today.
                    </p>
                    <Button onClick={() => navigate('/')} className="w-full">
                        Find & Book a Room <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

export default NoHostelAssigned
