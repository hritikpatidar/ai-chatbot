import { verifyAccessToken } from "../helpers/jwt.js";
import Client from "../models/Client.js";

export const socketMiddleware = async (socket, next) => {
  try {
    let token = socket.handshake.auth?.token;

    const clientKey = socket.handshake.auth?.clientKey;

    /*
     * ----------------------------------------------
     * 1. Existing authenticated user connection
     * ----------------------------------------------
     */

    if (!token) {
      const authorization = socket.handshake.headers?.token;

      if (authorization?.startsWith("Bearer ")) {
        token = authorization.split(" ")[1];
      }
    }

    /*
     * ----------------------------------------------
     * User Authentication
     * ----------------------------------------------
     */

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

    /*
     * ----------------------------------------------
     * Client Authentication
     * ----------------------------------------------
     */

    if (clientKey) {
      const client = await Client.findOne({
        clientKey,
        status: "active",
      }).select("_id clientKey businessName businessType");

      if (!client) {
        return next(new Error("INVALID_CLIENT"));
      }

      /*
       * IMPORTANT:
       *
       * Don't use:
       * socket.client
       *
       * because "client" is an internal
       * Socket.IO property.
       */

      socket.businessClient = client;

      socket.clientId = client._id.toString();
    }

    /*
     * ----------------------------------------------
     * User OR Client required
     * ----------------------------------------------
     */

    if (!socket.user && !socket.clientId) {
      return next(new Error("AUTH_OR_CLIENT_REQUIRED"));
    }

    console.log("🔐 Socket authenticated:", {
      socketId: socket.id,

      userId: socket.user?.id || null,

      clientId: socket.clientId || null,
    });

    next();
  } catch (error) {
    console.error("❌ Socket Middleware Error:", error);

    return next(new Error("SOCKET_AUTH_FAILED"));
  }
};
