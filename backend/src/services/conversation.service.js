import {
  createConversation,
  deleteConversation,
  findConversationById,
  findConversationByIdAndClient,
  findGuestConversation,
  getClientConversations,
  getGuestConversations,
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
  guestId = null,
}) => {
  if (guestId && clientId) {
    return await getGuestConversations(guestId, clientId);
  }

  // if (clientId) {
  //   return await getClientConversations(clientId);
  // }

  if (userId) {
    return await getUserConversations(userId);
  }

  throw new Error("User or client is required");
};

// Get Conversation Messages
export const getConversationMessagesService = async ({
  userId = null,
  clientId = null,
  // guestId = null,
  conversationId,
}) => {
  let conversation;

  if (clientId) {
    conversation = await findConversationByIdAndClient(
      conversationId,
      clientId,
    );
  } else if (userId) {
    conversation = await findConversationById(conversationId);

    if (conversation && conversation.userId?.toString() !== userId.toString()) {
      throw new Error("Unauthorized access to conversation");
    }
  } else {
    throw new Error("User or client is required");
  }

  // if (userId) {
  //   conversation = await findConversationById(conversationId);

  //   if (conversation && conversation.userId?.toString() !== userId.toString()) {
  //     throw new Error("Unauthorized access to conversation");
  //   }
  // } else if (guestId && clientId) {
  //   conversation = await findConversationByIdAndClient(
  //     conversationId,
  //     clientId,
  //     guestId,
  //   );
  // } else {
  //   throw new Error("guestId, User or client is required");
  // }

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const messages = await getAllConversationMessages(conversationId);

  return {
    conversation,
    messages,
  };
};

// Delete Conversation
export const deleteConversationService = async ({
  userId = null,
  clientId = null,
  // guestId = null,
  conversationId,
}) => {
  let conversation;

  if (clientId) {
    conversation = await findConversationByIdAndClient(
      conversationId,
      clientId,
    );
  } else if (userId) {
    conversation = await findConversationById(conversationId);

    if (conversation && conversation.userId?.toString() !== userId.toString()) {
      throw new Error("Unauthorized access to conversation");
    }
  } else {
    throw new Error("User or client is required");
  }

  // if (userId) {
  //   conversation = await findConversationById(conversationId);

  //   if (conversation && conversation.userId?.toString() !== userId.toString()) {
  //     throw new Error("Unauthorized access to conversation");
  //   }
  // } else if (guestId && clientId) {
  //   conversation = await findConversationByIdAndClient(
  //     conversationId,
  //     clientId,
  //     guestId,
  //   );
  // } else {
  //   throw new Error("guestId, User or client is required");
  // }

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  await deleteConversationMessages(conversationId);
  await deleteConversation(conversationId);

  return {
    conversationId,
  };
};

export const findOrCreateGuestConversation = async ({
  clientId,
  guestId,
  title,
  lastMessage,
}) => {
  let conversation = await findGuestConversation(clientId, guestId);
  if (conversation) {
    return conversation;
  }

  conversation = await createConversation({
    clientId,
    guestId,
    title,
    lastMessage,
    lastMessageAt: new Date(),
  });

  return conversation;
};
