import express from "express";

import { identifyWidgetVisitorController, verifyWidgetSessionController } from "../controllers/widget.controller.js";

const router = express.Router();

router.post("/identify", identifyWidgetVisitorController);
router.get("/session/verify", verifyWidgetSessionController);

export default router;
