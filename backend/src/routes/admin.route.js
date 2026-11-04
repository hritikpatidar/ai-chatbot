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
import { getAdminAnalytics } from "../controllers/analytics.controller.js";
import { getAdminSubscriptionsController } from "../controllers/subscription.controller.js";

const router = express.Router();
const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }
  next();
};

router.post("/create-client", authMiddleware, createClientUser);
router.get("/clients", authMiddleware, getAllClients);
router.get("/clients/:clientId", authMiddleware, getClientById);
router.delete("/delete-client/:clientId", authMiddleware, deleteClient);
router.put("/clients/:clientId", authMiddleware, updateAdminClient);
router.get("/dashboard", authMiddleware, getAdminDashboard);
router.get("/analytics", authMiddleware, getAdminAnalytics);
router.get("/subscriptions", authMiddleware, adminOnly, getAdminSubscriptionsController);

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

router.get("/settings", authMiddleware,);
router.patch("/settings", authMiddleware,);

export default router;
