import mongoose from "mongoose";
import bcrypt from "bcrypt";

import {
  createClient,
  findClientByKey,
  findClientById,
  updateClientById,
} from "../repositories/client.repository.js";
import User from "../models/User.js";
import Client from "../models/Client.js";
import { findClientUserByClientId, findClientUserFcmTokenByClientId } from "../repositories/user.repository.js";
import { getProductCountByClientId } from "../repositories/product.repository.js";
import { getFaqCountByClientId } from "../repositories/faq.repository.js";
import { stripe } from "./stripe.service.js";
import { createAndSendNotification } from "./notification.service.js";

export const getClientConfigService = async (clientKey) => {
  const client = await findClientByKey(clientKey);

  if (!client) {
    const error = new Error("Client not found");
    error.statusCode = 404;
    throw error;
  }

  const user = await findClientUserByClientId(client._id);

  if (!user) {
    const error = new Error("Client user not found");
    error.statusCode = 404;
    throw error;
  }

  const isBasicPlan = client.active_plan === "Basic";

  const chatbotData =
    typeof client.chatbot?.toObject === "function"
      ? client.chatbot.toObject()
      : { ...client.chatbot };

  const predefinedQuestions = Array.isArray(
    chatbotData?.predefinedQuestions
  )
    ? chatbotData.predefinedQuestions
    : [];

  return {
    businessId: client._id,
    businessName: client.businessName,
    businessType: client.businessType,
    businessDescription: client.businessDescription,
    chatbot: {
      ...chatbotData,
      predefinedQuestions: isBasicPlan
        ? predefinedQuestions.slice(0, 5)
        : predefinedQuestions,
    },
    clientKey: user.clientKey,
    clientId: user?._id,
    fullName: user?.fullName,
    email: user.email,
    profileImage: user.profileImage,
    role: user.role,
  };
};

export const getClientByIdService = async (clientId) => {
  const client = await findClientById(clientId);

  if (!client) {
    const error = new Error("Client not found");
    error.statusCode = 404;
    throw error;
  }

  const user = await findClientUserByClientId(client._id);

  if (!user) {
    const error = new Error("Client user not found or blocked");
    error.statusCode = 404;
    throw error;
  }

  const isBasicPlan = client.active_plan === "Basic";
  const limit = isBasicPlan ? 5 : null;

  const [productCount, faqCount] = await Promise.all([
    getProductCountByClientId(client._id),
    getFaqCountByClientId(client._id),
  ]);

  // Basic plan par maximum 5 count return karo
  const limitedProductCount =
    limit !== null ? Math.min(productCount, limit) : productCount;

  const limitedFaqCount =
    limit !== null ? Math.min(faqCount, limit) : faqCount;

  // Predefined questions ko oldest-first order mein lo
  const predefinedQuestions = Array.isArray(client.chatbot?.predefinedQuestions)
    ? client.chatbot.predefinedQuestions
    : [];

  const limitedPredefinedQuestions =
    limit !== null
      ? predefinedQuestions.slice(0, limit)
      : predefinedQuestions;

  return {
    productCount: limitedProductCount,
    faqCount: limitedFaqCount,

    businessName: client.businessName,
    businessType: client.businessType,
    businessDescription: client.businessDescription,
    address: client.address,
    contact: client.contact,
    slug: client.slug,
    status: client.status,

    chatbot: {
      ...client.chatbot?.toObject?.() ?? client.chatbot,
      predefinedQuestions: limitedPredefinedQuestions,
    },

    clientKey: client.clientKey,
    clientCreatedAt: client.createdAt,
    clientUpdatedAt: client.updatedAt,
    businessId: client._id,
    clientId: user._id,
    fullName: user.fullName,
    email: user.email,
    profileImage: user.profileImage,
    role: user.role,
    stripe_customer: client.stripe_customer,
    active_plan: client.active_plan,
    current_plan_id: client.current_plan_id,
  };
};

export const updateClientService = async (clientId, updateData) => {
  const allowedData = {};

  // ==========================================
  // BUSINESS DETAILS
  // ==========================================

  if (updateData.businessName !== undefined) {
    allowedData.businessName = updateData.businessName;
  }

  if (updateData.businessType !== undefined) {
    allowedData.businessType = updateData.businessType;
  }

  if (updateData.businessDescription !== undefined) {
    allowedData.businessDescription = updateData.businessDescription;
  }

  // ==========================================
  // ADDRESS
  // ==========================================

  if (updateData.address !== undefined) {
    allowedData.address = {
      ...(updateData.address.addressLine1 !== undefined && {
        addressLine1: updateData.address.addressLine1,
      }),

      ...(updateData.address.addressLine2 !== undefined && {
        addressLine2: updateData.address.addressLine2,
      }),

      ...(updateData.address.city !== undefined && {
        city: updateData.address.city,
      }),

      ...(updateData.address.state !== undefined && {
        state: updateData.address.state,
      }),

      ...(updateData.address.country !== undefined && {
        country: updateData.address.country,
      }),

      ...(updateData.address.postalCode !== undefined && {
        postalCode: updateData.address.postalCode,
      }),

      ...(updateData.address.googleMapsUrl !== undefined && {
        googleMapsUrl: updateData.address.googleMapsUrl,
      }),
    };
  }

  // ==========================================
  // CONTACT
  // ==========================================

  if (updateData.contact !== undefined) {
    allowedData.contact = {
      ...(updateData.contact.phone !== undefined && {
        phone: updateData.contact.phone,
      }),
      ...(updateData.contact.alternatePhone !== undefined && {
        alternatePhone: updateData.contact.alternatePhone,
      }),

      ...(updateData.contact.email !== undefined && {
        email: updateData.contact.email.toLowerCase(),
      }),

      ...(updateData.contact.website !== undefined && {
        website: updateData.contact.website,
      }),

      ...(updateData.contact.whatsapp !== undefined && {
        whatsapp: updateData.contact.whatsapp,
      }),
    };
  }

  // ==========================================
  // CHATBOT
  // ==========================================

  if (updateData.chatbot !== undefined) {
    allowedData.chatbot = updateData.chatbot;
  }


  const client = await updateClientById(clientId, allowedData);

  if (!client) {
    const error = new Error("Client not found");
    error.statusCode = 404;
    throw error;
  }

  const user = await findClientUserByClientId(client._id);

  if (!user) {
    const error = new Error("Client user not found");
    error.statusCode = 404;
    throw error;
  }

  const [productCount, faqCount] = await Promise.all([
    getProductCountByClientId(client._id),
    getFaqCountByClientId(client._id),
  ]);

  await createAndSendNotification({
    type: "settings",
    clientId: clientId,
    title: "Client Chatbot Configuration Updated",
    message: `Your chatbot configuration has been updated successfully. Please check the details in your account.`,
    webRoute: "/client/chatbot-settings",
    screen: "",
    image: "https://api.naqshapp.com/naqshsvg.jpg",
    metadata: {
      subscriptionId: null,
      expiryDate: null,
    },
  });

  return {
    productCount,
    faqCount,

    businessName: client.businessName,
    businessType: client.businessType,
    businessDescription: client.businessDescription,

    address: client.address,
    contact: client.contact,

    clientKey: client.clientKey,
    slug: client.slug,

    chatbot: client.chatbot,

    status: client.status,

    clientCreatedAt: client.createdAt,
    clientUpdatedAt: client.updatedAt,

    businessId: client._id,
    clientId: user._id,

    fullName: user.fullName,
    email: user.email,
    profileImage: user.profileImage,
    role: user.role,
  };
};
