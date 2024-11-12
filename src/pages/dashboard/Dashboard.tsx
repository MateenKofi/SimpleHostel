import React from 'react'
import { 
  PlusCircle, RefreshCw, Clipboard, AlertTriangle, ThumbsUp
} from 'lucide-react'
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
)

// Define the options separately for each chart type
const occupancyOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1000
  },
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        font: {
          family: 'Poppins',
          size: 12
        },
        color: '#060e12'
      }
    },
    title: {
      display: true,
      text: 'Occupancy by Room Type',
      font: {
        family: 'poppim',
        size: 16,
        weight: 'bold' as const
      },
      color: '#060e12'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        callback: (value: number) => `${value}%`,
        stepSize: 20
      }
    }
  }
};

const revenueOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1000
  },
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        font: {
          family: 'Poppins',
          size: 12
        },
        color: '#060e12'
      }
    },
    title: {
      display: true,
      text: 'Revenue Summary',
      font: {
        family: 'poppim',
        size: 16,
        weight: 'bold' as const
      },
      color: '#060e12'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value: number) => `$${value.toLocaleString()}`,
        stepSize: 5000
      }
    }
  }
};

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1000
  },
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        font: {
          family: 'Poppins',
          size: 12
        },
        color: '#060e12',
        padding: 20
      }
    }
  }
};

// Sample data for charts
const occupancyData = {
  labels: ['Single', 'Double', 'Triple', 'Quad'],
  datasets: [
    {
      label: 'Current Semester',
      data: [85, 92, 78, 88],
      backgroundColor: '#5099c5',
      barThickness: 30,
    },
    {
      label: 'Previous Semester',
      data: [80, 88, 75, 85],
      backgroundColor: '#8d98d9',
      barThickness: 30,
    },
  ],
}

const revenueData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Revenue',
      data: [12000, 19000, 15000, 17000, 22000, 24000],
      backgroundColor: '#716acd',
      barThickness: 40,
      borderRadius: 8,
    },
  ],
}

const popularAmenitiesData = {
  labels: ['Wi-Fi', 'Gym', 'Laundry', 'Study Room', 'Parking'],
  datasets: [
    {
      data: [300, 180, 250, 220, 150],
      backgroundColor: [
        '#5099c5',
        '#8d98d9',
        '#716acd',
        '#4a90e2',
        '#6c63ff',
      ],
    },
  ],
}

const Dashboard =()=> {
  return (
      <main className="flex-1 bg-gray-100 overflow-y-auto p-4">
        {/* Quick Access Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Room Availability</h3>
            <div className="flex gap-2 justify-between items-center">
              <div className='flex flex-col items-center'>
                <p className="text-sm text-gray-500">Available</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <div className='flex flex-col items-center'>
                <p className="text-sm text-gray-500">Occupied</p>
                <p className="text-2xl font-bold">176</p>
              </div>
              <div className='flex flex-col items-center'>
                <p className="text-sm text-gray-500 text-nowrap">Upcoming Vacancies</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">New Bookings</h3>
            <p className="text-2xl font-bold mb-2">18</p>
            <div className="flex space-x-2">
              <button className="px-2 py-1 bg-green-500 text-white rounded-md text-sm">Approve</button>
              <button className="px-2 py-1 bg-blue-500 text-white rounded-md text-sm">Assign Rooms</button>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Pending Payments</h3>
            <p className="text-2xl font-bold mb-2">7</p>
            <button className="px-2 py-1 bg-yellow-500 text-white rounded-md text-sm">Send Reminders</button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Occupancy Rate</h3>
            <p className="text-2xl font-bold mb-2">88%</p>
            <p className="text-sm text-gray-500">5% increase from last semester</p>
          </div>
        </div>
         {/* Performance Insights */}
         <div className="bg-white p-4 my-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Performance Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Semester Comparison</h4>
              <p className="text-xl font-bold">+8% Revenue</p>
              <p className="text-sm text-gray-500">vs. previous semester</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Room Utilization</h4>
              <p className="text-xl font-bold">92%</p>
              <p className="text-sm text-gray-500">average across all rooms</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Most Popular Room</h4>
              <p className="text-xl font-bold">Double, 3rd Floor</p>
              <p className="text-sm text-gray-500">98% occupancy rate</p>
            </div>
          </div>
        </div>

        {/* Occupancy and Financial Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg shadow" style={{ height: '400px' }}>
            <h3 className="text-lg font-semibold mb-2">Occupancy by Room Type</h3>
            <Bar data={occupancyData} options={occupancyOptions} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow" style={{ height: '400px' }}>
            <h3 className="text-lg font-semibold mb-2">Revenue Summary</h3>
            <Bar data={revenueData} options={revenueOptions} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg shadow" style={{ height: '400px' }}>
            <Pie data={popularAmenitiesData} options={pieOptions} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow col-span-2">
            <h3 className="text-lg font-semibold mb-2">Upcoming Events & Important Dates</h3>
            <ul className="space-y-2">
              <li className="flex items-center justify-between">
                <span>Semester Start</span>
                <span className="text-sm text-gray-500">Sep 1, 2024</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Room Inspection</span>
                <span className="text-sm text-gray-500">Sep 15, 2024</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Renewal Deadline</span>
                <span className="text-sm text-gray-500">Nov 30, 2024</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Semester End</span>
                <span className="text-sm text-gray-500">Dec 20, 2024</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Resident Activity Feed and Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Resident Activity Feed</h3>
            <ul className="space-y-2">
              <li className="flex items-center justify-between py-2 border-b">
                <span className="text-sm">New room assignment: John Doe to Room 301</span>
                <span className="text-xs text-gray-500">5 min ago</span>
              </li>
              <li className="flex items-center justify-between py-2 border-b">
                <span className="text-sm">Maintenance request: Broken AC in Room 205</span>
                <span className="text-xs text-gray-500">1 hour ago</span>
              </li>
              <li className="flex items-center justify-between py-2">
                <span className="text-sm">Room change request: Jane Smith from 102 to 304</span>
                <span className="text-xs text-gray-500">2 hours ago</span>
              </li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Notifications & Alerts</h3>
            <ul className="space-y-2">
              <li className="flex items-center justify-between py-2 border-b">
                <span className="text-sm flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
                  5 contracts expiring next week
                </span>
                <button className="text-xs text-blue-500">Review</button>
              </li>
              <li className="flex items-center justify-between py-2 border-b">
                <span className="text-sm flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
                  Low occupancy alert: 2nd floor
                </span>
                <button className="text-xs text-blue-500">Take Action</button>
              </li>
              <li className="flex items-center justify-between py-2">
                <span className="text-sm flex items-center">
                  <ThumbsUp className="w-4 h-4 mr-2 text-green-500" />
                  Resident satisfaction score: 4.5/5
                </span>
                <button className="text-xs text-blue-500">View Details</button>
              </li>
            </ul>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
          <div className="flex space-x-4">
            <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add New Resident
            </button>
            <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md">
              <RefreshCw className="w-4 h-4 mr-2" />
              Bulk Assignments
            </button>
            <button className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-md">
              <Clipboard className="w-4 h-4 mr-2" />
              Manage Inventory
            </button>
          </div>
        </div>

       
      </main>
  )
}

export default Dashboard;