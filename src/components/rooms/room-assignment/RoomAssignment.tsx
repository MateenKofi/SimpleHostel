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
import { axiosConfig } from "../../../helper/axiosConfig";
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
      const response = await axios.get(`/api/rooms/hostel/${hostelId}`, axiosConfig);
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
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">Room Assignment</h2>
        <p className="text-gray-600 font-thin max-w-2xl">
          Select a room for the resident. The selected room will be reserved until payment is completed.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableRooms?.map((room:Room) => (
          <div
            key={room.id}
            className="border rounded-lg overflow-hidden cursor-pointer transition-all"
          >
            {/* Image Carousel */}
            <div className="relative h-48 w-full">
             <ImageSlider
                    images={room?.RoomImage?.map((i) => i.imageUrl) ?? []}
                  />
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <h5 className="text-lg font-medium flex items-center gap-2">
                  <House className="w-4 h-4" />
                  <span>{room.roomNumber}</span>
                </h5>
                <span className="flex gap-2 items-center bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  <ShieldPlus />
                  <span>
                    {room.currentResidentCount} / {room.maxCap} Occupants
                  </span>
                </span>
                <span className="text-primary font-semibold">
                  GH{room?.price?.toLocaleString()}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex gap-2 text-gray-600 text-sm">
                  <span className="flex items-center gap-1 bg-gray-100 text-gray-900 px-2 py-1 rounded-full shadow">
                    <Bed className="w-4 h-4" />
                    <div className="h-4/5 w-[0.2px] bg-gray-500 "></div>
                    <span>{room.maxOccupancy} Bed(s)</span>
                  </span>
                  <span className="flex items-center gap-1 bg-gray-100 text-gray-900 px-2 py-1 rounded-full shadow capitalize">
                    <User className="w-4 h-4" />
                    <div className="h-4/5 w-[0.2px] bg-gray-500 "></div>
                    <span>{room.gender}</span>
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {room?.amenities?.map((amenity, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-900"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-3">
                  <button
                  type="button"
                    className="w-full flex justify-center items-center text-base font-medium text-center bg-black text-white rounded-md px-4 py-2 hover:bg-gray-800 transition-all"
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