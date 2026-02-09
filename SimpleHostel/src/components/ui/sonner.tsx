import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "group-[.toaster]:bg-forest-green-50 group-[.toaster]:text-forest-green-800 group-[.toaster]:border-forest-green-200",
          error: "group-[.toaster]:bg-warm-red-50 group-[.toaster]:text-warm-red-800 group-[.toaster]:border-warm-red-200",
          warning: "group-[.toaster]:bg-amber-50 group-[.toaster]:text-amber-800 group-[.toaster]:border-amber-200",
          info: "group-[.toaster]:bg-teal-green-50 group-[.toaster]:text-teal-green-800 group-[.toaster]:border-teal-green-200",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
