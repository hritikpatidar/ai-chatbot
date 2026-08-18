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
  const $set = {};

  Object.entries(updateData).forEach(([key, value]) => {
    if (key === "address" && value && typeof value === "object") {
      Object.entries(value).forEach(([addressKey, addressValue]) => {
        $set[`address.${addressKey}`] = addressValue;
      });

      return;
    }

    if (key === "contact" && value && typeof value === "object") {
      Object.entries(value).forEach(([contactKey, contactValue]) => {
        $set[`contact.${contactKey}`] = contactValue;
      });

      return;
    }

    $set[key] = value;
  });

  return Client.findByIdAndUpdate(
    clientId,
    {
      $set,
    },
    {
      new: true,
      runValidators: true,
    },
  );
};
