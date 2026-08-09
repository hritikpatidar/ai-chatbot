import mongoose from "mongoose";
import {
  deleteConversationService,
  getConversationListService,
  getConversationMessagesService,
} from "../../services/conversation.service.js";

export const registerConversationEvents = (io, socket) => {
  // Get Conversation
  socket.on("conversation:list", async () => {
    try {
      const userId = socket.user.id;
      const conversations = await getConversationListService(userId);

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

  // Get Conversation Messages
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

      const userId = socket.user.id;

      const result = await getConversationMessagesService(
        userId,
        conversationId,
      );

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

  //  Delete Conversation
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

      const userId = socket.user.id;

      const result = await deleteConversationService(userId, conversationId);
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
