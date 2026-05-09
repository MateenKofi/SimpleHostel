import { CalendarYearT } from "@/helper/types/types";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { deleteCalendarYear, endCalendarYear, activateCalendarYear } from "@/api/calendar";
import { Edit, Ellipsis, Trash2, Power, Play, Calendar } from "lucide-react";
import React, { useState } from "react";
import CustomDataTable from "../CustomDataTable";
import { toast } from "sonner";
import EditCalendarYearModal from "./EditCalendarYearModal";
import { useModal } from "../Modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { handleSwalMutation } from "../swal/SwalMutationHelper";
import { Card, CardContent } from "@/components/ui/card";
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

  // Mutation to activate a calendar year
  const activateYearMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await activateCalendarYear(id);
        refetch();
        toast.success("Calendar year activated and migration completed");
      } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to activate calendar year";
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

  // End an active calendar year
  const handleEndYear = async (id: string) => {
    await handleSwalMutation({
      mutation: () => endYearMutation.mutateAsync(id),
      title: "End Year",
    });
  };

  // Activate a calendar year
  const handleActivateYear = async (id: string, yearName: string) => {
    const hasActiveYear = allYears.some(y => y.isActive);
    
    await handleSwalMutation({
      mutation: () => activateYearMutation.mutateAsync(id),
      title: "Activate Calendar Year",
      text: hasActiveYear
        ? `You are about to activate "${yearName}". This will:\n\n• End the current active year\n• Migrate all current residents to historical records\n• Reset all rooms to available\n\nThis action cannot be undone. Are you sure?`
        : `You are about to activate "${yearName}" as the first active year.\n\nThis will:\n• Set this year as the active academic year\n• Allow new reservations and payments\n\nDo you want to continue?`,
      icon: "warning",
      confirmButtonText: hasActiveYear ? "Yes, Activate & End Current Year" : "Yes, Activate",
      cancelButtonText: "Cancel",
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
      cell: (row: CalendarYearRow) => {
        const isNotStarted = !row.isActive && !row.endDate;
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium text-center text-nowrap ${
              row.isActive
                ? "bg-forest-green-100 text-forest-green-800"
                : isNotStarted
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {row.isActive ? "Active" : isNotStarted ? "Not Started" : "Ended"}
          </span>
        );
      },
    },
    {
      name: "Residents",
      selector: (row: CalendarYearRow) => {
        const count = row.isActive
          ? row.residents?.length || 0
          : row.historicalResidents?.length || 0;
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
            {!row.isActive && (
              <DropdownMenuItem>
                <button
                  className="flex items-center justify-center w-full gap-2 p-2 text-xs text-white bg-emerald-600 rounded hover:bg-emerald-700"
                  onClick={() => handleActivateYear(row.id, row.name)}
                  disabled={activateYearMutation.isPending}
                >
                  <Play className="w-4 h-4" />
                  <span>Activate</span>
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

  const MobileCardView = ({ years }: { years: CalendarYearRow[] }) => (
    <div className="grid gap-4 md:hidden">
      {years.map((year, index) => {
        const isNotStarted = !year.isActive && !year.endDate;
        const residentCount = year.isActive
          ? year.residents?.length || 0
          : year.historicalResidents?.length || 0;

        return (
          <motion.div
            key={year.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, type: "spring", stiffness: 400, damping: 30 }}
          >
            <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary/30">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">{year.name || "N/A"}</h3>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        year.isActive
                          ? "bg-forest-green-100 text-forest-green-800"
                          : isNotStarted
                          ? "bg-blue-100 text-blue-800"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {year.isActive ? "Active" : isNotStarted ? "Not Started" : "Ended"}
                    </span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="p-2 rounded-md hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                        aria-label="Open actions menu"
                      >
                        <Ellipsis className="w-5 h-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleEditYear(year)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      {year.isActive && (
                        <DropdownMenuItem onClick={() => handleEndYear(year.id)}>
                          <Power className="w-4 h-4 mr-2" />
                          End Year
                        </DropdownMenuItem>
                      )}
                      {!year.isActive && (
                        <DropdownMenuItem onClick={() => handleActivateYear(year.id)}>
                          <Play className="w-4 h-4 mr-2" />
                          Activate
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleDelete(year.id)} className="text-destructive focus:text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Start Date</p>
                    <p className="font-medium">
                      {year.startDate ? moment(year.startDate).format("MMM DD, YYYY") : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">End Date</p>
                    <p className="font-medium">
                      {year.endDate ? moment(year.endDate).format("MMM DD, YYYY") : "Active"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Residents:</span>
                  <span className="font-semibold">{residentCount}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );

  return (
    <>
      <div className="hidden md:block p-6 mt-2 bg-white border rounded-md shadow-sm">
        <CustomDataTable
          title="Calendar Years"
          columns={columns}
          data={allYears}
          isError={isError}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>
      <div className="md:hidden mt-2">
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-lg font-semibold">Calendar Years</h2>
        </div>
        <MobileCardView years={allYears} />
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
