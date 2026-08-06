import express from "express";

import { getProfile } from "../controllers/profile.controller.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

router.get("/", authMiddleware, getProfile);

export default router;