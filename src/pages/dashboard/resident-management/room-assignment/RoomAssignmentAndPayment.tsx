import React from 'react'
import { useNavigate } from 'react-router-dom'
import RoomAssignment from './RoomAssignment'
import { ChevronLeft } from 'lucide-react'

const RoomAssignmentAndPayment = () => {
    const navigate = useNavigate()
   
    const handleBack = () => {
        navigate('/dashboard/resident-management')
    }

    return (
        <div className="p-6 h-screen bg-gray-200">
            <div className="mb-6 bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold">Room Selection</h1>
                </div>
                <div className="flex justify-end">
                    <button onClick={handleBack} className="bg-primary text-white px-4 py-2 rounded-md flex items-center">
                       <ChevronLeft className="w-4 h-4" /> 
                       <span className="ml-2">Back</span>
                    </button>
                </div>
            </div>

            <div className="w-full ">
                <RoomAssignment />
            </div>
        </div>
    )
}

export default RoomAssignmentAndPayment 