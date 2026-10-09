import {
  getMyNotifications,
  markMyNotificationRead,
  markMyAllNotificationsRead,
} from "../services/notification.service.js";

export const getNotificationsController = async (req, res) => {
  try {
    const result = await getMyNotifications(
      req.user.id,
      req.query.page,
      req.query.limit
    );

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};

export const markNotificationReadController = async (
  req,
  res
) => {
  try {
    console.log("req.params",req.params.id)
    console.log("req.user.id",req.user.id)
    const notification = await markMyNotificationRead(
      req.params.id,
      req.user.id
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notifications not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update notification",
    });
  }
};

export const markAllNotificationsReadController = async (
  req,
  res
) => {
  try {
    await markMyAllNotificationsRead(req.user.id);

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update notifications",
    });
  }
};