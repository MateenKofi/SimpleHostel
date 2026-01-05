import { useRef, forwardRef } from "react";
import { format } from "date-fns";
import { Building2, MapPin, Phone, Mail, CheckCircle2, User, CreditCard } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { PaymentReceipt } from "@/helper/types/types";

interface ReceiptTemplateProps {
    data: PaymentReceipt;
}

const ReceiptTemplate = forwardRef<HTMLDivElement, ReceiptTemplateProps>(({ data }, ref) => {
    // Formatting currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-GH', {
            style: 'currency',
            currency: 'GHS'
        }).format(amount);
    };

    return (
        <div ref={ref} className="bg-white p-8 sm:p-12 text-black min-h-[800px] flex flex-col font-sans">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between gap-8 mb-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                        <Building2 className="h-8 w-8" />
                        <span className="text-2xl font-black uppercase tracking-tighter">SimpleHostel</span>
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold">{data.hostelName}</h2>
                        {/* Note: Address, phone and email might not be in the flat PaymentReceipt, 
                            but we can add them to the type or fallback */}
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                            <span>Official Management Office</span>
                        </div>
                    </div>
                </div>
                <div className="text-left md:text-right space-y-2">
                    <div className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-bold uppercase tracking-widest mb-2">
                        {data.status || "CONFIRMED"}
                    </div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-widest leading-none">Receipt Number</p>
                    <p className="text-2xl font-mono font-bold text-primary">{data.receiptNumber || data.reference || "N/A"}</p>
                    <div className="pt-2">
                        <p className="text-sm text-gray-500">Date Issued</p>
                        <p className="font-medium">{data.date ? format(new Date(data.date), "PPP p") : format(new Date(), "PPP p")}</p>
                    </div>
                </div>
            </div>

            <Separator className="bg-gray-200" />

            {/* Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
                <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Resident Information</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-500" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 leading-none">Full Name</p>
                                <p className="font-bold text-lg">{data.residentName}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase">Room Allocation</p>
                            <p className="font-medium">Room Number: <span className="font-bold">#{data.roomNumber}</span></p>
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Payment Summary</h3>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Method</p>
                                <p className="font-medium capitalize">{data.method?.replace("_", " ") || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Amount Due</p>
                                <p className="font-medium">{formatCurrency(data.amount || 0)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table / Ledger */}
            <div className="my-10 grow">
                <div className="w-full border rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Description</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b">
                                <td className="px-6 py-4">
                                    <p className="font-bold">Hostel Accommodation Payment</p>
                                    <p className="text-sm text-gray-500">Payment for room {data.roomNumber}</p>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="font-mono">{formatCurrency(data.amountPaid)}</span>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot className="bg-gray-50/50">
                            <tr>
                                <td className="px-6 py-3 text-right text-sm font-bold text-primary">Total Amount Paid</td>
                                <td className="px-6 py-3 text-right font-mono font-black text-xl text-primary">{formatCurrency(data.amountPaid)}</td>
                            </tr>
                            <tr className="border-t-2 border-primary/20">
                                <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">Outstanding Balance</td>
                                <td className="px-6 py-4 text-right font-mono font-bold text-red-600 bg-red-50">{formatCurrency(data.balanceOwed)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-10 border-t border-dashed flex flex-col items-center text-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="h-px w-12 bg-gray-300"></div>
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                    <div className="h-px w-12 bg-gray-300"></div>
                </div>
                <div className="space-y-2">
                    <p className="italic text-gray-500 text-xs">This is an electronically generated receipt. No signature required.</p>
                    <p className="font-bold text-gray-800">Thank you for chooosing {data.hostelName}!</p>
                </div>
                <div className="w-full flex justify-between items-end opacity-20 mt-4 px-4 text-[8px] font-mono uppercase tracking-tighter">
                    <span>SimpleHostel Platform</span>
                    <span>Reference: {data.reference || data.receiptNumber}</span>
                    <span>{new Date().toISOString()}</span>
                </div>
            </div>
        </div>
    );
});

ReceiptTemplate.displayName = "ReceiptTemplate";

export default ReceiptTemplate;
