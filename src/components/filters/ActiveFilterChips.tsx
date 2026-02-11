import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ActiveFilterChip {
  category: string;
  value: string;
  label?: string;
}

interface ActiveFilterChipsProps {
  filters: ActiveFilterChip[];
  onRemove: (category: string, value: string) => void;
  onClearAll?: () => void;
  className?: string;
}

// Category colors for visual distinction
const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    locations: "bg-forest-green-100 text-forest-green-800 hover:bg-forest-green-200 dark:bg-forest-green-900 dark:text-forest-green-100",
    gender: "bg-teal-green-100 text-teal-green-800 hover:bg-teal-green-200 dark:bg-teal-green-900 dark:text-teal-green-100",
    roomType: "bg-sage-green-100 text-sage-green-800 hover:bg-sage-green-200 dark:bg-sage-green-900 dark:text-sage-green-100",
    priceRange: "bg-warm-red-50 text-warm-red-700 hover:bg-warm-red-100 dark:bg-warm-red-950 dark:text-warm-red-300",
  };
  return colors[category] || "bg-muted text-muted-foreground hover:bg-muted/80";
};

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    locations: "Location",
    gender: "Gender",
    roomType: "Room Type",
    priceRange: "Price",
  };
  return labels[category] || category;
};

export const ActiveFilterChips = ({
  filters,
  onRemove,
  onClearAll,
  className,
}: ActiveFilterChipsProps) => {
  if (filters.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <AnimatePresence initial={false}>
        {filters.map((filter) => (
          <motion.div
            key={`${filter.category}-${filter.value}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            <Badge
              variant="secondary"
              className={cn(
                "flex items-center gap-1.5 pr-1.5 pl-2.5 py-1.5 text-sm font-medium",
                getCategoryColor(filter.category)
              )}
            >
              <span className="text-xs opacity-70">
                {getCategoryLabel(filter.category)}:
              </span>
              <span>{filter.label || filter.value}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto w-5 h-5 p-0 hover:bg-transparent"
                onClick={() => onRemove(filter.category, filter.value)}
              >
                <X className="w-3 h-3" />
                <span className="sr-only">Remove {filter.value} filter</span>
              </Button>
            </Badge>
          </motion.div>
        ))}
      </AnimatePresence>

      {onClearAll && filters.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-7 text-xs text-muted-foreground hover:text-destructive"
        >
          Clear all
        </Button>
      )}
    </div>
  );
};
