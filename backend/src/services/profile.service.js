import { comparePassword, hashPassword } from "../helpers/bcrypt.js";
import {
  updateUserProfile,
  userFindByEmailWithPassword,
  UserFindById,
  userUpdatePassword,
} from "../repositories/user.repository.js";
import { deleteFromS3, uploadToS3 } from "./s3.service.js";
import fs from "fs/promises";
import path from "path";

export const getProfileService = async (userId) => {
  const user = await UserFindById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return {
    success: true,
    message: "Profile fetched successfully",
    user,
  };
};

export const updateProfileService = async (userId, body, file) => {
  const { fullName } = body;
  const user = await UserFindById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  const updateData = {};
  if (fullName?.trim()) {
    updateData.fullName = fullName;
  }
  let oldImagePath = null;
  if (file) {
    updateData.profileImage = `/uploads/profile/${file.filename}`;
    oldImagePath = user.profileImage;
  }
  //s3 use karoge tab ye use karna hai
  // if (file) {
  //   const extension = file.originalname.split(".").pop().toLowerCase();

  //   const key = `profiles/${userId}/profile-${Date.now()}.${extension}`;

  //   const uploadedKey = await uploadToS3({
  //     buffer: file.buffer,
  //     mimetype: file.mimetype,
  //     key,
  //   });

  //   updateData.profileImage = uploadedKey;
  // }

  if (Object.keys(updateData).length === 0) {
    throw new Error("Nothing to update");
  }

  const updatedUser = await updateUserProfile(userId, updateData);
  // s3 se old image delete karne ke liye ye use karo
  // if (
  //   file &&
  //   user.profileImage &&
  //   user.profileImage !== updateData.profileImage
  // ) {
  //   try {
  //     await deleteFromS3(user.profileImage);
  //   } catch (error) {
  //     console.error(
  //       "Old profile image delete failed:",
  //       error,
  //     );
  //   }
  // }

  if (file && oldImagePath) {
    try {
      /*
       * DB me path:
       * /uploads/profile/profile-userid-123.jpg
       *
       * Actual path:
       * E:/AI CHATBOT/BACKEND/SRC/uploads/profile/profile-userid-123.jpg
       */

      const oldFilePath = path.join(
        process.cwd(),
        "src",
        oldImagePath.replace(/^\/uploads\//, "uploads/"),
      );

      await fs.unlink(oldFilePath);

      console.log("✅ Old profile image deleted:", oldFilePath);
    } catch (error) {
      // File already deleted/not found
      if (error.code !== "ENOENT") {
        console.error("❌ Old profile image delete failed:", error);
      }
    }
  }
  return {
    success: true,
    message: "Profile updated successfully",
    user: updatedUser,
  };
};
