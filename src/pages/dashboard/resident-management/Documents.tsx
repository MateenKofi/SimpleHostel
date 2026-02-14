"use client"

import { FileText, Download, ShieldCheck, FileCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import SEOHelmet from "@/components/SEOHelmet"
import { useQuery } from "@tanstack/react-query"
import { getResidentAllocationDetails } from "@/api/residents"
import { useNavigate } from "react-router-dom"

import NoHostelAssigned from "@/components/resident/NoHostelAssigned"
import { PageHeader } from "@/components/layout/PageHeader"

const Documents = () => {
    const userId = localStorage.getItem("userId")
    const hostelId = localStorage.getItem("hostelId")
    const navigate = useNavigate();

    // Fetch allocation details which contains rulesUrl
    const { data: allocation, isLoading: isAllocationLoading } = useQuery({
        queryKey: ['allocationDetails'],
        queryFn: async () => {
            const responseData = await getResidentAllocationDetails();
            return responseData?.data;
        },
        enabled: !!hostelId && hostelId !== 'undefined'
    })

    if (!hostelId || hostelId === 'undefined' || hostelId === 'null') {
        return <NoHostelAssigned />
    }

    const documents = [
        {
            id: 'allocation-letter',
            title: 'Allocation Letter',
            description: 'Official proof of residency and room assignment.',
            icon: <FileText className="w-10 h-10 text-primary" />,
            action: () => navigate('/dashboard/allocation-details'),
            buttonText: 'View & Download'
        },
        {
            id: 'hostel-rules',
            title: 'Hostel Rules & Regulations',
            description: 'The code of conduct and policy guide.',
            icon: <ShieldCheck className="w-10 h-10 text-green-500" />,
            action: () => {
                if (allocation?.rulesUrl) {
                    window.open(allocation.rulesUrl, '_blank');
                } else {
                    alert("No rules document available yet.");
                }
            },
            disabled: !allocation?.rulesUrl,
            buttonText: 'Download PDF'
        },
    ]

    return (
        <div className="container max-w-4xl py-6 mx-auto">
            <SEOHelmet
                title="Documents - Fuse"
                description="Download important hostel documents."
            />

            <PageHeader
                title="My Documents"
                subtitle="Access and download your official documents."
                icon={FileText}
                sticky={true}
            />

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
                            <Button
                                className="w-full"
                                variant="outline"
                                onClick={doc.action}
                                disabled={doc.disabled || isAllocationLoading}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                {doc.buttonText}
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
