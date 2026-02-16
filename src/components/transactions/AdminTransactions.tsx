"use client";

import { useState, useMemo } from "react";
import {
  ArrowUpDown,
  BadgeCent,
  CheckCircle2,
  Clock,
  CreditCard,
  Filter,
  Search,
  Smartphone,
  X,
  Download,
  Printer,
  FileText,
  MoreHorizontal,
} from "lucide-react";
import { format } from "date-fns";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import { useReactToPrint } from "react-to-print";
import ReceiptTemplate from "@/components/payment/ReceiptTemplate";
import { PaymentReceipt } from "@/helper/types/types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableColumn } from "react-data-table-component";
import CustomDataTable from "../CustomDataTable";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Resident, Transaction } from "@/helper/types/types";
import { useQuery } from "@tanstack/react-query";
import { getHostelTransactions } from "@/api/payments";
import { getHostelResidents } from "@/api/residents";
import TransactionsSkeleton from "../loaders/TransactionLoader";
import CustomeRefetch from "../CustomRefetch";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import {
  Dialog,
  DialogTitle,
} from "@/components/ui/dialog";
import Modal, { useModal } from "../Modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRef } from "react";


const safeFormat = (dateValue: any, formatStr: string) => {
  if (!dateValue) return "N/A";
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return "N/A";
  return format(date, formatStr);
};

const AdminTransactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Transaction;
    direction: "asc" | "desc";
  }>({
    key: "date",
    direction: "desc",
  });

  const [viewReceiptId, setViewReceiptId] = useState<string | null>(null);
  const { open: openReceiptModal, close: closeReceiptModal, isOpen: isReceiptOpen } = useModal('view_receipt');
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Receipt-${viewReceiptId}`,
  });

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;

    const loadingToast = toast.loading("Generating PDF...");
    try {
      const canvas = await html2canvas(receiptRef.current, {
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
      pdf.save(`Receipt-${viewReceiptId}.pdf`);
      toast.success("Receipt downloaded successfully", { id: loadingToast });
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF", { id: loadingToast });
    }
  };

  const handleViewReceipt = (id: string) => {
    setViewReceiptId(id);
    openReceiptModal();
  };

  const hostel_id = localStorage.getItem("hostelId") || "";
  const {
    data: transactionsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["transaction_admin"],
    queryFn: async () => {
      const responseData = await getHostelTransactions(hostel_id);
      const rawData = responseData?.data || [];
      // Map fields if they are missing or named differently in the raw response
      return rawData.map((t: any) => ({
        ...t,
        date: t.date || t.createdAt,
        residentId: t.residentId || t.residentProfileId
      }));
    },
    enabled: !!hostel_id,
  });

  // Handle null/undefined transactionsData
  const transactions = transactionsData || [];

  const hostelId = localStorage.getItem('hostelId')
  const { data: Residents } = useQuery({
    queryKey: ['residents'],
    queryFn: async () => {
      if (!hostelId) return [];
      const responseData = await getHostelResidents(hostelId)
      return responseData?.data
    },
  })

  // Calculate total amount
  const totalAmount = useMemo(() => {
    return transactions
      ?.reduce(
        (sum: number, transaction: Transaction) => sum + transaction.amount,
        0
      )
      .toFixed(2);
  }, [transactions]);

  // Calculate successful transactions amount
  const successfulAmount = useMemo(() => {
    return transactions
      ?.filter(
        (t: Transaction) => t.status?.toUpperCase() === "SUCCESS" || t.status?.toUpperCase() === "CONFIRMED"
      )
      .reduce(
        (sum: number, transaction: Transaction) => sum + transaction.amount,
        0
      )
      .toFixed(2);
  }, [transactions]);

  // Calculate pending transactions amount
  const pendingAmount = useMemo(() => {
    return transactions
      ?.filter((t: Transaction) => t.status?.toUpperCase() === "PENDING")
      .reduce(
        (sum: number, transaction: Transaction) => sum + transaction.amount,
        0
      )
      .toFixed(2);
  }, [transactions]);

  // Fetch specific receipt data for the modal
  const { data: receiptData, isLoading: isReceiptLoading } = useQuery<PaymentReceipt>({
    queryKey: ['receipt', viewReceiptId],
    queryFn: async () => {
      // Find the transaction in the current list or fetch if needed
      const tx = transactions?.find((t: Transaction) => t.id === viewReceiptId);
      const resident = Residents?.find((r: Resident) => r.id === tx?.residentId);

      return {
        receiptNumber: tx?.reference || "N/A",
        date: tx?.date || new Date().toISOString(),
        residentName: resident?.name || "Resident",
        amount: tx?.amount || 0,
        amountPaid: tx?.amount || 0,
        balanceOwed: resident?.balanceOwed || 0,
        method: tx?.method || "N/A",
        hostelName: localStorage.getItem("hostelName") || "SimpleHostel",
        roomNumber: resident?.room?.number || "N/A",
        status: tx?.status || "Success",
        reference: tx?.reference
      };
    },
    enabled: !!viewReceiptId && !!transactions && transactions.length > 0
  });

  const filteredTransactions = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    return transactions
      .filter((transaction: Transaction) => {
        const searchMatch =
          transaction.reference
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          transaction.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.residentId
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());

        const statusMatch =
          statusFilter === "all" ||
          transaction.status?.toUpperCase() === statusFilter.toUpperCase();

        const methodMatch =
          methodFilter === "all" ||
          (methodFilter === "none" && transaction.method === null) ||
          transaction.method?.toUpperCase() === methodFilter.toUpperCase();

        const dateMatch =
          !selectedDate ||
          safeFormat(transaction.date, "yyyy-MM-dd") ===
          safeFormat(selectedDate, "yyyy-MM-dd");

        return searchMatch && statusMatch && methodMatch && dateMatch;
      })
      .sort((a: Transaction, b: Transaction) => {
        const key = sortConfig.key;

        if (key === "amount") {
          return sortConfig.direction === "asc"
            ? a[key] - b[key]
            : b[key] - a[key];
        } else if (key === "date") {
          const aTime = new Date(a[key]).getTime();
          const bTime = new Date(b[key]).getTime();
          const aValid = !isNaN(aTime);
          const bValid = !isNaN(bTime);

          if (!aValid && !bValid) return 0;
          if (!aValid) return 1;
          if (!bValid) return -1;

          return sortConfig.direction === "asc"
            ? aTime - bTime
            : bTime - aTime;
        } else {
          const aValue = String(a[key]).toLowerCase();
          const bValue = String(b[key]).toLowerCase();
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
      });
  }, [
    searchTerm,
    statusFilter,
    methodFilter,
    selectedDate,
    sortConfig,
    transactions,
  ]);

  // Handle sorting (kept if needed elsewhere, but CustomDataTable handles its own sorting usually)
  const handleSort = (key: keyof Transaction) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const columns: TableColumn<Transaction>[] = [
    {
      name: "Reference",
      selector: (row) => row.reference || "",
      sortable: true,
      grow: 1,
    },
    {
      name: "Amount",
      cell: (row) => (
        <span
          className={cn(
            "font-medium",
            row.status?.toUpperCase() === "PENDING"
              ? "text-yellow-600"
              : "text-green-600"
          )}
        >
          GH¢{row.amount.toFixed(2)}
        </span>
      ),
      sortable: true,
      selector: (row) => row.amount,
    },
    {
      name: "Date",
      cell: (row) => (
        <div className="flex flex-col">
          <span>{safeFormat(row.date, "MMM d, yyyy")}</span>
          <span className="text-xs text-muted-foreground">
            {safeFormat(row.date, "h:mm a")}
          </span>
        </div>
      ),
      sortable: true,
      selector: (row) => new Date(row.date).getTime(),
    },
    {
      name: "Status",
      cell: (row) => getStatusBadge(row.status),
      sortable: true,
      selector: (row) => row.status,
    },
    {
      name: "Method",
      cell: (row) => (
        <div className="flex items-center gap-2">
          {getMethodIcon(row.method)}
          <span>{row.method ? "Mobile Money" : "Not specified"}</span>
        </div>
      ),
      sortable: true,
      selector: (row) => row.method || "",
    },
    {
      name: "Resident",
      grow: 2,
      cell: (row) => {
        const resident = Residents?.find(
          (resident: Resident) => resident.id === row.residentId
        );
        if (!resident) return "Unknown Resident";
        return (
          <div className="py-2">
            <div>{resident.name}</div>
            <div className="text-xs text-muted-foreground">
              Room: {resident.room?.number || "N/A"}
            </div>
          </div>
        );
      },
    },
    {
      name: "Action",
      right: true,
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleViewReceipt(row.id)}>
              <FileText className="w-4 h-4 mr-2" /> View Receipt
            </DropdownMenuItem>
            {(row.status?.toUpperCase() === "SUCCESS" ||
              row.status?.toUpperCase() === "CONFIRMED") && (
                <DropdownMenuItem
                  onClick={() => {
                    setViewReceiptId(row.id);
                    setTimeout(handleDownloadPDF, 100);
                  }}
                >
                  <Download className="w-4 h-4 mr-2" /> Download PDF
                </DropdownMenuItem>
              )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="text-yellow-700 border-yellow-200 bg-yellow-50"
          >
            <Clock className="w-3 h-3 mr-1" /> Pending
          </Badge>
        );
      case "SUCCESS":
      case "CONFIRMED":
        return (
          <Badge
            variant="outline"
            className="text-green-700 border-green-200 bg-green-50"
          >
            <CheckCircle2 className="w-3 h-3 mr-1" />{" "}
            {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get payment method icon
  const getMethodIcon = (method: string | null) => {
    if (!method) return <CreditCard className="w-4 h-4 text-gray-400" />;

    switch (method.toLowerCase()) {
      case "mobile_money":
        return <Smartphone className="w-4 h-4 text-purple-500" />;
      default:
        return <CreditCard className="w-4 h-4 text-blue-500" />;
    }
  };

  if (isLoading) {
    return <TransactionsSkeleton />;
  }
  if (isError) {
    return <CustomeRefetch refetch={refetch} />;
  }


  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BadgeCent className="w-5 h-5 mr-2 text-muted-foreground" />
              <div className="text-2xl font-bold">GH¢{totalAmount || "0.00"}</div>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {transactions.length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Successful Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" />
              <div className="text-2xl font-bold text-green-600">
                GH¢{successfulAmount || "0.00"}
              </div>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {
                transactions.filter(
                  (t: Transaction) =>
                    t.status === "success" || t.status === "CONFIRMED"
                ).length
              }{" "}
              transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-yellow-500" />
              <div className="text-2xl font-bold text-yellow-600">
                GH¢{pendingAmount || "0.00"}
              </div>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {
                transactions.filter(
                  (t: Transaction) => t.status === "PENDING"
                ).length
              }{" "}
              transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by reference or ID..."
            className="pl-8 h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="flex gap-2 w-full sm:w-auto">
            {/* date picker */}
            {selectedDate && (
              <button
                onClick={() => setSelectedDate(null)}
                className="shrink-0 grid w-10 h-10 text-white bg-red-400 hover:bg-red-500 rounded-md place-items-center focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            )}
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              placeholderText="Filter by date"
              className="flex-1 sm:w-auto w-full h-10 px-3 border rounded-md shadow-sm text-sm"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-10 w-full sm:w-40">
              <Filter className="w-4 h-4 mr-2 shrink-0" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={methodFilter} onValueChange={setMethodFilter}>
            <SelectTrigger className="h-10 w-full sm:w-40">
              <CreditCard className="w-4 h-4 mr-2 shrink-0" />
              <SelectValue placeholder="Payment Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="mobile_money">Mobile Money</SelectItem>
              <SelectItem value="none">No Method</SelectItem>
            </SelectContent>
          </Select>

        </div>
      </div>

      {/* Transactions Table */}
      <CustomDataTable
        title="Transactions"
        columns={columns}
        data={filteredTransactions}
        isLoading={isLoading}
        isError={isError}
        refetch={refetch}
        searchable={false} // We are using our own search bar above
      />

      {/* Receipt Modal */}
      <Modal modalId="view_receipt" onClose={() => setViewReceiptId(null)} size="large">
        <div className="space-y-4 pt-4">
          <div className="pb-4">
            <h2 className="text-lg font-semibold text-foreground">Payment Receipt</h2>
            <p className="text-sm text-muted-foreground">
              Official payment details and transaction record.
            </p>
          </div>

          {isReceiptLoading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <div className="w-10 h-10 border-4 rounded-full border-primary border-t-transparent animate-spin"></div>
              <p className="text-sm text-muted-foreground">Loading receipt details...</p>
            </div>
          ) : receiptData ? (
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden bg-white shadow-inner max-h-[400px] overflow-y-auto">
                <ReceiptTemplate data={receiptData} ref={receiptRef} />
              </div>

              <div className="flex flex-col gap-2 sm:flex-row mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full sm:flex-1" onClick={handlePrint}>
                  <Printer className="w-4 h-4 mr-2" /> Print
                </Button>
                <Button variant="outline" className="w-full sm:flex-1" onClick={handleDownloadPDF}>
                  <Download className="w-4 h-4 mr-2" /> Download
                </Button>
                {receiptData.reference && (
                  <Button className="w-full sm:flex-1" onClick={() => window.open(`/dashboard/receipt/${receiptData.reference}`, '_blank')}>
                    <FileText className="w-4 h-4 mr-2" /> Full View
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="py-10 text-center text-muted-foreground">
              Failed to load receipt information.
            </div>
          )}
        </div>
      </Modal>

    </div>
  );
};

export default AdminTransactions;
