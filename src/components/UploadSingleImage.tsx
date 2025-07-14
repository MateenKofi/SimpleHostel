import React, { useState, useEffect,useRef } from "react";
import { UploadCloud, XCircle } from "lucide-react";
import { motion } from "framer-motion";

type UploadSingleImageProps = {
  image: File | string | null;
  setImage: (file: File | string | null) => void;
  previewImage?: string;
};

const UploadSingleImage: React.FC<UploadSingleImageProps> = ({
  image,
  setImage,
  previewImage,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");
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

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center justify-center gap-4 p-6 border-2 border-gray-400 border-dashed rounded-2xl"
    >
      {previewUrl ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <img
            src={previewUrl}
            alt="Uploaded Preview"
            className="object-cover w-48 h-48 shadow-lg rounded-xl"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            aria-label="Remove image"
            className="flex items-center gap-2 px-4 py-2 text-white transition bg-red-500 rounded-xl hover:bg-red-600"
          >
            <XCircle size={20} />
          </button>
        </motion.div>
      ) : (
        <motion.label
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            aria-label="Upload logo"
          />
          <div className="flex flex-col items-center gap-3">
            <UploadCloud className="w-10 h-10 text-gray-500 animate-bounce" />
            <span className="text-sm text-gray-600">Click to upload</span>
          </div>
        </motion.label>
      )}
    </motion.div>
  );
};

export default UploadSingleImage;