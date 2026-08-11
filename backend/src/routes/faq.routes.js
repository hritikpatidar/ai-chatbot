import express from "express";

import {
  createFAQController,
  getFAQsController,
  updateFAQController,
  deleteFAQController,
} from "../controllers/faq.controller.js";

import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

router.post("/client/:clientId", authMiddleware, createFAQController);

router.get("/client/:clientId", authMiddleware, getFAQsController);

router.patch("/:faqId", authMiddleware, updateFAQController);

router.delete("/:faqId", authMiddleware, deleteFAQController);

export default router;
