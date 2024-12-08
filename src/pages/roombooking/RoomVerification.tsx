import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const RoomVerification = () => {
  const [enteredCode, setEnteredCode] = useState('');

  const handleVerify = () => {
    // Mock verification code for demonstration
    const verificationCode = '123456';

    if (verificationCode === enteredCode) {
      toast.success('Room allocation verified successfully!');
      // Update room and resident status to verified
    } else {
      toast.error('Invalid verification code');
    }
  };

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Room Verification</h1>
      <input
        type="text"
        value={enteredCode}
        onChange={(e) => setEnteredCode(e.target.value)}
        placeholder="Enter Verification Code"
        className="border rounded-md p-2"
      />
      <button onClick={handleVerify} className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md">
        Verify
      </button>
    </div>
  );
};

export default RoomVerification;