import mongoose from "mongoose";
import bcrypt from "bcrypt";

import {
  createClient,
  findClientByKey,
  findClientById,
  updateClient,
} from "../repositories/client.repository.js";
import User from "../models/User.js";
import Client from "../models/Client.js";
import { findClientUserByClientId } from "../repositories/user.repository.js";
import { getProductCountByClientId } from "../repositories/product.repository.js";
import { getFaqCountByClientId } from "../repositories/faq.repository.js";

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

  return {
    businessId: client._id,
    businessName: client.businessName,
    businessType: client.businessType,
    businessDescription: client.businessDescription,
    chatbot: client.chatbot,
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
  const [productCount, faqCount] = await Promise.all([
    getProductCountByClientId(client._id),
    getFaqCountByClientId(client._id),
  ]);

  if (!user) {
    const error = new Error("client user is block");
    error.statusCode = 404;
    throw error;
  }

  return {
    productCount,
    faqCount,
    businessName: client.businessName,
    businessType: client.businessType,
    businessDescription: client.businessDescription,
    address: client.address,
    contact: client.contact,
    slug: client.slug,
    status: client.status,
    chatbot: client.chatbot,
    clientKey: client.clientKey,
    slug: client.slug,
    chatbot: client.chatbot,
    status: client.status,
    clientCreatedAt: client.createdAt,
    clientUpdatedAt: client.updatedAt,
    businessId: client._id,
    clientId: user?._id,
    fullName: user.fullName,
    email: user.email,
    profileImage: user.profileImage,
    role: user.role,
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

  // ==========================================
  // STATUS
  // ==========================================

  if (updateData.status !== undefined) {
    allowedData.status = updateData.status;
  }

  const client = await updateClient(clientId, allowedData);

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
