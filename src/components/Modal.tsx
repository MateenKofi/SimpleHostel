import { ReactNode, useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type ModalSize = 'small' | 'medium' | 'large'

interface ModalProps {
  children: ReactNode
  modalId: string
  onClose: () => void
  size?: ModalSize
}

// Simple registry to track which modals should be open
export const openModals = new Set<string>()
export const listeners = new Set<() => void>()

const notifyListeners = () => {
  listeners.forEach(fn => fn())
}

export function useModal(modalId: string) {
  const open = () => {
    openModals.add(modalId)
    notifyListeners()
  }

  const close = () => {
    openModals.delete(modalId)
    notifyListeners()
  }

  const isOpen = openModals.has(modalId)

  return { open, close, isOpen }
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
  const [, forceUpdate] = useState(0)

  // Register for global modal state changes
  useEffect(() => {
    const handleUpdate = () => {
      // Force re-render to check global state
      forceUpdate(prev => prev + 1)
    }
    listeners.add(handleUpdate)
    return () => {
      listeners.delete(handleUpdate)
    }
  }, [])

  // Determine if this modal should be open
  const shouldShow = openModals.has(modalId)

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (!shouldShow) return

    // Save original overflow style
    const originalOverflow = document.body.style.overflow
    const originalPaddingRight = document.body.style.paddingRight

    // Prevent body scroll and account for scrollbar width
    document.body.style.overflow = 'hidden'
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    // Restore on unmount
    return () => {
      document.body.style.overflow = originalOverflow
      document.body.style.paddingRight = originalPaddingRight
    }
  }, [shouldShow])

  const handleClose = () => {
    openModals.delete(modalId)
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  return (
    <AnimatePresence>
      {shouldShow && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            id={modalId}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            className={`relative w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto rounded-lg bg-card p-6 shadow-lg`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-sm text-muted-foreground hover:text-foreground"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}