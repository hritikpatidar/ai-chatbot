import ai from "../../config/gemini.js";

import {
  buildClientSystemInstruction,
  buildConversationContents,
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

const activeStreams = new Map();

export const registerAIEvents = (io, socket) => {
  /*
   * ----------------------------------------------
   * SEND MESSAGE
   * ----------------------------------------------
   */

  socket.on("ai:message", async (data) => {
    try {
      const { conversationId, message } = data;

      console.log("🔥 ai:message received", {
        socketId: socket.id,

        userId: socket.user?.id || null,

        clientId: socket.clientId || null,

        conversationId,

        message,
      });

      /*
       * ------------------------------------------
       * Validate Message
       * ------------------------------------------
       */

      if (!message || !message.trim()) {
        socket.emit("ai:error", {
          success: false,
          message: "Message is required",
        });

        return;
      }

      const userId = socket.user?.id || null;

      const clientId = socket.clientId || null;

      /*
       * ------------------------------------------
       * Validate User / Client
       * ------------------------------------------
       */

      if (!userId && !clientId) {
        socket.emit("ai:error", {
          success: false,
          message: "User or client is required",
        });

        return;
      }

      /*
       * ------------------------------------------
       * Get Client Information
       * ------------------------------------------
       */

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

      /*
       * ------------------------------------------
       * Conversation
       * ------------------------------------------
       */

      let conversation;

      /*
       * Existing conversation
       */

      if (conversationId) {
        /*
         * Client chatbot
         */

        if (clientId) {
          conversation = await findConversationByIdAndClient(
            conversationId,
            clientId,
          );
        } else if (userId) {
          /*
           * Existing authenticated app
           */
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
        /*
         * New conversation
         */
        const conversationData = {
          title: message.substring(0, 40),

          lastMessage: message,

          lastMessageAt: new Date(),
        };

        /*
         * Logged-in user
         */

        if (userId) {
          conversationData.userId = userId;
        }

        /*
         * Client
         */

        if (clientId) {
          conversationData.clientId = clientId;
        }

        conversation = await createConversation(conversationData);

        socket.emit("conversation:created", {
          conversation,
        });
      }

      /*
       * ------------------------------------------
       * Save User Message
       * ------------------------------------------
       */

      await createMessage({
        conversationId: conversation._id,

        role: "user",

        text: message,
      });

      /*
       * ------------------------------------------
       * Get Recent Conversation History
       * ------------------------------------------
       */

      const history = await getRecentConversationMessages(conversation._id, 20);

      console.log("📚 Conversation History:", history.length);

      let knowledgeContext = "";

      if (clientId) {
        const knowledge = await getRelevantClientKnowledge(clientId, message);

        knowledgeContext = buildKnowledgeContext(knowledge);

        console.log("📚 Client Knowledge:", {
          products: knowledge.products.length,

          faqs: knowledge.faqs.length,
        });
      }
      /*
       * ------------------------------------------
       * Build Gemini Context
       * ------------------------------------------
       */

      let systemInstruction = "";

      /*
       * Client chatbot gets
       * business-specific instructions.
       */

      if (client) {
        systemInstruction = buildClientSystemInstruction(
          client,
          knowledgeContext,
        );
      }

      /*
       * Convert MongoDB messages
       * into Gemini conversation format.
       */

      const contents = buildConversationContents(history, message);

      console.log("🧠 Gemini Context:", {
        hasClient: !!client,

        historyCount: contents.length,

        clientId: clientId || null,
      });

      /*
       * ------------------------------------------
       * Start Gemini Stream
       * ------------------------------------------
       */

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

      /*
       * ------------------------------------------
       * Stream Response
       * ------------------------------------------
       */

      let fullResponse = "";

      for await (const chunk of stream) {
        const text = chunk.text || "";

        /*
         * Stop generation
         */

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

      /*
       * ------------------------------------------
       * Save Assistant Message
       * ------------------------------------------
       */

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

      /*
       * ------------------------------------------
       * AI END
       * ------------------------------------------
       */

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

  /*
   * ----------------------------------------------
   * STOP GENERATION
   * ----------------------------------------------
   */

  socket.on("ai:stop", () => {
    console.log("🛑 Stop Requested", socket.id);

    activeStreams.set(socket.id, true);

    socket.emit("ai:stopped", {
      success: true,

      message: "Generation stopped",
    });
  });
};
