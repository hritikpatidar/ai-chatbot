import express from "express";

import {
  changePassword,
  getProfile,
  updateProfile,
} from "../controllers/profile.controller.js";
import authMiddleware from "../middlewares/auth.js";
import uploadProfileImage from "../middlewares/upload.js";

const router = express.Router();

router.get("/", authMiddleware, getProfile);
router.post("/change-password", authMiddleware, changePassword);
router.put("/update-profile", authMiddleware, uploadProfileImage.single("profileImage"), updateProfile);

export default router;
