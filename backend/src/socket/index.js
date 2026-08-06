import { Server } from "socket.io";
import env from "../config/env.js";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
  });

  return io;
};

export const getIO = () => io;