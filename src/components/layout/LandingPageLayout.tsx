import { Header } from '@/pages/landing-page/component/header'
import React from 'react'
import { Outlet } from 'react-router-dom'

const LandingPageLayout = () => {
  return (
    <div className=" bg-gray-100 w-full ">
        <Header />
      <Outlet />
  </div>
  )
}

export default LandingPageLayout
