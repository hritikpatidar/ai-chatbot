import socket from "../socket/socket";

// MESSAGE CONTAINER SOCKET SERVICES
export const sendAIMessage = (conversationId, message) => {
  socket.emit("ai:message", {
    conversationId,
    message,
  });
};

export const onAIChunk = (callback) => {
  socket.off("ai:chunk");
  socket.on("ai:chunk", callback);
};

export const removeAIChunk = (callback) => {
  socket.off("ai:chunk", callback);
};

export const onAIEnd = (callback) => {
  socket.off("ai:end");
  socket.on("ai:end", callback);
};

export const removeAIEnd = (callback) => {
  socket.off("ai:end", callback);
};

export const onAIError = (callback) => {
   socket.off("ai:error");
  socket.on("ai:error", callback);
};

export const removeAIError = (callback) => {
  socket.off("ai:error", callback);
};

export const stopAIMessage = () => {
  socket.emit("ai:stop");
};

export const onAIStopped = (callback) => {
   socket.off("ai:stopped");
  socket.on("ai:stopped", callback);
};

export const removeAIStopped = (callback) => {
  socket.off("ai:stopped", callback);
};
