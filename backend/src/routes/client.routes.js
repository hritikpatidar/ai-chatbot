import express from "express";

import {
  getClientConfig,
  getClientById,
  updateClient,
} from "../controllers/client.controller.js";

import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

router.get("/:clientId", authMiddleware, getClientById);
router.patch("/:clientId", authMiddleware, updateClient);
router.get("/config/:clientKey", getClientConfig);

export default router;
