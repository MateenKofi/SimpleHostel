import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStaffStore } from '../../../stores/staffStore';

const AddStaff: React.FC = () => {
  const navigate = useNavigate();
  const { addStaff } = useStaffStore();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    addStaff({
      id: Date.now().toString(),
      firstName: formData.get('firstName') as string,
      middleName: formData.get('middleName') as string,
      lastName: formData.get('lastName') as string,
      dateOfBirth: formData.get('dateOfBirth') as string,
      nationality: formData.get('nationality') as string,
      gender: formData.get('gender') as string,
      religion: formData.get('religion') as string,
      maritalStatus: formData.get('maritalStatus') as string,
      staffStatus: formData.get('staffStatus') as "Active" | "Inactive",
      phoneNumber: formData.get('phoneNumber') as string,
      email: formData.get('email') as string,
      residence: formData.get('residence') as string,
      qualification: formData.get('qualification') as string,
      staffType: formData.get('staffType') as string,
      dateOfAppointment: formData.get('dateOfAppointment') as string,
    });
    
    navigate('/dashboard/staff-management');
  };

  return (
   <div className='w-full h-screen flex justify-cente'>
 <div className="w-[90%] ">
      <div className="flex items-center justify-between mb-6 mt-6 bg-white p-4 rounded-lg">
        <h1 className="text-2xl font-bold">Add Staff</h1>
        <button 
          onClick={() => navigate('/staff-management')}
          className="px-4 py-2 bg-gray-200 rounded-md"
        >
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-6  p-6  rounded-lg shadow-sm bg-white">
        <div className="mb-6">
          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-primary file:text-white
              hover:file:bg-primary/80"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              required
              className="w-full p-2 border rounded-md"
              placeholder="Enter your first name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Middle Name</label>
            <input
              type="text"
              name="middleName"
              className="w-full p-2 border rounded-md"
              placeholder="Enter your middle name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              required
              className="w-full p-2 border rounded-md"
              placeholder="Enter your last name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nationality</label>
            <select name="nationality" required className="w-full p-2 border rounded-md">
              <option value="">Select Nationality</option>
              <option value="Filipino">Filipino</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select name="gender" required className="w-full p-2 border rounded-md">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Religion</label>
            <select name="religion" required className="w-full p-2 border rounded-md">
              <option value="">Select Religion</option>
              <option value="Catholic">Catholic</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Marital Status</label>
            <select name="maritalStatus" required className="w-full p-2 border rounded-md">
              <option value="">Select Marital Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Staff Status</label>
            <select name="staffStatus" required className="w-full p-2 border rounded-md">
              <option value="">Select Staff Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Contact Details */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Contact Details</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                className="w-full p-2 border rounded-md"
                placeholder="Enter Phone Number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                className="w-full p-2 border rounded-md"
                placeholder="someone@something.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Residence</label>
              <input
                type="text"
                name="residence"
                className="w-full p-2 border rounded-md"
                placeholder="Enter Residence"
              />
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Job Details</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Qualification</label>
              <select name="qualification" className="w-full p-2 border rounded-md">
                <option value="">--Select Qualification--</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Staff Type</label>
              <select name="staffType" className="w-full p-2 border rounded-md">
                <option value="">Select Staff Type</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date of Appointment</label>
              <input
                type="date"
                name="dateOfAppointment"
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
   </div>
  );
};

export default AddStaff;