import React, { useState } from 'react';
import { Room } from '../../../types/room';
import { useRoomStore } from '../../../stores/roomStore';
import { Check, Banknote, Phone } from 'lucide-react';

interface RoomAssignmentProps {
  residentId: string;
  onComplete: () => void;
}

const RoomAssignment: React.FC<RoomAssignmentProps> = ({ residentId, onComplete }) => {
  const [residentData, setResidentData] = useState({
    name: '',
    email: '',
    phone: '',
    studentId: ''
  });
  const [step, setStep] = useState<'resident' | 'room' | 'payment' | 'confirmation'>('resident');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed'>('pending');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'momo' | null>(null);
  const [momoNumber, setMomoNumber] = useState('');

  const rooms = useRoomStore(state => state.rooms);
  const availableRooms = rooms.filter(room => room.status === 'Available');

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
    setStep('payment');
  };

  const handlePayment = async (method: 'cash' | 'momo', momoNumber?: string) => {
    setPaymentStatus('processing');
    try {
      // Your payment processing logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPaymentStatus('completed');
      setStep('confirmation');
    } catch (error) {
      setPaymentStatus('pending');
      // Handle error
    }
  };

  const renderRoomSelection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select a Room</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableRooms.map((room) => (
          <div
            key={room.id}
            className={`p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors
              ${selectedRoom?.id === room.id ? 'border-primary' : 'border-gray-200'}`}
            onClick={() => handleRoomSelect(room)}
          >
            <h4 className="font-semibold">Room {room.number}</h4>
            <p className="text-sm text-gray-600">Block {room.block}</p>
            <p className="text-sm text-gray-600">{room.type}</p>
            <p className="mt-2 font-semibold">${room.basePrice}/month</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPayment = () => {
    return (
      <div className="max-w-md mx-auto space-y-6">
        <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            className={`p-4 border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors
              ${paymentMethod === 'cash' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
            onClick={() => setPaymentMethod('cash')}
          >
            <Banknote className="w-6 h-6" />
            <span>Cash</span>
          </button>

          <button
            className={`p-4 border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors
              ${paymentMethod === 'momo' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
            onClick={() => setPaymentMethod('momo')}
          >
            <Phone className="w-6 h-6" />
            <span>Mobile Money</span>
          </button>
        </div>

        {paymentMethod === 'momo' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Mobile Money Number</label>
            <div className="relative">
              <input
                type="tel"
                className="w-full p-2 border rounded pl-10"
                placeholder="Enter MoMo number"
                value={momoNumber}
                onChange={(e) => setMomoNumber(e.target.value)}
              />
              <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        )}

        <div className="pt-4">
          <button
            className="w-full py-2 bg-primary text-white rounded-md disabled:opacity-50"
            disabled={!paymentMethod || (paymentMethod === 'momo' && !momoNumber)}
            onClick={() => handlePayment(paymentMethod, momoNumber)}
          >
            Proceed with Payment
          </button>
        </div>
      </div>
    );
  };

  const renderResidentForm = () => (
    <div className="max-w-md mx-auto space-y-6">
      <h3 className="text-lg font-semibold">Resident Information</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={residentData.name}
            onChange={(e) => setResidentData({...residentData, name: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded"
            value={residentData.email}
            onChange={(e) => setResidentData({...residentData, email: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input
            type="tel"
            className="w-full p-2 border rounded"
            value={residentData.phone}
            onChange={(e) => setResidentData({...residentData, phone: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Student ID</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={residentData.studentId}
            onChange={(e) => setResidentData({...residentData, studentId: e.target.value})}
          />
        </div>
        <button
          className="w-full py-2 bg-primary text-white rounded-md"
          onClick={() => setStep('payment')}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="max-w-md mx-auto text-center space-y-4">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <Check className="w-8 h-8 text-green-500" />
      </div>
      <h3 className="text-xl font-semibold">Room Assignment Successful!</h3>
      <p className="text-gray-600">
        You have been assigned to Room {selectedRoom?.number}. 
        Your payment has been processed successfully.
      </p>
      <button
        className="px-6 py-2 bg-primary text-white rounded-md"
        onClick={onComplete}
      >
        Done
      </button>
    </div>
  );

  return (
    <div className="p-6">
      {/* Progress Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center 
            ${step === 'resident' ? 'bg-primary text-white' : 'bg-gray-200'}`}>
            1
          </div>
          <div className="w-16 h-1 bg-gray-200" />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center
            ${step === 'room' ? 'bg-primary text-white' : 'bg-gray-200'}`}>
            2
          </div>
          <div className="w-16 h-1 bg-gray-200" />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center
            ${step === 'payment' ? 'bg-primary text-white' : 'bg-gray-200'}`}>
            3
          </div>
          <div className="w-16 h-1 bg-gray-200" />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center
            ${step === 'confirmation' ? 'bg-primary text-white' : 'bg-gray-200'}`}>
            4
          </div>
        </div>
      </div>

      {step === 'resident' && (
        <div>
          {renderResidentForm()}
          <button 
            className="w-full mt-4 py-2 bg-primary text-white rounded-md"
            onClick={() => setStep('room')}
          >
            Continue to Room Selection
          </button>
        </div>
      )}
      {step === 'room' && renderRoomSelection()}
      {step === 'payment' && (
        <div>
          {renderPayment()}
          <div className="mt-4 text-sm text-gray-600">
            Selected Room: {selectedRoom?.number} - ${selectedRoom?.price}
          </div>
        </div>
      )}
      {step === 'confirmation' && renderConfirmation()}
    </div>
  );
};

export default RoomAssignment; 