import { UserFindById } from "../repositories/user.repository.js";

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