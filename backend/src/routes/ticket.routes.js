import express from "express";

import {
  createTicket,
  getTicket,
  getUserTickets,
  getClientTickets,
  updateUserTicket,
  updateClientTicket,
  deleteUserTicket,
  deleteClientTicket,
} from "../controllers/ticket.controller.js";

import authMiddleware from "../middlewares/auth.js";

const router = express.Router();


// USER TICKET APIs
// router.post("/", authMiddleware, createTicket);
// router.get("/my", authMiddleware, getUserTickets);
// router.get("/:ticketId", authMiddleware, getTicket); //get signle ticket
// router.patch("/:ticketId", authMiddleware, updateUserTicket); 
// router.delete("/:ticketId", authMiddleware, deleteUserTicket);


// CLIENT / ADMIN TICKET APIs
 
router.get("/client/all", authMiddleware, getClientTickets);
router.patch("/client/:ticketId", authMiddleware, updateClientTicket);
router.delete("/client/:ticketId", authMiddleware, deleteClientTicket);

export default router;
