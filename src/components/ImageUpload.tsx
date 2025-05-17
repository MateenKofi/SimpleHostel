"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { X, Upload } from "lucide-react";

interface ImageUploadProps {
  onImagesChange?: (images: File[]) => void;
  defaultImages?: string[];
  onRemoveDefaultImage?: (index: number) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImagesChange,
  defaultImages = [],
  onRemoveDefaultImage,
}) => {
  const [images, setImages] = useState<File[]>([]);
  

  // Handle new file drops and update state
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const allowedCount = 3 - defaultImages.length;
      const newImages = acceptedFiles.slice(0, allowedCount);
      const updated = [...images, ...newImages].slice(0, allowedCount);
      setImages(updated);
      onImagesChange?.(updated);
    },
    [images, onImagesChange, defaultImages.length]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
    },
    maxSize: 15 * 1024 * 1024, // 15MB
    multiple: true,
  });

  // Remove an uploaded image from local state
  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesChange?.(updatedImages);
  };

  useEffect(() => {
    return () => {
      setImages([]);
    };
  }, []);

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-2 transition-colors duration-150 ease-in-out ${
          isDragActive ? "border-primary bg-primary/5" : ""
        } ${
          images.length + defaultImages.length >= 3
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:border-primary"
        }`}
      >
        <input {...getInputProps()} disabled={images.length + defaultImages.length >= 3} />
        <div className="flex flex-col items-center justify-center gap-4">
          <Upload className="w-12 h-12 text-gray-400" />
          <div className="text-center">
            <h3 className="text-lg font-semibold">Upload file</h3>
            <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
            <p>Max 3 files</p>
            <p className="text-xs text-gray-400 mt-2">Supported formats: JPEG, JPG, PNG</p>
            <p className="text-xs text-gray-400">Max file size: 15MB</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        {/* Default Images Section */}
        {defaultImages.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-500">Default Images</h3>
            <div className="w-fit grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
              {defaultImages.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 w-32 h-32">
                    <img
                      src={image}
                      alt={`Default Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveDefaultImage?.(index);
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Uploaded Images Section */}
        {images.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-500">Uploaded Images</h3>
            <div className="w-fit grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 w-32 h-32">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
