import {
  createNotification,
  findNotificationsByUser,
  markNotificationRead,
  markAllNotificationsRead,
  updateNotificationDelivery,
} from "../repositories/notification.repository.js";

import {
  findClientUserFcmTokenByClientId,
} from "../repositories/user.repository.js";

import sendNotification from "../helpers/fcm_notification.js";

export const createAndSendNotification = async ({
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
    console.log("clientUser",clientUser)
    let notification = await createNotification({
      userId: clientUser?._id,
      clientId,
      title,
      message,
      webRoute,
      screen,
      image,
      metadata,
    });

    const result = await sendNotification(
      clientUser.fcmToken,
      {
        title,
        message,
        image: image || "",
        webRoute,
        screen,
        notificationId: notification._id.toString(),
      }
    );

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
