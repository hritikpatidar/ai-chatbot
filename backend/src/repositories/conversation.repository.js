import Conversation from "../models/Conversation.js";

// Create Conversation
export const createConversation = async (data) => {
  return await Conversation.create(data);
};

// Find Conversation By Id
export const findConversationById = async (conversationId) => {
    console.log("repository conversation",conversationId)
  return await Conversation.findById(conversationId);
};

// Get User Conversations
export const getUserConversations = async (userId) => {
  return await Conversation.find({
    userId,
    isArchived: false,
  }).sort({
    updatedAt: -1,
  });
};

// Update Conversation
export const updateConversation = async (conversationId, data) => {
  return await Conversation.findByIdAndUpdate(
    conversationId,
    data,
    {
      new: true,
    }
  );
};

// Delete Conversation
export const deleteConversation = async (conversationId) => {
  return await Conversation.findByIdAndDelete(conversationId);
};