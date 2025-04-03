import Modal from '@/components/Modal'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { Resident } from '@/helper/types/types'

interface VisitorFormData {
  name: string
  phone: string
  email: string
  residentId: { value: string; label: string } | null
  purpose: string
}

interface AddVisitorModalProps {
  onClose: () => void
}

const AddVisitorModal = ({ onClose }: AddVisitorModalProps) => {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<VisitorFormData>()

  const { data: Residents, isLoading: isLoadingResidents } = useQuery({
    queryKey: ['residents'],
    queryFn: async () => {
      const hostelId = localStorage.getItem('hostelId')
      const response = await axios.get(`/api/residents/hostel/${hostelId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      return response?.data?.data
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: VisitorFormData) => {
      const hostelId = localStorage.getItem('hostelId')
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('phone', data.phone)
      formData.append('email', data.email)
      formData.append('residentId', data.residentId?.value || '')
      
      // formData.append('purpose', data.purpose)

      const response = await axios.post(`/api/visitors/add/${hostelId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      return response.data
    },
    onSuccess: () => {
      toast.success('Visitor added successfully!')
      reset()
      onClose()
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Failed to add visitor.')
    },
  })

  const onSubmit = (data: VisitorFormData) => {
    mutation.mutate(data)
  }

  return (
    <Modal modalId="add_visitor_modal" onClose={onClose}>
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-500">New Visitor</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-500">
                Visitor Name
              </label>
              <input
                {...register('name', { required: 'Name is required' })}
                className="w-full p-2 border rounded-md"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-500">
                Phone Number
              </label>
              <input
                {...register('phone', { required: 'Phone number is required' })}
                className="w-full p-2 border rounded-md"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-500">
                Email
              </label>
              <input
                {...register('email', { required: 'Email is required' })}
                className="w-full p-2 border rounded-md"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-500">
                Select Resident
              </label>
              <Controller
                name="residentId"
                control={control}
                rules={{ required: 'Please select a resident' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={
                      Residents?.map((resident: Resident) => ({
                        value: resident.id,
                        label: resident?.name + ' - ' + (resident?.room?.number || "No Room"),
                      })) || []
                    }
                    isLoading={isLoadingResidents}
                    className="w-full text-gray-500"
                    placeholder="Search for a resident..."
                    isClearable
                  />
                )}
              />
              {errors.residentId && (
                <p className="text-red-500 text-sm mt-1">{errors.residentId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-500">
                Purpose of Visit
              </label>
              <textarea
                {...register('purpose', { required: 'Purpose is required' })}
                className="w-full p-2 border rounded-md"
                rows={3}
              />
              {errors.purpose && (
                <p className="text-red-500 text-sm mt-1">{errors.purpose.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-md bg-red-500 text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-md"
              >
                Add Visitor
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  )
}

export default AddVisitorModal
