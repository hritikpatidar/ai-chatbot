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

export const getClientConfigService = async (clientKey) => {
  const client = await findClientByKey(clientKey);

  if (!client) {
    const error = new Error("Client not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    clientId: client._id,
    clientKey: client.clientKey,
    businessName: client.businessName,
    businessType: client.businessType,
    businessDescription: client.businessDescription,
    chatbot: client.chatbot,
  };
};

export const getClientByIdService = async (clientId) => {
  const client = await findClientById(clientId);

  if (!client) {
    const error = new Error("Client not found");
    error.statusCode = 404;
    throw error;
  }

  return client;
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
