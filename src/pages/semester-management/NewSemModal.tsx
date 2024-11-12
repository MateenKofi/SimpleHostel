import React from 'react'
import Modal from '../../components/Modal'
import { useForm } from 'react-hook-form'

interface NewSemesterForm {
  startDate: string;
  endDate: string;
}

const NewSemModal = ({onClose, onSubmit: onSubmitProp}:{
  onClose: () => void,
  onSubmit: (data: NewSemesterForm) => void
}) => {
  const { register, handleSubmit } = useForm<NewSemesterForm>()

  const onSubmit = (data: NewSemesterForm) => {
    onSubmitProp(data)
    onClose()
  }

  return (
    <Modal modalId="new_sem_modal" onClose={() => {onClose()}}>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <span className='text-2xl font-bold'>New Semester</span>
            <div className='flex flex-col gap-2'>
                <label htmlFor="startDate" className='text-sm font-medium'>Start Date</label>
                <input 
                  {...register('startDate')}
                  type="date" 
                  id="startDate"
                  className='border-2 border-gray-300 rounded-md p-2'
                />
            </div>
            <div className='flex flex-col gap-2'>
                <label htmlFor="endDate" className='text-sm font-medium'>End Date</label>
                <input 
                  {...register('endDate')}
                  type="date"
                  id="endDate" 
                  className='border-2 border-gray-300 rounded-md p-2'
                />
            </div>
            <div className='flex justify-end'>
                <button type="submit" className='bg-blue-500 text-white px-4 py-2 rounded-md'>
                  Create New Semester
                </button>
            </div>
        </form>
    </Modal>
  )
}

export default NewSemModal