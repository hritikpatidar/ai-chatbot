import socket from "../socket/socket";

/* ---------------- Get Conversation Messages ---------------- */

export const getConversationMessages = (conversationId) => {
  socket.emit("conversation:messages", {
    conversationId,
  });
};

export const onConversationMessages = (callback) => {
  // socket.off("conversation:messages:response");
  socket.on("conversation:messages:response", callback);
};

export const removeConversationMessages = (callback) => {
  socket.off("conversation:messages:response", callback);
};


/* ---------------- Message Error ---------------- */

export const onMessageError = (callback) => {
  socket.off("message:error");
  socket.on("message:error", callback);
};

export const removeMessageError = (callback) => {
  socket.off("message:error", callback);
};