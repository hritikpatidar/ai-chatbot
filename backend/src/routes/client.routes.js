import express from "express";

import {
  getClientConfig,
  getClientById,
  updateClient,
} from "../controllers/client.controller.js";

import authMiddleware from "../middlewares/auth.js";
import { createSupportTicket, getMySupportTickets } from "../controllers/supportTicket.controller.js";

const router = express.Router();

// Client Support Ticket APIs
router.post("/support-ticket", authMiddleware, createSupportTicket);
router.get("/client-support-tickets", authMiddleware, getMySupportTickets);

// Client APIs
router.get("/:clientId", authMiddleware, getClientById);
router.patch("/:clientId", authMiddleware, updateClient);
router.get("/config/:clientKey", getClientConfig);


export default router;
