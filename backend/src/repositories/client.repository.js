import Client from "../models/Client.js";

export const createClient = async (clientData) => {
  return await Client.create(clientData);
};

export const findClientById = async (clientId) => {
  return await Client.findById(clientId);
};

export const findClientByKey = async (clientKey) => {
  return await Client.findOne({
    clientKey,
    status: "active",
  }).lean();
};

export const findClientBySlug = async (slug) => {
  return await Client.findOne({
    slug,
    status: "active",
  }).lean();
};

export const updateClient = async (clientId, updateData) => {
  return await Client.findByIdAndUpdate(clientId, updateData, {
    new: true,
    runValidators: true,
  });
};
