import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Edit, ImageUp, Trash, Loader } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import dayjs from 'dayjs';

type StaffForm = {
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: string;
  dateOfBirth: string;
  nationality: string;
  maritalStatus: string;
  religion: string;
  ghanaCardNumber: string;
  phoneNumber: string;
  email: string;
  residence: string;
  qualification: string;
  role: string;
  block: string;
  dateOfAppointment: string;
};

const EditStaff: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const hostelId = localStorage.getItem('hostelId');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<StaffForm>();

  // Fetch staff details for the given id
  const { data: staff_details, isLoading: detailsLoading, isError } = useQuery({
    queryKey: ['staff_details', id],
    queryFn: async () => {
      const response = await axios.get(`/api/staffs/get/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data.data;
    },
  });

  // Populate form fields using setValue when staff_details are fetched
  useEffect(() => {
    if (staff_details) {
      setValue('firstName', staff_details.firstName);
      setValue('middleName', staff_details.middleName || '');
      setValue('lastName', staff_details.lastName);
      // Using uppercase values to match the select option values below
      setValue('gender', staff_details.gender);
      setValue('dateOfBirth', dayjs(staff_details.dateOfBirth).format('YYYY-MM-DD'));
      setValue('nationality', staff_details.nationality);
      setValue('maritalStatus', staff_details.maritalStatus);
      setValue('religion', staff_details.religion);
      setValue('ghanaCardNumber', staff_details.ghanaCardNumber);
      setValue('phoneNumber', staff_details.phoneNumber);
      setValue('email', staff_details.email);
      setValue('residence', staff_details.residence);
      setValue('qualification', staff_details.qualification);
      setValue('role', staff_details.role);
      setValue('block', staff_details.block);
      setValue('dateOfAppointment', dayjs(staff_details.dateOfAppointment).format('YYYY-MM-DD'));
      
      // Use passportUrl for the image preview
      if (staff_details.passportUrl) {
        setImage(staff_details.passportUrl);
      }
    }
  }, [staff_details, setValue]);

  // Handle image upload for preview and file state
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  // Mutation for editing staff details
  const EditStaffMutation = useMutation({
    mutationFn: async (data: StaffForm) => {
      try {
        const formData = new FormData();
        formData.append('hostelId', hostelId || '');
        formData.append('maritalStatus', data.maritalStatus);
        formData.append('religion', data.religion);
        formData.append('gender', data.gender);
        formData.append('nationality', data.nationality);
        formData.append('dateOfBirth', data.dateOfBirth);
        formData.append('lastName', data.lastName);
        formData.append('middleName', data.middleName || '');
        formData.append('firstName', data.firstName);
        formData.append('ghanaCardNumber', data.ghanaCardNumber);
        formData.append('phoneNumber', data.phoneNumber);
        formData.append('email', data.email);
        formData.append('residence', data.residence);
        formData.append('qualification', data.qualification);
        formData.append('role', data.role);
        formData.append('block', data.block);
        formData.append('dateOfAppointment', data.dateOfAppointment);
        
        if (imageFile) {
          formData.append('photo', imageFile);
        }

        const response = await axios.put(`/api/staffs/update/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        return response.data;
      } catch (error) {
        console.error('Error in mutation', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff_details'] });
      toast.success('Staff updated successfully');
      reset();
      navigate(-1);
    },
    onError: (error: unknown) => {
      console.error('Mutation error:', error);
      let errorMessage = 'Failed to update staff';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || 'Failed to update staff';
      } else {
        errorMessage = (error as Error).message || 'Failed to update staff';
      }
      toast.error(errorMessage);
    },
  });

  // Submit handler to format dates and call mutation
  const onSubmit = (data: StaffForm) => {
    const dateOfBirthValid = dayjs(data.dateOfBirth, 'YYYY-MM-DD', true).isValid();
    const dateOfAppointmentValid = dayjs(data.dateOfAppointment, 'YYYY-MM-DD', true).isValid();

    if (!dateOfBirthValid || !dateOfAppointmentValid) {
      toast.error('Date of birth and Date of appointment must be in the format YYYY-MM-DD');
      return;
    }

    const formattedDOB = dayjs(data.dateOfBirth).format('YYYY-MM-DDTHH:mm:ss[Z]');
    const formattedDateOfAppointment = dayjs(data.dateOfAppointment).format('YYYY-MM-DDTHH:mm:ss[Z]');
    EditStaffMutation.mutate({ ...data, dateOfBirth: formattedDOB, dateOfAppointment: formattedDateOfAppointment });
  };

  if (detailsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    return <p>Error loading staff details.</p>;
  }

  return (
    <div className="w-full h-screen flex justify-center">
      <div className="w-[90%]">
        <div className="flex items-center justify-between mb-6 mt-6 bg-white p-4 rounded-lg">
          <h1 className="text-2xl font-bold">Edit Staff</h1>
          <button 
            onClick={() => navigate(-1)}
            className="flex gap-2 px-4 py-2 bg-black text-white rounded-md"
          >
            <ChevronLeft />
            <span>Back</span>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6 p-6 rounded-lg shadow-sm bg-white">
          {/* Image Upload Section */}
          <div className="w-52 h-52 overflow-hidden">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image
            </label>
            {image ? (
              <div className="w-full h-80 relative">
                <img
                  src={image}
                  alt="Staff"
                  className="object-cover w-full h-full rounded-md"
                />
                <div className="absolute top-2 right-2 space-x-2">
                  <button
                    type="button"
                    onClick={() => document.getElementById('imageUpload')?.click()}
                    title="Edit Image"
                    className="bg-white p-1 rounded-full"
                  >
                    <Edit className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setImageFile(null);
                    }}
                    title="Remove Image"
                    className="bg-white p-1 rounded-full"
                  >
                    <Trash className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer"
                onClick={() => document.getElementById('imageUpload')?.click()}
              >
                <ImageUp className="mx-auto h-12 w-12 text-gray-400" />
                <p>Click to upload image</p>
              </div>
            )}

            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              value={undefined}
            />
          </div>

          {/* Personal Details */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                {...register('firstName', { required: 'First name is required' })}
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <span className="text-red-500 text-sm">{errors.firstName.message?.toString()}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Middle Name</label>
              <input
                {...register('middleName')}
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Enter your middle name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                {...register('lastName', { required: 'Last name is required' })}
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <span className="text-red-500 text-sm">{errors.lastName.message?.toString()}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date of Birth</label>
              <input
                {...register('dateOfBirth', { required: 'Date of birth is required' })}
                type="date"
                className="w-full p-2 border rounded-md"
              />
              {errors.dateOfBirth && (
                <span className="text-red-500 text-sm">{errors.dateOfBirth.message?.toString()}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Nationality</label>
              <input
                type="text"
                {...register('nationality', { required: 'Nationality is required' })}
                className="w-full p-2 border rounded-md"
                placeholder="Enter Nationality"
              />
              {errors.nationality && (
                <span className="text-red-500 text-sm">{errors.nationality.message?.toString()}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                {...register('gender', { required: 'Gender is required' })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">-- Select Gender --</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
              {errors.gender && (
                <span className="text-red-500 text-sm">{errors.gender.message?.toString()}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Religion</label>
              <select
                {...register('religion', { required: 'Religion is required' })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">-- Select Religion --</option>
                <option value="CHRISTIAN">Christian</option>
                <option value="MUSLIM">Muslim</option>
                <option value="TRADITIONALIST">Traditionalist</option>
              </select>
              {errors.religion && (
                <span className="text-red-500 text-sm">{errors.religion.message?.toString()}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Marital Status</label>
              <select
                {...register('maritalStatus', { required: 'Marital status is required' })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">-- Select Marital Status --</option>
                <option value="SINGLE">Single</option>
                <option value="MARRIED">Married</option>
                <option value="DIVORCED">Divorced</option>
                <option value="WIDOWED">Widowed</option>
              </select>
              {errors.maritalStatus && (
                <span className="text-red-500 text-sm">{errors.maritalStatus.message?.toString()}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Ghana Card Number</label>
              <input
                type="text"
                {...register('ghanaCardNumber', { required: 'Ghana card number is required' })}
                className="w-full p-2 border rounded-md"
                placeholder="GHA-XXXX-XXXX-XXXX"
              />
              {errors.ghanaCardNumber && (
                <span className="text-red-500 text-sm">{errors.ghanaCardNumber.message?.toString()}</span>
              )}
            </div>
          </div>

          {/* Contact Details */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Contact Details</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  {...register('phoneNumber', { required: 'Phone number is required' })}
                  type="tel"
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter Phone Number"
                />
                {errors.phoneNumber && (
                  <span className="text-red-500 text-sm">{errors.phoneNumber.message?.toString()}</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  type="email"
                  className="w-full p-2 border rounded-md"
                  placeholder="someone@something.com"
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">{errors.email.message?.toString()}</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Residence</label>
                <input
                  {...register('residence', { required: 'Residence is required' })}
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter Residence"
                />
                {errors.residence && (
                  <span className="text-red-500 text-sm">{errors.residence.message?.toString()}</span>
                )}
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Job Details</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Qualification</label>
                <input
                  {...register('qualification', { required: 'Qualification is required' })}
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter Qualification"
                />
                {errors.qualification && (
                  <span className="text-red-500 text-sm">{errors.qualification.message?.toString()}</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Staff Type</label>
                <input
                  {...register('role', { required: 'Staff type is required' })}
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter Staff Type"
                />
                {errors.role && (
                  <span className="text-red-500 text-sm">{errors.role.message?.toString()}</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Block</label>
                <input
                  {...register('block', { required: 'Block is required' })}
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter Block"
                />
                {errors.block && (
                  <span className="text-red-500 text-sm">{errors.block.message?.toString()}</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date of Appointment</label>
                <input
                  {...register('dateOfAppointment', { required: 'Date of appointment is required' })}
                  type="date"
                  className="w-full p-2 border rounded-md"
                />
                {errors.dateOfAppointment && (
                  <span className="text-red-500 text-sm">{errors.dateOfAppointment.message?.toString()}</span>
                )}
              </div>
            </div>
          </div>

          <div>
            <button type="submit" className="px-4 py-2 bg-black text-white rounded-md">
              {EditStaffMutation.isPending ? <Loader className="animate-spin"/> : 'Submit Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStaff;
