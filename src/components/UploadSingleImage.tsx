// ImageUploader.jsx
import React from "react";
import { UploadCloud, XCircle } from "lucide-react";
import { motion } from "framer-motion";

type UploadSingleImageProps = {
  image: File | null;
  setImage: (file: File | null) => void;
};

const UploadSingleImage: React.FC<UploadSingleImageProps> = ({ image, setImage }) => {

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImage(file); // pass the File object to parent
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center justify-center gap-4 p-6 border-2 border-dashed border-gray-400 rounded-2xl"
    >
      {image ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <img
            src={URL.createObjectURL(image)}
            alt="Uploaded Preview"
            className="w-48 h-48 object-cover rounded-xl shadow-lg"
          />
          <button
            onClick={handleRemoveImage}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
          >
            <XCircle size={20} />
            Remove
          </button>
        </motion.div>
      ) : (
        <motion.label
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-3">
            <UploadCloud className="w-10 h-10 text-gray-500 animate-bounce" />
            <span className="text-gray-600 text-sm">Click to upload</span>
          </div>
        </motion.label>
      )}
    </motion.div>
  );
};

export default UploadSingleImage;
