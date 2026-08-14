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
    clientId: user._id,
    fullName: user.fullName,
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

  return {
    productCount,
    faqCount,
    businessName: client.businessName,
    businessType: client.businessType,
    businessDescription: client.businessDescription,
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

export const updateClientService = async (clientId, updateData) => {
  const client = await updateClient(clientId, updateData);

  if (!client) {
    const error = new Error("Client not found");
    error.statusCode = 404;
    throw error;
  }

  return client;
};
