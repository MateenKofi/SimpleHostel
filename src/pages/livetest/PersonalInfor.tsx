import React from 'react'

const PersonalInfor = () => {
  return (
    <div className='flex flex-col gap-4 m-6'>
        <div>
            <h1 className='text-5xl font-bold'>Personal Info</h1>
            <p className='text-gray-500'>Please provide your name, email address, and phone number</p>
        </div>
        <form action="" className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
                <label htmlFor="name">Name</label>
                <input type="text" id='name' className='border-2 border-gray-300 rounded-md p-2' />
            </div>
            <div className='flex flex-col gap-2'>
                <label htmlFor="email">Email</label>
                <input type="email" id='email' className='border-2 border-gray-300 rounded-md p-2' />
            </div>
            <div className='flex flex-col gap-2'>
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id='phone' className='border-2 border-gray-300 rounded-md p-2' />
            </div>
            <div className='w-full flex justify-end items-center'>
                <button className='bg-blue-700 text-white p-2 rounded-md'>Next Step</button>
            </div>
        </form>
    </div>
  )
}

export default PersonalInfor