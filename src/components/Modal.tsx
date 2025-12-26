import { ReactNode } from 'react'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'

type ModalSize = 'small' | 'medium' | 'large'

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
}

const variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.3, ease: 'easeInOut' }

}

export default function Modal({ children, modalId, onClose, size = 'medium' }: ModalProps) {
  return (
    <motion.dialog
      id={modalId}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      className={`relative z-50 w-full ${sizeClasses[size]} rounded-lg bg-white p-6 shadow-lg backdrop:bg-black/90`}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-sm text-gray-400 hover:text-gray-500"
        aria-label="Close modal"
      >
        <X className="h-4 w-4" />
      </button>
      {children}
    </motion.dialog>
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