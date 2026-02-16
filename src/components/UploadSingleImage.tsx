import React, { useState, useEffect, useRef } from "react";
import { UploadCloud, XCircle, User } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type UploadSingleImageProps = {
  image: File | string | null;
  setImage: (file: File | string | null) => void;
  previewImage?: string;
  className?: string;
};

const UploadSingleImage: React.FC<UploadSingleImageProps> = ({
  image,
  setImage,
  previewImage,
  className,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (image instanceof File) {
      const url = URL.createObjectURL(image);
      setPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else if (typeof image === "string") {
      setPreviewUrl(image);
    } else if (previewImage) {
      setPreviewUrl(previewImage);
    } else {
      setPreviewUrl("");
    }
  }, [image, previewImage]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "flex flex-col items-center justify-center w-full max-w-xs sm:max-w-sm mx-auto",
        className
      )}
    >
      {previewUrl ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-3 w-full"
        >
          <div className="relative group">
            <img
              src={previewUrl}
              alt="Uploaded Preview"
              className="object-cover w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 shadow-lg rounded-2xl border-2 border-border"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-2xl">
              <button
                type="button"
                onClick={handleRemoveImage}
                aria-label="Remove image"
                className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              >
                <XCircle size={24} className="text-destructive" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="w-4 h-4" />
            <span>Profile photo</span>
          </div>
        </motion.div>
      ) : (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <label
            htmlFor="image-upload"
            className={cn(
              "flex flex-col items-center justify-center w-full cursor-pointer",
              "border-2 border-dashed rounded-2xl transition-all duration-200",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/30"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              id="image-upload"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              aria-label="Upload image"
            />
            <div className="flex flex-col items-center justify-center w-full py-8 sm:py-12 px-4 gap-3">
              <div className={cn(
                "p-3 rounded-full transition-colors",
                isDragging ? "bg-primary/10" : "bg-muted"
              )}>
                <UploadCloud className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10",
                  isDragging ? "text-primary animate-bounce" : "text-muted-foreground"
                )} />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  {isDragging ? "Drop image here" : "Click to upload"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  PNG, JPG up to 5MB
                </p>
              </div>
            </div>
          </label>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UploadSingleImage;
