import {
  getSubscriptionPlans,
  getSubscriptionPlan,
  getCurrentSubscription,
  getUserSubscription,
  getSubscriptionDetails,
  createSubscriptionService,
  changeSubscriptionPlanService,
  previewSubscriptionChangeService,
  cancelSubscriptionService,
  cancelSubscriptionAtPeriodEndService,
  resumeSubscriptionService,
  getPaymentMethodsService,
  addPaymentMethodService,
  setDefaultPaymentMethodService,
  removePaymentMethodService,
  refreshSubscriptionService,
} from "../services/subscription.service.js";

/* =========================================================
   GET SUBSCRIPTION PLANS
   GET /subscription/plans
========================================================= */

export const getSubscriptionPlansController = async (req, res) => {
  try {
    const plans = await getSubscriptionPlans();

    return res.status(200).json({
      success: true,
      message: "Subscription plans fetched successfully",
      data: plans,
    });
  } catch (error) {
    console.error("Get subscription plans error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch subscription plans",
    });
  }
};

/* =========================================================
   GET SINGLE SUBSCRIPTION PLAN
   GET /subscription/plans/:planId
========================================================= */

export const getSubscriptionPlanController = async (req, res) => {
  try {
    const { planId } = req.params;

    const plan = await getSubscriptionPlan(planId);

    return res.status(200).json({
      success: true,
      message: "Subscription plan fetched successfully",
      data: plan,
    });
  } catch (error) {
    console.error("Get subscription plan error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch subscription plan",
    });
  }
};

/* =========================================================
   GET CURRENT SUBSCRIPTION
   GET /subscription/current
========================================================= */

export const getCurrentSubscriptionController = async (req, res) => {
  try {
    /*
     * Assuming auth middleware puts user/client information
     * inside req.user.
     *
     * Adjust this according to your existing auth middleware.
     */
    const clientId = req.user?.clientId;

    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required",
      });
    }

    const subscription = await getCurrentSubscription(clientId);

    return res.status(200).json({
      success: true,
      message: "Current subscription fetched successfully",
      data: subscription,
    });
  } catch (error) {
    console.error("Get current subscription error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch current subscription",
    });
  }
};

/* =========================================================
   GET USER SUBSCRIPTION
   Optional API
   GET /subscription/user/current
========================================================= */

export const getUserSubscriptionController = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const subscription = await getUserSubscription(userId);

    return res.status(200).json({
      success: true,
      message: "User subscription fetched successfully",
      data: subscription,
    });
  } catch (error) {
    console.error("Get user subscription error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch user subscription",
    });
  }
};

/* =========================================================
   GET SUBSCRIPTION DETAILS
   GET /subscription/:subscriptionId
========================================================= */

export const getSubscriptionDetailsController = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    console.log("subscriptionId", subscriptionId);
    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        message: "Subscription ID is required",
      });
    }

    const subscription = await getSubscriptionDetails(subscriptionId);

    return res.status(200).json({
      success: true,
      message: "Subscription details fetched successfully",
      data: subscription,
    });
  } catch (error) {
    console.error("Get subscription details error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch subscription details",
    });
  }
};

/* =========================================================
   CREATE SUBSCRIPTION
   POST /subscription/create
========================================================= */

export const createSubscriptionController = async (req, res) => {
  try {
    const { planId, paymentMethodId = null } = req.body;

    const userId = req.user?._id || req.user?.id;
    const clientId = req.user?.clientId;
    /*
     * User information
     *
     * If your auth middleware already provides these values,
     * use them directly.
     */

    const fullName = req.user?.fullName || req.body?.fullName;

    const email = req.user?.email || req.body?.email;

    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required",
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!planId) {
      return res.status(400).json({
        success: false,
        message: "Plan ID is required",
      });
    }

    if (!fullName) {
      return res.status(400).json({
        success: false,
        message: "Full name is required",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const data = await createSubscriptionService({
      clientId,
      userId,
      fullName,
      email,
      planId,
      paymentMethodId,
    });

    return res.status(201).json({
      success: true,
      message: "Subscription created successfully",
      data,
    });
  } catch (error) {
    console.error("Create subscription error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to create subscription",
    });
  }
};

/* =========================================================
   PREVIEW PLAN CHANGE
   POST /subscription/preview
========================================================= */

export const previewSubscriptionChangeController = async (req, res) => {
  try {
    const { subscriptionId, planId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        message: "Subscription ID is required",
      });
    }

    if (!planId) {
      return res.status(400).json({
        success: false,
        message: "Plan ID is required",
      });
    }

    const data = await previewSubscriptionChangeService({
      subscriptionId,
      planId,
    });

    return res.status(200).json({
      success: true,
      message: "Subscription change preview generated successfully",
      data,
    });
  } catch (error) {
    console.error("Preview subscription change error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to preview subscription change",
    });
  }
};

/* =========================================================
   CHANGE PLAN
   POST /subscription/change-plan
========================================================= */

export const changeSubscriptionPlanController = async (req, res) => {
  try {
    const { subscriptionId, planId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        message: "Subscription ID is required",
      });
    }

    if (!planId) {
      return res.status(400).json({
        success: false,
        message: "Plan ID is required",
      });
    }

    const data = await changeSubscriptionPlanService({
      subscriptionId,
      planId,
    });

    return res.status(200).json({
      success: true,
      message: "Subscription plan changed successfully",
      data,
    });
  } catch (error) {
    console.error("Change subscription plan error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to change subscription plan",
    });
  }
};

/* =========================================================
   CANCEL IMMEDIATELY
   POST /subscription/cancel
========================================================= */

export const cancelSubscriptionController = async (req, res) => {
  try {
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        message: "Subscription ID is required",
      });
    }

    const subscription = await cancelSubscriptionService(subscriptionId);

    return res.status(200).json({
      success: true,
      message: "Subscription canceled successfully",
      data: subscription,
    });
  } catch (error) {
    console.error("Cancel subscription error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to cancel subscription",
    });
  }
};

/* =========================================================
   CANCEL AT PERIOD END
   POST /subscription/cancel-at-period-end
========================================================= */

export const cancelSubscriptionAtPeriodEndController = async (req, res) => {
  try {
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        message: "Subscription ID is required",
      });
    }

    const subscription =
      await cancelSubscriptionAtPeriodEndService(subscriptionId);

    return res.status(200).json({
      success: true,
      message: "Subscription will be canceled at the end of the billing period",
      data: subscription,
    });
  } catch (error) {
    console.error("Cancel at period end error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to cancel subscription at period end",
    });
  }
};

/* =========================================================
   RESUME SUBSCRIPTION
   POST /subscription/resume
========================================================= */

export const resumeSubscriptionController = async (req, res) => {
  try {
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        message: "Subscription ID is required",
      });
    }

    const subscription = await resumeSubscriptionService(subscriptionId);

    return res.status(200).json({
      success: true,
      message: "Subscription resumed successfully",
      data: subscription,
    });
  } catch (error) {
    console.error("Resume subscription error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to resume subscription",
    });
  }
};

/* =========================================================
   GET PAYMENT METHODS
   GET /subscription/payment-methods
========================================================= */

export const getPaymentMethodsController = async (req, res) => {
  try {
    console.log("req.query", req.query);
    const subscriptionId = req.query.subscriptionId;
    console.log("subscriptionIds controler", subscriptionId);
    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        message: "Subscription ID is required",
      });
    }

    const data = await getPaymentMethodsService(subscriptionId);

    return res.status(200).json({
      success: true,
      message: "Payment methods fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Get payment methods error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch payment methods",
    });
  }
};

/* =========================================================
   ADD PAYMENT METHOD
   POST /subscription/payment-method
========================================================= */

export const addPaymentMethodController = async (req, res) => {
  try {
    const { subscriptionId, paymentMethodId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        message: "Subscription ID is required",
      });
    }

    if (!paymentMethodId) {
      return res.status(400).json({
        success: false,
        message: "Payment method ID is required",
      });
    }

    const paymentMethod = await addPaymentMethodService({
      subscriptionId,
      paymentMethodId,
    });

    return res.status(200).json({
      success: true,
      message: "Payment method added successfully",
      data: paymentMethod,
    });
  } catch (error) {
    console.error("Add payment method error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to add payment method",
    });
  }
};

/* =========================================================
   SET DEFAULT PAYMENT METHOD
   PATCH /subscription/payment-method/default
========================================================= */

export const setDefaultPaymentMethodController = async (req, res) => {
  try {
    const { subscriptionId, paymentMethodId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        message: "Subscription ID is required",
      });
    }

    if (!paymentMethodId) {
      return res.status(400).json({
        success: false,
        message: "Payment method ID is required",
      });
    }

    const paymentMethod = await setDefaultPaymentMethodService({
      subscriptionId,
      paymentMethodId,
    });

    return res.status(200).json({
      success: true,
      message: "Default payment method updated successfully",
      data: paymentMethod,
    });
  } catch (error) {
    console.error("Set default payment method error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to set default payment method",
    });
  }
};

/* =========================================================
   REMOVE PAYMENT METHOD
   DELETE /subscription/payment-method/:paymentMethodId
========================================================= */

export const removePaymentMethodController = async (req, res) => {
  try {
    const { paymentMethodId } = req.params;

    const { subscriptionId } = req.query;

    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        message: "Subscription ID is required",
      });
    }

    if (!paymentMethodId) {
      return res.status(400).json({
        success: false,
        message: "Payment method ID is required",
      });
    }

    const paymentMethod = await removePaymentMethodService({
      subscriptionId,
      paymentMethodId,
    });

    return res.status(200).json({
      success: true,
      message: "Payment method removed successfully",
      data: paymentMethod,
    });
  } catch (error) {
    console.error("Remove payment method error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to remove payment method",
    });
  }
};

/* =========================================================
   REFRESH SUBSCRIPTION
   POST /subscription/refresh
========================================================= */

export const refreshSubscriptionController = async (req, res) => {
  try {
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        message: "Subscription ID is required",
      });
    }

    const subscription = await refreshSubscriptionService(subscriptionId);

    return res.status(200).json({
      success: true,
      message: "Subscription refreshed successfully",
      data: subscription,
    });
  } catch (error) {
    console.error("Refresh subscription error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to refresh subscription",
    });
  }
};
