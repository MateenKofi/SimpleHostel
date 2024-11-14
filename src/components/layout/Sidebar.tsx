import  { useState } from 'react';
import {
  LayoutDashboard,
  Menu,
  X,

  LogOut,
  BookOpenCheck,
  BedDouble,
  CalendarCheck,
  CreditCard,
  Wrench,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { title: 'Semester Management', icon: LayoutDashboard, path: '/semester-management' },
    { title: 'Resident Management', icon: BookOpenCheck, path: '/resident-management' },
    { title: 'Room & Occupancy', icon: BedDouble, path: '/rooms' },
    { title: 'Check-in & Check-out', icon: CalendarCheck, path: '/check-in-out' },
    { title: 'Visitor Management', icon: CalendarCheck, path: '/visitor-management' },
    { title: 'Payment & Billing', icon: CreditCard, path: '/payments' },
    { title: 'Maintenance & Tracking', icon: Wrench, path: '/maintenance' },
    { title: 'Reports & Analytics', icon: BarChart3, path: '/analytics' },
    { title: 'Test', icon: BarChart3, path: '/test' },

  ];

  return (
    <div
      className={`min-h-screen bg-background text-text transition-all duration-300 ease-in-out relative px-2 mr-16 ${
        isExpanded ? 'w-80' : 'w-20'
      }`}
    >
       {/* Toggle Button */}
       <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute right-0 top-3 transform translate-x-1/2 bg-primary p-2 rounded-full border-l-2 border-accent"
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
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
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
            className="flex text-nowrap text-base font-body items-center px-4 py-2 my-2 text-text hover:bg-secondary hover:rounded-lg hover:text-background transition-colors duration-200"
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
          className="flex items-center px-4 py-2 w-full text-text hover:bg-secondary hover:text-background hover:rounded-lg transition-colors duration-200 font-body"
        >
          <LogOut size={20} />
          {isExpanded && <span className="ml-3 text-lg">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;