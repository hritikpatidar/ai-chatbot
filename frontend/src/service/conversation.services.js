import socket from "../socket/socket";

/* ---------------- Create Conversation ---------------- */

export const onConversationCreated = (callback) => {
  socket.off("conversation:created");
  socket.on("conversation:created", callback);
};

export const removeConversationCreated = (callback) => {
  socket.off("conversation:created", callback);
};

/* ---------------- Get Conversations ---------------- */

export const getConversations = () => {
  socket.emit("conversation:list");
};

export const onConversationList = (callback) => {
  socket.off("conversation:list:response");
  socket.on("conversation:list:response", callback);
};

export const removeConversationList = (callback) => {
  socket.off("conversation:list:response", callback);
};

/* ---------------- Rename Conversation ---------------- */

export const renameConversation = (conversationId, title) => {
  socket.emit("conversation:rename", {
    conversationId,
    title,
  });
};

export const onConversationRenamed = (callback) => {
  socket.off("conversation:renamed:response");
  socket.on("conversation:renamed", callback);
};

export const removeConversationRenamed = (callback) => {
  socket.off("conversation:renamed:response", callback);
};

/* ---------------- Delete Conversation ---------------- */

export const deleteConversation = (conversationId) => {
  socket.emit("conversation:delete", {
    conversationId,
  });
};

export const onConversationDeleted = (callback) => {
  socket.off("conversation:deleted:response");
  socket.on("conversation:deleted:response", callback);
};

export const removeConversationDeleted = (callback) => {
  socket.off("conversation:deleted:response", callback);
};

/* ---------------- Conversation Error ---------------- */

export const onConversationError = (callback) => {
   socket.off("conversation:error");
  socket.on("conversation:error", callback);
};

export const removeConversationError = (callback) => {
  socket.off("conversation:error", callback);
};