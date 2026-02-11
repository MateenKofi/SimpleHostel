import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  activeFilterCount: number;
  onToggleFilters: () => void;
  onClearAll: () => void;
  isOpen: boolean;
  className?: string;
}

export const FilterBar = ({
  activeFilterCount,
  onToggleFilters,
  onClearAll,
  isOpen,
  className,
}: FilterBarProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 p-3 bg-card border border-border rounded-lg shadow-sm",
        className
      )}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleFilters}
        className="flex items-center gap-2"
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <Badge variant="default" className="ml-1">
            {activeFilterCount}
          </Badge>
        )}
        <span
          className={cn(
            "ml-1 transition-transform duration-200",
            isOpen ? "rotate-180" : ""
          )}
        >
          ▼
        </span>
      </Button>

      {activeFilterCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <X className="w-4 h-4 mr-1" />
          Clear All
        </Button>
      )}
    </div>
  );
};
