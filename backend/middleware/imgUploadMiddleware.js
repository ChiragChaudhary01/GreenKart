import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

const imgUploadMiddleware = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const steamUpload = () => {
      return new Promise((resolve, reject) => {
        const steam = cloudinary.uploader.upload_stream(
          { folder: "farmer_products" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        Readable.from(req.file.buffer).pipe(steam);
      });
    };

    const result = await steamUpload();
    console.log("fileInfo", req.file);
    console.log("result", result);
    req.file.cloudinaryURL = result.secure_url; // pass cloudinay url forward
    next();
  } catch (error) {
    console.error("cloudinary upload failed:", error);
    return res.status(500).json({ error: "image upload failed" });
  }
};

export default imgUploadMiddleware;
