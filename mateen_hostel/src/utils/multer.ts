import { Request } from "express";
import multer from "multer";
import path from "path";

// Multer config
const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req: Request, file: Express.Multer.File, cb: Function) => {
    // Allowable file extensions
    const allowedExt = [
      ".jpg",
      ".jpeg",
      ".png",
      ".pdf",
      ".mp4",
      ".mp3",
      ".xls",
      ".xlsx",
      ".ppt",
      ".pptx",
      ".doc",
      ".docx",
    ];

    const ext = path.extname(file.originalname).toLowerCase();

    // Check if the file extension is allowed
    if (!allowedExt.includes(ext)) {
      cb(new Error("File type is not supported"), false);
      return;
    }

    cb(null, true);
  },
});

export default upload;
