import * as React from "react"
import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CustomTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Icon to display in the top-left corner */
  icon?: LucideIcon
  /** Optional label for the textarea */
  label?: string
  /** Optional helper text */
  helperText?: string
  /** Optional error message */
  error?: string
  /** Whether the textarea is in a loading state */
  loading?: boolean
  /** Maximum number of characters */
  maxLength?: number
  /** Show character count */
  showCount?: boolean
  /** Container className for wrapper */
  containerClassName?: string
}

const CustomTextarea = React.forwardRef<HTMLTextAreaElement, CustomTextareaProps>(
  (
    {
      className,
      containerClassName,
      icon: Icon,
      label,
      helperText,
      error,
      loading,
      maxLength,
      showCount,
      disabled,
      value,
      ...props
    },
    ref
  ) => {
    const id = React.useId()
    const characterCount = typeof value === "string" ? value.length : 0

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
          {Icon && (
            <div className="absolute left-3 top-3 text-muted-foreground pointer-events-none">
              <Icon className="h-4 w-4" />
            </div>
          )}

          <textarea
            ref={ref}
            id={id}
            disabled={disabled || loading}
            maxLength={maxLength}
            value={value}
            className={cn(
              "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "resize-y",
              "transition-all duration-200",
              Icon && "pl-10",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            {...props}
          />

          {loading && (
            <div className="absolute right-3 bottom-3">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          {(helperText || error) && (
            <p className={cn("text-xs flex-1", error ? "text-destructive" : "text-muted-foreground")}>
              {error || helperText}
            </p>
          )}
          {showCount && maxLength && (
            <span className={cn(
              "text-xs tabular-nums",
              characterCount >= maxLength ? "text-destructive" : "text-muted-foreground"
            )}>
              {characterCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    )
  }
)

CustomTextarea.displayName = "CustomTextarea"

export { CustomTextarea }
