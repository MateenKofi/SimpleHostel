import { ChevronLeft } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useResidentStore } from '../../stores/residentStore';
import { Resident } from '../../types/types';

interface VerificationForm {
  verificationCode: string;
}

const RoomVerification = () => {
  const navigate = useNavigate();
  const [resident, setResident] = useState<Resident | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<VerificationForm>();

  const residents = useResidentStore(state => state.residents);

  const onSubmit = (data: VerificationForm) => {
    const matchedResident = residents.find(resident => resident.verificationCode === data.verificationCode);

    if (matchedResident) {
      toast.success('Room allocation verified successfully!');
      setResident(matchedResident);
    } else {
      toast.error('Invalid verification code');
      setResident(null);
    }
  };

  return (
    <div className="p-6 bg-gray-100">
      <div className='w-full flex justify-between items-start'>
        <h1 className="text-2xl font-bold mb-4">Room Verification</h1>
        <button
          className='flex gap-2 items-center bg-primary px-4 py-2 text-white rounded-md'
          onClick={() => {
            navigate('/resident-management')
          }}>
          <ChevronLeft />
          <span>
            Back
          </span>
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input
          {...register('verificationCode', { required: 'Verification code is required' })}
          type="text"
          placeholder="Enter Verification Code"
          className="border rounded-md p-2"
        />
        {errors.verificationCode && (
          <span className="text-red-500 text-sm">{errors.verificationCode.message}</span>
        )}
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
          Verify
        </button>
      </form>

      {resident && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Resident Information</h2>
          <p><strong>Full Name:</strong> {resident.fullName}</p>
          <p><strong>Student ID:</strong> {resident.studentId}</p>
          <p><strong>Email:</strong> {resident.email}</p>
          <p><strong>Phone:</strong> {resident.phone}</p>
          <p><strong>Course:</strong> {resident.course}</p>
          <p><strong>Emergency Contact Name:</strong> {resident.emergencyContactName}</p>
          <p><strong>Emergency Contact Phone:</strong> {resident.emergencyContactPhone}</p>
          <p><strong>Emergency Contact Relation:</strong> {resident.emergencyContactRelation}</p>
          <p><strong>Status:</strong> {resident.status}</p>
          <p><strong>Room Number:</strong> {resident.roomNumber}</p>
          <p><strong>Payment Method:</strong> {resident.paymentMethod}</p>
        </div>
      )}
    </div>
  );
};

export default RoomVerification;