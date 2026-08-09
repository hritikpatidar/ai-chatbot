import {
    deleteConversation,
  findConversationById,
  getUserConversations,
} from "../repositories/conversation.repository.js";
import {
    deleteConversationMessages,
  getAllConversationMessages,
} from "../repositories/message.repository.js";

export const getConversationListService = async (userId) => {
  const conversations = await getUserConversations(userId);

  return conversations;
};

export const getConversationMessagesService = async (
  userId,
  conversationId,
) => {
  const conversation = await findConversationById(conversationId);

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  // Make sure conversation belongs to logged-in user
  if (conversation.userId.toString() !== userId.toString()) {
    throw new Error("Unauthorized access to conversation");
  }

  const messages = await getAllConversationMessages(conversationId);

  return {
    conversation,
    messages,
  };
};

export const deleteConversationService = async (
  userId,
  conversationId,
) => {
  const conversation =
    await findConversationById(conversationId);

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  // Check conversation ownership
  if (
    conversation.userId.toString() !==
    userId.toString()
  ) {
    throw new Error(
      "Unauthorized access to conversation",
    );
  }

  // Delete all messages
  await deleteConversationMessages(conversationId);

  // Delete conversation
  await deleteConversation(conversationId);

  return {
    conversationId,
  };
};