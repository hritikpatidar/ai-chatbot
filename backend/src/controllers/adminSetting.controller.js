import { getAdminSettingsService, updateAdminSettingsService } from "../services/adminSetting.service.js";
import { getGeminiModelsService } from "../services/gemini.service.js";
import { notifyAdminClientsOfMaintenanceMode } from "../services/notification.service.js";



// GET ADMIN SETTINGS
export const getAdminSettingsController = async (req, res) => {
  try {
    const adminId = req.user?.id || req.user?._id;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required",
      });
    }

    const settings = await getAdminSettingsService(adminId);

    return res.status(200).json({
      success: true,
      message: "Admin settings fetched successfully",
      data: settings,
    });
  } catch (error) {
    console.error("Get Admin Settings Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch admin settings",
    });
  }
};

// UPDATE ADMIN SETTINGS
export const updateAdminSettingsController = async (req, res) => {
  try {
    const adminId = req.user?.id || req.user?._id;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required",
      });
    }

    const previousSettings = await getAdminSettingsService(adminId);
    const settings = await updateAdminSettingsService(adminId, req.body);

    if (previousSettings.maintenanceMode !== settings.maintenanceMode) {
      try {
        const notificationResult =
          await notifyAdminClientsOfMaintenanceMode({
            adminId,
            maintenanceMode: settings.maintenanceMode,
          });

        if (!notificationResult.success) {
          console.error(
            "Some clients did not receive the maintenance notification:",
            notificationResult,
          );
        }
      } catch (notificationError) {
        console.error(
          "Failed to send maintenance mode notifications:",
          notificationError,
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: "Admin settings updated successfully",
      data: settings,
    });
  } catch (error) {
    console.error("Update Admin Settings Error:", error);

    const isValidationError =
      error.name === "ValidationError" ||
      error.name === "CastError" ||
      error.message.startsWith("Invalid ") ||
      error.message.includes("must be") ||
      error.message.includes("Please provide");

    return res.status(isValidationError ? 400 : 500).json({
      success: false,
      message: error.message || "Failed to update admin settings",
    });
  }
};

export const getGeminiModelsController = async (req, res) => {
  try {
    const models = await getGeminiModelsService();

    return res.status(200).json({
      success: true,
      message: "Gemini models fetched successfully",
      data: models,
    });
  } catch (error) {
    console.error("Get Gemini Models Error:", error);

    return res.status(502).json({
      success: false,
      message: "Failed to fetch Gemini models",
    });
  }
};
