
import RoomAssignment from './online-room-assignment/RoomAssignment';
import Payment from './online-room-assignment/Payment'

const RoomBooking = () => {
  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Room Booking</h1>
      <div className="w-full grid lg:grid-cols-[2fr_1fr] gap-6">
                {/* Left Column - Room Assignment */}
                <RoomAssignment />
                {/* Right Column - Payment Details */}
                <Payment />
            </div>
    </div>
  );
};

export default RoomBooking;