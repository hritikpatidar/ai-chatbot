import { registerAIEvents } from "./events/ai.events.js";

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`✅ Socket Connected : ${socket.id}`);

    registerAIEvents(io, socket);

    socket.on("disconnect", () => {
      console.log(`❌ Socket Disconnected : ${socket.id}`);
    });
  });
};