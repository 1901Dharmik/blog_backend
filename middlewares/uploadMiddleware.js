import multer from "multer";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter: (req, file, cb) => {
    ALLOWED_TYPES.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Only JPEG, PNG, GIF, WebP images are allowed"), false);
  },
}).single("image");

// Wrap multer so errors pass to Express error handler
export function uploadMiddleware(req, res, next) {
  upload(req, res, (err) => {
    if (err?.code === "LIMIT_FILE_SIZE") err.message = "Image too large (max 5MB)";
    err ? next(err) : next();
  });
}
