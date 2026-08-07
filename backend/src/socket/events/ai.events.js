import ai from "../../config/gemini.js";
import Conversation from "../../models/Conversation.js";
import {
  createConversation,
  findConversationById,
  updateConversation,
} from "../../repositories/conversation.repository.js";
import {
  createMessage,
  getRecentConversationMessages,
} from "../../repositories/message.repository.js";

const activeStreams = new Map();

export const registerAIEvents = (io, socket) => {
  // SEND MESSAGE
  socket.on("ai:message", async (data) => {
    try {
      const { conversationId, message } = data;
      console.log("conversationId", conversationId);
      console.log("message", message);
      if (!message) {
        socket.emit("ai:error", {
          success: false,
          message: "Message is required",
        });
        return;
      }
      let conversation;

      if (conversationId) {
        conversation = await findConversationById(conversationId);

        if (!conversation) {
          socket.emit("ai:error", {
            success: false,
            message: "Conversation not found",
          });

          return;
        }
      } else {
        conversation = await createConversation({
          userId: socket.user.id,
          title: message.substring(0, 40),
          lastMessage: message,
          lastMessageAt: new Date(),
        });

        socket.emit("conversation:created", {
          conversationId: conversation._id,
        });
      }

      await createMessage({
        conversationId: conversation._id,
        role: "user",
        text: message,
      });

      const history = await getRecentConversationMessages(conversation._id, 20);

      activeStreams.set(socket.id, false);
      const stream = await ai.models.generateContentStream({
        model: "gemini-3.6-flash",
        contents: message,
      });

      let fullResponse = "";

      for await (const chunk of stream) {
        const text = chunk.text || "";
        if (activeStreams.get(socket.id)) {
          console.log("⛔ Stream Stopped");
          break;
        }
        fullResponse += text;
        socket.emit("ai:chunk", {
          text,
        });
      }

      activeStreams.delete(socket.id);

      await createMessage({
        conversationId: conversation._id,
        role: "assistant",
        text: fullResponse,
      });

      await updateConversation(conversation._id, {
        lastMessage: fullResponse,
        lastMessageAt: new Date(),
      });

      socket.emit("ai:end", {
        success: true,
        message: "Response completed",
        response: fullResponse,
      });
    } catch (error) {
      console.error(error);
      activeStreams.delete(socket.id);
      let message = "Something went wrong. Please try again.";
      if (error.status === 429) {
        message =
          "AI request limit exceeded. Please wait a few seconds and try again.";
      } else if (error.status === 401) {
        message = "Invalid Gemini API Key.";
      } else if (error.status === 403) {
        message = "Access denied. Please check your API permissions.";
      } else if (error.status === 400) {
        message = "Invalid request.";
      }

      socket.emit("ai:error", {
        success: false,
        status: error.status || 500,
        message,
      });
    }
  });

  // STOP GENERATION
  socket.on("ai:stop", () => {
    console.log("🛑 Stop Requested");

    activeStreams.set(socket.id, true);

    socket.emit("ai:stopped", {
      success: true,
      message: "Generation stopped",
    });
  });
};
