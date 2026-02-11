import React from 'react'
import { Outlet } from 'react-router-dom'

const BookingLayout = () => {
  return (
    <div className='w-full'>
        <Outlet />
    </div>
  )
}

export default BookingLayout