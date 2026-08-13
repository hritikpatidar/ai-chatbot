import Message from "../models/Message.js";

// Create Message
export const createMessage = async (data) => {
  return await Message.create(data);
};

// Get Messages By Conversation
export const getConversationMessages = async (conversationId, limit = 20) => {
  return await Message.find({
    conversationId,
  })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Get All Messages
export const getAllConversationMessages = async (conversationId) => {
  return await Message.find({
    conversationId,
  }).sort({
    createdAt: 1,
  });
};

// Find Message
export const findMessageById = async (messageId) => {
  return await Message.findById(messageId);
};

// Update Message
export const updateMessage = async (messageId, data) => {
  return await Message.findByIdAndUpdate(messageId, data, {
    new: true,
  });
};

// Delete Message
export const deleteMessage = async (messageId) => {
  return await Message.findByIdAndDelete(messageId);
};

// Delete All Messages of Conversation
export const deleteConversationMessages = async (conversationId) => {
  return await Message.deleteMany({
    conversationId,
  });
};

// GET LAST 20 MESSAGES ONLY
export const getRecentConversationMessages = async (
  conversationId,
  limit = 20,
) => {
  const messages = await Message.find({
    conversationId,
  })
    .sort({ createdAt: -1 })
    .limit(limit);

  return messages.reverse();
};
