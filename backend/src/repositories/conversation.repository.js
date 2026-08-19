import Conversation from "../models/Conversation.js";

// Create Conversation
export const createConversation = async (data) => {
  return await Conversation.create(data);
};

// Find Conversation By Id
export const findConversationById = async (conversationId) => {
  return await Conversation.findById(conversationId);
};

// Find Conversation By Id + Client
export const findConversationByIdAndClient = async (
  conversationId,
  clientId,
  // guestId,
) => {
  return await Conversation.findOne({
    _id: conversationId,
    clientId,
    // guestId,
  });
};

// Get User Conversations
export const getUserConversations = async (userId, clientId = null) => {
  const query = {
    userId,
    isArchived: false,
  };

  if (clientId) {
    query.clientId = clientId;
  }

  return await Conversation.find(query).sort({
    updatedAt: -1,
  });
};

export const getGuestConversations = async (guestId, clientId) => {
  return await Conversation.find({
    guestId,
    clientId,
    isArchived: false,
  }).sort({ updatedAt: -1 });
};

export const findGuestConversation = async (clientId, guestId) => {
  return await Conversation.findOne({
    clientId,
    guestId,
    isArchived: false,
  }).sort({
    updatedAt: -1,
  });
};

// Get Client Conversations
export const getClientConversations = async (clientId) => {
  return await Conversation.find({
    clientId,
    isArchived: false,
  }).sort({
    updatedAt: -1,
  });
};

// Update Conversation
export const updateConversation = async (conversationId, data) => {
  return await Conversation.findByIdAndUpdate(conversationId, data, {
    new: true,
  });
};

// Delete Conversation
export const deleteConversation = async (conversationId) => {
  return await Conversation.findByIdAndDelete(conversationId);
};
