import mongoose from "mongoose";

import {
  deleteConversationService,
  getConversationListService,
  getConversationMessagesService,
} from "../../services/conversation.service.js";

export const registerConversationEvents = (io, socket) => {
  socket.on("conversation:list", async () => {
    try {
      const userId = socket.user?.id || null;
      const clientId = socket.clientId || null;
      const guestId = socket.guestId || null;

      if (!userId && !clientId) {
        socket.emit("conversation:error", {
          success: false,
          message: "User or client is required",
        });
        return;
      }
      if (!userId && !guestId) {
        socket.emit("conversation:error", {
          success: false,
          message: "User or client is required",
        });
        return;
      }

      const conversations = await getConversationListService({
        userId,
        clientId,
        guestId,
      });

      socket.emit("conversation:list:response", {
        success: true,
        conversations,
      });
    } catch (error) {
      console.error("Conversation List Error:", error);
      socket.emit("conversation:error", {
        success: false,
        message: "Failed to fetch conversations",
      });
    }
  });

  socket.on("conversation:messages", async (data) => {
    try {
      const { conversationId } = data;
      if (!conversationId) {
        socket.emit("conversation:error", {
          success: false,
          message: "Conversation ID is required",
        });
        return;
      }

      if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        socket.emit("conversation:error", {
          success: false,
          message: "Invalid conversation ID",
        });
        return;
      }

      const userId = socket.user?.id || null;
      const clientId = socket.clientId || null;
      if (!userId && !clientId) {
        socket.emit("conversation:error", {
          success: false,
          message: "User or client is required",
        });
        return;
      }

      const result = await getConversationMessagesService({
        userId,
        clientId,
        conversationId,
      });

      socket.emit("conversation:messages:response", {
        success: true,
        conversationId,
        messages: result.messages,
      });
    } catch (error) {
      console.error("Conversation Messages Error:", error);

      socket.emit("conversation:error", {
        success: false,
        message: error.message,
      });
    }
  });

  socket.on("conversation:delete", async (data) => {
    try {
      const { conversationId } = data;
      if (!conversationId) {
        socket.emit("conversation:error", {
          success: false,
          message: "Conversation ID is required",
        });
        return;
      }

      if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        socket.emit("conversation:error", {
          success: false,
          message: "Invalid conversation ID",
        });
        return;
      }

      const userId = socket.user?.id || null;
      const clientId = socket.clientId || null;
      if (!userId && !clientId) {
        socket.emit("conversation:error", {
          success: false,
          message: "User or client is required",
        });
        return;
      }

      const result = await deleteConversationService({
        userId,
        clientId,
        conversationId,
      });

      socket.emit("conversation:deleted:response", {
        success: true,
        conversationId: result.conversationId,
        message: "Conversation deleted successfully",
      });
    } catch (error) {
      console.error("Conversation Delete Error:", error);
      socket.emit("conversation:error", {
        success: false,
        message: error.message,
      });
    }
  });
};
