import express from "express";

import {
  getProfile,
  updateProfile,
} from "../controllers/profile.controller.js";
import authMiddleware from "../middlewares/auth.js";
import uploadProfileImage from "../middlewares/upload.js";

const router = express.Router();

router.get("/", authMiddleware, getProfile);
router.put("/update-profile", authMiddleware, uploadProfileImage.single("profileImage"), updateProfile);

export default router;
