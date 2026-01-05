import { useQuery } from "@tanstack/react-query";
import { getResidentAllocationDetails } from "@/api/residents";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Printer, ArrowLeft, Building2, MapPin, Phone, Mail, CheckCircle2 } from "lucide-react";
import SEOHelmet from "@/components/SEOHelmet";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import toast from "react-hot-toast";
import { AllocationDetails } from "@/helper/types/types";

const AllocationDetailsPage = () => {
    const navigate = useNavigate();
    const letterRef = useRef<HTMLDivElement>(null);

    const { data: response, isLoading, isError } = useQuery({
        queryKey: ["resident-allocation-details"],
        queryFn: async () => {
            const responseData = await getResidentAllocationDetails();
            return responseData?.data as AllocationDetails;
        },
    });

    const details = response;

    const handlePrint = useReactToPrint({
        contentRef: letterRef,
        documentTitle: `Allocation_Letter_${details?.studentId || 'Resident'}`,
    });

    const handleDownloadPDF = async () => {
        if (!letterRef.current) return;

        const loadingToast = toast.loading("Generating PDF...");
        try {
            const canvas = await html2canvas(letterRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
            });
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });

            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            pdf.save(`Allocation_Letter_${details?.studentId || 'Resident'}.pdf`);
            toast.success("Allocation Letter downloaded successfully", { id: loadingToast });
        } catch (error) {
            console.error("PDF generation failed:", error);
            toast.error("Failed to generate PDF", { id: loadingToast });
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Loading allocation details...</p>
            </div>
        );
    }

    if (isError || !details) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 p-6 text-center">
                <div className="p-6 bg-yellow-50 rounded-full dark:bg-yellow-900/20">
                    <Loader2 className="w-12 h-12 text-yellow-500" />
                </div>
                <h2 className="text-2xl font-bold">No Allocation Yet</h2>
                <p className="text-muted-foreground max-w-md">
                    You haven't been allocated to a room yet or your details are still being processed.
                </p>
                <Button onClick={() => navigate(-1)} variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
                </Button>
            </div>
        );
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-GH', {
            style: 'currency',
            currency: 'GHS'
        }).format(amount);
    };

    const issueDate = details.issueDate ? new Date(details.issueDate) : new Date();

    return (
        <div className="container mx-auto p-4 max-w-4xl py-10">
            <SEOHelmet
                title="Room Allocation Letter - Fuse"
                description="Your official room allocation letter."
            />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-2 -ml-2">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">Allocation Letter</h1>
                    <p className="text-muted-foreground">Official proof of residency</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button variant="outline" size="sm" onClick={handlePrint} className="flex-1 sm:flex-none">
                        <Printer className="h-4 w-4 mr-2" /> Print
                    </Button>
                    <Button size="sm" onClick={handleDownloadPDF} className="flex-1 sm:flex-none">
                        <Download className="h-4 w-4 mr-2" /> Download PDF
                    </Button>
                </div>
            </div>

            <Card className="shadow-2xl border-none overflow-hidden bg-white text-black dark:text-black">
                <div ref={letterRef} className="p-10 md:p-16 bg-white min-h-[1000px] flex flex-col">
                    {/* A. Letterhead */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
                        <div className="flex items-center gap-4">
                            {details.hostelLogo ? (
                                <img src={details.hostelLogo} alt="Hostel Logo" className="h-20 w-auto object-contain" />
                            ) : (
                                <div className="h-16 w-16 bg-primary flex items-center justify-center rounded-lg">
                                    <Building2 className="h-10 w-10 text-white" />
                                </div>
                            )}
                            <div className="space-y-1">
                                <h2 className="text-2xl font-black uppercase tracking-tight text-primary">{details.hostelName}</h2>
                                <p className="text-sm font-bold text-gray-800">Management Office</p>
                            </div>
                        </div>
                        <div className="text-left md:text-right text-sm text-gray-600 space-y-1">
                            <div className="flex items-center md:justify-end gap-2">
                                <MapPin className="h-3.5 w-3.5" />
                                <span>{details.hostelAddress}</span>
                            </div>
                            <div className="flex items-center md:justify-end gap-2">
                                <Phone className="h-3.5 w-3.5" />
                                <span>{details.hostelPhone}</span>
                            </div>
                            <div className="flex items-center md:justify-end gap-2">
                                <Mail className="h-3.5 w-3.5" />
                                <span>{details.hostelEmail}</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-1 w-full bg-primary mb-10"></div>

                    {/* B. Formal Header */}
                    <div className="text-center mb-10">
                        <h3 className="text-2xl font-bold uppercase tracking-widest border-b-2 border-black inline-block pb-1 px-4">OFFICIAL ROOM ALLOCATION LETTER</h3>
                    </div>

                    <div className="flex justify-between items-end mb-10 text-sm">
                        <div className="space-y-1">
                            <p className="font-bold uppercase tracking-wider text-gray-400">Date Issued</p>
                            <p className="text-base font-medium">{format(issueDate, "MMMM dd, yyyy")}</p>
                        </div>
                        <div className="text-right space-y-1">
                            <p className="font-bold uppercase tracking-wider text-gray-400">Reference Number</p>
                            <p className="text-base font-mono font-bold">ALLOC-{details.hostelName.replace(/\s+/g, '').toUpperCase()}-{details.studentId}</p>
                        </div>
                    </div>

                    {/* C. Resident & Room Information */}
                    <div className="space-y-6 mb-10">
                        <div className="space-y-2">
                            <p className="text-gray-800">To:</p>
                            <div className="pl-4 border-l-4 border-primary py-1">
                                <p className="text-xl font-black">{details.residentName}</p>
                                <p className="text-gray-600">ID: <span className="font-bold text-black">{details.studentId || "N/A"}</span> | Course: <span className="font-bold text-black">{details.course || "N/A"}</span></p>
                            </div>
                        </div>

                        <p className="leading-relaxed text-gray-700">
                            This is to certify that you have been officially allocated accommodation at <span className="font-bold text-black">{details.hostelName}</span> for the <span className="font-bold text-black">{details.academicPeriod}</span>.
                        </p>

                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Allocation Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-500">Room Number</span>
                                    <span className="font-bold text-lg">{details.roomNumber} ({details.roomBlock || 'N/A'}, Floor {details.roomFloor || 'N/A'})</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-500">Accommodation Type</span>
                                    <span className="font-bold capitalize">{details.roomType}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-500">Allocation Period</span>
                                    <span className="font-bold text-sm">
                                        {details.checkInDate ? format(new Date(details.checkInDate), "PPP") : "N/A"} to {details.checkOutDate ? format(new Date(details.checkOutDate), "PPP") : "N/A"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* D. Financial Statement */}
                    <div className="mb-10">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Financial Status</h4>
                        <div className="w-full border rounded-2xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Description</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b">
                                        <td className="px-6 py-4">Total Accommodation Fee</td>
                                        <td className="px-6 py-4 text-right font-mono font-bold">{formatCurrency(details.roomPrice)}</td>
                                    </tr>
                                    <tr className="border-b bg-green-50/50">
                                        <td className="px-6 py-4 font-bold text-green-700">Total Amount Paid</td>
                                        <td className="px-6 py-4 text-right font-mono font-black text-green-700">{formatCurrency(details.amountPaid)}</td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr className="bg-red-50">
                                        <td className="px-6 py-4 font-bold text-red-700 uppercase tracking-tighter">Outstanding Balance</td>
                                        <td className="px-6 py-4 text-right font-mono font-black text-xl text-red-700">{formatCurrency(details.balanceOwed)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* E. Important Notices */}
                    <div className="space-y-4 mb-12">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-primary">Important Notices</h4>
                        <ul className="space-y-3 list-none">
                            <li className="flex gap-3 text-sm text-gray-700">
                                <span className="h-5 w-5 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold">1</span>
                                <span><span className="font-bold text-black">Hostel Rules:</span> Residents are required to adhere to the rules found at <a href={details.rulesUrl} className="text-primary hover:underline font-medium break-all">{details.rulesUrl}</a></span>
                            </li>
                            <li className="flex gap-3 text-sm text-gray-700">
                                <span className="h-5 w-5 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold">2</span>
                                <span><span className="font-bold text-black">Check-in:</span> Please present this letter at the front desk upon arrival.</span>
                            </li>
                        </ul>
                    </div>

                    {/* F. Authorization */}
                    <div className="mt-auto grid grid-cols-2 gap-10 pt-10">
                        <div className="space-y-10">
                            <div className="h-20 flex items-end">
                                <div className="w-48 border-b-2 border-dashed border-gray-400"></div>
                            </div>
                            <div className="space-y-0.5">
                                <p className="font-bold text-gray-900">Hostel Manager Signature</p>
                                <p className="text-xs text-gray-500 uppercase tracking-widest">{details.hostelName}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <div className="h-32 w-32 border-4 border-double border-gray-200 rounded-full flex items-center justify-center text-center opacity-20 rotate-12">
                                <p className="text-[10px] font-bold uppercase tracking-tighter">OFFICIAL<br />HOSTEL STAMP<br />REQUIRED</p>
                            </div>
                            <p className="mt-4 text-[10px] text-gray-400 uppercase font-mono">Digitally Issued via SimpleHostel</p>
                        </div>
                    </div>

                    <div className="mt-10 pt-4 border-t border-gray-100 flex justify-between items-center opacity-30 text-[9px] font-mono uppercase">
                        <div className="flex items-center gap-1">
                            <CheckCircle2 size={10} />
                            <span>Verified Electronic Document</span>
                        </div>
                        <span>Date Printed: {new Date().toLocaleString()}</span>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AllocationDetailsPage;

