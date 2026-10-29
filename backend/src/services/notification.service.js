import {
  createNotification,
  findNotificationsByUser,
  markNotificationRead,
  markAllNotificationsRead,
  updateNotificationDelivery,
  deleteNotification,
} from "../repositories/notification.repository.js";

import {
  findAdminUserFcmTokenByAdminId,
  findClientUserFcmTokenByClientId,
} from "../repositories/user.repository.js";

import sendNotification from "../helpers/fcm_notification.js";
import { getIO } from "../config/socket.js";
import { emitNotificationCreated } from "../socket/events/notification.event.js";

// export const createAndSendNotification = async ({
//   type = "general",
//   clientId = null,
//   title,
//   message,
//   webRoute = "/",
//   screen = "notification",
//   image = null,
//   metadata = {},
// }) => {
//   try {
//     const clientUser = clientId
//       ? await findClientUserFcmTokenByClientId(clientId)
//       : null;

//     let notification = await createNotification({
//       userId: clientUser?._id,
//       clientId,
//       title,
//       message,
//       webRoute,
//       screen,
//       image,
//       metadata,
//       type,
//     });
//     //notification socket emit
//     try {
//       const io = getIO();
//       emitNotificationCreated(io, notification);
//     } catch (socketError) {
//       console.error("Notification socket emit failed:", socketError.message);
//     }

//     if (clientUser?.fcmToken) {
//       try {
//         const result = await sendNotification(clientUser.fcmToken, {
//           title,
//           message,
//           image: image || "",
//           webRoute,
//           screen,
//           notificationId: notification._id.toString(),
//           metadata,
//           type,
//         });

//         // If your helper returns a message ID/status,
//         // updateNotificationDelivery can be used here.
//       } catch (fcmError) {
//         console.error("FCM notification failed:", fcmError.message);
//       }
//     }


//     return {
//       success: true,
//       notification,
//     };
//   } catch (error) {
//     console.log("error", error)
//     return {
//       success: false,
//     };
//   }
// };


export const createAndSendNotification = async ({
  type = "general",
  clientId = null,
  adminId = null,
  title,
  message,
  webRoute = "/",
  screen = "notification",
  image = null,
  metadata = {},
}) => {
  try {
    const io = getIO();
    const recipients = [];
    // 1. Client recipient
    if (clientId) {
      const clientUser =
        await findClientUserFcmTokenByClientId(clientId);

      if (clientUser) {
        recipients.push({
          user: clientUser,
          clientId,
          role: "client",
        });
      }
    }

    // 2. Specific admin recipient
    if (adminId) {
      const adminUser = await findAdminUserFcmTokenByAdminId(adminId);

      if (adminUser) {
        recipients.push({
          user: adminUser,
          clientId: null,
          role: "admin",
        });
      }
    }

    const results = await Promise.allSettled(
      recipients.map(async ({ user, clientId: recipientClientId, role }) => {
        const notification = await createNotification({
          userId: user._id,
          clientId: recipientClientId,
          title,
          message,
          webRoute,
          screen,
          image,
          metadata,
          type,
        });

        try {
          emitNotificationCreated(io, notification);
          console.log(`[${role}] Socket event emitted`);
        } catch (socketError) {
          console.error(`[${role}] Socket error:`, socketError);
        }

        if (user.fcmToken) {
          try {
            const fcmResult = await sendNotification(user.fcmToken, {
              title,
              message,
              image: image || "",
              webRoute,
              screen,
              notificationId: notification._id.toString(),
              metadata,
              type,
            });
          } catch (fcmError) {
            console.error(`[${role}] FCM error:`, fcmError);
          }
        } else {
          console.warn(`[${role}] FCM token missing for user:`, user._id);
        }
        return notification;
      })
    );

    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(
          `Recipient ${index} notification failed:`,
          result.reason
        );
      }
    });

    return {
      success: results.every((result) => result.status === "fulfilled"),
      count: results.filter((result) => result.status === "fulfilled").length,
      notifications: results
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value),
    };
  } catch (error) {
    console.error("createAndSendNotification error:", error);
    return {
      success: false,
      count: 0,
      notifications: [],
    };
  }
};

export const getMyNotifications = async (
  userId,
  page = 1,
  limit = 10,
  filter = "all"
) => {
  console.log("filter",filter)
  return findNotificationsByUser(
    userId,
    Math.max(1, Number(page) || 1),
    Math.min(100, Math.max(1, Number(limit) || 10)),
    filter
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
  return deleteNotification(notificationId, userId);
};
