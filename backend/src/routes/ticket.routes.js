import express from "express";

import {
  getClientTickets,
  updateClientTicket,
  deleteClientTicket,
} from "../controllers/ticket.controller.js";

import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

// CLIENT / ADMIN TICKET APIs
 
router.get("/client/all", authMiddleware, getClientTickets);
router.patch("/client/:ticketId", authMiddleware, updateClientTicket);
router.delete("/client/:ticketId", authMiddleware, deleteClientTicket);

export default router;
