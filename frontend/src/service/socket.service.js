import socket from "../socket/socket";

export const sendAIMessage = (conversationId, message) => {
  socket.emit("ai:message", {
    conversationId,
    message,
  });
};

export const onAIChunk = (callback) => {
  socket.on("ai:chunk", callback);
};

export const removeAIChunk = (callback) => {
  socket.off("ai:chunk", callback);
};

export const onAIEnd = (callback) => {
  socket.on("ai:end", callback);
};

export const removeAIEnd = (callback) => {
  socket.off("ai:end", callback);
};

export const onAIError = (callback) => {
  socket.on("ai:error", callback);
};

export const removeAIError = (callback) => {
  socket.off("ai:error", callback);
};

export const stopAIMessage = () => {
  socket.emit("ai:stop");
};

export const onAIStopped = (callback) => {
  socket.on("ai:stopped", callback);
};

export const removeAIStopped = (callback) => {
  socket.off("ai:stopped", callback);
};
