import {
  deleteConversation,
  findConversationById,
  findConversationByIdAndClient,
  getClientConversations,
  getUserConversations,
} from "../repositories/conversation.repository.js";

import {
  deleteConversationMessages,
  getAllConversationMessages,
} from "../repositories/message.repository.js";

// Get Conversation List
export const getConversationListService = async ({
  userId = null,
  clientId = null,
}) => {
  if (clientId) {
    return await getClientConversations(clientId);
  }

  if (userId) {
    return await getUserConversations(userId);
  }

  throw new Error("User or client is required");
};

// Get Conversation Messages
export const getConversationMessagesService = async ({
  userId = null,
  clientId = null,
  conversationId,
}) => {
  let conversation;

  if (clientId) {
    conversation =
      await findConversationByIdAndClient(
        conversationId,
        clientId,
      );
  } else if (userId) {
    conversation =
      await findConversationById(conversationId);

    if (
      conversation &&
      conversation.userId?.toString() !==
        userId.toString()
    ) {
      throw new Error(
        "Unauthorized access to conversation",
      );
    }
  } else {
    throw new Error("User or client is required");
  }

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const messages =
    await getAllConversationMessages(conversationId);

  return {
    conversation,
    messages,
  };
};

// Delete Conversation
export const deleteConversationService = async ({
  userId = null,
  clientId = null,
  conversationId,
}) => {
  let conversation;

  if (clientId) {
    conversation =
      await findConversationByIdAndClient(
        conversationId,
        clientId,
      );
  } else if (userId) {
    conversation =
      await findConversationById(conversationId);

    if (
      conversation &&
      conversation.userId?.toString() !==
        userId.toString()
    ) {
      throw new Error(
        "Unauthorized access to conversation",
      );
    }
  } else {
    throw new Error("User or client is required");
  }

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  await deleteConversationMessages(conversationId);
  await deleteConversation(conversationId);

  return {
    conversationId,
  };
};