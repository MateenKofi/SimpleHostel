import React, { useState, useEffect, useRef } from "react";
import { UploadCloud, X, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
    <div className={cn("w-full max-w-[280px]", className)}>
      <AnimatePresence mode="wait">
        {previewUrl ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-slate-100 shadow-md bg-white"
          >
            <img
              src={previewUrl}
              alt="Logo Preview"
              className="w-full h-full object-contain p-4"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={handleRemoveImage}
                className="p-3 bg-red-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                title="Remove logo"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-white/90 backdrop-blur-sm text-[10px] font-bold text-slate-500 rounded-full border border-slate-100">
              Logo Preview
            </div>
          </motion.div>
        ) : (
          <motion.label
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "flex flex-col items-center justify-center aspect-square rounded-2xl cursor-pointer transition-all duration-300 border-2 border-dashed",
              isDragging
                ? "border-primary bg-primary/5 scale-[1.02]"
                : "border-slate-200 hover:border-primary/50 hover:bg-slate-50"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-3 p-4 text-center">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                isDragging ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
              )}>
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700">Upload Logo</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Drag & Drop</p>
              </div>
            </div>
          </motion.label>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadSingleImage;
