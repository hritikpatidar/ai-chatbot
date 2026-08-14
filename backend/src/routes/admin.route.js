import express from "express";


import authMiddleware from "../middlewares/auth.js";
import { createClientUser } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/create-client", authMiddleware, createClientUser); 

export default router;
