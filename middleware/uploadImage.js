const multer = require("multer");
const path = require("path");

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only JPG, JPEG, and PNG is allowed")), false;
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
  return upload.single(imageType);
}

module.exports = { uploadSingleImage };