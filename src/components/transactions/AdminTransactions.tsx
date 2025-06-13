"use client";

import { useState, useMemo } from "react";
import {
  ArrowUpDown,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Filter,
  Search,
  Smartphone,
  X,
} from "lucide-react";
import { format } from "date-fns";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import axios from "axios";
import TransactionsSkeleton from "../loaders/TransactionLoader";
import CustomeRefetch from "../CustomeRefetch";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"


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

  const hostel_id = localStorage.getItem("hostelId") || "";
  const {
    data: transactionsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["transaction_admin"],
    queryFn: async () => {
      const response = await axios.get(
        `/api/payments/get/hostel/${hostel_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );
      return response.data?.data;
    },
    enabled: !!hostel_id,
  });


  const hostelId = localStorage.getItem('hostelId')
   const { data: Residents} = useQuery({
    queryKey: ['residents'],
    queryFn: async () => {
      const response = await axios.get(`/api/residents/hostel/${hostelId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      return response?.data?.data
    },
  })
  
  // Calculate total amount
  const totalAmount = useMemo(() => {
    return transactionsData
      ?.reduce(
        (sum: number, transaction: Transaction) => sum + transaction.amount,
        0
      )
      .toFixed(2);
  }, [transactionsData]);

  // Calculate successful transactions amount
  const successfulAmount = useMemo(() => {
    return transactionsData
      ?.filter(
        (t: Transaction) => t.status === "success" || t.status === "CONFIRMED"
      )
      .reduce(
        (sum: number, transaction: Transaction) => sum + transaction.amount,
        0
      )
      .toFixed(2);
  }, [transactionsData]);

  // Calculate pending transactions amount
  const pendingAmount = useMemo(() => {
    return transactionsData
      ?.filter((t: Transaction) => t.status === "PENDING")
      .reduce(
        (sum: number, transaction: Transaction) => sum + transaction.amount,
        0
      )
      .toFixed(2);
  }, [transactionsData]);

  const filteredTransactions = useMemo(() => {
    return transactionsData
      ?.filter((transaction: Transaction) => {
        const searchMatch =
          transaction.reference
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.residentId
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const statusMatch =
          statusFilter === "all" ||
          transaction.status.toLowerCase() === statusFilter.toLowerCase();

        const methodMatch =
          methodFilter === "all" ||
          (methodFilter === "none" && transaction.method === null) ||
          transaction.method?.toLowerCase() === methodFilter.toLowerCase();

        const dateMatch =
          !selectedDate ||
          format(new Date(transaction.date), "yyyy-MM-dd") ===
            format(selectedDate, "yyyy-MM-dd");

        return searchMatch && statusMatch && methodMatch && dateMatch;
      })
      .sort((a: Transaction, b: Transaction) => {
        const key = sortConfig.key;

        if (key === "amount") {
          return sortConfig.direction === "asc"
            ? a[key] - b[key]
            : b[key] - a[key];
        } else if (key === "date") {
          return sortConfig.direction === "asc"
            ? new Date(a[key]).getTime() - new Date(b[key]).getTime()
            : new Date(b[key]).getTime() - new Date(a[key]).getTime();
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
    transactionsData,
  ]);

  // Handle sorting
  const handleSort = (key: keyof Transaction) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

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
              <DollarSign className="w-5 h-5 mr-2 text-muted-foreground" />
              <div className="text-2xl font-bold">GH¢{totalAmount}</div>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {transactionsData.length} transactions
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
                GH¢{successfulAmount}
              </div>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {
                transactionsData.filter(
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
                GH¢{pendingAmount}
              </div>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {
                transactionsData.filter(
                  (t: Transaction) => t.status === "PENDING"
                ).length
              }{" "}
              transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by reference or ID..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
           <div className="flex w-40 gap-2">
            {/* date picker */}
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              placeholderText="Filter by date"
              className="w-full p-1 border rounded-md shadow-sm"
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate(null)}
                className="grid w-8 bg-red-200 rounded-md place-items-center hover:bg-red-300"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
          
          </div>
          <div className="w-40">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-40">
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger>
                <CreditCard className="w-4 h-4 mr-2" />
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
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            Showing {filteredTransactions.length} of {transactionsData.length}{" "}
            transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">
                    <Button
                      variant="ghost"
                      className="h-8 p-0 font-medium"
                      onClick={() => handleSort("reference")}
                    >
                      Reference
                      <ArrowUpDown className="w-3 h-3 ml-2" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="h-8 p-0 font-medium"
                      onClick={() => handleSort("amount")}
                    >
                      Amount
                      <ArrowUpDown className="w-3 h-3 ml-2" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="h-8 p-0 font-medium"
                      onClick={() => handleSort("date")}
                    >
                      Date
                      <ArrowUpDown className="w-3 h-3 ml-2" />
                    </Button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Resident
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction: Transaction) => (
                    <TableRow key={transaction.id} className="group">
                      <TableCell className="font-medium">
                        {transaction.reference}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "font-medium",
                          transaction.status.toUpperCase() === "PENDING"
                            ? "text-yellow-600"
                            : "text-green-600"
                        )}
                      >
                        GH¢{transaction.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>
                            {format(new Date(transaction.date), "MMM d, yyyy")}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(transaction.date), "h:mm a")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(transaction.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getMethodIcon(transaction.method)}
                          <span>
                            {transaction.method
                              ? "Mobile Money"
                              : "Not specified"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell  max-w-[150px]">
                        {(() => {
                          const resident = Residents?.find(
                            (resident: Resident) => resident.id === transaction.residentId
                          );
                          if (!resident) return "Unknown Resident";
                          return (
                            <div>
                              <div>{resident.name}</div>
                              <div className="text-xs text-muted-foreground">
                                Room: {resident.room?.number || "N/A"}
                              </div>
                            </div>
                          );
                        })()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTransactions;
