import { verifyAccessToken } from "../helpers/jwt.js";

export const socketMiddleware = (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("AUTH_REQUIRED"));
    }
    const user = verifyAccessToken(token);
    socket.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new Error("TOKEN_EXPIRED"));
    }
    return next(new Error("INVALID_TOKEN"));
  }
};
