import { getAdminDashboardService } from "../services/adminDashboard.service.js";

export const getAdminDashboard = async (req, res) => {
  try {
    const data = await getAdminDashboardService();

    return res.status(200).json({
      success: true,

      message: "Admin dashboard fetched successfully",

      data,
    });
  } catch (error) {
    console.error("Get admin dashboard error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,

      message: error.message || "Failed to fetch admin dashboard",
    });
  }
};
