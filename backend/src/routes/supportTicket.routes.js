import express from "express";

import {
  createSupportTicket,
  getMySupportTickets,
  getAllSupportTickets,
  getSupportTicketById,
  replyToSupportTicket,
  updateSupportTicketStatus,
} from "../controllers/supportTicket.controller.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

// Admin APIs
router.get("/admin", authMiddleware, getAllSupportTickets);
router.get("/admin/:id", authMiddleware, getSupportTicketById);
router.post("/admin/:id/reply", authMiddleware, replyToSupportTicket);
router.patch(
  "/admin/:id/status",
  authMiddleware,
  updateSupportTicketStatus
);

export default router;