"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { X, Upload } from "lucide-react"

interface ImageUploadProps {
    onImagesChange: (images: File[]) => void
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImagesChange }) => {
    const [images, setImages] = useState<File[]>([])

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const newImages = acceptedFiles
            setImages((prev) => {
                const updated = [...prev, ...newImages].slice(0, 5) // Limit to 5 images
                onImagesChange(updated)
                return updated
            })
        },
        [onImagesChange],
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/jpeg": [".jpeg", ".jpg"],
            "image/png": [".png"],
        },
        maxSize: 25 * 1024 * 1024, // 25MB
        multiple: true,
    })

    const removeImage = (index: number) => {
        const updatedImages = images.filter((_, i) => i !== index)
        setImages(updatedImages)
        onImagesChange(updatedImages)
    }

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={`
                    border-2 border-dashed border-gray-300 dark:border-gray-700
                    rounded-lg
                    p-8
                    transition-colors
                    duration-150
                    ease-in-out
                    ${isDragActive ? "border-primary bg-primary/5" : ""}
                    ${images.length >= 5 ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-primary"}
                `}
            >
                <input {...getInputProps()} disabled={images.length >= 5} />
                <div className="flex flex-col items-center justify-center gap-4">
                    <Upload className="w-12 h-12 text-gray-400" />
                    <div className="text-center">
                        <h3 className="text-lg font-semibold">Upload file</h3>
                        <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                        <p>Max 4 files</p>
                        <p className="text-xs text-gray-400 mt-2">Supported formats: JPEG, JPG, PNG</p>
                        <p className="text-xs text-gray-400">Max file size: 25MB</p>
                    </div>
                </div>
            </div>

            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {images.map((image, index) => (
                        <div key={index} className="relative group">
                            <div className="aspect-square relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                                <img
                                    src={URL.createObjectURL(image) || "/placeholder.svg"}
                                    alt={`Upload ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        removeImage(index)
                                    }}
                                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ImageUpload
