import { Calendar, Users, Building, ClipboardList } from 'lucide-react'
import React, { useState } from 'react'
import { useModal } from '../../components/Modal'
import NewSemModal from './NewSemModal'
import { Switch } from '@headlessui/react'

const Planning = () => {
    const [currentSemester, setCurrentSemester] = useState<{startDate: string, endDate: string}>({
        startDate: 'Sep 1, 2024',
        endDate: 'Dec 20, 2024'
    })
    const [newSemester, setNewSemester] = useState<{startDate: string, endDate: string} | null>(null)
    const [isPublished, setIsPublished] = useState(false)
    const {open:openNewSemModal,close:closeNewSemModal} = useModal('new_sem_modal')

    const handleNewSemester = (data: {startDate: string, endDate: string}) => {
        setNewSemester(data)
    }

    const handlePublishChange = (newValue: boolean) => {
        setIsPublished(newValue)
        if (newValue && newSemester) {
            setCurrentSemester(newSemester)
            setNewSemester(null)
        }
    }

    return (
        <div>
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex flex-row items-center space-x-2 mb-4">
                            <Calendar className="w-6 h-6" />
                            <h3 className="text-lg font-semibold">Current Semester</h3>
                        </div>
                        <div className="space-y-2">
                            <p><strong>Start Date:</strong> {new Date(currentSemester.startDate).toLocaleDateString()}</p>
                            <p><strong>End Date:</strong> {new Date(currentSemester.endDate).toLocaleDateString()}</p>
                            <p><strong>Status:</strong> <span className="text-green-500">Active</span></p>
                        </div>
                        <div>
                            <div className="space-y-2 py-4">
                                <div className="flex flex-row items-center space-x-2">
                                    <Building className="w-6 h-6" />
                                    <h3 className="text-lg font-semibold">Next Semester</h3>
                                </div>
                                {newSemester ? (
                                    <>
                                        <p><strong>Start Date:</strong> {new Date(newSemester.startDate).toLocaleDateString()}</p>
                                        <p><strong>End Date:</strong> {new Date(newSemester.endDate).toLocaleDateString()}</p>
                                        <div className="flex items-center space-x-2 mt-2">
                                            <Switch
                                                checked={isPublished}
                                                onChange={handlePublishChange}
                                                className={`${
                                                    isPublished ? 'bg-primary' : 'bg-gray-200'
                                                } relative inline-flex h-6 w-11 items-center rounded-full`}
                                            >
                                                <span className="sr-only">Publish semester</span>
                                                <span
                                                    className={`${
                                                        isPublished ? 'translate-x-6' : 'translate-x-1'
                                                    } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                                />
                                            </Switch>
                                            <span>{isPublished ? 'Published' : 'Publish'}</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p><strong>Planning Status:</strong> Not Started</p>
                                        <button 
                                            className="mt-2 px-4 py-2 bg-primary text-white rounded-md"
                                            onClick={openNewSemModal}
                                        >
                                            Start Planning
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex flex-row items-center space-x-2 mb-4">
                            <Users className="w-6 h-6" />
                            <h3 className="text-lg font-semibold">Occupancy Overview</h3>
                        </div>
                        <div className="space-y-2">
                            <p><strong>Total Rooms:</strong> 200</p>
                            <p><strong>Occupied:</strong> 180</p>
                            <p><strong>Available:</strong> 20</p>
                        </div>
                    
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 mt-4">
                    <h3 className="text-lg font-semibold mb-4">Semester Timeline</h3>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <ClipboardList className="w-5 h-5 text-blue-500" />
                            <div>
                                <p className="font-medium">Room Assignment Phase</p>
                                <p className="text-sm text-gray-500">Aug 1 - Aug 15, 2024</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <ClipboardList className="w-5 h-5 text-green-500" />
                            <div>
                                <p className="font-medium">Move-in Period</p>
                                <p className="text-sm text-gray-500">Aug 28 - Sep 1, 2024</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <ClipboardList className="w-5 h-5 text-yellow-500" />
                            <div>
                                <p className="font-medium">Mid-semester Review</p>
                                <p className="text-sm text-gray-500">Oct 15, 2024</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <NewSemModal onClose={closeNewSemModal} onSubmit={handleNewSemester} />
        </div>
    )
}

export default Planning