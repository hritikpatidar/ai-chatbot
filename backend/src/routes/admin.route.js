import express from "express";

import authMiddleware from "../middlewares/auth.js";
import {
  createClientUser,
  deleteClient,
  getAllClients,
  getClientById,
  updateAdminClient,
} from "../controllers/admin.controller.js";
import { getAdminDashboard } from "../controllers/adminDashboard.controller.js";
import { createSubscriptionPlanController, deleteSubscriptionPlanController, getAdminSubscriptionPlanController, getAllSubscriptionPlansController, updateSubscriptionPlanController } from "../controllers/adminSubscriptionPlan.controller.js";

const router = express.Router();

router.post("/create-client", authMiddleware, createClientUser);
router.get("/clients", authMiddleware, getAllClients);
router.get("/clients/:clientId", authMiddleware, getClientById);
router.delete("/delete-client/:clientId", authMiddleware, deleteClient);
router.put("/clients/:clientId", authMiddleware, updateAdminClient);
router.get("/dashboard", authMiddleware, getAdminDashboard);

router.post(
  "/subscription-plans",
  authMiddleware,
  createSubscriptionPlanController,
);

router.get(
  "/subscription-plans",
  authMiddleware,
  getAllSubscriptionPlansController,
);

router.get(
  "/subscription-plans/:planId",
  authMiddleware,
  getAdminSubscriptionPlanController,
);

router.patch(
  "/subscription-plans/:planId",
  authMiddleware,
  updateSubscriptionPlanController,
);

router.delete(
  "/subscription-plans/:planId",
  authMiddleware,
  deleteSubscriptionPlanController,
);

export default router;
