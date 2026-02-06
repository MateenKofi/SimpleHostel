import Rooms from "@/components/rooms/Rooms";
import SEOHelmet from "@/components/SEOHelmet";
import { Building } from "lucide-react";

const RoomManagement = () => {
  return (
    <div className="p-6 bg-white">
      <SEOHelmet
        title="Room Management - Fuse"
        description="Manage your hostel rooms and amenities efficiently with our user-friendly interface."
        keywords="room management, hostel, amenities, Fuse"
      />
      <div className="flex justify-between items-center mb-6 bg-white">
        <div className="flex items-center gap-2">
          <Building className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Room Management</h1>
        </div>
      </div>
      <Rooms/>
    </div>
  );
};

export default RoomManagement;
