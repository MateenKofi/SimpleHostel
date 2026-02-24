import * as React from "react"
import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Mail, CheckCircle, XCircle, Loader2 } from "lucide-react"

export interface EmailInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Icon to display on the left side of the input */
  leftIcon?: LucideIcon
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
  /** Enable domain suggestions dropdown (default: true) */
  enableDomainSuggestions?: boolean
  /** Show validation indicator icon (default: true) */
  showValidationIndicator?: boolean
  /** Custom domain suggestions */
  customDomains?: string[]
  /** Callback when validation state changes */
  onValidationChange?: (isValid: boolean, email: string) => void
}

// Default domain suggestions
const DEFAULT_DOMAINS = [
  "@gmail.com",
  "@yahoo.com",
  "@outlook.com",
  "@hotmail.com",
  "@icloud.com",
  "@live.com",
]

// Email validation regex (more comprehensive than HTML5)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

const EmailInput = React.forwardRef<HTMLInputElement, EmailInputProps>(
  (
    {
      className,
      containerClassName,
      leftIcon: LeftIcon,
      label,
      helperText,
      error,
      loading,
      disabled,
      enableDomainSuggestions = true,
      showValidationIndicator = true,
      customDomains,
      onValidationChange,
      value: controlledValue,
      defaultValue = "",
      ...props
    },
    ref
  ) => {
    const id = React.useId()
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [internalValue, setInternalValue] = React.useState(defaultValue)
    const [isFocused, setIsFocused] = React.useState(false)
    const [showSuggestions, setShowSuggestions] = React.useState(false)
    const [highlightedIndex, setHighlightedIndex] = React.useState(-1)
    const [hasBlurredOnce, setHasBlurredOnce] = React.useState(false)
    const suggestionsRef = React.useRef<HTMLUListElement>(null)

    // Handle controlled/uncontrolled input - ensure value is always treated as string
    const value = String(controlledValue !== undefined ? controlledValue : internalValue)

    // Merge refs
    React.useImperativeHandle(ref, () => inputRef.current!)

    // Debounced value for validation
    const debouncedValue = useDebounce(value, 300)

    // Validation state
    const isValid = React.useMemo(() => {
      if (!debouncedValue || (!hasBlurredOnce && !error)) return null
      return EMAIL_REGEX.test(debouncedValue)
    }, [debouncedValue, hasBlurredOnce, error])

    // Notify parent of validation changes
    React.useEffect(() => {
      if (onValidationChange && isValid !== null) {
        onValidationChange(isValid, debouncedValue)
      }
    }, [isValid, debouncedValue, onValidationChange])

    // Domain suggestions
    const domains = customDomains || DEFAULT_DOMAINS

    const suggestions = React.useMemo(() => {
      if (!enableDomainSuggestions || !value || value.includes("@")) {
        return []
      }
      return domains
    }, [value, domains, enableDomainSuggestions])

    // Handle keyboard navigation in suggestions
    React.useEffect(() => {
      if (showSuggestions && highlightedIndex >= 0 && suggestionsRef.current) {
        const items = suggestionsRef.current.querySelectorAll("li")
        const highlightedItem = items[highlightedIndex] as HTMLElement
        highlightedItem?.scrollIntoView({ block: "nearest" })
      }
    }, [highlightedIndex, showSuggestions])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      if (controlledValue === undefined) {
        setInternalValue(newValue)
      }
      props.onChange?.(e)
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      props.onFocus?.(e)

      if (enableDomainSuggestions && value && !value.includes("@")) {
        setShowSuggestions(true)
      }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setHasBlurredOnce(true)

      // Delay hiding suggestions to allow click events
      setTimeout(() => {
        setShowSuggestions(false)
        setHighlightedIndex(-1)
      }, 200)

      setIsFocused(false)
      props.onBlur?.(e)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showSuggestions || suggestions.length === 0) {
        props.onKeyDown?.(e)
        return
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setHighlightedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : prev
          )
          break
        case "ArrowUp":
          e.preventDefault()
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1))
          break
        case "Enter":
          e.preventDefault()
          if (highlightedIndex >= 0) {
            applySuggestion(suggestions[highlightedIndex])
          }
          break
        case "Escape":
          setShowSuggestions(false)
          setHighlightedIndex(-1)
          break
        default:
          props.onKeyDown?.(e)
      }
    }

    const applySuggestion = (domain: string) => {
      const newValue = value + domain
      if (controlledValue === undefined) {
        setInternalValue(newValue)
      }

      // Trigger change event
      const event = {
        target: { value: newValue },
      } as React.ChangeEvent<HTMLInputElement>

      props.onChange?.(event)
      setShowSuggestions(false)
      setHighlightedIndex(-1)

      // Focus back on input
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    }

    const hasValue = value.length > 0
    const showValidationIcon = showValidationIndicator && hasBlurredOnce && hasValue && !isFocused

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
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <LeftIcon className="h-4 w-4" />
            </div>
          )}

          <input
            ref={inputRef}
            id={id}
            type="email"
            autoComplete="email"
            {...props}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            disabled={disabled || loading}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "transition-all duration-200",
              LeftIcon && "pl-10",
              (showValidationIcon || loading) && "pr-10",
              (error || (showValidationIcon && isValid === false)) && "border-destructive focus-visible:ring-destructive",
              showValidationIcon && isValid === true && "border-green-500 focus-visible:ring-green-500",
              className
            )}
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : showValidationIcon ? (
              isValid === true ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : isValid === false ? (
                <XCircle className="h-4 w-4 text-destructive" />
              ) : null
            ) : null}
          </div>

          {/* Domain suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <ul
              ref={suggestionsRef}
              className={cn(
                "absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-md bg-popover border border-border shadow-lg",
                "py-1 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2"
              )}
              role="listbox"
              id={`${id}-suggestions`}
            >
              {suggestions.map((domain, index) => {
                const isHighlighted = index === highlightedIndex
                return (
                  <li
                    key={domain}
                    role="option"
                    aria-selected={isHighlighted}
                    className={cn(
                      "relative flex items-center px-3 py-2 text-sm cursor-pointer transition-colors",
                      "hover:bg-muted hover:text-foreground",
                      isHighlighted && "bg-muted text-foreground",
                      "outline-none focus:bg-muted"
                    )}
                    onClick={() => applySuggestion(domain)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="truncate">
                      {value}
                      <span className="text-primary font-medium">{domain}</span>
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {(helperText || error || (hasBlurredOnce && isValid === false)) && (
          <p className={cn("text-xs", (error || (isValid === false && hasBlurredOnce)) ? "text-destructive" : "text-muted-foreground")}>
            {error || helperText || (isValid === false && hasBlurredOnce && "Please enter a valid email address")}
          </p>
        )}
      </div>
    )
  }
)

EmailInput.displayName = "EmailInput"

export { EmailInput }
