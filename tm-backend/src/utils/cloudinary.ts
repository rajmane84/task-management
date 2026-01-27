import { v2 as cloudinaryV2 } from "cloudinary";
import fs from "fs";

cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

/**
 * Upload a file to Cloudinary
 * @param filePath - Local path to the file
 * @param folder - Folder in Cloudinary (optional)
 * @returns secure_url of uploaded image
 */
export const uploadOnCloudinary = async (
  localFilePath: string,
  folder: string = "avatars"
): Promise<string | null> => {
  if (!localFilePath) return null;

  try {
    const fileMetaData = await cloudinaryV2.uploader.upload(localFilePath, {
      resource_type: "image",
      folder,
    });

    console.log("Cloudinary public_id:", fileMetaData.public_id);

    // Delete local file after successful upload
    fs.existsSync(localFilePath) && fs.unlinkSync(localFilePath);

    return fileMetaData.secure_url;
  } catch (err) {
    // Delete local file even if upload fails
    fs.existsSync(localFilePath) && fs.unlinkSync(localFilePath);

    console.error("Cloudinary upload error:", err);
    return null;
  }
};

/**
 * Delete a file from Cloudinary by public_id
 * @param publicId - Cloudinary public_id
 */
export const deleteFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinaryV2.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error("Failed to delete image");
  }
};
