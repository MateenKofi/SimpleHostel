import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {  MapPin, MapPinHouse, Phone, X } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Hostel } from "@/helper/types/types";

interface Filter {
  locations: string[];
  genders: string[];
}

interface ActiveFilters {
  [key: string]: string[];
}

const filterOptions: Filter = {
  locations: [
    "Ahafo",
    "Ashanti",
    "Bono",
    "Bono East",
    "Central",
    "Eastern",
    "Greater Accra",
    "Northern",
    "Oti",
    "Savannah",
    "Upper East",
    "Upper West",
    "Volta",
    "Western",
    "Western North",
  ],
  genders: ["Male", "Female", "Mix"],
};

export function FindHostel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    locations: [],
    genders: [],
    priceRanges: [],
    roomTypes: [],
  });

  const { data: rooms } = useQuery({
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

  const PublishedHostels = rooms?.filter(
    (room: Hostel) => room?.state === "PUBLISHED"
  );

  const handleFilterChange = (category: string, value: string) => {
    setActiveFilters((prev) => {
      const updatedFilters = { ...prev };
      if (updatedFilters[category].includes(value)) {
        updatedFilters[category] = updatedFilters[category].filter(
          (item) => item !== value
        );
      } else {
        updatedFilters[category] = [...updatedFilters[category], value];
      }
      return updatedFilters;
    });
  };

  const removeFilter = (category: string, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [category]: prev[category].filter((item) => item !== value),
    }));
  };

  const filteredHostels = PublishedHostels?.filter((hostel: Hostel) => {
    const matchesSearch = hostel.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesLocation =
      activeFilters.locations.length === 0 ||
      activeFilters.locations.includes(hostel.location);
    const matchesGender =
      activeFilters.genders.length === 0 ||
      activeFilters.genders.includes(hostel.gender);
    return matchesSearch && matchesLocation && matchesGender;
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Panel */}
        <div className="w-full lg:w-64 space-y-6">
          <div className="p-4 border rounded-lg space-y-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filter
            </h2>
            {/* Location Filter */}
            <div className="space-y-2">
              <Label className="font-semibold">Location</Label>
              {filterOptions.locations.map((location) => (
                <div key={location} className="flex items-center space-x-2">
                  <Checkbox
                    id={`location-${location}`}
                    checked={activeFilters.locations.includes(location)}
                    onCheckedChange={() =>
                      handleFilterChange("locations", location)
                    }
                  />
                  <Label htmlFor={`location-${location}`}>{location}</Label>
                </div>
              ))}
            </div>
            {/* Gender Filter */}
            <div className="space-y-2">
              <Label className="font-semibold">Gender</Label>
              {filterOptions.genders.map((gender) => (
                <div key={gender} className="flex items-center space-x-2">
                  <Checkbox
                    id={`gender-${gender}`}
                    checked={activeFilters.genders.includes(gender)}
                    onCheckedChange={() =>
                      handleFilterChange("genders", gender)
                    }
                  />
                  <Label htmlFor={`gender-${gender}`}>{gender}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Search Bar */}
          <div className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder="Search For Hostel By name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
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
          </div>
          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredHostels?.map((hostel: Hostel) => (
              <Card
                key={hostel?.id}
                className="overflow-hidden flex flex-col h-full"
              >
                <div className="relative aspect-[4/3] w-full">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {(hostel?.HostelImages || []).map(
                        (img, index: number) => (
                          <CarouselItem key={index}>
                            <div className="aspect-[4/3] w-full relative">
                              <img
                                src={img.imageUrl || "/logo.png"}
                                alt={`${hostel.name} Room ${
                                  hostel.id
                                } - Image ${index + 1}`}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          </CarouselItem>
                        )
                      )}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </Carousel>
                </div>
                <CardContent className="p-4 flex flex-col flex-1">
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      <div className="w-full flex items-center gap-2 border shadow-sm rounded-md p-2">
                        <span>
                          <MapPinHouse className="h-5 w-5 text-gray-600" />
                        </span>
                        <span className="flex flex-col">
                          <p className="text-xs font-bold">{hostel.address}</p>
                          <span className="text-[10px] text-gray-500">
                            click and search of hostel with the address
                          </span>
                        </span>
                      </div>
                      <div className="w-full flex items-center gap-2 border shadow-sm rounded-md p-2">
                        <MapPin className="h-5 w-5 text-gray-600" />
                        <p className="text-sm">{hostel.location}</p>
                      </div>
                    </div>
                    <a href={`tel:${hostel.phone}`}>
                      <div className="w-full flex items-center gap-2 border shadow-sm rounded-md p-2 my-1">
                        <span>
                          <Phone className="h-5 w-5 text-gray-600" />
                        </span>
                        <span className="flex flex-col">
                          <p className="text-xs font-bold">{hostel.phone}</p>
                          <span className="text-[10px] text-gray-500">
                            click to place i call to hostel
                          </span>
                        </span>
                      </div>
                    </a>
                  </div>
                  <Link to={`/find/${hostel?.id}/room`} className="mt-4 block">
                    <Button className="w-full">Find Room</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
