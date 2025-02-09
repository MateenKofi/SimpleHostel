import { ChevronLeft } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Resident } from '../../types/types';

interface VerificationForm {
  verificationCode: string;
}

const RoomVerification = () => {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<VerificationForm>();

  const onSubmit = (data: VerificationForm) => {
   
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

     
    </div>
  );
};

export default RoomVerification;