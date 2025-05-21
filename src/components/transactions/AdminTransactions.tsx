"use client"

import { useState, useMemo } from "react"
import { ArrowUpDown, CheckCircle2, Clock, CreditCard, DollarSign, Filter, Search, Smartphone } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Transaction } from "@/helper/types/types"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import TransactionsSkeleton from "../loaders/TransactionLoader"
import CustomeRefetch from "../CustomeRefetch"



const AdminTransactions = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [methodFilter, setMethodFilter] = useState<string>("all")
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Transaction
    direction: "asc" | "desc"
  }>({
    key: "date",
    direction: "desc",
  })

  const hostel_id = localStorage.getItem('hostelId') || ''
  const {data:transactionsData,isLoading,isError,refetch} = useQuery({
    queryKey:['transaction_admin'],
    queryFn: async () => {
        const response = await axios.get(`/api/payments/get/hostel/${hostel_id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
            },
        })
        return response.data?.data;
    },
     enabled: !!hostel_id,
  })

  // Calculate total amount
  const totalAmount = useMemo(() => {
    return transactionsData?.reduce((sum:number, transaction:Transaction) => sum + transaction.amount, 0).toFixed(2)
  }, [transactionsData])

  // Calculate successful transactions amount
  const successfulAmount = useMemo(() => {
    return transactionsData
      ?.filter(
        (t: Transaction) => t.status === "success" || t.status === "CONFIRMED"
      )
      .reduce((sum: number, transaction: Transaction) => sum + transaction.amount, 0)
      .toFixed(2)
  }, [transactionsData])

  // Calculate pending transactions amount
  const pendingAmount = useMemo(() => {
    return transactionsData
      ?.filter((t: Transaction) => t.status === "PENDING")
      .reduce((sum: number, transaction: Transaction) => sum + transaction.amount, 0)
      .toFixed(2)
  }, [transactionsData])



  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    return transactionsData
      ?.filter((transaction:Transaction) => {
        // Search filter
        const searchMatch =
          transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.residentId.toLowerCase().includes(searchTerm.toLowerCase())

        // Status filter
        const statusMatch = statusFilter === "all" || transaction.status.toLowerCase() === statusFilter.toLowerCase()

        // Method filter
        const methodMatch =
          methodFilter === "all" ||
          (methodFilter === "none" && transaction.method === null) ||
          transaction.method?.toLowerCase() === methodFilter.toLowerCase()

        return searchMatch && statusMatch && methodMatch
      })
      .sort((a:any, b:any) => {
        const key = sortConfig.key

        if (key === "amount") {
          return sortConfig.direction === "asc" ? a[key] - b[key] : b[key] - a[key]
        } else if (key === "date") {
          return sortConfig.direction === "asc"
            ? new Date(a[key]).getTime() - new Date(b[key]).getTime()
            : new Date(b[key]).getTime() - new Date(a[key]).getTime()
        } else {
          const aValue = String(a[key]).toLowerCase()
          const bValue = String(b[key]).toLowerCase()

          return sortConfig.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
        }
      })
  }, [searchTerm, statusFilter, methodFilter, sortConfig,transactionsData])

  // Handle sorting
  const handleSort = (key: keyof Transaction) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
    }))
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="mr-1 h-3 w-3" /> Pending
          </Badge>
        )
      case "SUCCESS":
      case "CONFIRMED":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="mr-1 h-3 w-3" /> {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Get payment method icon
  const getMethodIcon = (method: string | null) => {
    if (!method) return <CreditCard className="h-4 w-4 text-gray-400" />

    switch (method.toLowerCase()) {
      case "mobile_money":
        return <Smartphone className="h-4 w-4 text-purple-500" />
      default:
        return <CreditCard className="h-4 w-4 text-blue-500" />
    }
  }

    if(isLoading){
    return <TransactionsSkeleton />
  }
  if(isError){
    return <CustomeRefetch refetch={refetch}/>
  }
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">${totalAmount}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{transactionsData.length} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Successful Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
              <div className="text-2xl font-bold text-green-600">${successfulAmount}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {transactionsData.filter((t:Transaction) => t.status === "success" || t.status === "CONFIRMED").length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-yellow-500 mr-2" />
              <div className="text-2xl font-bold text-yellow-600">${pendingAmount}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {transactionsData.filter((t:Transaction) => t.status === "PENDING").length} transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
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
          <div className="w-40">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <Filter className="mr-2 h-4 w-4" />
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
                <CreditCard className="mr-2 h-4 w-4" />
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
            Showing {filteredTransactions.length} of {transactionsData.length} transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">
                    <Button variant="ghost" className="p-0 h-8 font-medium" onClick={() => handleSort("reference")}>
                      Reference
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 h-8 font-medium" onClick={() => handleSort("amount")}>
                      Amount
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 h-8 font-medium" onClick={() => handleSort("date")}>
                      Date
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="hidden md:table-cell">Resident ID</TableHead>
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
                      <TableCell className="font-medium">{transaction.reference}</TableCell>
                      <TableCell
                        className={cn(
                          "font-medium",
                          transaction.status.toUpperCase() === "PENDING" ? "text-yellow-600" : "text-green-600",
                        )}
                      >
                        ${transaction.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{format(new Date(transaction.date), "MMM d, yyyy")}</span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(transaction.date), "h:mm a")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getMethodIcon(transaction.method)}
                          <span>{transaction.method ? "Mobile Money" : "Not specified"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell truncate max-w-[150px]">
                        {transaction.residentId}
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
  )
}

export default AdminTransactions