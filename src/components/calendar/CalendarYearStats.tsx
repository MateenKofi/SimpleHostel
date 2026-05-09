import { motion } from "framer-motion";
import { Calendar, CalendarClock, History, Users } from "lucide-react";
import { StatCard } from "../stat-card";

interface CalendarYearStatsProps {
  activeYearsCount: number;
  totalYearsCount: number;
  totalResidents: number;
  currentYearName?: string;
}

const cardVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
    },
  },
};

const CalendarYearStats = ({
  activeYearsCount,
  totalYearsCount,
  totalResidents,
  currentYearName,
}: CalendarYearStatsProps) => {
  return (
    <div className="grid gap-3 sm:gap-4 my-3 sm:grid-cols-2 lg:grid-cols-4">
      <motion.div
        variants={cardVariants}
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="cursor-default"
      >
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
      </motion.div>

      <motion.div
        variants={cardVariants}
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="cursor-default"
      >
        <StatCard
          icon={History}
          title="Total Years"
          content={totalYearsCount.toString()}
          description="All calendar years (active + historical)"
          backgroundColor="bg-white border-border"
          titleColor="text-muted-foreground"
          contentColor="text-foreground"
          descriptionColor="text-muted-foreground"
        />
      </motion.div>

      <motion.div
        variants={cardVariants}
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="cursor-default"
      >
        <StatCard
          icon={Users}
          title="Total Residents"
          content={totalResidents.toString()}
          description="Residents across all years"
          backgroundColor="bg-white border-border"
          titleColor="text-muted-foreground"
          contentColor="text-foreground"
          descriptionColor="text-muted-foreground"
        />
      </motion.div>

      <motion.div
        variants={cardVariants}
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="cursor-default"
      >
        <StatCard
          icon={CalendarClock}
          title="Current Year"
          content={currentYearName || "N/A"}
          description="Active calendar year name"
          backgroundColor="bg-white border-border"
          titleColor="text-muted-foreground"
          contentColor="text-foreground text-xl sm:text-2xl"
          descriptionColor="text-muted-foreground"
        />
      </motion.div>
    </div>
  );
};

export default CalendarYearStats;
