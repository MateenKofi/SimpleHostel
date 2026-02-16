import * as React from "react"
import { type LucideIcon, Loader2 } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90 active:bg-primary/80",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:bg-destructive/80",
        outline:
          "border border-border bg-card shadow-sm hover:bg-muted hover:text-foreground active:bg-muted/80",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 active:bg-secondary/70",
        ghost: "hover:bg-muted hover:text-foreground active:bg-muted/80",
        link: "text-foreground underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface FormButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Icon to display on the left side of the button */
  leftIcon?: LucideIcon
  /** Icon to display on the right side of the button */
  rightIcon?: LucideIcon
  /** Whether the button is in a loading state */
  loading?: boolean
  /** Loading text to display instead of children when loading */
  loadingText?: string
  /** Replace button content with spinner when loading */
  fullLoading?: boolean
}

const FormButton = React.forwardRef<HTMLButtonElement, FormButtonProps>(
  (
    {
      className,
      variant,
      size,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      loading = false,
      loadingText,
      fullLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          fullLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {loadingText || children}
            </>
          )
        ) : (
          <>
            {LeftIcon && <LeftIcon className="h-4 w-4" />}
            {children}
            {RightIcon && <RightIcon className="h-4 w-4" />}
          </>
        )}
      </button>
    )
  }
)

FormButton.displayName = "FormButton"

export { FormButton, buttonVariants }
