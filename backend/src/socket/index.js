import { Server } from "socket.io";
import env from "../config/env.js";
import { socketMiddleware } from "./middleware.js";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
    transports: ["websocket"],
  });
  io.use(socketMiddleware);
  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }

  return io;
};
