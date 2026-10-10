import {
  createNotification,
  findNotificationsByUser,
  markNotificationRead,
  markAllNotificationsRead,
  updateNotificationDelivery,
  deleteNotification,
} from "../repositories/notification.repository.js";

import {
  findClientUserFcmTokenByClientId,
} from "../repositories/user.repository.js";

import sendNotification from "../helpers/fcm_notification.js";
import { getIO } from "../config/socket.js";
import { emitNotificationCreated } from "../socket/events/notification.event.js";

export const createAndSendNotification = async ({
  type = "general",
  clientId = null,
  title,
  message,
  webRoute = "/",
  screen = "notification",
  image = null,
  metadata = {},
}) => {

  try {
    const clientUser = clientId
      ? await findClientUserFcmTokenByClientId(clientId)
      : null;

    let notification = await createNotification({
      userId: clientUser?._id,
      clientId,
      title,
      message,
      webRoute,
      screen,
      image,
      metadata,
      type,
    });
    //notification socket emit
    try {
      const io = getIO();
      emitNotificationCreated(io, notification);
    } catch (socketError) {
      console.error("Notification socket emit failed:", socketError.message);
    }

    if (clientUser?.fcmToken) {
      try {
        const result = await sendNotification(clientUser.fcmToken, {
          title,
          message,
          image: image || "",
          webRoute,
          screen,
          notificationId: notification._id.toString(),
          metadata,
          type,
        });

        // If your helper returns a message ID/status,
        // updateNotificationDelivery can be used here.
      } catch (fcmError) {
        console.error("FCM notification failed:", fcmError.message);
      }
    }


    return {
      success: true,
      notification,
    };
  } catch (error) {
    console.log("error", error)
    return {
      success: false,
    };
  }
};

export const getMyNotifications = async (
  userId,
  page = 1,
  limit = 10
) => {
  return findNotificationsByUser(
    userId,
    Math.max(1, Number(page) || 1),
    Math.min(100, Math.max(1, Number(limit) || 10))
  );
};

export const markMyNotificationRead = async (
  notificationId,
  userId
) => {
  return markNotificationRead(notificationId, userId);
};

export const markMyAllNotificationsRead = async (userId) => {
  return markAllNotificationsRead(userId);
};

export const deleteNotifications = async (
  notificationId,
  userId
) => {
  return deleteNotification(notificationId,userId);
};
