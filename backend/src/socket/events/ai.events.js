import ai from "../../config/gemini.js";

import {
  buildClientSystemInstruction,
  buildConversationContents,
  classifyUserMessage,
} from "../../services/ai.service.js";

import { findClientById } from "../../repositories/client.repository.js";

import {
  createConversation,
  findConversationById,
  findConversationByIdAndClient,
  updateConversation,
} from "../../repositories/conversation.repository.js";

import {
  createMessage,
  getRecentConversationMessages,
} from "../../repositories/message.repository.js";

import {
  getRelevantClientKnowledge,
  buildKnowledgeContext,
} from "../../services/knowledge.service.js";
import { createAITicketService } from "../../services/ticket.service.js";
import { findOrCreateGuestConversation } from "../../services/conversation.service.js";

const activeStreams = new Map();

export const registerAIEvents = (io, socket) => {
  socket.on("ai:message", async (data) => {
    try {
      const { conversationId, message } = data;

      if (!message || !message.trim()) {
        socket.emit("ai:error", {
          success: false,
          message: "Message is required",
        });

        return;
      }

      const userId = socket.user?.id || null;
      const clientId = socket.clientId || null;
      const guestId = socket.guestId || null;
      console.log("clientId",clientId)
      console.log("guestId",guestId)

      if (!userId && !clientId) {
        socket.emit("ai:error", {
          success: false,
          message: "User or client is required",
        });

        return;
      }

      let client = null;
      if (clientId) {
        client = await findClientById(clientId);
        if (!client) {
          socket.emit("ai:error", {
            success: false,
            message: "Client not found",
          });
          return;
        }

        if (client.status !== "active") {
          socket.emit("ai:error", {
            success: false,
            message: "Client is inactive",
          });
          return;
        }
      }

      let conversation;
      console.log("conversationId",conversationId)
      if (conversationId) {
        if (clientId) {
          conversation = await findConversationByIdAndClient(
            conversationId,
            clientId,
          );
        } else if (userId) {
          conversation = await findConversationById(conversationId);
          if (
            !conversation ||
            conversation.userId?.toString() !== userId.toString()
          ) {
            socket.emit("ai:error", {
              success: false,
              message: "Unauthorized access to conversation",
            });
            return;
          }
        }

        if (!conversation) {
          socket.emit("ai:error", {
            success: false,
            message: "Conversation not found",
          });

          return;
        }
      } else {
        const conversationData = {
          title: message.substring(0, 40),
          lastMessage: message,
          lastMessageAt: new Date(),
        };
        if (userId) {
          conversationData.userId = userId;
        }

        if (clientId) {
          conversationData.clientId = clientId;
        }

        if (guestId) {
          conversation = await findOrCreateGuestConversation({
            clientId,
            guestId,
            title: message.substring(0, 40),
            lastMessage: message,
          });
        } else {
          conversation = await createConversation(conversationData);
        }
        console.log("conversation",conversation)
        socket.emit("conversation:created", {
          conversation,
        });
      }

      const userMessage = await createMessage({
        conversationId: conversation._id,
        role: "user",
        text: message,
      });

      const history = await getRecentConversationMessages(conversation._id, 20);
      console.log("📚 Conversation History:", history.length);
      let knowledgeContext = "";
      if (clientId) {
        const knowledge = await getRelevantClientKnowledge(clientId, message);
        knowledgeContext = buildKnowledgeContext(knowledge);
        // const classification = await classifyUserMessage({
        //   message,
        //   knowledgeContext,
        //   client,
        // });

        // // NOT BUSINESS RELATED
        // if (!classification.businessRelated) {
        //   const fallbackMessage =
        //     "I'm sorry, I can only help with questions related to our business and services. I've created a support ticket for you.";

        //   await createMessage({
        //     conversationId: conversation._id,
        //     role: "assistant",
        //     text: fallbackMessage,
        //   });

        //   const ticket = await createAITicketService({
        //     userId: userId || null,
        //     clientId,
        //     conversationId: conversation._id,
        //     messageId: userMessage._id,
        //     userMessage: message,
        //   });

        //   socket.emit("ai:chunk", {
        //     text: fallbackMessage,
        //   });

        //   socket.emit("ai:end", {
        //     success: true,
        //     conversationId: conversation._id,
        //     response: fallbackMessage,
        //     ticketCreated: true,
        //     ticketId: ticket._id,
        //   });

        //   return;
        // }
        // // BUSINESS RELATED BUT AI DOES NOT KNOW
        // if (classification.businessRelated && !classification.canAnswer) {
        //   const fallbackMessage =
        //     "I'm sorry, I don't have enough information to answer that. I've created a support ticket for you.";

        //   await createMessage({
        //     conversationId: conversation._id,
        //     role: "assistant",
        //     text: fallbackMessage,
        //   });

        //   const ticket = await createAITicketService({
        //     userId: userId || null,
        //     clientId,
        //     conversationId: conversation._id,
        //     messageId: userMessage._id,
        //     userMessage: message,
        //   });

        //   socket.emit("ai:chunk", {
        //     text: fallbackMessage,
        //   });

        //   socket.emit("ai:end", {
        //     success: true,
        //     conversationId: conversation._id,
        //     response: fallbackMessage,
        //     ticketCreated: true,
        //     ticketId: ticket._id,
        //   });

        //   return;
        // }
      }
      let systemInstruction = "";

      if (client) {
        systemInstruction = buildClientSystemInstruction(
          client,
          knowledgeContext,
        );
      }

      const contents = buildConversationContents(history, message);

      activeStreams.set(socket.id, false);
      const stream = await ai.models.generateContentStream({
        model: "gemini-3.6-flash",
        contents,
        config: client
          ? {
              systemInstruction,
            }
          : undefined,
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

      if (fullResponse) {
        await createMessage({
          conversationId: conversation._id,
          role: "assistant",
          text: fullResponse,
        });

        await updateConversation(conversation._id, {
          lastMessage: fullResponse,
          lastMessageAt: new Date(),
        });
      }

      socket.emit("ai:end", {
        success: true,
        message: "Response completed",
        conversationId: conversation._id,
        response: fullResponse,
      });
    } catch (error) {
      console.error("❌ AI Message Error:", error);
      activeStreams.delete(socket.id);
      let errorMessage = "Something went wrong. Please try again.";
      if (error.status === 429) {
        errorMessage =
          "AI request limit exceeded. Please wait a few seconds and try again.";
      } else if (error.status === 401) {
        errorMessage = "Invalid Gemini API Key.";
      } else if (error.status === 403) {
        errorMessage = "Access denied. Please check your API permissions.";
      } else if (error.status === 400) {
        errorMessage = "Invalid request.";
      }

      socket.emit("ai:error", {
        success: false,
        status: error.status || 500,
        message: errorMessage,
      });
    }
  });

  socket.on("ai:stop", () => {
    console.log("🛑 Stop Requested", socket.id);
    activeStreams.set(socket.id, true);
    socket.emit("ai:stopped", {
      success: true,
      message: "Generation stopped",
    });
  });
};
