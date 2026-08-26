import {
  createSubscriptionPlanService,
  getAllSubscriptionPlansService,
  getAdminSubscriptionPlanService,
  updateSubscriptionPlanService,
  deleteSubscriptionPlanService,
} from "../services/adminSubscriptionPlan.service.js";

/* =========================================================
   CREATE PLAN
   POST /admin/subscription-plans
========================================================= */

export const createSubscriptionPlanController =
  async (req, res) => {
    try {
      const {
        name,
        description = "",
        stripePriceId,
        stripeProductId,
        amount,
        currency = "gbp",
        interval = "month",
        features = [],
        sortOrder = 0,
        status = "active",
      } = req.body;

      /* ---------------------------------------------------
         Required fields
      --------------------------------------------------- */

      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Plan name is required",
        });
      }

      if (!stripePriceId) {
        return res.status(400).json({
          success: false,
          message: "Stripe Price ID is required",
        });
      }

      if (!stripeProductId) {
        return res.status(400).json({
          success: false,
          message: "Stripe Product ID is required",
        });
      }

      if (
        amount === undefined ||
        amount === null
      ) {
        return res.status(400).json({
          success: false,
          message: "Amount is required",
        });
      }

      if (Number(amount) < 0) {
        return res.status(400).json({
          success: false,
          message:
            "Amount cannot be negative",
        });
      }

      if (!["month", "year"].includes(interval)) {
        return res.status(400).json({
          success: false,
          message:
            "Interval must be month or year",
        });
      }

      if (
        !["active", "inactive"].includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Status must be active or inactive",
        });
      }

      if (!Array.isArray(features)) {
        return res.status(400).json({
          success: false,
          message:
            "Features must be an array",
        });
      }

      /* ---------------------------------------------------
         Create
      --------------------------------------------------- */

      const plan =
        await createSubscriptionPlanService({
          name,
          description,
          stripePriceId,
          stripeProductId,
          amount: Number(amount),
          currency,
          interval,
          features,
          sortOrder: Number(sortOrder),
          status,
        });

      return res.status(201).json({
        success: true,
        message:
          "Subscription plan created successfully",
        data: plan,
      });
    } catch (error) {
      console.error(
        "Create subscription plan error:",
        error,
      );

      return res
        .status(error.statusCode || 500)
        .json({
          success: false,
          message:
            error.message ||
            "Failed to create subscription plan",
        });
    }
  };

/* =========================================================
   GET ALL PLANS
   GET /admin/subscription-plans
========================================================= */

export const getAllSubscriptionPlansController =
  async (req, res) => {
    try {
      const plans =
        await getAllSubscriptionPlansService();

      return res.status(200).json({
        success: true,
        message:
          "Subscription plans fetched successfully",
        data: plans,
      });
    } catch (error) {
      console.error(
        "Get all subscription plans error:",
        error,
      );

      return res
        .status(error.statusCode || 500)
        .json({
          success: false,
          message:
            error.message ||
            "Failed to fetch subscription plans",
        });
    }
  };

/* =========================================================
   GET SINGLE PLAN
   GET /admin/subscription-plans/:planId
========================================================= */

export const getAdminSubscriptionPlanController =
  async (req, res) => {
    try {
      const { planId } = req.params;

      if (!planId) {
        return res.status(400).json({
          success: false,
          message: "Plan ID is required",
        });
      }

      const plan =
        await getAdminSubscriptionPlanService(
          planId,
        );

      return res.status(200).json({
        success: true,
        message:
          "Subscription plan fetched successfully",
        data: plan,
      });
    } catch (error) {
      console.error(
        "Get subscription plan error:",
        error,
      );

      return res
        .status(error.statusCode || 500)
        .json({
          success: false,
          message:
            error.message ||
            "Failed to fetch subscription plan",
        });
    }
  };

/* =========================================================
   UPDATE PLAN
   PATCH /admin/subscription-plans/:planId
========================================================= */

export const updateSubscriptionPlanController =
  async (req, res) => {
    try {
      const { planId } = req.params;

      if (!planId) {
        return res.status(400).json({
          success: false,
          message: "Plan ID is required",
        });
      }

      const allowedFields = [
        "name",
        "description",
        "stripePriceId",
        "stripeProductId",
        "amount",
        "currency",
        "interval",
        "features",
        "sortOrder",
        "status",
      ];

      const updateData = {};

      for (const field of allowedFields) {
        if (
          req.body[field] !== undefined
        ) {
          updateData[field] =
            req.body[field];
        }
      }

      if (
        Object.keys(updateData).length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "No fields provided for update",
        });
      }

      /* ---------------------------------------------------
         Validation
      --------------------------------------------------- */

      if (
        updateData.amount !== undefined
      ) {
        if (
          Number(updateData.amount) < 0
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Amount cannot be negative",
          });
        }

        updateData.amount =
          Number(updateData.amount);
      }

      if (
        updateData.interval !== undefined &&
        !["month", "year"].includes(
          updateData.interval,
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Interval must be month or year",
        });
      }

      if (
        updateData.status !== undefined &&
        !["active", "inactive"].includes(
          updateData.status,
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Status must be active or inactive",
        });
      }

      if (
        updateData.features !== undefined &&
        !Array.isArray(updateData.features)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Features must be an array",
        });
      }

      if (
        updateData.sortOrder !== undefined
      ) {
        updateData.sortOrder =
          Number(updateData.sortOrder);
      }

      /* ---------------------------------------------------
         Update
      --------------------------------------------------- */

      const plan =
        await updateSubscriptionPlanService(
          planId,
          updateData,
        );

      return res.status(200).json({
        success: true,
        message:
          "Subscription plan updated successfully",
        data: plan,
      });
    } catch (error) {
      console.error(
        "Update subscription plan error:",
        error,
      );

      return res
        .status(error.statusCode || 500)
        .json({
          success: false,
          message:
            error.message ||
            "Failed to update subscription plan",
        });
    }
  };

/* =========================================================
   DELETE PLAN
   DELETE /admin/subscription-plans/:planId
========================================================= */

export const deleteSubscriptionPlanController =
  async (req, res) => {
    try {
      const { planId } = req.params;

      if (!planId) {
        return res.status(400).json({
          success: false,
          message: "Plan ID is required",
        });
      }

      const deletedPlan =
        await deleteSubscriptionPlanService(
          planId,
        );

      return res.status(200).json({
        success: true,
        message:
          "Subscription plan deleted successfully",
        data: deletedPlan,
      });
    } catch (error) {
      console.error(
        "Delete subscription plan error:",
        error,
      );

      return res
        .status(error.statusCode || 500)
        .json({
          success: false,
          message:
            error.message ||
            "Failed to delete subscription plan",
        });
    }
  };