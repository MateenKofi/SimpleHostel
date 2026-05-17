import { useState } from "react";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

const sampleAuditLogs = [
  { id: "1", timestamp: new Date().toISOString(), user: "John Doe", action: "Login", target: "System", details: "Successful login" },
  { id: "2", timestamp: new Date(Date.now() - 86400000).toISOString(), user: "Jane Smith", action: "Create", target: "User", details: "Created new staff account" },
  { id: "3", timestamp: new Date(Date.now() - 172800000).toISOString(), user: "Admin User", action: "Password Reset", target: "User", details: "Reset password for john@example.com" },
  { id: "4", timestamp: new Date(Date.now() - 259200000).toISOString(), user: "John Doe", action: "Update", target: "Room", details: "Updated room 101 details" },
  { id: "5", timestamp: new Date(Date.now() - 345600000).toISOString(), user: "Jane Smith", action: "Delete", target: "Payment", details: "Deleted pending payment record" },
];

const actionTypes = ["Login", "Logout", "Create", "Update", "Delete", "Password Reset", "Export"];

export function AuditLogs() {
  const [dateRange, setDateRange] = useState<string>("all");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = sampleAuditLogs.filter((log) => {
    const matchesSearch = searchTerm === "" ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const handleExport = () => {
    const csvContent = [
      ["Timestamp", "User", "Action", "Target", "Details"].join(","),
      ...filteredLogs.map((log) =>
        [log.timestamp, log.user, log.action, log.target, log.details].join(",")
      ),
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Audit Logs</h2>
          <p className="text-muted-foreground">Track user actions and system changes</p>
        </div>
        <Button onClick={handleExport} className="flex items-center gap-2">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Input
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Action Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            {actionTypes.map((action) => (
              <SelectItem key={action} value={action}>{action}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">Last 30 Days</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Timestamp</th>
                  <th className="text-left py-3 px-4 font-medium">User</th>
                  <th className="text-left py-3 px-4 font-medium">Action</th>
                  <th className="text-left py-3 px-4 font-medium">Target</th>
                  <th className="text-left py-3 px-4 font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 text-sm">{format(new Date(log.timestamp), "PP p")}</td>
                    <td className="py-3 px-4 text-sm">{log.user}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        log.action === "Delete" ? "bg-red-100 text-red-700" :
                        log.action === "Create" ? "bg-green-100 text-green-700" :
                        log.action === "Update" ? "bg-blue-100 text-blue-700" :
                        log.action === "Login" || log.action === "Logout" ? "bg-gray-100 text-gray-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">{log.target}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No audit logs found matching your filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}