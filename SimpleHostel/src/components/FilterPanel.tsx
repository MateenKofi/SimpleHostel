import { useState, useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { CollapsibleFilterSection } from "@/components/filters/CollapsibleFilterSection";
import { PriceRangeSlider } from "@/components/filters/PriceRangeSlider";
import { ActiveFilterChips } from "@/components/filters/ActiveFilterChips";
import { cn } from "@/lib/utils";

type ActiveFilters = { [key: string]: string[] };

type FilterConfig = {
  category: string;
  label: string;
  options: string[];
};

type Props = {
  activeFilters: ActiveFilters;
  handleFilterChange: (category: string, value: string) => void;
  FilterConfig: FilterConfig[];
  onClearAll?: () => void;
  variant?: "sidebar" | "drawer";
  isOpen?: boolean;
  priceRangeConfig?: {
    min: number;
    max: number;
    category: string;
  };
};

const FilterPanel = ({
  activeFilters,
  handleFilterChange,
  FilterConfig,
  onClearAll,
  variant = "sidebar",
  isOpen: controlledOpen,
  priceRangeConfig,
}: Props) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const isOpen = controlledOpen !== undefined ? controlledOpen : true;

  // Count active filters
  const activeFilterCount = useMemo(() => {
    return Object.values(activeFilters).filter((arr) => arr.length > 0).length;
  }, [activeFilters]);

  // Generate filter chips from active filters
  const activeFilterChips = useMemo(() => {
    const chips: Array<{ category: string; value: string; label: string }> = [];
    Object.entries(activeFilters).forEach(([category, values]) => {
      values.forEach((value) => {
        chips.push({ category, value, label: value });
      });
    });
    return chips;
  }, [activeFilters]);

  // Handle individual filter removal
  const handleRemoveFilter = (category: string, value: string) => {
    handleFilterChange(category, value);
  };

  // Check if a category is the price range category
  const isPriceRangeCategory = (category: string) => {
    return priceRangeConfig?.category === category;
  };

  // Handle price range slider change
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handlePriceRangeChange = (_value: [number, number]) => {
    // This converts the slider values to the checkbox-based filter format
    // For now, we'll need to work with the existing checkbox-based approach
    // but can add special handling if needed
  };

  const filterContent = (
    <div className="space-y-1">
      {/* Active Filters Chips */}
      {activeFilterChips.length > 0 && (
        <div className="mb-4">
          <ActiveFilterChips
            filters={activeFilterChips}
            onRemove={handleRemoveFilter}
            onClearAll={onClearAll}
          />
        </div>
      )}

      {/* Filter Sections */}
      {FilterConfig.map((filter) => {
        // Skip price range if it's handled by slider
        if (isPriceRangeCategory(filter.category) && priceRangeConfig) {
          return (
            <CollapsibleFilterSection
              key={filter.category}
              label={filter.label}
              defaultOpen={true}
            >
              <PriceRangeSlider
                min={priceRangeConfig.min}
                max={priceRangeConfig.max}
                value={[0, priceRangeConfig.max]}
                onChange={handlePriceRangeChange}
                presets={[
                  { label: "0 - 50", min: 0, max: 50 },
                  { label: "51 - 100", min: 51, max: 100 },
                  { label: "101 - 150", min: 101, max: 150 },
                  { label: "150+", min: 150, max: Infinity },
                ]}
              />
            </CollapsibleFilterSection>
          );
        }

        return (
          <CollapsibleFilterSection
            key={filter.category}
            label={filter.label}
            defaultOpen={activeFilters[filter.category]?.length > 0}
          >
            <div className="space-y-2.5 pt-1">
              {filter.options.map((option) => (
                <div
                  key={option}
                  className={cn(
                    "flex items-start space-x-3 rounded-md px-2 py-2 transition-colors hover:bg-muted/50 cursor-pointer group",
                    activeFilters[filter.category]?.includes(option) &&
                      "bg-forest-green-50 dark:bg-forest-green-950/30"
                  )}
                  onClick={() => handleFilterChange(filter.category, option)}
                >
                  <Checkbox
                    id={`${filter.category}-${option}`}
                    checked={activeFilters[filter.category]?.includes(option)}
                    onCheckedChange={() =>
                      handleFilterChange(filter.category, option)
                    }
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor={`${filter.category}-${option}`}
                    className="flex-1 cursor-pointer text-sm font-normal text-foreground group-hover:text-primary transition-colors"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </CollapsibleFilterSection>
        );
      })}

      {onClearAll && activeFilterCount > 0 && (
        <Button
          variant="outline"
          onClick={onClearAll}
          className="w-full mt-4 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );

  // Desktop Sidebar Variant
  if (variant === "sidebar") {
    return (
      <div
        className={cn(
          "transition-all duration-300 ease-in-out overflow-hidden",
          isOpen ? "w-full opacity-100" : "w-0 opacity-0"
        )}
      >
        <div
          className={cn(
            "p-4 bg-card border border-border rounded-lg shadow-sm overflow-y-auto max-h-[calc(100vh-8rem)]",
            !isOpen && "hidden"
          )}
        >
          {filterContent}
        </div>
      </div>
    );
  }

  // Mobile Drawer Variant (using Sheet)
  return (
    <>
      {/* Mobile Filter Button */}
      <div className="fixed bottom-4 right-4 z-50 md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 transition-all relative"
            >
              <SlidersHorizontal className="w-5 h-5" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-white text-xs flex items-center justify-center font-medium">
                  {activeFilterCount}
                </span>
              )}
              <span className="sr-only">Open filters</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full sm:max-w-sm overflow-y-auto"
          >
            <SheetHeader className="mb-6">
              <div className="flex items-center justify-between">
                <SheetTitle>Filters</SheetTitle>
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearAll}
                    className="text-destructive hover:text-destructive"
                  >
                    Clear All
                  </Button>
                )}
              </div>
              {activeFilterCount > 0 && (
                <p className="text-sm text-muted-foreground">
                  {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} applied
                </p>
              )}
            </SheetHeader>
            {filterContent}
            <div className="mt-6 pt-4 border-t border-border">
              <SheetClose asChild>
                <Button className="w-full" size="lg">
                  Apply Filters
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block p-4 bg-card border border-border rounded-lg shadow-sm">
        {filterContent}
      </div>
    </>
  );
};

export default FilterPanel;
