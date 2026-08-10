import { comparePassword, hashPassword } from "../helpers/bcrypt.js";
import {
  updateUserProfile,
  userFindByEmailWithPassword,
  UserFindById,
  userUpdatePassword,
} from "../repositories/user.repository.js";
import { deleteFromS3, uploadToS3 } from "./s3.service.js";

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

export const changePasswordService = async (email, body) => {
  const { currentPassword, newPassword } = body;

  if (!currentPassword) {
    throw new Error("Current password is required");
  }

  if (!newPassword) {
    throw new Error("New password is required");
  }

  const user = await userFindByEmailWithPassword(email);

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await comparePassword(currentPassword, user.password);

  if (!isPasswordValid) {
    throw new Error("Current password is incorrect");
  }

  const isSamePassword = await comparePassword(newPassword, user.password);

  if (isSamePassword) {
    throw new Error("New password must be different from current password");
  }

  const hashedPassword = await hashPassword(newPassword);

  await userUpdatePassword(user?._id, hashedPassword);

  return {
    success: true,
    message: "Password changed successfully",
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
  if (file) {
    updateData.profileImage = `/uploads/profile/${file.filename}`;
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
  return {
    success: true,
    message: "Profile updated successfully",
    user: updatedUser,
  };
};
