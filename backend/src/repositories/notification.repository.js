import Notification from "../models/Notification.js";

export const createNotification = async (data) => {
  return Notification.create(data);
};

export const findNotificationsByUser = async (
  userId,
  page = 1,
  limit = 10
) => {
  const skip = (page - 1) * limit;

  const [notifications, total, unreadCount] =
    await Promise.all([
      Notification.find({ userId })
        .populate("userId","_id fullName email profileImage role")
        .populate("clientId", "_id businessName contact clientKey")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Notification.countDocuments({ userId }),

      Notification.countDocuments({
        userId,
        isRead: false,
      }),
    ]);

  return {
    notifications: notifications.map((item) => ({
      ...item,
      id: item._id.toString(),
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    unreadCount,
  };
};

export const markNotificationRead = async (
  notificationId,
  userId
) => {
  return Notification.findOneAndUpdate(
    {
      _id: notificationId,
      userId,
    },
    {
      $set: {
        isRead: true,
        readAt: new Date(),
      },
    },
    { new: true }
  );
};

export const markAllNotificationsRead = async (userId) => {
  return Notification.updateMany(
    {
      userId,
      isRead: false,
    },
    {
      $set: {
        isRead: true,
        readAt: new Date(),
      },
    }
  );
};

export const updateNotificationDelivery = async (
  notificationId,
  update
) => {
  return Notification.findByIdAndUpdate(
    notificationId,
    { $set: update },
    { new: true }
  );
};
