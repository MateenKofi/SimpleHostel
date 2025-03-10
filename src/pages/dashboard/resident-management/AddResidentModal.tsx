import Modal from '../../../components/Modal'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Resident } from '../../../types/types'
import { useNavigate } from 'react-router-dom'


type AddResidentModalProps = {
    onClose: () => void;
}
type ResidentForm = Omit<Resident, 'paymentMethod'>

const AddResidentModal = ({ onClose }: AddResidentModalProps) => {
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm<ResidentForm>()

    const onSubmit = (formData: ResidentForm) => {
        console.log(formData)
        toast.success('Resident added successfully')
        onClose()
        navigate('/dashboard/room-assignment')
    }

    return (
        <Modal modalId="add_resident_modal" onClose={onClose}>
            <div className='p-6'>
                <h1 className='text-3xl font-bold'>Add Resident </h1>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-6">
                <div className="flex flex-col gap-1">
                    <label htmlFor="fullName" className="text-sm font-medium">
                        Full Name*
                    </label>
                    <input
                        {...register('fullName', { required: 'Full name is required' })}
                        type="text"
                        id="fullName"
                        placeholder="Enter full name"
                        className="border rounded-md p-2"
                    />
                    {errors.fullName && (
                        <span className="text-red-500 text-sm">{errors.fullName.message}</span>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="studentId" className="text-sm font-medium">
                        Student ID*
                    </label>
                    <input
                        {...register('studentId', { required: 'Student ID is required' })}
                        type="text"
                        id="studentId"
                        placeholder="Enter student ID"
                        className="border rounded-md p-2"
                    />
                    {errors.studentId && (
                        <span className="text-red-500 text-sm">{errors.studentId.message}</span>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="course" className="text-sm font-medium">
                        Course*
                    </label>
                    <input
                        {...register('course', { required: 'Course is required' })}
                        type="text"
                        id="course"
                        placeholder="Enter course name"
                        className="border rounded-md p-2"
                    />
                    {errors.course && (
                        <span className="text-red-500 text-sm">{errors.course.message}</span>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="email" className="text-sm font-medium">
                        Email*
                    </label>
                    <input
                        {...register('email', { 
                            required: 'Email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address'
                            }
                        })}
                        type="email"
                        id="email"
                        placeholder="Enter email address"
                        className="border rounded-md p-2"
                    />
                    {errors.email && (
                        <span className="text-red-500 text-sm">{errors.email.message}</span>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="phone" className="text-sm font-medium">
                        Phone Number*
                    </label>
                    <input
                        {...register('phone', { 
                            required: 'Phone number is required',
                            pattern: {
                                value: /^\d{10}$/,
                                message: 'Phone number must be 10 digits'
                            }
                        })}
                        type="tel"
                        id="phone"
                        placeholder="Enter phone number"
                        className="border rounded-md p-2"
                    />
                    {errors.phone && (
                        <span className="text-red-500 text-sm">{errors.phone.message}</span>
                    )}
                </div>

                <div className="border-t pt-4 mt-2">
                    <h2 className="text-lg font-semibold mb-4">Emergency Contact</h2>
                    
                    <div className="flex flex-col gap-1">
                        <label htmlFor="emergencyContactName" className="text-sm font-medium">
                            Contact Name*
                        </label>
                        <input
                            {...register('emergencyContactName', { required: 'Emergency contact name is required' })}
                            type="text"
                            id="emergencyContactName"
                            placeholder="Enter emergency contact name"
                            className="border rounded-md p-2"
                        />
                        {errors.emergencyContactName && (
                            <span className="text-red-500 text-sm">{errors.emergencyContactName.message}</span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1 mt-4">
                        <label htmlFor="emergencyContactPhone" className="text-sm font-medium">
                            Contact Phone*
                        </label>
                        <input
                            {...register('emergencyContactPhone', { 
                                required: 'Emergency contact phone is required',
                                pattern: {
                                    value: /^\d{10}$/,
                                    message: 'Phone number must be 10 digits'
                                }
                            })}
                            type="tel"
                            id="emergencyContactPhone"
                            placeholder="Enter emergency contact phone"
                            className="border rounded-md p-2"
                        />
                        {errors.emergencyContactPhone && (
                            <span className="text-red-500 text-sm">{errors.emergencyContactPhone.message}</span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1 mt-4">
                        <label htmlFor="emergencyContactRelation" className="text-sm font-medium">
                            Relationship*
                        </label>
                        <input
                            {...register('emergencyContactRelation', { required: 'Relationship is required' })}
                            type="text"
                            id="emergencyContactRelation"
                            placeholder="Enter relationship (e.g. Parent, Sibling)"
                            className="border rounded-md p-2"
                        />
                        {errors.emergencyContactRelation && (
                            <span className="text-red-500 text-sm">{errors.emergencyContactRelation.message}</span>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border rounded-md hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                    >
                        Add Resident
                    </button>
                </div>
            </form>
        </Modal>
    )
}

export default AddResidentModal