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
import { createAndSendNotification } from "../../services/notification.service.js";

import { getActiveSubscriptionWithPlan } from "../../repositories/subscription.repository.js";

import {
  reserveAIUsage,
  completeAIUsage,
  releaseAIUsage,
  reserveConversationCreation,
  completeConversationCreation,
  releaseConversationCreation,
} from "../../services/aiUsage.service.js";

import env from "../../config/env.js";

const activeStreams = new Map();

const estimateTokens = (value = "") => {
  // Fallback estimate only; this is not Google's exact token count.
  return Math.ceil(String(value).length / 4);
};

export const registerAIEvents = (io, socket) => {
  socket.on("ai:message", async (data = {}) => {
    let usageReservation = null;
    let usageSettled = false;
    let subscription = null;
    let plan = null;
    let totalGeminiTokens = 0;
    let conversationReservation = null;
    let conversationReservationSettled = false;

    const settleUsage = async (actualTokens) => {
      if (!usageReservation || usageSettled) return;

      await completeAIUsage({
        usageId: usageReservation.usageId,
        reservedTokens: usageReservation.reservedTokens,
        actualTokens,
      });

      usageSettled = true;
    };

    const releaseUsage = async () => {
      if (!usageReservation || usageSettled) return;

      await releaseAIUsage({
        usageId: usageReservation.usageId,
        reservedTokens: usageReservation.reservedTokens,
      });

      usageSettled = true;
    };

    const settleConversationReservation = async (created) => {
      if (
        !conversationReservation ||
        conversationReservationSettled
      ) {
        return;
      }

      if (created) {
        await completeConversationCreation({
          usageId: conversationReservation.usageId,
        });
      } else {
        await releaseConversationCreation({
          usageId: conversationReservation.usageId,
        });
      }

      conversationReservationSettled = true;
    };

    const releaseConversationReservationIfNeeded = async () => {
      if (
        !conversationReservation ||
        conversationReservationSettled
      ) {
        return;
      }

      await releaseConversationCreation({
        usageId: conversationReservation.usageId,
      });

      conversationReservationSettled = true;
    };

    try {
      const { conversationId, message } = data;
      if (typeof message !== "string" || !message.trim()) {
        socket.emit("ai:error", {
          success: false,
          code: "MESSAGE_REQUIRED",
          message: "Message is required.",
        });
        return;
      }

      const cleanMessage = message.trim();

      const userId = socket.user?.id || null;
      const clientId = socket.clientId || null;
      const clientUserId = socket.clientUserId || null;
      const guestId = socket.guestId || null;

      if (!userId && !clientId) {
        socket.emit("ai:error", {
          success: false,
          code: "IDENTITY_REQUIRED",
          message: "User or client is required.",
        });
        return;
      }

      // 1. Validate client account.
      let client = null;

      if (clientId) {
        client = await findClientById(clientId);
        if (!client) {
          socket.emit("ai:error", {
            success: false,
            code: "CLIENT_NOT_FOUND",
            message: "Client not found.",
          });
          return;
        }

        if (client.status !== "active") {
          socket.emit("ai:error", {
            success: false,
            code: "CLIENT_INACTIVE",
            message: "Client is inactive.",
          });
          return;
        }
      }

      // 2. Validate an existing conversation before reserving quota.
      let conversation = null;

      if (conversationId) {
        if (clientId) {
          conversation = await findConversationByIdAndClient(
            conversationId,
            clientId
          );
        } else if (userId) {
          conversation = await findConversationById(conversationId);

          if (
            !conversation ||
            conversation.userId?.toString() !== userId.toString()
          ) {
            socket.emit("ai:error", {
              success: false,
              code: "CONVERSATION_FORBIDDEN",
              message: "Unauthorized access to conversation.",
            });
            return;
          }
        }
        if (!conversation) {
          socket.emit("ai:error", {
            success: false,
            code: "CONVERSATION_NOT_FOUND",
            message: "Conversation not found.",
          });
          return;
        }
      }

      // 3. Get the active subscription and reserve usage.
      if (clientId) {
        try {
          const result = await getActiveSubscriptionWithPlan(clientId);
          if (!result?.subscription || !result?.plan) {
            socket.emit("ai:error", {
              success: false,
              code: "USAGE_VALIDATION_FAILED",
              message: "Client subscription not found. Please try again.",
            });
            return;
          }
          subscription = result.subscription;
          plan = result.plan;

          if (!conversation) {
            conversationReservation =
              await reserveConversationCreation({
                subscription,
                plan,
                clientId,
              });
          }

          usageReservation = await reserveAIUsage({
            subscription,
            plan,
            clientId,
          });
        } catch (error) {
          await releaseConversationReservationIfNeeded();
          const quotaErrors = {
            ACTIVE_SUBSCRIPTION_NOT_FOUND: {
              code: "SUBSCRIPTION_REQUIRED",
              message:
                "This chatbot is currently unavailable. Please try again later.",
            },

            MONTHLY_RESPONSE_LIMIT_REACHED: {
              code: "RESPONSE_LIMIT_REACHED",
              message:
                "This chatbot has reached its usage limit for now. Please try again later.",
            },

            MONTHLY_TOKEN_LIMIT_REACHED: {
              code: "TOKEN_LIMIT_REACHED",
              message:
                "This chatbot has reached its usage limit for now. Please try again later.",
            },

            SUBSCRIPTION_PLAN_LIMITS_NOT_CONFIGURED: {
              code: "PLAN_LIMITS_NOT_CONFIGURED",
              message:
                "We're unable to process your request right now. Please try again later.",
            },

            MONTHLY_CONVERSATION_LIMIT_REACHED: {
              code: "CONVERSATION_LIMIT_REACHED",
              message:
                "This chatbot has reached its conversation limit for now. Please try again later.",
            },
          };

          const knownError = quotaErrors[error.message];
          if (knownError) {
            socket.emit("ai:error", {
              success: false,
              ...knownError,
            });
            return;
          }

          console.error("AI usage reservation failed:", error);

          socket.emit("ai:error", {
            success: false,
            code: "USAGE_VALIDATION_FAILED",
            message: "Unable to verify usage limits. Please try again.",
          });
          return;
        }
      }

      // 4. Create a conversation only after subscription/quota validation.
      if (!conversation) {
        const conversationData = {
          title: cleanMessage.substring(0, 40),
          lastMessage: cleanMessage,
          lastMessageAt: new Date(),
          source: "website"
        };

        if (userId) conversationData.userId = userId;
        if (clientId) conversationData.clientId = clientId;

        if (guestId) {
          const guestResult = await findOrCreateGuestConversation({
            clientId,
            guestId,
            title: cleanMessage.substring(0, 40),
            lastMessage: cleanMessage,
            source: "widget"
          });
          // The helper must return { conversation, created }.
          conversation = guestResult.conversation;

          // Count only if a genuinely new conversation was created.
          await settleConversationReservation(
            Boolean(guestResult.created)
          );
        } else {
          conversation = await createConversation(conversationData);
          await settleConversationReservation(true);
        }
        socket.emit("conversation:created", { conversation });
      }

      // 5. Save user message and fetch recent history.
      const userMessage = await createMessage({
        conversationId: conversation._id,
        role: "user",
        text: cleanMessage,
      });

      const history = await getRecentConversationMessages(
        conversation._id,
        20
      );

      let knowledgeContext = "";
      let systemInstruction = "";

      // 6. Client chatbot: knowledge + classification.
      if (clientId) {
        const knowledge = await getRelevantClientKnowledge(
          client,
          clientId,
          cleanMessage
        );

        knowledgeContext = buildKnowledgeContext(knowledge);

        const classification = await classifyUserMessage({
          message: cleanMessage,
          knowledgeContext,
          client,
        });

        // Use actual metadata where available.
        // ai.service.js must return usageMetadata for this to work.
        const classificationTokens =
          classification?.usageMetadata?.totalTokenCount ??
          estimateTokens(
            JSON.stringify(client) +
            cleanMessage +
            knowledgeContext
          );

        totalGeminiTokens += classificationTokens;

        const needsTicket =
          !classification.classificationFailed &&
          (
            !classification.businessRelated ||
            !classification.canAnswer
          );

        if (needsTicket) {
          const fallbackMessage = !classification?.businessRelated
            ? "I'm sorry, I can only help with questions related to our business and services. I've created a support ticket for you."
            : "I'm sorry, I don't have enough information to answer that. I've created a support ticket for you.";

          // The classifier has already consumed tokens, so count this request.
          await settleUsage(totalGeminiTokens);

          await createMessage({
            conversationId: conversation._id,
            role: "assistant",
            text: fallbackMessage,
            replyToMessageId: userMessage._id,
          });

          const ticket = await createAITicketService({
            userId: userId || null,
            clientId: clientUserId || null,
            guestId: guestId || null,
            conversationId: conversation._id,
            messageId: userMessage._id,
            userMessage: cleanMessage,
          });

          await createAndSendNotification({
            type: "ticket",
            clientId,
            title: `New Support Ticket Created by ${ticket?.guestKeyId?.fullName || "user"}`,
            message: "A new support ticket has been created for a query.",
            webRoute: "/client/tickets",
            screen: "",
            image: "https://api.naqshapp.com/naqshsvg.jpg",
            metadata: {
              conversationId: conversation._id,
              expiryDate: null,
            },
          });

          socket.emit("ai:chunk", { text: fallbackMessage });

          socket.emit("ai:end", {
            success: true,
            conversationId: conversation._id,
            response: fallbackMessage,
            ticketCreated: true,
            ticketId: ticket._id,
          });

          return;
        }

        systemInstruction = buildClientSystemInstruction(
          client,
          knowledgeContext
        );
      }

      // 7. Build conversation content.
      const contents = buildConversationContents(history, cleanMessage);
      const maxOutputTokens = plan?.limits?.maxOutputTokens;

      // 8. Generate final answer.
      activeStreams.set(socket.id, false);
      const stream = await ai.models.generateContentStream({
        model: env.GEMINI_MODEL,
        contents,
        config: clientId
          ? {
            systemInstruction,
            maxOutputTokens,
            temperature: 0.4
          }
          : undefined,
      });

      let fullResponse = "";
      let chatUsageMetadata = null;
      let wasStopped = false;

      for await (const chunk of stream) {
        if (activeStreams.get(socket.id)) {
          wasStopped = true;
          break;
        }

        if (chunk.usageMetadata) {
          chatUsageMetadata = chunk.usageMetadata;
        }

        const chunkText = chunk.text || "";
        fullResponse += chunkText;

        if (chunkText) {
          socket.emit("ai:chunk", { text: chunkText });
        }
      }

      activeStreams.delete(socket.id);

      const chatTokens =
        chatUsageMetadata?.totalTokenCount ??
        estimateTokens(
          JSON.stringify(contents) +
          systemInstruction +
          fullResponse
        );

      totalGeminiTokens += chatTokens;

      if (fullResponse) {
        await createMessage({
          conversationId: conversation._id,
          role: "assistant",
          text: fullResponse,
          replyToMessageId: userMessage._id,
        });

        await updateConversation(conversation._id, {
          lastMessage: fullResponse,
          lastMessageAt: new Date(),
        });
      }

      // 9. Finalize quota once. Stopped streams are counted too.
      await settleUsage(totalGeminiTokens);
      socket.emit("ai:end", {
        success: true,
        message: wasStopped
          ? "Generation stopped."
          : "Response completed.",
        conversationId: conversation._id,
        response: fullResponse,
        stopped: wasStopped,
      });
    } catch (error) {
      console.error("AI Message Error:", error);
      activeStreams.delete(socket.id);
      // Release quota if the request failed before being finalized.
      try {
        await releaseUsage();
      } catch (releaseError) {
        console.error("Failed to release AI quota:", releaseError);
      }

      try {
        await releaseConversationReservationIfNeeded();
      } catch (releaseError) {
        console.error("Failed to release conversation quota:", releaseError);
      }

      let errorMessage =
        "Sorry, something went wrong while processing your request. Please try again.";

      if (error.status === 429) {
        errorMessage =
          "The assistant is temporarily unavailable. Please try again later.";
      } else if (error.status === 401 || error.status === 403) {
        errorMessage =
          "We are unable to process your request right now. Please try again later.";
      } else if (error.status === 400) {
        errorMessage =
          "We could not understand your request. Please try again.";
      }

      socket.emit("ai:error", {
        success: false,
        status: error.status || 500,
        code: "AI_REQUEST_FAILED",
        message: errorMessage,
      });
    }
  });

  socket.on("ai:stop", () => {
    activeStreams.set(socket.id, true);

    socket.emit("ai:stopped", {
      success: true,
      message: "Generation stop requested.",
    });
  });
};