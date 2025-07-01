import cloudinary from "./cloudinary.js";
import streamifier from "streamifier";

const uploadToCloudinary = (fileBuffer, folder = "ecommerce") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return reject(error);
        }
        resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

export default uploadToCloudinary;
