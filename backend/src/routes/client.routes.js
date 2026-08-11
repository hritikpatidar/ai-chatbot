import express from "express";

import {
  createClient,
  getClientConfig,
  getClientById,
  updateClient,
} from "../controllers/client.controller.js";

import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

/*
 * Admin / authenticated APIs
 */

router.post("/", authMiddleware, createClient);

router.get("/:clientId", authMiddleware, getClientById);

router.patch("/:clientId", authMiddleware, updateClient);

/*
 * Public API
 *
 * Client website/widget will use this.
 */

router.get("/config/:clientKey", getClientConfig);

export default router;
