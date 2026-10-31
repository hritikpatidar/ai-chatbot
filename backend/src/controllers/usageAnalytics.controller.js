import {
  getUsageAnalyticsService,
} from "../services/usageAnalytics.service.js";

export const getUsageAnalytics = async (req, res) => {
  try {
    const clientId = req.user?.clientId || req.user?.id;

    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID not found.",
      });
    }

    const data = await getUsageAnalyticsService(clientId);

    return res.status(200).json({
      success: true,
      message: "Usage analytics fetched successfully.",
      data,
    });
  } catch (error) {
    console.error("Get Usage Analytics Error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch usage analytics.",
    });
  }
};

