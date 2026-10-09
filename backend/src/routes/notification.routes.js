import { Router } from "express";

import {
    getNotificationsController,
    markNotificationReadController,
    markAllNotificationsReadController,
} from "../controllers/notification.controller.js";
import authMiddleware from "../middlewares/auth.js";

const router = Router();

router.get("/", authMiddleware, getNotificationsController);

router.patch(
    "/read-all",
    authMiddleware,
    markAllNotificationsReadController
);

router.patch(
    "/:id/read",
    authMiddleware,
    markNotificationReadController
);

export default router;