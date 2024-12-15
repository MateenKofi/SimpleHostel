"use client"

import { useState } from "react"
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react'

type Task = {
  id: number
  title: string
  description: string
  priority: "low" | "medium" | "high"
  status: "pending" | "in-progress" | "completed"
  assignedTo: string
}

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Fix leaky faucet in Room 101",
    description: "The faucet in the bathroom of Room 101 is leaking. Needs immediate attention.",
    priority: "high",
    status: "pending",
    assignedTo: "John Doe"
  },
  {
    id: 2,
    title: "Replace light bulbs in common area",
    description: "Several light bulbs in the common area need to be replaced.",
    priority: "medium",
    status: "in-progress",
    assignedTo: "Jane Smith"
  },
  {
    id: 3,
    title: "Clean air conditioning filters",
    description: "Regular maintenance: clean the air conditioning filters in all rooms.",
    priority: "low",
    status: "completed",
    assignedTo: "Mike Johnson"
  }
]

const MaintenanceList =()=> {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  const updateTaskStatus = (id: number, newStatus: Task["status"]) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: newStatus } : task
    ))
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="border rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">{task.title}</h3>
            <PriorityBadge priority={task.priority} />
          </div>
          <p className="text-sm text-gray-600 mb-2">{task.description}</p>
          <div className="flex items-center space-x-2 mb-4">
            <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
              <span>{task.assignedTo.split(' ').map(n => n[0]).join('')}</span>
            </div>
            <span className="text-sm">{task.assignedTo}</span>
          </div>
          <div className="flex justify-between items-center">
            <StatusBadge status={task.status} />
            <div className="space-x-2">
              <button 
                className="px-2 py-1 border rounded-md text-sm"
                onClick={() => updateTaskStatus(task.id, "in-progress")}
                disabled={task.status === "in-progress" || task.status === "completed"}
              >
                Start
              </button>
              <button 
                className="px-2 py-1 border rounded-md text-sm bg-blue-500 text-white"
                onClick={() => updateTaskStatus(task.id, "completed")}
                disabled={task.status === "completed"}
              >
                Complete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
export default MaintenanceList

function PriorityBadge({ priority }: { priority: Task["priority"] }) {
  const colors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800"
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${colors[priority]}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  )
}

function StatusBadge({ status }: { status: Task["status"] }) {
  const statusConfig = {
    pending: { label: "Pending", icon: Clock, className: "bg-gray-300 text-gray-800" },
    "in-progress": { label: "In Progress", icon: AlertTriangle, className: "bg-blue-100 text-blue-800" },
    completed: { label: "Completed", icon: CheckCircle, className: "bg-green-100 text-green-800" }
  }

  const { label, icon: Icon, className } = statusConfig[status]

  return (
    <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${className}`}>
      <Icon size={14} />
      <span>{label}</span>
    </span>
  )
}