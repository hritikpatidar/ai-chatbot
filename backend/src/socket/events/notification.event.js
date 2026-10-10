
export const emitNotificationCreated = (io, notification) => {
  if (!io || !notification?.userId || !notification?._id) {
    console.error("Invalid notification data");
    return;
  }

  const userId = notification.userId.toString();
  const room = `user:${userId}`;

  // Get all socket IDs connected to this user
  const socketIds = [
    ...(io.sockets.adapter.rooms.get(room) || []),
  ];

  if (socketIds.length === 0) {
    console.log("No active sockets for user:", userId);
    return;
  }

  const payload = {
    notificationId: notification._id.toString(),
  };

  // Send notification to each socket ID
  socketIds.forEach((socketId) => {
    io.to(socketId).emit("notification:created", payload);

    console.log("Notification sent to socket:", socketId);
  });
};


export const registerNotificationEvents = (io, socket) => {
    const userId = socket.user?.id?.toString();
    if (userId) {
        socket.join(`user:${userId}`);
    }
  
};