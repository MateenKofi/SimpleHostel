import { useRoomStore } from '@stores/roomStore';
import { Bed, House } from 'lucide-react';

const RoomAssignment = () => {


  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-xl font-semibold mb-4">Room Assignment</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms?.map(room => (
          <div 
            key={room.id}
            className={`border rounded-lg p-4 hover:border-primary cursor-pointer transition-all ${
              selectedRoom?.id === room.id ? 'border-primary border-2' : ''
            }`}
            onClick={() => setSelectedRoom(room)}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h5 className="text-lg font-medium flex items-center gap-2">
                  <House className="w-4 h-4" /> 
                  <span>{room.roomNumber}</span>
                </h5>
              </div>
              <span className="text-primary font-semibold">
                GH{room?.basePrice?.toLocaleString()}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex gap-2 text-gray-600 text-sm">
                <Bed className="w-4 h-4" />
                <span>{room?.maxOccupancy} Beds</span>
              </div>
              
              {/* Amenities */}
              <div className="flex flex-wrap gap-2">
                {room.amenities.map((amenity: string, index: number) => (
                  <span 
                    key={index}
                    className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
              </div>

              {/* Status indicator */}
              <div className="flex justify-between items-center mt-3">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  room.isAvailable 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {room.isAvailable ? 'Available' : 'Occupied'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomAssignment;