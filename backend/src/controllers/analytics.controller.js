import { getAdminAnalyticsService } from "../services/adminAnalytics.service.js";

export const getAdminAnalytics = async (req, res) => {
    try {
        const range = Number(req.query.range) || 7;

        if (![7, 30, 90].includes(range)) {
            return res.status(400).json({
                success: false,
                message: "Invalid analytics range. Allowed values: 7, 30, 90",
            });
        }

        const data = await getAdminAnalyticsService(range);

        return res.status(200).json({
            success: true,
            message: "Admin analytics fetched successfully",
            data,
        });
    } catch (error) {
        console.error("Admin Analytics Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch admin analytics",
            error: error.message,
        });
    }
};