
import { useState } from 'react'
import { Menu, X, ChevronDown, BarChart3, BedDouble, BookOpenCheck, CalendarCheck, LayoutDashboard, List, Users, Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'

interface User {
  name: string
  email: string
}

interface HeaderProps {
  user?: User
}

const  Header = ({ user }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)

  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { title: 'Room Management', icon: BedDouble, path: '/room-management' },
    { title: 'Resident Management', icon: BookOpenCheck, path: '/resident-management' },
    { title: 'Deptors List', icon: List, path: '/deptors-list' },
    { title: 'Visitor Management', icon: CalendarCheck, path: '/visitor-management' },
    { title: 'Maintenance & Tracking', icon: Wrench, path: '/maintenance-and-tracking' },
    { title: 'Reports & Analytics', icon: BarChart3, path: '/report-and-analytics' },
    {
      title: 'Staff Management',
      icon: Users,
      path: '/staff-management',
    },
  ];

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
            <div className="mr-4 flex items-center sm:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
              <Link to="/" className="text-xl font-bold text-gray-800">
                Logo
              </Link>
            </div>
          </div>

         

          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 focus:outline-none"
              >
                <span>{user ? user.name : <div className="avatar online placeholder">
  <div className="bg-neutral text-neutral-content w-16 rounded-full">
    <span className="text-xl">AI</span>
  </div>
</div>}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  {user ? (
                    <>
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Profile
                      </Link>
                      <Link to="/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Logout
                      </Link>
                    </>
                  ) : (
                    <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Login
                    </Link>
                  )}
                </div>
              )}
            </div>

           
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
          {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="flex text-nowrap text-base font-body items-center px-4 py-2 my-2 text-text hover:bg-black rounded-lg hover:rounded-lg hover:text-background transition-colors duration-200"
          >
            <item.icon size={25} />
            <span className="ml-3 text-lg">{item.title}</span>
          </Link>
        ))}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
