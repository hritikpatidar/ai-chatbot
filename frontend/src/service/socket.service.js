import socket from "../socket/socket";

export const sendAIMessage = (message) => {
  socket.emit("ai:message", {
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