import * as React from "react"
import {
  Select as SelectPrimitive,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectInputProps {
  /** Unique identifier for the select */
  name?: string
  /** Options to display in the dropdown */
  options: SelectOption[]
  /** Currently selected value */
  value?: string
  /** Callback when value changes */
  onValueChange?: (value: string) => void
  /** Icon to display on the left side */
  leftIcon?: LucideIcon
  /** Optional label for the select */
  label?: string
  /** Optional helper text */
  helperText?: string
  /** Optional error message */
  error?: string
  /** Whether the select is in a loading state */
  loading?: boolean
  /** Placeholder text when no value is selected */
  placeholder?: string
  /** Whether the select is disabled */
  disabled?: boolean
  /** Container className for wrapper */
  containerClassName?: string
  /** Trigger className */
  triggerClassName?: string
  /** Optional group label for options */
  groupLabel?: string
}

const SelectInput = React.forwardRef<HTMLButtonElement, SelectInputProps>(
  (
    {
      name,
      options,
      value,
      onValueChange,
      leftIcon: LeftIcon,
      label,
      helperText,
      error,
      loading,
      placeholder = "Select an option",
      disabled,
      containerClassName,
      triggerClassName,
      groupLabel,
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
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10">
              <LeftIcon className="h-4 w-4" />
            </div>
          )}

          <SelectPrimitive
            value={value}
            onValueChange={onValueChange}
            disabled={disabled || loading}
            name={name}
          >
            <SelectTrigger
              ref={ref}
              id={id}
              className={cn(
                "h-10 w-full",
                LeftIcon && "pl-10",
                error && "border-destructive data-[placeholder]:text-destructive/50",
                triggerClassName
              )}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent>
              {groupLabel && (
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  {groupLabel}
                </div>
              )}
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))}
              {options.length === 0 && (
                <div className="px-2 py-4 text-sm text-center text-muted-foreground">
                  No options available
                </div>
              )}
            </SelectContent>
          </SelectPrimitive>

          {loading && (
            <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent text-muted-foreground" />
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

SelectInput.displayName = "SelectInput"

export { SelectInput }
