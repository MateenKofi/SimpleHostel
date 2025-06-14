import { useMemo } from "react";
import {
  Bed,
  HomeIcon as House,
  ShieldPlus,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RoomAssignmentLoader from "../../loaders/RoomAssignmentLoader";
import { Room } from "../../../helper/types/types";
import CustomeRefetch from "@/components/CustomeRefetch";
import { useQuery } from "@tanstack/react-query";
import { useSelectedRoomStore } from "@/controllers/SelectedRoomStore";
import ImageSlider from "@/components/ImageSlider";

const RoomAssignment = () => {
  const navigate = useNavigate();
  const setRoom = useSelectedRoomStore((state)=> state.setRoom)

  const hostelId = localStorage.getItem("hostelId") || "";
  // Function to handle image navigation


  // Fetch rooms data
  const { data:Rooms, isLoading, isError, refetch:refetchRooms } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const response = await axios.get(`/api/rooms/get/hostel/${hostelId}`);
      return response.data.data;
    },
    enabled:!!hostelId
  });

  const handleBookRoom = (room:Room) =>{
      setRoom(room)
      setTimeout(()=>{
        navigate('/dashboard/payment')
      },50)
  }

  // Transform the API data to match the Room interface and filter available rooms
  const availableRooms = useMemo(() => {
      const rooms = Rooms?.rooms || [];
      return rooms.filter((room: Room) => room.status === "AVAILABLE");
    }, [Rooms?.rooms]);

  if (isLoading) return <RoomAssignmentLoader />;
  if (isError) return <CustomeRefetch refetch={refetchRooms}/>;

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">Room Assignment</h2>
        <p className="max-w-2xl font-thin text-gray-600">
          Select a room for the resident. The selected room will be reserved until payment is completed.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {availableRooms?.map((room:Room) => (
          <div
            key={room.id}
            className="overflow-hidden transition-all border rounded-lg cursor-pointer"
          >
            {/* Image Carousel */}
            <div className="relative w-full h-48">
             <ImageSlider
                    images={room?.RoomImage?.map((i) => i.imageUrl) ?? []}
                  />
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <h5 className="flex items-center gap-2 text-lg font-medium">
                  <House className="w-4 h-4" />
                  <span>{room.roomNumber}</span>
                </h5>
                <span className="flex items-center gap-2 px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
                  <ShieldPlus />
                  <span>
                    {room.currentResidentCount} / {room.maxCap} Occupants
                  </span>
                </span>
                <span className="font-semibold text-primary">
                  GH{room?.price?.toLocaleString()}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex gap-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1 px-2 py-1 text-gray-900 bg-gray-100 rounded-full shadow">
                    <Bed className="w-4 h-4" />
                    <div className="h-4/5 w-[0.2px] bg-gray-500 "></div>
                    <span>{room.maxOccupancy} Bed(s)</span>
                  </span>
                  <span className="flex items-center gap-1 px-2 py-1 text-gray-900 capitalize bg-gray-100 rounded-full shadow">
                    <User className="w-4 h-4" />
                    <div className="h-4/5 w-[0.2px] bg-gray-500 "></div>
                    <span>{room.gender}</span>
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {room?.amenities?.map((amenity, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs text-gray-900 bg-gray-100 rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-3">
                  <button
                  type="button"
                    className="flex items-center justify-center w-full px-4 py-2 text-base font-medium text-center text-white transition-all bg-black rounded-md hover:bg-gray-800"
                    onClick={
                      () => {
                        handleBookRoom(room);
                      }
                    }
                  >
                      Book Room
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomAssignment;