'use client'
import { ReactNode } from 'react'
import { X } from 'lucide-react'

type ModalSize = 'small' | 'medium' | 'large';

interface ModalProps {
  children: ReactNode
  modalId: string
  onClose: () => void
  size?: ModalSize
}

const sizeClasses: Record<ModalSize, string> = {
  small: 'max-w-md',   // 28rem / 448px
  medium: 'max-w-xl',  // 36rem / 576px
  large: 'max-w-3xl'   // 48rem / 768px
};

export default function Modal({ children, modalId, onClose, size = 'medium' }: ModalProps) {
  return (
    <dialog id={modalId} className={`relative z-50 w-full ${sizeClasses[size]} rounded-lg bg-white p-6 shadow-lg`}>
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-sm text-gray-400 hover:text-gray-500"
        aria-label="Close modal"
      >
        <X className="h-4 w-4" />
      </button>
      {children}
    </dialog>
  )
}

export function useModal(modalId: string) {
  const open = () => {
    const modal = document.getElementById(modalId) as HTMLDialogElement | null
    if (modal) {
      modal.showModal()
    }
  }

  const close = () => {
    const modal = document.getElementById(modalId) as HTMLDialogElement | null
    if (modal) {
      modal.close()
    }
  }

  return { open, close }
}