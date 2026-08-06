import { getProfileService } from "../services/profile.service.js";

export const getProfile = async (req, res) => {
  try {
    const response = await getProfileService(req.user.id);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};