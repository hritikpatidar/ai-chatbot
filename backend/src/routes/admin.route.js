import express from "express";

import authMiddleware from "../middlewares/auth.js";
import {
  createClientUser,
  deleteClient,
  getAllClients,
  getClientById,
  updateAdminClient,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/create-client", authMiddleware, createClientUser);
router.get("/clients", authMiddleware, getAllClients);
router.get("/clients/:clientId", authMiddleware, getClientById);
router.delete("/delete-client/:clientId", authMiddleware, deleteClient);
router.put("/clients/:clientId", authMiddleware, updateAdminClient);

export default router;
