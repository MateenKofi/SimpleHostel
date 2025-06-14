import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Hostel } from "@/helper/types/types";
import CustomeRefetch from "@/components/CustomeRefetch";
import ImageSlider from "@/components/ImageSlider";
import { MapPin, MapPinHouse, Phone } from "lucide-react";
import { useDebounce } from "@/helper/useDebounce";
import FilterPanel from "@components/FilterPanel";
import FindHostelSkeleton from "@components/loaders/HostelCardSkeleton";
import { HostetFilterConfig } from "@/helper/hostel_filter_config";
import { useSelectedCalendarYearStore } from "@/controllers/SelectedCalendarYear";
import { useNavigate } from "react-router-dom";

interface ActiveFilters {
  [key: string]: string[];
}

export function FindHostel() {
  const navigate = useNavigate()
  const setCalendarYear = useSelectedCalendarYearStore((state) => state.setCalendarYear);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 500);

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    locations: [],
  });

  const {
    data: rooms,
    isError,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["find_hostel"],
    queryFn: async () => {
      const response = await axios.get(`/api/hostels/get`);
      return response.data?.data;
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
    if (hostel.CalendarYear) {
      setCalendarYear(hostel.CalendarYear[0] || null); 
    } else {
      setCalendarYear(null);
    }
    navigate(`/find/${hostel.id}/room`);
  }, 50);
};

  if (isLoading) return <FindHostelSkeleton />;
  if (isError) return <CustomeRefetch refetch={refetch} />;

  const PublishedHostels = rooms?.filter(
    (room: Hostel) => room?.state === "PUBLISHED"
  );

  const filteredHostels = PublishedHostels?.filter((hostel: Hostel) => {
    const matchesSearch = hostel.name
      .toLowerCase()
      .includes(debouncedQuery.toLowerCase());

    const matchesLocation =
      activeFilters.locations.length === 0 ||
      activeFilters.locations.includes(hostel.location);

    return matchesSearch && matchesLocation;
  });

  return (
    <div className="container py-8 mx-auto">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="w-full lg:w-64 ">
          <FilterPanel
            FilterConfig={HostetFilterConfig}
            activeFilters={activeFilters}
            handleFilterChange={handleFilterChange}
          />
        </div>
        <div className="flex-1 p-4 space-y-6 transition-colors bg-white rounded shadow dark:bg-zinc-900">
          <Input
            placeholder="Search For Hostel By name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-black bg-white border border-gray-300 dark:bg-zinc-800 dark:text-white dark:border-zinc-700"
          />
          <div className="flex flex-wrap gap-2">
            {Object.entries(activeFilters).map(([category, values]) =>
              values.map((value) => (
                <Badge
                  key={`${category}-${value}`}
                  variant="secondary"
                  className="flex items-center gap-1 text-black bg-gray-100 dark:bg-zinc-800 dark:text-white"
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
         
            {filteredHostels?.length === 0 ? (
              <p className="text-center text-black dark:text-white">No hostels match your search.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {filteredHostels?.map((hostel: Hostel) => (
                  <div
                    key={hostel.id}
                    className="overflow-hidden transition-colors bg-white border rounded-md dark:border-zinc-700 dark:bg-zinc-800"
                  >
                    <ImageSlider
                      images={hostel?.HostelImages?.map((i) => i.imageUrl)}
                    />
                    <div className="p-4 space-y-2">
                      <p className="font-bold text-black dark:text-white">{hostel.name}</p>
                      <div className="flex gap-2">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            hostel.address
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center flex-1 gap-2 p-2 transition-colors border rounded dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700"
                        >
                          <MapPinHouse className="w-4 h-4 text-black dark:text-white" />
                          <div>
                            <p className="text-xs font-bold text-black truncate dark:text-white">
                              {hostel.address}
                            </p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400">
                              click to search
                            </p>
                          </div>
                        </a>

                        <div className="flex items-center flex-1 gap-2 p-2 border rounded dark:border-zinc-700">
                          <MapPin className="w-4 h-4 text-black dark:text-white" />
                          <p className="text-sm text-black dark:text-white">{hostel.location}</p>
                        </div>
                      </div>

                      <a
                        href={`tel:${hostel.phone}`}
                        className="flex items-center gap-2 p-2 border rounded dark:border-zinc-700"
                      >
                        <Phone className="w-4 h-4 text-black dark:text-white" />
                        <div>
                          <p className="text-xs font-bold text-black dark:text-white">{hostel.phone}</p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400">
                            click to call
                          </p>
                        </div>
                      </a>
                        <button
                          className="w-full mt-2 text-white transition-colors bg-black btn btn-black dark:bg-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-200"
                          onClick={() => handleFindRoom(hostel)}
                        >
                          Find Room
                        </button>

                    </div>
                  </div>
                ))}
               </div>
            )}
          </div>
        </div>
      </div>
   
  );
}