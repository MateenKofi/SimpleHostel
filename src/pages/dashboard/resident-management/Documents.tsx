"use client"

import { FileText, Download, ShieldCheck, FileCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import SEOHelmet from "@/components/SEOHelmet"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

import NoHostelAssigned from "@/components/resident/NoHostelAssigned"

const Documents = () => {
    const userId = localStorage.getItem("userId")
    const hostelId = localStorage.getItem("hostelId")

    // Fetch user profile to ensure we have data for documents
    // We might not use it directly but it validates the user context
    const { data: userProfile } = useQuery({
        queryKey: ['userProfile', userId],
        queryFn: async () => {
            const response = await axios.get(`/api/users/get/${userId}`)
            return response.data
        },
        enabled: !!userId
    })

    if (!hostelId || hostelId === 'undefined' || hostelId === 'null') {
        return <NoHostelAssigned />
    }

    const documents = [
        {
            id: 'allocation-letter',
            title: 'Allocation Letter',
            description: 'Official proof of your room assignment.',
            icon: <FileCheck className="w-10 h-10 text-blue-500" />,
            action: () => window.open(`/api/exports/residents/${userId}`, '_blank')
        },
        {
            id: 'hostel-rules',
            title: 'Hostel Rules & Regulations',
            description: 'The code of conduct and policy guide.',
            icon: <ShieldCheck className="w-10 h-10 text-green-500" />,
            action: () => alert("Downloading Hostel Rules PDF...") // Placeholder for static asset link
        },
        // Receipts are handled in Payments page but can be linked here too if needed
    ]

    return (
        <div className="container max-w-4xl py-6 mx-auto">
            <SEOHelmet
                title="Documents - Fuse"
                description="Download important hostel documents."
            />

            <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-3xl font-bold tracking-tight">My Documents</h1>
                <p className="text-muted-foreground">Access and download your official documents.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {documents.map((doc) => (
                    <Card key={doc.id} className="transition-all hover:border-primary/50">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            <div className="p-3 bg-slate-50 dark:bg-zinc-800 rounded-full border">
                                {doc.icon}
                            </div>
                            <div>
                                <CardTitle className="text-xl">{doc.title}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-base">
                                {doc.description}
                            </CardDescription>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" variant="outline" onClick={doc.action}>
                                <Download className="w-4 h-4 mr-2" /> Download details
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 rounded-lg flex items-start gap-3">
                <FileText className="w-5 h-5 mt-0.5" />
                <div>
                    <h4 className="font-semibold">Need Receipts?</h4>
                    <p className="text-sm">You can view and download all your payment receipts from the <a href="/dashboard/payment-billing" className="underline hover:no-underline font-medium">Payments & Billing</a> page.</p>
                </div>
            </div>
        </div>
    )
}

export default Documents
