const cloudinary = require("./cloudinary-config.js");

function uploadToCloudinary(buffer, folderName, filename) {
  return new Promise((resolve, reject) => {
    if (!buffer || !filename) {
      return reject(new Error("Missing file buffer or filename", 400));
    }

    const timestamp = Date.now();
    const uniqueName = `${timestamp}_${filename.split(".")[0]}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderName,
        public_id: uniqueName,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("Failed to upload to cloudinary", error);
          return reject(new Error("Gagal mengupload gambar ke cloudinary"));
        }
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
}

module.exports = uploadToCloudinary;