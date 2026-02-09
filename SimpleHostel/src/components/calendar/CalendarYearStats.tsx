import { Calendar, CalendarClock, History, Users } from "lucide-react";
import { StatCard } from "../stat-card";

interface CalendarYearStatsProps {
  activeYearsCount: number;
  totalYearsCount: number;
  totalResidents: number;
  currentYearName?: string;
}

const CalendarYearStats = ({
  activeYearsCount,
  totalYearsCount,
  totalResidents,
  currentYearName,
}: CalendarYearStatsProps) => {
  return (
    <div className="grid gap-4 my-3 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={Calendar}
        title="Active Years"
        content={activeYearsCount.toString()}
        description="Currently active calendar years"
        backgroundColor="bg-primary"
        titleColor="text-white"
        contentColor="text-white"
        descriptionColor="text-white"
      />
      <StatCard
        icon={History}
        title="Total Years"
        content={totalYearsCount.toString()}
        description="All calendar years (active + historical)"
        backgroundColor="bg-white"
        titleColor="text-gray-600"
        contentColor="text-gray-900"
        descriptionColor="text-gray-600"
      />
      <StatCard
        icon={Users}
        title="Total Residents"
        content={totalResidents.toString()}
        description="Residents across all years"
        backgroundColor="bg-white"
        titleColor="text-gray-600"
        contentColor="text-gray-900"
        descriptionColor="text-gray-600"
      />
      <StatCard
        icon={CalendarClock}
        title="Current Year"
        content={currentYearName || "N/A"}
        description="Active calendar year name"
        backgroundColor="bg-white"
        titleColor="text-gray-600"
        contentColor="text-gray-900 text-2xl"
        descriptionColor="text-gray-600"
      />
    </div>
  );
};

export default CalendarYearStats;
