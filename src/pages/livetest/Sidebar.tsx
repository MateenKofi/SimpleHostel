import React from 'react'

const Sidebar = () => {
  return (
    <div className='bg-[url("./bg-sidebar-desktop.svg")] bg-cover bg-center m-4 rounded-lg p-6 h-4/5'>
        <div className='flex flex-col gap-4'>
          <div className='flex gap-4 items-center'>
            <span className='bg-white rounded-full p-2'>1</span>
            <div className='flex flex-col'>
                <span className='text-white'>Step 1</span>
                <span className='text-white'>Your Info</span>
            </div>
          </div>
          <div className='flex gap-4 items-center'>
            <span className='bg-white rounded-full p-2'>2</span>
            <div className='flex flex-col'>
                <span className='text-white'>Step 2</span>
                <span className='text-white'>select plan</span>
            </div>
          </div>
          <div className='flex gap-4 items-center'>
            <span className='bg-white rounded-full p-2'>3</span>
            <div className='flex flex-col'>
                <span className='text-white'>Step 3</span>
                <span className='text-white'>Add-ons</span>
            </div>
          </div>
          <div className='flex gap-4 items-center'>
            <span className='bg-white rounded-full p-2'>4</span>
            <div className='flex flex-col'>
                <span className='text-white'>Step 4</span>
                <span className='text-white'>Summary</span>
            </div>
          </div>
          
        </div>
    </div>
  )
}

export default Sidebar