'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { X } from 'lucide-react'

interface Filter {
  locations: string[];
  genders: string[];
  priceRanges: string[];
  roomTypes: string[];
}

interface ActiveFilters {
  [key: string]: string[];
}

// Sample hostel data
const hostels = [
  {
    id: 1,
    name: "Accra Central Hostel",
    location: "Accra",
    price: 3000,
    gender: "Mix",
    roomType: "Single",
    image: "https://images.unsplash.com/photo-1520277739336-7bf67edfa768?auto=format&fit=crop&w=300&h=200&q=80",
  },
  {
    id: 2,
    name: "Kumasi Student Lodge",
    location: "Kumasi",
    price: 5200,
    gender: "Female",
    roomType: "Double",
    image: "https://images.unsplash.com/photo-1626265774643-f1943311a86b?auto=format&fit=crop&w=300&h=200&q=80",
  },
  {
    id: 3,
    name: "Sunyani Comfort",
    location: "Sunyani",
    price: 6500,
    gender: "Male",
    roomType: "Suite",
    image: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&w=300&h=200&q=80",
  },
]

const filterOptions: Filter = {
  locations: ["Accra", "Kumasi", "Sunyani"],
  genders: ["Male", "Female", "Mix"],
  priceRanges: ["2500-4000", "5000-5500", "6000-7000"],
  roomTypes: ["Single", "Double", "Suite", "Shared"],
}

export function FindHostel() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    locations: [],
    genders: [],
    priceRanges: [],
    roomTypes: [],
  })

  const handleFilterChange = (category: string, value: string) => {
    setActiveFilters(prev => {
      const updatedFilters = { ...prev }
      if (updatedFilters[category].includes(value)) {
        updatedFilters[category] = updatedFilters[category].filter(item => item !== value)
      } else {
        updatedFilters[category] = [...updatedFilters[category], value]
      }
      return updatedFilters
    })
  }

  const removeFilter = (category: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item !== value)
    }))
  }

  const filteredHostels = hostels.filter(hostel => {
    const matchesSearch = hostel.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLocation = activeFilters.locations.length === 0 || activeFilters.locations.includes(hostel.location)
    const matchesGender = activeFilters.genders.length === 0 || activeFilters.genders.includes(hostel.gender)
    const matchesRoomType = activeFilters.roomTypes.length === 0 || activeFilters.roomTypes.includes(hostel.roomType)
    const matchesPriceRange = activeFilters.priceRanges.length === 0 || activeFilters.priceRanges.some(range => {
      const [min, max] = range.split('-').map(Number)
      return hostel.price >= min && hostel.price <= max
    })

    return matchesSearch && matchesLocation && matchesGender && matchesRoomType && matchesPriceRange
  })

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
              {filterOptions.locations.map(location => (
                <div key={location} className="flex items-center space-x-2">
                  <Checkbox
                    id={`location-${location}`}
                    checked={activeFilters.locations.includes(location)}
                    onCheckedChange={() => handleFilterChange('locations', location)}
                  />
                  <Label htmlFor={`location-${location}`}>{location}</Label>
                </div>
              ))}
            </div>

            {/* Gender Filter */}
            <div className="space-y-2">
              <Label className="font-semibold">Gender</Label>
              {filterOptions.genders.map(gender => (
                <div key={gender} className="flex items-center space-x-2">
                  <Checkbox
                    id={`gender-${gender}`}
                    checked={activeFilters.genders.includes(gender)}
                    onCheckedChange={() => handleFilterChange('genders', gender)}
                  />
                  <Label htmlFor={`gender-${gender}`}>{gender}</Label>
                </div>
              ))}
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2">
              <Label className="font-semibold">Price (GH₵)</Label>
              {filterOptions.priceRanges.map(range => (
                <div key={range} className="flex items-center space-x-2">
                  <Checkbox
                    id={`price-${range}`}
                    checked={activeFilters.priceRanges.includes(range)}
                    onCheckedChange={() => handleFilterChange('priceRanges', range)}
                  />
                  <Label htmlFor={`price-${range}`}>{range}</Label>
                </div>
              ))}
            </div>

            {/* Room Type Filter */}
            <div className="space-y-2">
              <Label className="font-semibold">Room Type</Label>
              {filterOptions.roomTypes.map(type => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`room-${type}`}
                    checked={activeFilters.roomTypes.includes(type)}
                    onCheckedChange={() => handleFilterChange('roomTypes', type)}
                  />
                  <Label htmlFor={`room-${type}`}>{type}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Search Bar */}
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search For Hostel By name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full "
              />
            </div>

            {/* Active Filters */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(activeFilters).map(([category, values]) =>
                values.map(value => (
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {filteredHostels.map((hostel) => (
              <Card key={hostel.id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={hostel.image}
                    alt={hostel.name}
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-2">
                  <h3 className="font-semibold text-lg mb-2">
                    {hostel.name}</h3>
                  <p className="text-sm text-gray-600 ">Location: {hostel.location}</p>
                  <p className="text-sm text-gray-600 ">Gender: {hostel.gender}</p>
                  <p className="text-sm text-gray-600 ">Room Type: {hostel.roomType}</p>
                  <p className="font-bold">GH₵ {hostel.price}/semester</p>
                  <Button className="w-full mt-4">Book Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

