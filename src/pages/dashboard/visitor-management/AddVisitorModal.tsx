import React from 'react'
import Modal from '../../../components/Modal'
import { useForm, Controller } from 'react-hook-form'
import { useVisitorStore } from '../../../stores/visitorStore'
import { useResidentStore } from '../../../stores/residentStore'
import { X } from 'lucide-react'
import Select from 'react-select'

interface AddVisitorModalProps {
  onClose: () => void
}

interface ResidentOption {
  value: string
  label: string
}

const AddVisitorModal = ({ onClose }: AddVisitorModalProps) => {
  const addVisitor = useVisitorStore((state) => state.addVisitor)
  const residents = useResidentStore((state) => state.residents)
  
  const { control, handleSubmit, register, reset, formState: { errors } } = useForm()

  const residentOptions: ResidentOption[] = residents.map((resident) => ({
    value: resident.id,
    label: `${resident.fullName} - Room ${resident.roomNumber || 'Not Assigned'}`
  }))

  const onSubmit = (data: any) => {
    addVisitor({
      name: data.name,
      phone: data.phone,
      purpose: data.purpose,
      residentId: data.residentId,
    })
    reset()
    onClose()
  }

  return (
    <Modal modalId='add_visitor_modal' onClose={onClose}>
      <div className="fixed inset-0 bg-black/50 z-50">
        <div className="fixed inset-y-0 right-0 w-full sm:w-3/4 lg:w-1/2 bg-white shadow-lg">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">New Visitor</h2>
              <button onClick={onClose}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Visitor Name</label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    className="w-full p-2 border rounded-md"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message as string}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    {...register('phone', { required: 'Phone number is required' })}
                    className="w-full p-2 border rounded-md"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message as string}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Select Resident</label>
                  <Controller
                    name="residentId"
                    control={control}
                    rules={{ required: 'Please select a resident' }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={residentOptions}
                        className="w-full"
                        classNamePrefix="select"
                        placeholder="Search for a resident..."
                        isClearable
                        value={residentOptions.find(option => option.value === field.value)}
                        onChange={(option) => field.onChange(option?.value)}
                      />
                    )}
                  />
                  {errors.residentId && (
                    <p className="text-red-500 text-sm mt-1">{errors.residentId.message as string}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Purpose of Visit</label>
                  <textarea
                    {...register('purpose', { required: 'Purpose is required' })}
                    className="w-full p-2 border rounded-md"
                    rows={3}
                  />
                  {errors.purpose && (
                    <p className="text-red-500 text-sm mt-1">{errors.purpose.message as string}</p>
                  )}
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-md"
                  >
                    Add Visitor
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default AddVisitorModal 