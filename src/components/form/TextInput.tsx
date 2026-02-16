import * as React from "react"
import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Icon to display on the left side of the input */
  leftIcon?: LucideIcon
  /** Icon to display on the right side of the input */
  rightIcon?: LucideIcon
  /** Action to call when right icon is clicked */
  onRightIconClick?: () => void
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

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      className,
      containerClassName,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      onRightIconClick,
      label,
      helperText,
      error,
      loading,
      disabled,
      type = "text",
      ...props
    },
    ref
  ) => {
    const id = React.useId()

    return (
      <div className={cn("space-y-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "text-sm font-medium leading-none",
              error ? "text-destructive" : "text-foreground"
            )}
          >
            {label}
          </label>
        )}

        <div className="relative">
          {LeftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <LeftIcon className="h-4 w-4" />
            </div>
          )}

          <input
            ref={ref}
            id={id}
            type={type}
            disabled={disabled || loading}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "transition-all duration-200",
              LeftIcon && "pl-10",
              (RightIcon || loading) && "pr-10",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            {...props}
          />

          {(RightIcon || loading) && (
            <div
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground",
                onRightIconClick && "cursor-pointer hover:text-foreground transition-colors"
              )}
              onClick={onRightIconClick}
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : RightIcon ? (
                <RightIcon className="h-4 w-4" />
              ) : null}
            </div>
          )}
        </div>

        {(helperText || error) && (
          <p className={cn("text-xs", error ? "text-destructive" : "text-muted-foreground")}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

TextInput.displayName = "TextInput"

export { TextInput }
