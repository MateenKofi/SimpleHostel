import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getHostels } from "@/api/hostels";
import { Hostel } from "@/helper/types/types";
import CustomeRefetch from "@/components/CustomRefetch";
import HostelCard from "@/components/hostel/HostelCard";
import { useDebounce } from "@/helper/useDebounce";
import FilterPanel from "@components/FilterPanel";
import FindHostelSkeleton from "@components/loaders/HostelCardSkeleton";
import { HostetFilterConfig } from "@/helper/hostel_filter_config";
import { useSelectedCalendarYearStore } from "@/stores/useSelectedCalendarYearStore";
import { useNavigate } from "react-router-dom";
import { FilterBar } from "@/components/filters/FilterBar";

interface ActiveFilters {
  [key: string]: string[];
}

export function FindHostel() {
  const navigate = useNavigate();
  const setCalendarYear = useSelectedCalendarYearStore(
    (state) => state.setCalendarYear
  );
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 500);

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    locations: [],
  });

  // Filter panel open state (desktop)
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const [sortBy, setSortBy] = useState<"name" | "price" | "rating">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const {
    data: rooms,
    isError,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["find_hostel"],
    queryFn: async () => {
      const responseData = await getHostels();
      return responseData?.data;
    },
  });

  const handleFilterChange = (category: string, value: string) => {
    setActiveFilters((prev) => {
      const updated = { ...prev };
      if (updated[category].includes(value)) {
        updated[category] = updated[category].filter((item) => item !== value);
      } else {
        updated[category] = [...updated[category], value];
      }
      return updated;
    });
  };

  const removeFilter = (category: string, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [category]: prev[category].filter((item) => item !== value),
    }));
  };

  const handleFindRoom = (hostel: Hostel) => {
    setTimeout(() => {
      if (hostel.calendarYears) {
        setCalendarYear(hostel.calendarYears[0] || null);
      } else {
        setCalendarYear(null);
      }
      navigate(`/find/${hostel.id}/room`);
    }, 50);
  };

  // Helper function to get minimum room price for a hostel (for sorting)
  const getMinPrice = (hostel: Hostel): number => {
    if (!hostel.rooms || hostel.rooms.length === 0) return 0;
    return Math.min(...hostel.rooms.map(room => room.price));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setActiveFilters({
      locations: [],
    });
  };

  // Count active filters
  const activeFilterCount = useMemo(() => {
    return Object.values(activeFilters).filter((arr) => arr.length > 0).length;
  }, [activeFilters]);

  if (isLoading) return <FindHostelSkeleton />;
  if (isError) return <CustomeRefetch refetch={refetch} />;

  const roomsArray = Array.isArray(rooms) ? rooms : [];
  const PublishedHostels = roomsArray.filter(
    (room: Hostel) => room?.state === "published"
  );

  const filteredHostels = PublishedHostels?.filter((hostel: Hostel) => {
    // Search filter
    const matchesSearch = hostel.name
      .toLowerCase()
      .includes(debouncedQuery.toLowerCase());

    // Location filter
    const matchesLocation =
      activeFilters.locations.length === 0 ||
      activeFilters.locations.includes(hostel.location);

    return matchesSearch && matchesLocation;
  })
  .sort((a: Hostel, b: Hostel) => {
    // Apply sorting
    let comparison = 0;
    if (sortBy === "price") {
      comparison = getMinPrice(a) - getMinPrice(b);
    } else if (sortBy === "rating") {
      comparison = (a.averageRating || 0) - (b.averageRating || 0);
    } else {
      comparison = a.name.localeCompare(b.name);
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  return (
    <div className="px-4 py-8 mx-auto">
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar with FilterBar */}
        <div className="w-full lg:w-72 space-y-4">
          <FilterBar
            activeFilterCount={activeFilterCount}
            onToggleFilters={() => setIsFilterOpen(!isFilterOpen)}
            onClearAll={clearAllFilters}
            isOpen={isFilterOpen}
          />
          <FilterPanel
            FilterConfig={HostetFilterConfig}
            activeFilters={activeFilters}
            handleFilterChange={handleFilterChange}
            onClearAll={clearAllFilters}
            variant="sidebar"
            isOpen={isFilterOpen}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 space-y-6 bg-card border border-border rounded-lg shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row">
            <Input
              placeholder="Search For Hostel By name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-background border-input text-foreground placeholder:text-muted-foreground"
            />
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sort, order] = e.target.value.split("-");
                setSortBy(sort as "name" | "price" | "rating");
                setSortOrder(order as "asc" | "desc");
              }}
              className="px-4 py-2 bg-background border border-input rounded-md text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="rating-desc">Rating (Highest)</option>
              <option value="rating-asc">Rating (Lowest)</option>
            </select>
          </div>

          {/* Active filter badges (shown inline, below search) */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2">
              {Object.entries(activeFilters).map(([category, values]) =>
                values.map((value) => (
                  <Badge
                    key={`${category}-${value}`}
                    variant="secondary"
                    className="flex items-center gap-1 bg-forest-green-100 text-forest-green-800 hover:bg-forest-green-200 dark:bg-forest-green-900 dark:text-forest-green-100"
                  >
                    {value}
                    <button
                      onClick={() => removeFilter(category, value)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          )}

          {filteredHostels?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg font-medium text-foreground mb-2">
                No hostels match your search
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Try adjusting your filters or search query
              </p>
              {(activeFilterCount > 0 || debouncedQuery) && (
                <button
                  onClick={() => {
                    clearAllFilters();
                    setSearchQuery("");
                  }}
                  className="text-primary hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredHostels?.map((hostel: Hostel) => (
                <HostelCard
                  key={hostel.id}
                  hostel={hostel}
                  onFindRoom={handleFindRoom}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
