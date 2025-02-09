import { useState } from 'react';
import { Trash2, Banknote, SmartphoneCharging, Check } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Payment = () => {
  const navigate = useNavigate();
const { residentId } = useParams<{ residentId: string }>();
console.log('residentId from manual payment', residentId);
  // const residentId = localStorage.getItem('resident_id');

  const {
    selectedRoom,
    removeSelectedRoom,
  } = useRoomStore();

  const { processPayment } = useResidentStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [verificationCode, setVerificationCode] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'momo' | null>(null);

  const handlePayment = async () => {
    if (!residentId || !selectedRoom || !paymentMethod) {
      toast.error('Please select a room and payment method first');
      return;
    }

    const verificationToken = uuidv4();
    setVerificationCode(verificationToken);

    setIsProcessing(true);
    try {
      const paymentAmount = 100; // Replace with the actual payment amount
      await processPayment(residentId!, paymentMethod, verificationToken, paymentAmount);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/resident-management');
        localStorage.removeItem('resident_id');
      }, 2000);
    } catch (error) {
      console.error('Payment failed:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
        <div className="space-y-4">
          {/* Display Room Details */}
          <div>
            {!selectedRoom ? (
              <div className="flex justify-center items-center py-10">
                <p className="text-sm font-medium">No room selected</p>
              </div>
            ) : (
              <>
                <p className="text-sm font-medium">
                  Room: {selectedRoom.roomNumber}
                </p>
                <p className="text-sm font-medium">
                  Price: ₵{selectedRoom.basePrice}
                </p>
                {/* Remove Room Button */}
                <div>
                  <button
                    onClick={removeSelectedRoom}
                    className="text-red-500 rounded-md px-4 py-2 bg-red-500/10 flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    <span>Remove Room</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Payment Method Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Payment Method
            </label>
            <div className="flex gap-4">
              <button
                className={`p-8 border rounded-md flex justify-center items-center gap-2 ${
                  paymentMethod === 'cash' ? 'bg-primary text-white' : ''
                }`}
                onClick={() => setPaymentMethod('cash')}>
                <Banknote size={40} />
                <span className="text-3xl font-semibold">Cash</span>
              </button>
              <button
                className={`p-8 border rounded-md flex justify-center items-center gap-2 ${
                  paymentMethod === 'momo' ? 'bg-primary text-white' : ''
                }`}
                onClick={() => setPaymentMethod('momo')}>
                <SmartphoneCharging size={40} />
                <span className="text-3xl font-semibold">MoMo</span>
              </button>
            </div>
          </div>

          {/* MoMo Phone Number Field */}
          {paymentMethod === 'momo' && (
            <div>
              <label className="block text-sm font-medium mb-2">
                MoMo Phone Number
              </label>
              <input
                type="tel"
                placeholder="Enter MoMo phone number"
                className="w-full p-2 border rounded-md"
                pattern="[0-9]{10}"
                maxLength={10}
              />
            </div>
          )}
        </div>
        <div className="mt-4">
          <button
            className="w-full px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
            onClick={handlePayment}
            disabled={!selectedRoom || !paymentMethod || isProcessing}>
            {isProcessing ? 'Processing...' : 'Make Payment'}
          </button>
        </div>
      </div>

      {isSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
            <p className="text-gray-600">
              Room has been assigned successfully.
            </p>
            {verificationCode && (
              <p className="text-gray-600 mt-2">Your verification code is: <strong>{verificationCode}</strong></p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;