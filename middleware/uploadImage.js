const multer = require("multer");
const path = require("path");

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only JPG, JPEG, and PNG is allowed"), false);
  }

  cb(null, true);
};

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // Limit file size to 1MB
  fileFilter,
});

function uploadSingleImage(imageType) {
  return (req, res, next) => {
    upload.single(imageType)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: "Ukuran file terlalu besar. Maksimal 1MB"
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      next();
    });
  };
}

function uploadMultipleImages(fields) {
  return upload.fields(fields);
}

module.exports = { uploadSingleImage, uploadMultipleImages };