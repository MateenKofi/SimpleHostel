import CustomDataTable from "../CustomDataTable";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getHostelVisitors } from "@/api/visitors";
import { Visitor } from "@/helper/types/types";
import { Badge } from "@/components/ui/badge";


const VisitorHistory = () => {
  const hostelId = localStorage.getItem("hostelId") || "";

  const {
    data: visitors,
    isLoading,
    isError,
    refetch: refetchVisitors,
  } = useQuery({
    queryKey: ["visitors"],
    queryFn: async () => {
      if (!hostelId) return [];
      const res = await getHostelVisitors(hostelId);
      return res?.data || [];
    },
    enabled: !!hostelId,
  });

  const InactiveVisitors = Array.isArray(visitors) ? visitors.filter((active: Visitor) => {
    return active.status === 'CHECKED_OUT';
  }) : [];




  const columns = [
    {
      name: "Visitor Name",
      selector: (row: Visitor) => row.name,
      sortable: true,
    },
    {
      name: "V Phone",
      selector: (row: Visitor) => row.phone,
    },
    {
      name: 'Resident',
      selector: (row: Visitor) => row?.resident?.name ?? ""
    },
    {
      name: 'R Phone',
      selector: (row: Visitor) => row?.resident?.phone ?? ""
    },
    {
      name: "Check-in Time",
      selector: (row: Visitor) =>
        row.timeOut && !isNaN(new Date(row.timeOut).getTime())
          ? format(new Date(row.timeOut), "MMM dd, yyyy HH:mm")
          : "-",
      sortable: true,
    },
    {
      name: "Status",
      cell: (row: Visitor) => (
        <Badge
          variant={row.status === "ACTIVE" ? "default" : "secondary"}
          className="capitalize"
        >
          {row.status === "ACTIVE" ? "Checked In" : "Checked Out"}
        </Badge>
      ),
    },

  ];

  return (
    <div className="p-4 bg-card border border-border rounded-lg shadow-sm">
      <CustomDataTable
        title="Visitors History Table"
        columns={columns}
        data={InactiveVisitors}
        isError={isError}
        isLoading={isLoading}
        refetch={refetchVisitors}
      />
    </div>
  );
};

export default VisitorHistory;