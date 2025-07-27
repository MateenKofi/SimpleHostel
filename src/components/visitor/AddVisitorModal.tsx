import Modal from '@/components/Modal'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { Resident } from '@/helper/types/types'
import { TextField } from '../TextField'

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
      const response = await axios.get(`/api/residents/hostel/${hostelId}`)
      return response?.data?.data
    },
  })

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (data: VisitorFormData) => {
      const hostelId = localStorage.getItem('hostelId')
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('phone', data.phone)
      formData.append('email', data.email)
      formData.append('residentId', data.residentId?.value || '')
      formData.append('status', 'ACTIVE')
      // formData.append('purpose', data.purpose)

      try {
        const response = await axios.post(`/api/visitors/add`, formData, {
          params:{
            hostelId: hostelId,
          },
        })
        toast.success('Visitor added successfully!')
      reset()
      onClose()
      queryClient.invalidateQueries({ queryKey: ['visitors'] })
        return response.data
      } catch (error) {
       if(error instanceof AxiosError && error.response) {
          const errorMessage = error.response.data?.message || 'Failed to add visitor'
          toast.error(errorMessage)
        }
      }
    },
  })

  const onSubmit = (data: VisitorFormData) => {
    mutation.mutate(data)
  }

  return (
    <Modal modalId="add_visitor_modal" onClose={onClose}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-500">New Visitor</h2>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <TextField id='name' label='Visitor Name' error={errors.name} register={register('name')} />
            </div>
            <div>
             <TextField id='phone' label='Phone Number' error={errors.phone} register={register('phone', { required: 'Phone number is required' })} />
            </div>
            <div>
              <TextField id='email' label='Email Address' error={errors.email} register={register('email', { required: 'Email is required' })} />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-500">
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
                    name="color"
                  />
                )}
              />
              {errors.residentId && (
                <p className="mt-1 text-sm text-red-500">{errors.residentId.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-500">
                Purpose of Visit
              </label>
              <textarea
                {...register('purpose', { required: 'Purpose is required' })}
                className="w-full p-2 border rounded-md"
                rows={3}
              />
              {errors.purpose && (
                <p className="mt-1 text-sm text-red-500">{errors.purpose.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-white bg-red-500 border rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-black rounded-md"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'Adding...' : 'Add Visitor'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  )
}

export default AddVisitorModal
