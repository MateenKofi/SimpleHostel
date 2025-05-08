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
import { Link } from "react-router-dom";
import { useDebounce } from "@/helper/useDebounce";
import FilterPanel from "@components/FilterPanel";
import FindHostelSkeleton from "@components/loaders/HostelCardSkeleton";

interface ActiveFilters {
  [key: string]: string[];
}

export function FindHostel() {
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
      const response = await axios.get(`/api/hostels/get`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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
    <div className="container mx-auto py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 ">
          <FilterPanel
            activeFilters={activeFilters}
            handleFilterChange={handleFilterChange}
          />
        </div>
        <div className="flex-1 space-y-6 bg-white p-4 shadow rounded">
          <Input
            placeholder="Search For Hostel By name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {Object.entries(activeFilters).map(([category, values]) =>
              values.map((value) => (
                <Badge
                  key={`${category}-${value}`}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {value}
                  <button
                    onClick={() => removeFilter(category, value)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            )}
          </div>
         
            {filteredHostels?.length === 0 ? (
              <p className="text-center ">No hostels match your search.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredHostels?.map((hostel: Hostel) => (
                  <div
                    key={hostel.id}
                    className="border rounded-md overflow-hidden"
                  >
                    <ImageSlider
                      images={hostel?.HostelImages?.map((i) => i.imageUrl)}
                    />
                    <div className="p-4 space-y-2">
                      <p className="font-bold text-black ">{hostel.name}</p>
                      <div className="flex gap-2">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            hostel.address
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 border rounded p-2 flex items-center gap-2 hover:bg-gray-100 transition"
                        >
                          <MapPinHouse className="w-4 h-4" />
                          <div>
                            <p className="text-xs font-bold truncate">
                              {hostel.address}
                            </p>
                            <p className="text-[10px] text-gray-500">
                              click to search
                            </p>
                          </div>
                        </a>

                        <div className="flex-1 border rounded p-2 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <p className="text-sm">{hostel.location}</p>
                        </div>
                      </div>

                      <a
                        href={`tel:${hostel.phone}`}
                        className="border rounded p-2 flex items-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        <div>
                          <p className="text-xs font-bold">{hostel.phone}</p>
                          <p className="text-[10px] text-gray-500">
                            click to call
                          </p>
                        </div>
                      </a>
                      <Link to={`/find/${hostel.id}/room`}>
                        <button className="w-full mt-2 btn btn-black text-white">
                          Find Room
                        </button>
                      </Link>
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
