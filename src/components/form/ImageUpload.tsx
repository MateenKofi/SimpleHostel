"use client"

import * as React from "react"
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export type ImageFile = {
  file?: File
  url: string
  preview?: string
}

export interface ImageUploadProps {
  /** Currently selected images */
  value?: ImageFile[]
  /** Callback when images change */
  onChange?: (images: ImageFile[]) => void
  /** Optional label for the input */
  label?: string
  /** Optional helper text */
  helperText?: string
  /** Optional error message */
  error?: string
  /** Whether the input is disabled */
  disabled?: boolean
  /** Whether the input is in a loading state */
  loading?: boolean
  /** Maximum number of images allowed */
  maxImages?: number
  /** Maximum file size in MB */
  maxSize?: number
  /** Accepted file types */
  accept?: string
  /** Container className for wrapper */
  containerClassName?: string
  /** Upload area className */
  uploadAreaClassName?: string
  /** Whether to show the image count */
  showCount?: boolean
  /** Custom empty state icon */
  emptyStateIcon?: React.ReactNode
  /** Custom empty state title */
  emptyStateTitle?: string
  /** Custom empty state description */
  emptyStateDescription?: string
}

const ImageUpload = React.forwardRef<HTMLDivElement, ImageUploadProps>(
  (
    {
      value = [],
      onChange,
      label,
      helperText,
      error,
      disabled,
      loading,
      maxImages = 5,
      maxSize = 5,
      accept = "image/jpeg,image/jpg,image/png,image/webp,image/gif",
      containerClassName,
      uploadAreaClassName,
      showCount = true,
      emptyStateIcon,
      emptyStateTitle = "Upload images",
      emptyStateDescription = "Drag & drop or click to select",
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = React.useState(false)
    const [previewUrls, setPreviewUrls] = React.useState<Map<string, string>>(new Map())
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    // Generate preview URLs for File objects
    React.useEffect(() => {
      const newPreviews = new Map(previewUrls)

      value.forEach((img, index) => {
        if (img.file && !newPreviews.has(img.url)) {
          const preview = URL.createObjectURL(img.file)
          newPreviews.set(img.url, preview)
        }
      })

      // Clean up previews for removed images
      const currentUrls = new Set(value.map((img) => img.url))
      for (const [url] of newPreviews) {
        if (!currentUrls.has(url)) {
          URL.revokeObjectURL(newPreviews.get(url)!)
          newPreviews.delete(url)
        }
      }

      setPreviewUrls(newPreviews)

      return () => {
        newPreviews.forEach((url) => URL.revokeObjectURL(url))
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    const handleFileSelect = (files: FileList | null) => {
      if (!files || files.length === 0) return

      const newImages: ImageFile[] = []
      const remainingSlots = maxImages - value.length

      for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
        const file = files[i]

        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
          console.error(`File ${file.name} exceeds maximum size of ${maxSize}MB`)
          continue
        }

        newImages.push({
          file,
          url: `${Date.now()}-${i}`,
        })
      }

      if (newImages.length > 0) {
        onChange?.([...value, ...newImages])
      }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)

      if (disabled || loading) return

      handleFileSelect(e.dataTransfer.files)
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      if (!disabled && !loading) {
        setIsDragging(true)
      }
    }

    const handleDragLeave = () => {
      setIsDragging(false)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileSelect(e.target.files)
      // Reset input value to allow selecting the same file again
      e.target.value = ""
    }

    const handleRemoveImage = (index: number) => {
      const newImages = value.filter((_, i) => i !== index)
      onChange?.(newImages)
    }

    const isFull = value.length >= maxImages
    const imageCount = value.length

    return (
      <div ref={ref} className={cn("space-y-2", containerClassName)}>
        {label && (
          <div className="flex items-center justify-between">
            <label
              className={cn(
                "text-sm font-medium leading-none",
                error ? "text-destructive" : "text-foreground"
              )}
            >
              {label}
            </label>
            {showCount && (
              <span className={cn(
                "text-xs tabular-nums",
                isFull ? "text-destructive" : "text-muted-foreground"
              )}>
                {imageCount}/{maxImages}
              </span>
            )}
          </div>
        )}

        {/* Upload Area */}
        {!isFull && (
          <div
            className={cn(
              "relative group rounded-lg border-2 border-dashed transition-all duration-200",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/30",
              (disabled || loading) && "opacity-50 cursor-not-allowed",
              uploadAreaClassName
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              multiple
              onChange={handleInputChange}
              disabled={disabled || loading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              aria-label="Upload images"
            />

            <div className="flex flex-col items-center justify-center py-8 px-4 gap-3">
              {loading ? (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : emptyStateIcon ? (
                emptyStateIcon
              ) : (
                <div className={cn(
                  "p-3 rounded-full transition-colors",
                  isDragging ? "bg-primary/10" : "bg-muted"
                )}>
                  <Upload className={cn(
                    "h-6 w-6",
                    isDragging ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
              )}

              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  {loading ? "Uploading..." : isDragging ? "Drop images here" : emptyStateTitle}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {emptyStateDescription}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  PNG, JPG, WEBP up to {maxSize}MB
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Image Preview Grid */}
        {value.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {value.map((image, index) => {
              const previewUrl = image.preview || (image.file ? previewUrls.get(image.url) : image.url)

              return (
                <div
                  key={`${image.url}-${index}`}
                  className="group relative aspect-square rounded-lg overflow-hidden border border-border bg-muted"
                >
                  <img
                    src={previewUrl}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />

                  {/* Remove button overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      disabled={disabled || loading}
                      className="p-2 bg-white rounded-full text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={`Remove image ${index + 1}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Image number badge */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 rounded-full">
                    <span className="text-xs font-medium text-white">{index + 1}</span>
                  </div>
                </div>
              )
            })}

            {/* Add more button (if not full) */}
            {!isFull && !loading && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/30 transition-all duration-200 flex flex-col items-center justify-center gap-1 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                  <ImageIcon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-xs text-muted-foreground">Add more</span>
              </button>
            )}
          </div>
        )}

        {(helperText || error) && (
          <p className={cn("text-xs", error ? "text-destructive" : "text-muted-foreground")}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

ImageUpload.displayName = "ImageUpload"

/* Single Image Upload Variant */
export interface SingleImageUploadProps extends Omit<ImageUploadProps, "value" | "onChange" | "maxImages" | "showCount"> {
  value?: ImageFile | null
  onChange?: (image: ImageFile | null) => void
}

const SingleImageUpload = React.forwardRef<HTMLDivElement, SingleImageUploadProps>(
  (
    {
      value,
      onChange,
      label,
      helperText,
      error,
      disabled,
      loading,
      maxSize = 5,
      accept = "image/jpeg,image/jpg,image/png,image/webp,image/gif",
      containerClassName,
      emptyStateTitle = "Upload image",
      emptyStateDescription = "Drag & drop or click to select",
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = React.useState(false)
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {
      if (value?.file) {
        const preview = URL.createObjectURL(value.file)
        setPreviewUrl(preview)
        return () => URL.revokeObjectURL(preview)
      } else if (value?.url) {
        setPreviewUrl(value.url)
      } else {
        setPreviewUrl(null)
      }
    }, [value])

    const handleFileSelect = (file: File | null) => {
      if (!file) return

      if (file.size > maxSize * 1024 * 1024) {
        console.error(`File exceeds maximum size of ${maxSize}MB`)
        return
      }

      onChange?.({
        file,
        url: `${Date.now()}`,
      })
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)

      if (disabled || loading) return

      const file = e.dataTransfer.files?.[0]
      if (file && file.type.startsWith("image/")) {
        handleFileSelect(file)
      }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      if (!disabled && !loading) {
        setIsDragging(true)
      }
    }

    const handleDragLeave = () => {
      setIsDragging(false)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null
      handleFileSelect(file)
      e.target.value = ""
    }

    const handleRemove = () => {
      onChange?.(null)
      setPreviewUrl(null)
    }

    return (
      <div ref={ref} className={cn("space-y-2", containerClassName)}>
        {label && (
          <label
            className={cn(
              "text-sm font-medium leading-none",
              error ? "text-destructive" : "text-foreground"
            )}
          >
            {label}
          </label>
        )}

        {previewUrl ? (
          // Show preview
          <div className="relative group w-fit">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-xl overflow-hidden border-2 border-border">
              <img
                src={previewUrl}
                alt="Uploaded preview"
                className="w-full h-full object-cover"
              />

              {/* Remove button overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={disabled || loading}
                  className="p-2 bg-white rounded-full text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Upload area
          <div
            className={cn(
              "relative group rounded-xl border-2 border-dashed transition-all duration-200",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/30",
              (disabled || loading) && "opacity-50 cursor-not-allowed"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleInputChange}
              disabled={disabled || loading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              aria-label="Upload image"
            />

            <div className="flex flex-col items-center justify-center py-10 px-6 gap-3">
              {loading ? (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : (
                <div className={cn(
                  "p-3 rounded-full transition-colors",
                  isDragging ? "bg-primary/10" : "bg-muted"
                )}>
                  <Upload className={cn(
                    "h-6 w-6",
                    isDragging ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
              )}

              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  {loading ? "Uploading..." : isDragging ? "Drop image here" : emptyStateTitle}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {emptyStateDescription}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  PNG, JPG, WEBP up to {maxSize}MB
                </p>
              </div>
            </div>
          </div>
        )}

        {(helperText || error) && (
          <p className={cn("text-xs", error ? "text-destructive" : "text-muted-foreground")}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

SingleImageUpload.displayName = "SingleImageUpload"

export { ImageUpload, SingleImageUpload }
