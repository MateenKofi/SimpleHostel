import React from 'react'
import Sidebar from './Sidebar'
import PersonalInfor from './PersonalInfor'

const Test = () => {
  return (
    <div className='bg-blue-100 w-full h-[100dvh] grid place-items-center'>
       <div className='bg-white w-3/4 h-2/3 flex gap-4 rounded-lg h-fit'>
       <div className='w-1/3 h-full'>
            <Sidebar/>
        </div>
        <div className='w-2/3 h-full'>
            <PersonalInfor/>
        </div>
       </div>
    </div>
  )
}

export default Test