import React from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useResidentStore } from '../../../../stores/residentStore'
import RoomAssignment from './RoomAssignment'
import Payment from './Payment'
import { ChevronLeft } from 'lucide-react'

const RoomAssignmentAndPayment = () => {
    const navigate = useNavigate()
    const { residentId } = useParams()
    const resident = useResidentStore(state => 
        state.residents.find(r => r.id === residentId)
    )

    const handleBack = () => {
        navigate('/resident-management')
    }

    return (
        <div className="p-6 bg-gray-100">
            <div className="mb-6 bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Room Assignment & Payment</h1>
                    <p className="text-gray-600">Resident: {resident?.fullName}</p>
                </div>
                <div className="flex justify-end">
                    <button onClick={handleBack} className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center">
                       <ChevronLeft className="w-4 h-4" /> 
                       <span className="ml-2">Back</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-[2fr_1fr] gap-6">
                {/* Left Column - Room Assignment */}
                <RoomAssignment />

                {/* Right Column - Payment Details */}
                <Payment />
            </div>
        </div>
    )
}

export default RoomAssignmentAndPayment 