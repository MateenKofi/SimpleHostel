import { useState } from 'react';
import { Trash2, SmartphoneCharging, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Payment = () => {
  const residentId = localStorage.getItem('resident_id');

  // Dummy data
  const selectedRoom = {
    roomNumber: '101',
    basePrice: 500.0,
  };
  const verificationCode = 'ABC123';

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'momo' | null>(null);
  const [isPartialPayment, setIsPartialPayment] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      toast.success('Payment successful!');
    }, 2000);
  };

  const removeSelectedRoom = () => {
    console.log('Room removed');
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
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
              <p className="text-sm font-medium">Room: {selectedRoom.roomNumber}</p>
              <p className="text-sm font-medium">
                Price: ₵{isPartialPayment ? (selectedRoom.basePrice * 0.7).toFixed(2) : selectedRoom.basePrice.toFixed(2)}
              </p>
              {/* Remove Room Button */}
              <div>
                <button
                  onClick={removeSelectedRoom}
                  className="text-red-500 rounded-md px-2 py-1 bg-red-500/10 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove Room</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* 70% Payment Option */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="partialPayment"
            checked={isPartialPayment}
            onChange={() => setIsPartialPayment(!isPartialPayment)}
            className="h-4 w-4 text-primary border-gray-300 rounded"
          />
          <label htmlFor="partialPayment" className="text-sm font-medium">
            Pay 70% now
          </label>
        </div>

        {/* Payment Method Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Select Payment Method</label>
          <div className="flex gap-4">
            <button
              className={`p-8 border rounded-md flex justify-center items-center gap-2 ${
                paymentMethod === 'momo' ? 'bg-primary text-white' : ''
              }`}
              onClick={() => setPaymentMethod('momo')}
            >
              <SmartphoneCharging size={40} />
              <span className="text-3xl font-semibold">MoMo</span>
            </button>
          </div>
        </div>

        {/* MoMo Phone Number Field */}
        {paymentMethod === 'momo' && (
          <div>
            <label className="block text-sm font-medium mb-2">MoMo Phone Number</label>
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

      {/* Payment Button */}
      <div className="mt-4">
        <button
          className="w-full px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
          onClick={handlePayment}
          disabled={!selectedRoom || !paymentMethod || isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Make Payment'}
        </button>
      </div>

      {/* Success Modal */}
      {isSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
            <p className="text-gray-600">Room has been assigned successfully.</p>
            {verificationCode && (
              <p className="text-gray-600 mt-2">
                Your verification code is: <strong>{verificationCode}</strong>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
