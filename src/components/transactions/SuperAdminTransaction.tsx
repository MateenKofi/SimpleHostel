import { useState } from "react";
import {
  ArrowUpDown,
  BadgeCent,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import TransactionsSkeleton from "../loaders/TransactionLoader";
import { getDisbursementSummary } from "@/api/analytics";
import { useQuery } from "@tanstack/react-query";
import CustomeRefetch from "../CustomeRefetch";
import { Avatar, AvatarFallback } from "../ui/avatar";

interface Hostel {
  hostelId: string;
  name: string;
  phone: string;
  email: string;
  amountCollected: number;
}

interface DisbursementData {
  totalCollected: number;
  disbursements: Hostel[];
}

const SuperAdminTransaction = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>(null);

  const {
    data: transactionData,
    isLoading,
    isError,
    refetch,
  } = useQuery<DisbursementData>({
    queryKey: ["disbursements"],
    queryFn: async () => {
      const responseData = await getDisbursementSummary();
      return responseData?.data;
    },
  });

  // Filter hostels based on search term
  const filteredHostels =
    transactionData?.disbursements.filter(
      (hostel) =>
        hostel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hostel.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hostel.phone.includes(searchTerm)
    ) || [];

  // Sort hostels based on sort config
  const sortedHostels = [...filteredHostels].sort((a, b) => {
    if (!sortConfig) return 0;

    const key = sortConfig.key as keyof Hostel;

    if (key === "amountCollected") {
      return sortConfig.direction === "ascending"
        ? a[key] - b[key]
        : b[key] - a[key];
    } else {
      const aValue = String(a[key]).toLowerCase();
      const bValue = String(b[key]).toLowerCase();

      return sortConfig.direction === "ascending"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
  });

  // Handle sorting
  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }

    setSortConfig({ key, direction });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (isLoading) {
    return <TransactionsSkeleton />;
  }
  if (isError) {
    return <CustomeRefetch refetch={refetch} />;
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <CardTitle className="text-2xl">
              Hostel Disbursement Summary
            </CardTitle>
            <CardDescription>
              Transaction summary for all registered hostels
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-4 py-2 text-green-700 rounded-lg bg-green-50 dark:bg-green-950 dark:text-green-300">
              <BadgeCent className="w-5 h-5" />
              <div>
                <p className="text-xs font-medium">Total Collected</p>
                <p className="text-lg font-bold">
                  {formatCurrency(transactionData?.totalCollected || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search hostels..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-hidden border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">
                  <Button
                    variant="ghost"
                    className="flex items-center p-0 font-medium"
                    onClick={() => requestSort("name")}
                  >
                    Hostel Name
                    <ArrowUpDown className="w-4 h-4 ml-2" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="flex items-center p-0 font-medium"
                    onClick={() => requestSort("phone")}
                  >
                    Phone
                    <ArrowUpDown className="w-4 h-4 ml-2" />
                  </Button>
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  <Button
                    variant="ghost"
                    className="flex items-center p-0 font-medium"
                    onClick={() => requestSort("email")}
                  >
                    Email
                    <ArrowUpDown className="w-4 h-4 ml-2" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    className="flex items-center p-0 ml-auto font-medium"
                    onClick={() => requestSort("amountCollected")}
                  >
                    Amount
                    <ArrowUpDown className="w-4 h-4 ml-2" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedHostels.length > 0 ? (
                sortedHostels.map((hostel) => (
                  <TableRow
                    key={hostel.hostelId}
                    className={
                      hostel.amountCollected > 0
                        ? "bg-green-50 dark:bg-green-950/20"
                        : ""
                    }
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8 *:rounded-full">
                          <AvatarFallback>
                            {hostel.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {hostel.name}
                        {hostel.amountCollected > 0 && (
                          <Badge
                            variant="outline"
                            className="ml-2 text-green-800 bg-green-100 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-800"
                          >
                            Active
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{hostel.phone}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {hostel.email}
                    </TableCell>
                    <TableCell className="font-medium text-right">
                      {formatCurrency(hostel.amountCollected)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No hostels found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {sortedHostels.length} of{" "}
          {transactionData?.disbursements.length || 0} hostels
        </p>
      </CardFooter>
    </Card>
  );
};

export default SuperAdminTransaction;
