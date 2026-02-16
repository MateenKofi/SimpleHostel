import * as React from "react"
import { Eye, EyeOff, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { TextInput } from "./TextInput"

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "leftIcon" | "rightIcon"> {
  /** Optional label for the input */
  label?: string
  /** Optional helper text */
  helperText?: string
  /** Optional error message */
  error?: string
  /** Whether the input is in a loading state */
  loading?: boolean
  /** Container className for wrapper */
  containerClassName?: string
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, helperText, error, loading, containerClassName, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev)
    }

    return (
      <TextInput
        ref={ref}
        type={showPassword ? "text" : "password"}
        leftIcon={Lock}
        rightIcon={showPassword ? EyeOff : Eye}
        onRightIconClick={togglePasswordVisibility}
        label={label}
        helperText={helperText}
        error={error}
        loading={loading}
        containerClassName={containerClassName}
        className={className}
        {...props}
      />
    )
  }
)

PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
