import { useState, useMemo } from "react";
import {
  Building,
  Users,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Filter,
  ArrowLeft,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Room } from "@/helper/types/types";
import { useNavigate } from "react-router-dom";
import { useSelectedRoomStore } from "@/controllers/SelectedRoomStore";

const FindRoom = () => {
  const navigate = useNavigate();
  const { id: hostelId } = useParams();
  const [roomType, setRoomType] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000]);
  const [gender, setGender] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { room:roomstore,setRoom } = useSelectedRoomStore();

 

  const { data: hostelData } = useQuery({
    queryKey: ["hostel", hostelId],
    queryFn: async () => {
      const response = await axios.get(`/api/hostels/get/${hostelId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data?.data;
    },
  });

const availableRooms = useMemo(() => {
  const rooms = hostelData?.Rooms || [];
  return rooms.filter((room: Room) => room.status === "AVAILABLE");
}, [hostelData?.Rooms]);

  const filteredRooms = useMemo(() => {
    return availableRooms.filter((room:Room) => {
      const matchesType = roomType ? room.type === roomType : true;
      const matchesPrice =
        room.price >= priceRange[0] && room.price <= priceRange[1];
      const matchesGender = gender ? room.gender.toUpperCase() === gender : true;
      return matchesType && matchesPrice && matchesGender;
    });
  }, [availableRooms, roomType, priceRange, gender]);

  const priceRanges = [
    { label: "1000 - 2000", min: 1000, max: 2000 },
    { label: "2000 - 3000", min: 2000, max: 3000 },
    { label: "3000 - 4000", min: 3000, max: 4000 },
    { label: "4000 - 5000", min: 4000, max: 5000 },
    { label: "5000+", min: 5000, max: Infinity },
  ];

  const resetFilters = () => {
    setRoomType("");
    setPriceRange([0, Infinity]);
    setGender("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

const handleRoomClick = (room: Room) => {
  setRoom(room);
  console.log("Selected Room", room);
  console.log("Room Store", roomstore);
  navigate("/resident-form");
};


  return (
    <div className="container mx-auto px-4 py-8">
        <button
        className="my-2 bg-primary text-white px-4 py-2 rounded-md flex"
        onClick={() => window.history.back()}
        >
            <ArrowLeft className="w-6 h-6 animate-out "/>
            Back</button>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3 rounded-lg overflow-hidden">
            {hostelData?.HostelImages?.length > 0 ? (
              <img
                src={hostelData.HostelImages[0].imageUrl || "/placeholder.svg"}
                alt={hostelData.name}
                className="w-full h-64 object-cover"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                <Building size={48} className="text-gray-400" />
              </div>
            )}
          </div>

          <div className="w-full md:w-2/3 shadow-md p-4 border rounded-md">
            <h1 className="text-3xl font-bold mb-2">{hostelData?.name}</h1>
           

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                <span>
                  {hostelData?.address}, {hostelData?.location}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={18} />
                <span>Manager: {hostelData?.manager}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={18} />
                <span>{hostelData?.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={18} />
                <span>{hostelData?.email}</span>
              </div>
              {hostelData?.CalendarYear?.[0]?.isActive && (
                <div className="flex items-center gap-2 md:col-span-2">
                  <Calendar size={18} />
                  <span>Academic Year: {hostelData.CalendarYear[0].name}</span>
                </div>
              )}
            </div>
            <span>
                
             <p className="text-gray-600 mb-4">{hostelData?.description}</p>

            </span>
          </div>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg"
        >
          <Filter size={24} />
        </Button>
      </div>

      {/* Sheet Filter */}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
          <div className="bg-gray-50 h-full">
            <div className="p-4 flex items-center gap-2 border-b">
              <Filter size={18} />
              <h3 className="text-lg font-medium">Filter</h3>
            </div>

            <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)]">
              <div>
                <h4 className="text-gray-500 mb-2">Gender</h4>
                {["Male", "Female", "Mix"].map((g) => (
                  <div key={g} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={gender === g.toUpperCase()}
                      onChange={() =>
                        setGender(gender === g.toUpperCase() ? "" : g.toUpperCase())
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label className="ml-2 text-sm">{g}</label>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="text-gray-500 mb-2">Price</h4>
                {priceRanges.map((range) => (
                  <div key={range.label} className="flex items-center">
                    <input
                      type="radio"
                      name="price-range"
                      checked={
                        priceRange[0] === range.min && priceRange[1] === range.max
                      }
                      onChange={() => setPriceRange([range.min, range.max])}
                      className="h-4 w-4"
                    />
                    <label className="ml-2 text-sm">{range.label}</label>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="text-gray-500 mb-2">Room Type</h4>
                {["Single", "Double", "Quad", "Suite"].map((type) => (
                  <div key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={roomType === type.toUpperCase()}
                      onChange={() =>
                        setRoomType(
                          roomType === type.toUpperCase() ? "" : type.toUpperCase()
                        )
                      }
                      className="h-4 w-4"
                    />
                    <label className="ml-2 text-sm">{type}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t bg-white flex justify-between gap-4">
              <Button variant="outline" onClick={resetFilters} className="flex-1">
                Reset
              </Button>
              <Button onClick={() => setIsFilterOpen(false)} className="flex-1">
                Apply
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="hidden md:flex justify-between items-center mb-6">
        <Button variant="outline" onClick={() => setIsFilterOpen(!isFilterOpen)}>
          <Filter size={16} className="mr-2" />
          Filter
        </Button>
        <span className="text-gray-500">
          {filteredRooms.length} room{filteredRooms.length !== 1 ? "s" : ""} found
        </span>
      </div>
      
      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms?.map((room: Room) => (
          <Card
            key={room.id}
            className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <CardHeader className="pb-2 border-b bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl font-bold">
                    Room {room.number}
                  </CardTitle>
                  <p className="text-xs text-gray-500">
                    Block {room.block} · Floor {room.floor}
                  </p>
                </div>
                <Badge
                  className={`${getStatusColor(room.status)} px-2 py-1 text-xs font-medium rounded-md`}
                >
                  {room.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-xs text-gray-500 mb-1">Type</p>
                    <p className="font-semibold">
                      {room.type.charAt(0) + room.type.slice(1).toLowerCase()}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-xs text-gray-500 mb-1">Gender</p>
                    <p className="font-semibold">
                      {room.gender.charAt(0) + room.gender.slice(1).toLowerCase()}
                    </p>
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
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full flex justify-between items-center p-0 m-0">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Price</p>
                  <p className="font-semibold">GHS {room.price}</p>
                </div>
                <Button 
                onClick={()=>handleRoomClick(room)}
                >Book Now</Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FindRoom;
