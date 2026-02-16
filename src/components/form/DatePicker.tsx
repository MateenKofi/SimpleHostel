import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { DayPickerRangeProps, DayPickerSingleProps } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

export interface DatePickerProps {
  /** Currently selected date */
  value?: Date
  /** Callback when date changes */
  onChange?: (date: Date | undefined) => void
  /** Optional label for the input */
  label?: string
  /** Optional helper text */
  helperText?: string
  /** Optional error message */
  error?: string
  /** Whether the input is disabled */
  disabled?: boolean
  /** Placeholder text */
  placeholder?: string
  /** Format for displaying the date */
  dateFormat?: string
  /** Container className for wrapper */
  containerClassName?: string
  /** Minimum date that can be selected */
  fromDate?: Date
  /** Maximum date that can be selected */
  toDate?: Date
  /** Disable specific dates */
  disabledDays?: DayPickerSingleProps["disabled"]
  /** Whether to show the week numbers */
  showWeekNumber?: boolean
  /** Default month to show */
  defaultMonth?: Date
}

const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      value,
      onChange,
      label,
      helperText,
      error,
      disabled,
      placeholder = "Pick a date",
      dateFormat = "PPP",
      containerClassName,
      fromDate,
      toDate,
      disabledDays,
      showWeekNumber = false,
      defaultMonth,
    },
    ref
  ) => {
    const id = React.useId()
    const [isOpen, setIsOpen] = React.useState(false)

    const handleDateSelect = (date: Date | undefined) => {
      onChange?.(date)
      if (date) {
        setIsOpen(false)
      }
    }

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

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={ref}
              id={id}
              variant="outline"
              type="button"
              disabled={disabled}
              className={cn(
                "w-full justify-start text-left font-normal h-10",
                !value && "text-muted-foreground",
                error && "border-destructive",
                "focus:ring-2 focus:ring-ring focus:ring-offset-2"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value ? format(value, dateFormat) : placeholder}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleDateSelect}
              fromDate={fromDate}
              toDate={toDate}
              disabled={disabledDays}
              showWeekNumber={showWeekNumber}
              defaultMonth={defaultMonth || value}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {(helperText || error) && (
          <p className={cn("text-xs", error ? "text-destructive" : "text-muted-foreground")}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

DatePicker.displayName = "DatePicker"

/* Range Date Picker */
export interface DateRangePickerProps {
  /** Currently selected date range */
  value?: { from?: Date; to?: Date }
  /** Callback when date range changes */
  onChange?: (range: { from?: Date; to?: Date } | undefined) => void
  /** Optional label for the input */
  label?: string
  /** Optional helper text */
  helperText?: string
  /** Optional error message */
  error?: string
  /** Whether the input is disabled */
  disabled?: boolean
  /** Placeholder text */
  placeholder?: string
  /** Number of months to display */
  numberOfMonths?: 1 | 2
  /** Container className for wrapper */
  containerClassName?: string
  /** Minimum date that can be selected */
  fromDate?: Date
  /** Maximum date that can be selected */
  toDate?: Date
  /** Disable specific dates */
  disabledDays?: DayPickerRangeProps["disabled"]
}

const DateRangePicker = React.forwardRef<HTMLButtonElement, DateRangePickerProps>(
  (
    {
      value,
      onChange,
      label,
      helperText,
      error,
      disabled,
      placeholder = "Pick a date range",
      numberOfMonths = 2,
      containerClassName,
      fromDate,
      toDate,
      disabledDays,
    },
    ref
  ) => {
    const id = React.useId()
    const [isOpen, setIsOpen] = React.useState(false)

    const handleDateSelect = (range: { from?: Date; to?: Date } | undefined) => {
      onChange?.(range)
      if (range?.to) {
        setIsOpen(false)
      }
    }

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

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={ref}
              id={id}
              variant="outline"
              type="button"
              disabled={disabled}
              className={cn(
                "w-full justify-start text-left font-normal h-10",
                !value?.from && "text-muted-foreground",
                error && "border-destructive",
                "focus:ring-2 focus:ring-ring focus:ring-offset-2"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value?.from ? (
                value.to ? (
                  <>
                    {format(value.from, "LLL dd, y")} - {format(value.to, "LLL dd, y")}
                  </>
                ) : (
                  format(value.from, "LLL dd, y")
                )
              ) : (
                placeholder
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              numberOfMonths={numberOfMonths}
              selected={value?.from && value?.to ? { from: value.from, to: value.to } : undefined}
              onSelect={handleDateSelect}
              fromDate={fromDate}
              toDate={toDate}
              disabled={disabledDays}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {(helperText || error) && (
          <p className={cn("text-xs", error ? "text-destructive" : "text-muted-foreground")}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

DateRangePicker.displayName = "DateRangePicker"

export { DatePicker, DateRangePicker }
