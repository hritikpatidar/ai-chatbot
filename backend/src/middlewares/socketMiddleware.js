import { verifyAccessToken } from "../helpers/jwt.js";
import Client from "../models/Client.js";

export const socketMiddleware = async (socket, next) => {
  try {
    let token = socket.handshake.auth?.token;
    const clientKey = socket.handshake.auth?.clientKey;
    const guestId = socket.handshake.auth?.guestId;
    console.log("socket.handshake.auth", socket.handshake.auth);
    console.log("guestId", guestId);
    if (!token) {
      const authorization = socket.handshake.headers?.token;

      if (authorization?.startsWith("Bearer ")) {
        token = authorization.split(" ")[1];
      }
    }

    if (token) {
      try {
        const user = verifyAccessToken(token);
        socket.user = user;
      } catch (error) {
        if (error.name === "TokenExpiredError") {
          return next(new Error("TOKEN_EXPIRED"));
        }
        return next(new Error("INVALID_TOKEN"));
      }
    }

    if (clientKey) {
      const client = await Client.findOne({
        clientKey,
        status: "active",
      }).select("_id clientKey businessName businessType");

      if (!client) {
        return next(new Error("INVALID_CLIENT"));
      }
      socket.businessClient = client;
      socket.clientId = client._id.toString();
      if (!socket.user && guestId) {
        socket.guestId = guestId;
      }
    }

    if (!socket.user && !socket.clientId) {
      return next(new Error("AUTH_OR_CLIENT_REQUIRED"));
    }

    console.log("🔐 Socket authenticated:", {
      socketId: socket.id,
      userId: socket.user?.id || null,
      clientId: socket.clientId || null,
      guestId: socket.guestId || null,
    });

    next();
  } catch (error) {
    console.error("❌ Socket Middleware Error:", error);

    return next(new Error("SOCKET_AUTH_FAILED"));
  }
};
