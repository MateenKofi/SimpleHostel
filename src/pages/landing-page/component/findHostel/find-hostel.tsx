'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

// Sample hostel data
const hostels = [
  {
    id: 1,
    name: "Backpackers Paradise",
    location: "Bangkok, Thailand",
    price: 1545,
    gender: "Mixed",
    roomType: "single",
    image: "https://images.unsplash.com/photo-1520277739336-7bf67edfa768?auto=format&fit=crop&w=300&h=200&q=80",
  },
  {
    id: 2,
    name: "Urban Oasis",
    location: "Barcelona, Spain",
    price: 2012,
    gender: "Female Only",
    roomType: "double",
    image: "https://images.unsplash.com/photo-1626265774643-f1943311a86b?auto=format&fit=crop&w=300&h=200&q=80",
  },
  {
    id: 3,
    name: "City Central",
    location: "London, UK",
    price: 2511,
    gender: "Mixed",
    roomType: "suite",
    image: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&w=300&h=200&q=80",
  },
  {
    id: 4,
    name: "Art House",
    location: "Berlin, Germany",
    price: 2000,
    gender: "Mixed",
    roomType: "single",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=300&h=200&q=80",
  },
]

export function FindHostel() {
  const [filteredHostels, setFilteredHostels] = useState(hostels)
  const [priceRange, setPriceRange] = useState([0, 50])

  const handleFilter = (filterType: string, value: string) => {
    let newFilteredHostels = hostels
    if (filterType === 'location') {
      newFilteredHostels = newFilteredHostels.filter(hostel => hostel.location.includes(value))
    } else if (filterType === 'gender') {
      newFilteredHostels = newFilteredHostels.filter(hostel => hostel.gender === value)
    } else if (filterType === 'roomType') {
      newFilteredHostels = newFilteredHostels.filter(hostel => hostel.roomType === value)
    }
    newFilteredHostels = newFilteredHostels.filter(hostel => hostel.price >= priceRange[0] && hostel.price <= priceRange[1])
    setFilteredHostels(newFilteredHostels)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Find Your Perfect Hostel</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8">
        <Select onValueChange={(value) => handleFilter('location', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Location</SelectLabel>
              <SelectItem value="Bangkok">Bangkok</SelectItem>
              <SelectItem value="Barcelona">Barcelona</SelectItem>
              <SelectItem value="London">London</SelectItem>
              <SelectItem value="Berlin">Berlin</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => handleFilter('gender', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Gender</SelectLabel>
              <SelectItem value="Mixed">Mixed</SelectItem>
              <SelectItem value="Female Only">Female Only</SelectItem>
              <SelectItem value="Male Only">Male Only</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => handleFilter('roomType', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Room Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Room Type</SelectLabel>
              <SelectItem value="Dorm">Dorm</SelectItem>
              <SelectItem value="Private">Private</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range: ₵{priceRange[0]} - ₵{priceRange[1]}
          </label>
          <Slider
            min={0}
            max={50}
            step={1}
            value={priceRange}
            onValueChange={setPriceRange}
            className="w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredHostels.map((hostel) => (
          <Card key={hostel.id} className="overflow-hidden">
            <div className="relative h-48">
              <img
                src={hostel.image}
                alt={hostel.name}
                className="object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">{hostel.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{hostel.location}</p>
              <p className="text-sm text-gray-600 mb-2">Gender: {hostel.gender}</p>
              <p className="text-sm text-gray-600 mb-2">Room Type: {hostel.roomType}</p>
              <p className="font-bold">₵{hostel.price}/semester</p>
              <Button className="w-full mt-4">Book Now</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

