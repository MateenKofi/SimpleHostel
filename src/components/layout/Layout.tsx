import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';


const Layout = () => {
  return (
    <div className="flex w-full max-h-screen  items-start overflow-y-hidden ">
    <Sidebar />
    <div className='w-full '>
      {' '}
      {/* <NavBar /> */}
      <div className='max-h-screen overflow-y-auto'>
      <Outlet />
      </div>
    </div>
  </div>
  );
};

export default Layout; 