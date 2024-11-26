import multer from "multer";
import path from "path";
import fs from "fs";

const uploadBaseDir = path.join(process.cwd(), "public/uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const section = (req.body.section as string) || "";

    if (!section) {
      return cb(new Error("Section name is required"), "");
    }

    const sectionDir = path.join(uploadBaseDir, section);

    // Create the directory if it doesn't exist
    if (!fs.existsSync(sectionDir)) {
      fs.mkdirSync(sectionDir, { recursive: true });
    }

    cb(null, sectionDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s/g, "_")}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  },
});

export default upload;
