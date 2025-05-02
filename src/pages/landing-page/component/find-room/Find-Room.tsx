import { useState, useMemo } from "react"
import { Building, Users, Phone, Mail, MapPin, Calendar, Filter, X } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useParams } from "react-router-dom"

// Types based on the provided data
type Room = {
  id: string
  number: string
  block: string
  floor: string
  maxCap: number
  price: number
  description: string
  type: "SINGLE" | "DOUBLE" | "QUAD" | "SUITE"
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE"
  gender: "MALE" | "FEMALE" | "MIX"
  currentResidentCount: number
}

type HostelImage = {
  imageUrl: string
}

type CalendarYear = {
  name: string
  startDate: string
  isActive: boolean
}

type Hostel = {
  id: string
  name: string
  description: string
  address: string
  location: string
  manager: string
  email: string
  phone: string
  Rooms: Room[]
  HostelImages: HostelImage[]
  CalendarYear: CalendarYear[]
}

// Sample data from the provided JSON
const hostelData: Hostel = {
  id: "ca2ccd40-c19b-466c-91bb-fcf3caa78957",
  name: "DEBAGIO",
  description: "A nice hostel behind the campus third gate to the west",
  address: "AF-0028-7204",
  location: "BONO",
  manager: "SHAIZLYASSNIGGA",
  email: "amponsahdanquah1206@gmail.com",
  phone: "0546665214",
  Rooms: [
    {
      id: "eb38a556-0030-40c6-a4f0-f21f8990c8d6",
      number: "B2838",
      block: "B",
      floor: "3",
      maxCap: 1,
      price: 2300,
      description: "Air conditioner",
      type: "SINGLE",
      status: "AVAILABLE",
      currentResidentCount: 0,
      gender: "MALE",
    },
    {
      id: "73b1a1f4-8c53-45f7-a21b-0ea53d25b4d0",
      number: "A2009",
      block: "A",
      floor: "2",
      maxCap: 2,
      price: 1500,
      description: "Provision of fridge",
      type: "DOUBLE",
      status: "MAINTENANCE",
      currentResidentCount: 0,
      gender: "FEMALE",
    },
    {
      id: "d83deb67-fcea-4f3f-a1ec-1b0c28ada2c2",
      number: "C3212",
      block: "C",
      floor: "1",
      maxCap: 4,
      price: 900,
      description: "Provision of fans",
      type: "QUAD",
      status: "OCCUPIED",
      currentResidentCount: 0,
      gender: "MIX",
    },
    {
      id: "0e31b47d-da8a-4c29-94ef-0115eb017f62",
      number: "G2632",
      block: "G",
      floor: "4",
      maxCap: 3,
      price: 1200,
      description: "All gadgets needed for a soft living",
      type: "SUITE",
      status: "AVAILABLE",
      currentResidentCount: 0,
      gender: "FEMALE",
    },
  ],
  HostelImages: [
    {
      imageUrl: "https://res.cloudinary.com/dbpc1jkiy/image/upload/v1745894005/hostel/c18rxuq2efmmhsfxbdzr.jpg",
    },
  ],
  CalendarYear: [
    {
      name: "2nd September 2024-2025",
      startDate: "2025-04-29T03:29:58.851Z",
      isActive: true,
    },
  ],
}

const FindRoom = () => {
    const { id:hostelId } = useParams()
    console.log(hostelId)
  // Filter states
  const [roomType, setRoomType] = useState<string>("")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000])
  const [gender, setGender] = useState<string>("")
  const [status, setStatus] = useState<string>("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Calculate min and max prices for the slider
  const minPrice = Math.min(...hostelData.Rooms.map((room) => room.price))
  const maxPrice = Math.max(...hostelData.Rooms.map((room) => room.price))

  // Filter rooms based on selected criteria
  const filteredRooms = useMemo(() => {
    return hostelData.Rooms.filter((room) => {
      const matchesType = roomType ? room.type === roomType : true
      const matchesPrice = room.price >= priceRange[0] && room.price <= priceRange[1]
      const matchesGender = gender ? room.gender === gender : true
      const matchesStatus = status ? room.status === status : true

      return matchesType && matchesPrice && matchesGender && matchesStatus
    })
  }, [roomType, priceRange, gender, status])

  // Reset all filters
  const resetFilters = () => {
    setRoomType("")
    setPriceRange([minPrice, maxPrice])
    setGender("")
    setStatus("")
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-500"
      case "OCCUPIED":
        return "bg-red-500"
      case "MAINTENANCE":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hostel Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-1/3 rounded-lg overflow-hidden">
            {hostelData.HostelImages.length > 0 ? (
              <img
                src={hostelData.HostelImages[0].imageUrl || "/placeholder.svg"}
                alt={hostelData.name}
                width={400}
                height={300}
                className="w-full h-64 object-cover"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                <Building size={48} className="text-gray-400" />
              </div>
            )}
          </div>

          <div className="w-full md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">{hostelData.name}</h1>
            <p className="text-gray-600 mb-4">{hostelData.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-gray-500" />
                <span>
                  {hostelData.address}, {hostelData.location}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={18} className="text-gray-500" />
                <span>Manager: {hostelData.manager}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={18} className="text-gray-500" />
                <span>{hostelData.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-gray-500" />
                <span>{hostelData.email}</span>
              </div>
              {hostelData.CalendarYear.length > 0 && hostelData.CalendarYear[0].isActive && (
                <div className="flex items-center gap-2 md:col-span-2">
                  <Calendar size={18} className="text-gray-500" />
                  <span>Academic Year: {hostelData.CalendarYear[0].name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Button - Mobile Floating */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <Button onClick={() => setIsFilterOpen(!isFilterOpen)} size="icon" className="h-14 w-14 rounded-full shadow-lg">
          <Filter size={24} />
        </Button>
      </div>

      {/* Filter Panel */}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
          <div className="bg-gray-50 h-full">
            <div className="p-4 flex items-center gap-2 border-b">
              <Filter size={18} className="text-gray-500" />
              <h3 className="text-lg font-medium text-gray-700">Filter</h3>
            </div>

            <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)]">
              {/* Gender Filter */}
              <div>
                <h4 className="text-gray-500 mb-2">Gender</h4>
                <div className="space-y-2">
                  {["Male", "Female", "Mix"].map((g) => (
                    <div key={g} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`gender-${g}`}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={gender === g.toUpperCase()}
                        onChange={() => {
                          setGender(gender === g.toUpperCase() ? "" : g.toUpperCase())
                        }}
                      />
                      <label htmlFor={`gender-${g}`} className="ml-2 text-sm text-gray-600">
                        {g}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h4 className="text-gray-500 mb-2">Price</h4>
                <div className="px-2">
                  <p className="mb-2 text-sm text-gray-600">
                    ₵{priceRange[0]} - ₵{priceRange[1]}
                  </p>
                  <Slider
                    defaultValue={[minPrice, maxPrice]}
                    min={minPrice}
                    max={maxPrice}
                    step={100}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    className="my-4"
                  />
                </div>
              </div>

              {/* Room Type Filter */}
              <div>
                <h4 className="text-gray-500 mb-2">Type</h4>
                <div className="space-y-2">
                  {["Single", "Double", "Quad", "Suite"].map((type) => (
                    <div key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`type-${type}`}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={roomType === type.toUpperCase()}
                        onChange={() => {
                          setRoomType(roomType === type.toUpperCase() ? "" : type.toUpperCase())
                        }}
                      />
                      <label htmlFor={`type-${type}`} className="ml-2 text-sm text-gray-600">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t p-4 bg-white">
              <div className="flex justify-between gap-4">
                <Button variant="outline" onClick={resetFilters} className="flex-1">
                  Reset
                </Button>
                <Button onClick={() => setIsFilterOpen(false)} className="flex-1">
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Filter Toggle */}
      <div className="hidden md:block mb-6">
        <Button variant="outline" onClick={() => setIsFilterOpen(!isFilterOpen)} className="flex items-center gap-2">
          <Filter size={16} />
          Filter
        </Button>
      </div>

      {/* Results Count - Desktop */}
      <div className="hidden md:flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Available Rooms</h2>
        <span className="text-gray-500">
          {filteredRooms.length} room{filteredRooms.length !== 1 ? "s" : ""} found
        </span>
      </div>

      {/* Room Cards */}
      {filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <Card
              key={room.id}
              className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <CardHeader className="pb-2 border-b bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl font-bold">Room {room.number}</CardTitle>
                    <p className="text-xs text-gray-500">
                      Block {room.block} · Floor {room.floor}
                    </p>
                  </div>
                  <Badge className={`${getStatusColor(room.status)} px-2 py-1 text-xs font-medium rounded-md`}>
                    {room.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-xs text-gray-500 mb-1">Type</p>
                      <p className="font-semibold">{room.type.charAt(0) + room.type.slice(1).toLowerCase()}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-xs text-gray-500 mb-1">Gender</p>
                      <p className="font-semibold">{room.gender.charAt(0) + room.gender.slice(1).toLowerCase()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
                    <Users size={18} className="text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Capacity</p>
                      <p className="font-semibold">
                        {room.currentResidentCount}/{room.maxCap} residents
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Amenities</p>
                    <p className="text-sm">{room.description}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center border-t pt-4 bg-gray-50">
                <div>
                  <p className="text-xs text-gray-500">Price</p>
                  <p className="font-bold text-lg">₵{room.price.toLocaleString()}</p>
                </div>
                <Button
                  disabled={room.status !== "AVAILABLE"}
                  variant={room.status === "AVAILABLE" ? "default" : "outline"}
                  className={room.status === "AVAILABLE" ? "bg-primary hover:bg-primary/90" : ""}
                  size="sm"
                >
                  {room.status === "AVAILABLE" ? "Book Now" : "Unavailable"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-center mb-4">
            <X size={48} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-medium mb-2">No Rooms Found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your filters to find available rooms</p>
          <Button onClick={resetFilters}>Reset Filters</Button>
        </div>
      )}
    </div>
  )
}
 export default FindRoom