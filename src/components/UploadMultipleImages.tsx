import React, { useMemo } from "react";
import { UploadCloud, X, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type UploadMultipleImagesProps = {
  images: File[];
  setImages: (files: File[]) => void;
  maxImages?: number;
};

const UploadMultipleImages: React.FC<UploadMultipleImagesProps> = ({
  images,
  setImages,
  maxImages = 5,
}) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const availableSlots = Math.max(0, maxImages - images.length);
      const newImages = Array.from(files).slice(0, availableSlots);
      setImages([...images, ...newImages]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
  };

  const previews = useMemo(() => {
    return images.map(file => URL.createObjectURL(file));
  }, [images]);

  // Clean up object URLs to avoid memory leaks
  React.useEffect(() => {
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previews]);

  return (
    <div className="w-full p-2 space-y-4">
      {images.length < maxImages && (
        <motion.label
          whileHover={{ scale: 1.01, borderColor: "var(--primary)" }}
          whileTap={{ scale: 0.99 }}
          className={cn(
            "flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50/50 transition-all group",
            images.length === 0 ? "min-h-[160px]" : "min-h-[100px]"
          )}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Click to upload gallery photos</p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG or WebP (Max {maxImages} images)</p>
            </div>
          </div>
        </motion.label>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <AnimatePresence mode="popLayout">
          {previews.map((url, index) => (
            <motion.div
              key={url}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="relative group aspect-square rounded-lg overflow-hidden border border-slate-100 shadow-sm bg-slate-50"
            >
              <img
                src={url}
                alt={`Preview ${index}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-2 bg-white/20 hover:bg-red-500 text-white rounded-full transition-colors backdrop-blur-sm"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {index === 0 && (
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary/90 text-white text-[10px] font-bold rounded-full backdrop-blur-sm">
                  Cover
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {images.length > 0 && images.length < maxImages && (
          <div className="border border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-primary hover:border-primary/50 transition-colors cursor-pointer group bg-slate-50/30">
            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
              <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
              <ImageIcon className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-medium">Add More</span>
            </label>
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className="flex justify-between items-center px-1">
          <p className="text-[10px] text-slate-400 font-medium">
            {images.length} / {maxImages} images uploaded
          </p>
          <button
            type="button"
            className="text-[10px] text-slate-400 hover:text-red-500 font-bold uppercase tracking-wider transition-colors"
            onClick={() => setImages([])}
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadMultipleImages;

