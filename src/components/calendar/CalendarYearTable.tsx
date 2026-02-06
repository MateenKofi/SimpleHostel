import { CalendarYearT } from "@/helper/types/types";
import { useMutation } from "@tanstack/react-query";
import { deleteCalendarYear, endCalendarYear } from "@/api/calendar";
import { Edit, Eye, Ellipsis, Trash2, Power } from "lucide-react";
import React, { useState } from "react";
import CustomDataTable from "../CustomDataTable";
import { toast } from "sonner";
import EditCalendarYearModal from "./EditCalendarYearModal";
import { useModal } from "../Modal";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { handleSwalMutation } from "../swal/SwalMutationHelper";
import moment from "moment";

interface CalendarYearTableProps {
  currentYear: CalendarYearT | undefined;
  historicalYears: CalendarYearT[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

type CalendarYearRow = CalendarYearT & { isCurrent: boolean };

const CalendarYearTable = ({
  currentYear,
  historicalYears,
  isLoading,
  isError,
  refetch,
}: CalendarYearTableProps) => {
  const navigate = useNavigate();
  const { open: openEditModal, close: closeEditModal } = useModal("edit-calendar-year-modal");
  const [selectedYear, setSelectedYear] = useState<CalendarYearT>({} as CalendarYearT);
  const hostelId = localStorage.getItem("hostelId") || "";

  // Combine current and historical years into a single array
  const allYears: CalendarYearRow[] = [
    ...(currentYear ? [{ ...currentYear, isCurrent: true }] : []),
    ...historicalYears.map((year) => ({ ...year, isCurrent: false })),
  ];

  // Mutation to end a calendar year
  const endYearMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await endCalendarYear(id);
        refetch();
        toast.success("Calendar year ended successfully");
      } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to end calendar year";
        toast.error(errorMessage);
        throw error;
      }
    },
  });

  // Mutation to delete a calendar year
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await deleteCalendarYear(id, hostelId);
        refetch();
        toast.success("Calendar year deleted successfully");
      } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to delete calendar year";
        toast.error(errorMessage);
        throw error;
      }
    },
  });

  // Open edit modal for selected year
  const handleEditYear = (year: CalendarYearT) => {
    setSelectedYear(year);
    openEditModal();
  };

  // Navigate to year details
  const handleViewYear = (year: CalendarYearT) => {
    navigate(`/dashboard/calendar-year/${year.id}`);
  };

  // End an active calendar year
  const handleEndYear = async (id: string) => {
    await handleSwalMutation({
      mutation: () => endYearMutation.mutateAsync(id),
      title: "End Year",
    });
  };

  // Delete a calendar year
  const handleDelete = async (id: string) => {
    await handleSwalMutation({
      mutation: () => deleteMutation.mutateAsync(id),
      title: "Delete Year",
    });
  };

  const columns = [
    {
      name: "Year Name",
      selector: (row: CalendarYearRow) => row.name || "N/A",
      sortable: true,
      grow: 1.5,
    },
    {
      name: "Start Date",
      selector: (row: CalendarYearRow) =>
        row.startDate ? moment(row.startDate).format("MMM DD, YYYY") : "N/A",
      sortable: true,
    },
    {
      name: "End Date",
      selector: (row: CalendarYearRow) =>
        row.endDate ? moment(row.endDate).format("MMM DD, YYYY") : "Active",
      sortable: true,
    },
    {
      name: "Status",
      sortable: true,
      center: true,
      cell: (row: CalendarYearRow) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium text-center text-nowrap ${
            row.isActive
              ? "bg-forest-green-100 text-forest-green-800"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {row.isActive ? "Active" : "Ended"}
        </span>
      ),
    },
    {
      name: "Residents",
      selector: (row: CalendarYearRow) => {
        const count = row.isActive
          ? row.Residents?.length || 0
          : row.HistoricalResident?.length || 0;
        return count;
      },
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: CalendarYearRow) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded hover:bg-muted">
              <Ellipsis className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <button
                className="flex items-center justify-center w-full gap-2 p-2 text-xs text-white bg-black rounded hover:bg-gray-800"
                onClick={() => handleViewYear(row)}
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                className="flex items-center justify-center w-full gap-2 p-2 text-xs text-white bg-blue-600 rounded hover:bg-blue-700"
                onClick={() => handleEditYear(row)}
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
            </DropdownMenuItem>
            {row.isActive && (
              <DropdownMenuItem>
                <button
                  className="flex items-center justify-center w-full gap-2 p-2 text-xs text-white bg-amber-600 rounded hover:bg-amber-700"
                  onClick={() => handleEndYear(row.id)}
                  disabled={endYearMutation.isPending}
                >
                  <Power className="w-4 h-4" />
                  <span>End Year</span>
                </button>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <button
                className="flex items-center justify-center w-full gap-2 p-2 text-xs text-white bg-red-600 rounded hover:bg-red-700"
                onClick={() => handleDelete(row.id)}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <div className="p-6 mt-2 bg-white border rounded-md shadow-md">
        <CustomDataTable
          title="Calendar Years"
          columns={columns}
          data={allYears}
          isError={isError}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>
      <EditCalendarYearModal
        onClose={closeEditModal}
        calendarYear={selectedYear}
        refetch={refetch}
      />
    </>
  );
};

export default CalendarYearTable;
