import express from "express";

import {
  getSubscriptionPlansController,
  getSubscriptionPlanController,
  getCurrentSubscriptionController,
  getUserSubscriptionController,
  getSubscriptionDetailsController,
  createSubscriptionController,
  previewSubscriptionChangeController,
  changeSubscriptionPlanController,
  cancelSubscriptionController,
  cancelSubscriptionAtPeriodEndController,
  resumeSubscriptionController,
  getPaymentMethodsController,
  addPaymentMethodController,
  setDefaultPaymentMethodController,
  removePaymentMethodController,
  refreshSubscriptionController,
} from "../controllers/subscription.controller.js";

import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

/* =========================================================
   SUBSCRIPTION PLANS
========================================================= */

/**
 * Get all active subscription plans
 *
 * GET /subscription/plans
 */
router.get("/plans", authMiddleware, getSubscriptionPlansController);

/**
 * Get single subscription plan
 *
 * GET /subscription/plans/:planId
 */
router.get("/plans/:planId", authMiddleware, getSubscriptionPlanController);

/* =========================================================
   CURRENT SUBSCRIPTION
========================================================= */

/**
 * Get logged-in client's current subscription
 *
 * GET /subscription/current
 */
router.get("/current", authMiddleware, getCurrentSubscriptionController);

/* =========================================================
   CREATE SUBSCRIPTION
========================================================= */

/**
 * Create new subscription
 *
 * POST /subscription/create
 *
 * Body:
 * {
 *   "planId": "...",
 *   "paymentMethodId": "pm_xxx"
 * }
 */
router.post("/create", authMiddleware, createSubscriptionController);

/**
 * Get logged-in user's subscription
 *
 * GET /subscription/user/current
 */
router.get("/user/current", authMiddleware, getUserSubscriptionController);

/**
 * Get subscription details
 *
 * GET /subscription/:subscriptionId
 */
router.get(
  "/details/:subscriptionId",
  authMiddleware,
  getSubscriptionDetailsController,
);

/* =========================================================
   PREVIEW SUBSCRIPTION CHANGE
========================================================= */

/**
 * Preview upgrade/downgrade
 *
 * POST /subscription/preview
 *
 * Body:
 * {
 *   "subscriptionId": "...",
 *   "planId": "..."
 * }
 */
router.post("/preview", authMiddleware, previewSubscriptionChangeController);

/* =========================================================
   CHANGE PLAN
========================================================= */

/**
 * Upgrade / downgrade subscription
 *
 * POST /subscription/change-plan
 *
 * Body:
 * {
 *   "subscriptionId": "...",
 *   "planId": "..."
 * }
 */
router.post("/change-plan", authMiddleware, changeSubscriptionPlanController);

/* =========================================================
   CANCEL SUBSCRIPTION
========================================================= */

/**
 * Cancel subscription immediately
 *
 * POST /subscription/cancel
 *
 * Body:
 * {
 *   "subscriptionId": "..."
 * }
 */
router.post("/cancel", authMiddleware, cancelSubscriptionController);

/**
 * Cancel subscription at billing period end
 *
 * POST /subscription/cancel-at-period-end
 *
 * Body:
 * {
 *   "subscriptionId": "..."
 * }
 */
router.post(
  "/cancel-at-period-end",
  authMiddleware,
  cancelSubscriptionAtPeriodEndController,
);

/* =========================================================
   RESUME SUBSCRIPTION
========================================================= */

/**
 * Resume subscription
 *
 * POST /subscription/resume
 *
 * Body:
 * {
 *   "subscriptionId": "..."
 * }
 */
router.post("/resume", authMiddleware, resumeSubscriptionController);

/* =========================================================
   PAYMENT METHODS
========================================================= */

/**
 * Get saved payment methods
 *
 * GET /subscription/payment-methods?subscriptionId=xxx
 */
router.get("/payment-methods", authMiddleware, getPaymentMethodsController);

/**
 * Add payment method
 *
 * POST /subscription/payment-method
 *
 * Body:
 * {
 *   "subscriptionId": "...",
 *   "paymentMethodId": "pm_xxx"
 * }
 */
router.post("/payment-method", authMiddleware, addPaymentMethodController);

/**
 * Set default payment method
 *
 * PATCH /subscription/payment-method/default
 *
 * Body:
 * {
 *   "subscriptionId": "...",
 *   "paymentMethodId": "pm_xxx"
 * }
 */
router.patch(
  "/payment-method/default",
  authMiddleware,
  setDefaultPaymentMethodController,
);

/**
 * Remove payment method
 *
 * DELETE /subscription/payment-method/:paymentMethodId?subscriptionId=xxx
 */
router.delete(
  "/payment-method/:paymentMethodId",
  authMiddleware,
  removePaymentMethodController,
);

/* =========================================================
   REFRESH SUBSCRIPTION
========================================================= */

/**
 * Refresh subscription from Stripe
 *
 * POST /subscription/refresh
 *
 * Body:
 * {
 *   "subscriptionId": "..."
 * }
 */
router.post("/refresh", authMiddleware, refreshSubscriptionController);

export default router;
