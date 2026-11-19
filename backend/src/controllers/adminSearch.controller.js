import { searchAdminRecordsService } from "../services/adminSearch.service.js";

export const searchAdminRecordsController = async (req, res, next) => {
  try {
    const search = String(req.query.q || "").trim();
    if (search.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search query must be at least 2 characters",
      });
    }

    const data = await searchAdminRecordsService(search);
    return res.status(200).json({
      success: true,
      message: "Admin search completed",
      data,
    });
  } catch (error) {
    console.error("Admin search error:", error);
    next(error);
  }
};
