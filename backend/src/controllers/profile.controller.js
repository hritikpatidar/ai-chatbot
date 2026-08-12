import {
  getProfileService,
  updateProfileService,
} from "../services/profile.service.js";
import { updateProfileSchema } from "../validators/profile.validator.js";

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

export const updateProfile = async (req, res, next) => {
  try {
    const { error } = updateProfileSchema.validate(req.body);

    const result = await updateProfileService(req.user.id, req.body, req.file);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
