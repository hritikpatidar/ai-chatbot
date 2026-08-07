import socket from "../socket/socket";

/* ---------------- Create Conversation ---------------- */

export const onConversationCreated = (callback) => {
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
  socket.on("conversation:list", callback);
};

export const removeConversationList = (callback) => {
  socket.off("conversation:list", callback);
};

/* ---------------- Get Single Conversation ---------------- */

export const getConversation = (conversationId) => {
  socket.emit("conversation:get", {
    conversationId,
  });
};

export const onConversation = (callback) => {
  socket.on("conversation", callback);
};

export const removeConversation = (callback) => {
  socket.off("conversation", callback);
};

/* ---------------- Rename Conversation ---------------- */

export const renameConversation = (conversationId, title) => {
  socket.emit("conversation:rename", {
    conversationId,
    title,
  });
};

export const onConversationRenamed = (callback) => {
  socket.on("conversation:renamed", callback);
};

export const removeConversationRenamed = (callback) => {
  socket.off("conversation:renamed", callback);
};

/* ---------------- Delete Conversation ---------------- */

export const deleteConversation = (conversationId) => {
  socket.emit("conversation:delete", {
    conversationId,
  });
};

export const onConversationDeleted = (callback) => {
  socket.on("conversation:deleted", callback);
};

export const removeConversationDeleted = (callback) => {
  socket.off("conversation:deleted", callback);
};


export const onConversationError = (callback) => {
  socket.on("conversation:error", callback);
};

export const removeConversationError = (callback) => {
  socket.off("conversation:error", callback);
};