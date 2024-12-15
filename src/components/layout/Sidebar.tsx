import  { useState } from 'react';
import {
  LayoutDashboard,
  Menu,
  X,
  LogOut,
  BookOpenCheck,
  CalendarCheck,
  BedDouble,
  Wrench,
  BarChart3,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { title: 'Room Management', icon: BedDouble, path: '/room-management' },
    { title: 'Resident Management', icon: BookOpenCheck, path: '/resident-management' },
    { title: 'Visitor Management', icon: CalendarCheck, path: '/visitor-management' },
    { title: 'Maintenance & Tracking', icon: Wrench, path: '/maintenance-and-tracking' },
    { title: 'Reports & Analytics', icon: BarChart3, path: '/analytics' },
    {
      title: 'Staff Management',
      icon: Users,
      path: '/staff-management',
    },
  ];

  return (
    <div
      className={`min-h-screen bg-white text-text transition-all duration-300 ease-in-out relative px-2 mr-16 ${
        isExpanded ? 'w-80' : 'w-20'
      }`}
    >
       {/* Toggle Button */}
       <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute right-0 top-3 transform translate-x-1/2 bg-black p-2 rounded-full border-l-2 "
      >
        {isExpanded ? (
          <X size={20} className="text-background" />
        ) : (
          <Menu size={20} className="text-background" />
        )}
      </button>
      {/* Logo Section */}
      <div className="p-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span className="text-xl font-bold text-background">H</span>
          </div>
          {isExpanded && (
            <span className="ml-3 text-xl font-heading font-bold">SimpleHostel</span>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <nav className="mt-4">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="flex text-nowrap text-base font-body items-center px-4 py-2 my-2 text-text hover:bg-black rounded-lg hover:rounded-lg hover:text-background transition-colors duration-200"
          >
            <item.icon size={25} />
            {isExpanded && <span className="ml-3 text-lg">{item.title}</span>}
          </Link>
        ))}
      </nav>

      {/* Logout Section */}
      <div className="absolute bottom-4 w-full pr-4">
        <button
          onClick={() => {}}
          className="flex items-center px-4 py-2 w-full text-text hover:bg-primary hover:text-background hover:rounded-lg transition-colors duration-200 font-body"
        >
          <LogOut size={20} />
          {isExpanded && <span className="ml-3 text-lg">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;