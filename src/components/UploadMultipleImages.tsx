// UploadMultipleImages.jsx or .tsx
import React from "react";
import { UploadCloud, XCircle } from "lucide-react";
import { motion } from "framer-motion";

type UploadMultipleImagesProps = {
  images: File[];
  setImages: (files: File[]) => void;
};

const UploadMultipleImages: React.FC<UploadMultipleImagesProps> = ({
  images,
  setImages,
}) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImages([...images, ...Array.from(files)]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
  };

  const handleClearAll = () => {
    setImages([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col gap-4 p-6"
    >
        <motion.label
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center justify-center gap-4 p-6 border-2 border-dashed border-gray-400 rounded-2xl"
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-3">
            <UploadCloud className="w-10 h-10 text-gray-500 animate-bounce" />
            <span className="text-gray-600 text-sm">Click to upload images</span>
          </div>
        </motion.label>

      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative"
            >
              <img
                src={URL.createObjectURL(image)}
                alt={`Uploaded Preview ${index}`}
                className="w-32 h-32 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 bg-white rounded-full p-1"
              >
                <XCircle className="w-4 h-4 text-red-500" />
              </button>
            </motion.div>

          ))}
        </div>
      )}
    </motion.div>
  );
};

export default UploadMultipleImages;
