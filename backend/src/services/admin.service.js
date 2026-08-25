import mongoose from "mongoose";
import bcrypt from "bcrypt";

import User from "../models/User.js";
import Client from "../models/Client.js";
import { sendClientWelcomeEmail } from "./email.service.js";
import {
  deleteClientById,
  findClientById,
} from "../repositories/client.repository.js";
import { deleteUserByClientId } from "../repositories/user.repository.js";

export const createClientService = async (data) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const {
      fullName,
      email,
      password,
      businessName,
      businessType,
      businessDescription = "",
      address = {},
      contact = {},
      clientKey,
      slug,
      chatbot = {},
    } = data;

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedClientKey = clientKey.trim().toLowerCase();
    const normalizedSlug = slug.trim().toLowerCase();
    const existingUser = await User.findOne({
      email: normalizedEmail,
    }).session(session);

    if (existingUser) {
      throw new Error("USER_ALREADY_EXISTS");
    }

    const existingClientKey = await Client.findOne({
      clientKey: normalizedClientKey,
    }).session(session);

    if (existingClientKey) {
      throw new Error("CLIENT_KEY_ALREADY_EXISTS");
    }

    const existingSlug = await Client.findOne({
      slug: normalizedSlug,
    }).session(session);

    if (existingSlug) {
      throw new Error("CLIENT_SLUG_ALREADY_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const [client] = await Client.create(
      [
        {
          businessName: businessName.trim(),
          businessType: businessType.trim(),
          businessDescription: businessDescription.trim(),
          address: {
            addressLine1: address.addressLine1?.trim() || "",
            addressLine2: address.addressLine2?.trim() || "",
            city: address.city?.trim() || "",
            state: address.state?.trim() || "",
            country: address.country?.trim() || "",
            postalCode: address.postalCode?.trim() || "",
            googleMapsUrl: address.googleMapsUrl?.trim() || "",
          },

          contact: {
            phone: contact.phone?.trim() || "",
            alternatePhone: contact.alternatePhone?.trim() || "",
            email: contact.email?.trim().toLowerCase() || "",
            website: contact.website?.trim() || "",
            whatsapp: contact.whatsapp?.trim() || "",
          },

          clientKey: normalizedClientKey,
          slug: normalizedSlug,

          chatbot: {
            name: chatbot.name?.trim() || "AI Assistant",
            welcomeMessage:
              chatbot.welcomeMessage?.trim() ||
              "Hi 👋 Welcome! How can I help you today?",

            language: chatbot.language || "english",
            tone: chatbot.tone || "friendly",
            aiInstructions: chatbot.aiInstructions?.trim() || "",
            predefinedQuestions: chatbot.predefinedQuestions || [],
          },
          status: "active",
        },
      ],
      {
        session,
      },
    );

    const [user] = await User.create(
      [
        {
          fullName: fullName.trim(),
          email: normalizedEmail,
          password: hashedPassword,
          role: "client",
          clientId: client._id,
          terms: true,
          authProvider: "local",
          isEmailVerified: true,
          accountStatus: "active",
        },
      ],
      {
        session,
      },
    );
    await session.commitTransaction();
    // Send welcome email after successful transaction
    try {
      await sendClientWelcomeEmail({
        fullName: user.fullName,
        businessName: client.businessName,
        email: user.email,
        password: password,
        slug: client.slug,
      });
    } catch (emailError) {
      console.error(
        "Client created successfully, but welcome email could not be sent:",
        emailError,
      );
    }
    return {
      client,
      user,
    };
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    throw error;
  } finally {
    await session.endSession();
  }
};

export const getAllClientsService = async ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
} = {}) => {
  const skip = (page - 1) * limit;

  const query = {};

  if (search?.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");

    query.$or = [
      { businessName: searchRegex },
      { businessType: searchRegex },
      { clientKey: searchRegex },
      { slug: searchRegex },
    ];
  }

  if (status && ["active", "inactive"].includes(status)) {
    query.status = status;
  }

  const [clients, total] = await Promise.all([
    Client.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),

    Client.countDocuments(query),
  ]);

  const clientIds = clients.map((client) => client._id);

  const users = await User.find({
    clientId: { $in: clientIds },
    role: "client",
  })
    .select(
      "_id fullName email role profileImage clientId accountStatus createdAt lastLogin",
    )
    .lean();

  const userMap = new Map(users.map((user) => [String(user.clientId), user]));

  const data = clients.map((client) => {
    const user = userMap.get(String(client._id));
    return {
      ...client,
      user: user
      ? {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profileImage: user.profileImage,
            role: user.role,
            accountStatus: user?.accountStatus || "active",
            clientId: user.clientId,
            status: user.status,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin || null,
          }
        : null,
    };
  });

  return {
    clients: data,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getClientByIdService = async (clientId) => {
  if (!mongoose.Types.ObjectId.isValid(clientId)) {
    throw new Error("INVALID_CLIENT_ID");
  }

  const client = await Client.findById(clientId).lean();

  if (!client) {
    throw new Error("CLIENT_NOT_FOUND");
  }

  const user = await User.findOne({
    clientId: client._id,
    role: "client",
  })
    .select(
      "_id fullName email role clientId accountStatus createdAt lastLogin profileImage",
    )
    .lean();

  return {
    client,
    user: user
      ? {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          profileImage: user.profileImage,
          role: user.role,
          accountStatus: user?.accountStatus || "active",
          clientId: user.clientId,
          status: user.status,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin || null,
          profileImage: user.profileImage || "",
        }
      : null,
  };
};

export const deleteClientService = async (clientId) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const client = await findClientById(clientId);

    if (!client) {
      throw new Error("Client not found");
    }

    await deleteClientById(clientId, session);

    await deleteUserByClientId(clientId, session);

    await session.commitTransaction();

    return {
      clientId: client._id,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const updateAdminClientService = async (clientId, payload) => {
  const {
    fullName,
    email,
    status,
    accountStatus,

    businessName,
    businessType,
    businessDescription,

    address,
    contact,

    clientKey,
    slug,

    chatbot,
  } = payload;

  const client = await Client.findById(clientId);

  if (!client) {
    const error = new Error("Client not found");
    error.statusCode = 404;
    throw error;
  }

  // --------------------------------------------------
  // Find Client User
  // --------------------------------------------------

  const user = await User.findOne({
    clientId: client._id,
    role: "client",
  });

  if (!user) {
    const error = new Error("Client user not found");
    error.statusCode = 404;
    throw error;
  }

  // --------------------------------------------------
  // Check duplicate email
  // --------------------------------------------------

  const existingUser = await User.findOne({
    email: email.toLowerCase(),
    _id: { $ne: user._id },
  });

  if (existingUser) {
    const error = new Error("Email is already registered");

    error.statusCode = 409;

    throw error;
  }

  // --------------------------------------------------
  // Check duplicate clientKey
  // --------------------------------------------------

  const existingClientKey = await Client.findOne({
    clientKey,
    _id: { $ne: client._id },
  });

  if (existingClientKey) {
    const error = new Error("Client key is already in use");

    error.statusCode = 409;

    throw error;
  }

  // --------------------------------------------------
  // Check duplicate slug
  // --------------------------------------------------

  const existingSlug = await Client.findOne({
    slug,
    _id: { $ne: client._id },
  });

  if (existingSlug) {
    const error = new Error("Slug is already in use");

    error.statusCode = 409;

    throw error;
  }

  user.fullName = fullName;
  user.email = email.toLowerCase();
  user.accountStatus = accountStatus;

  await user.save();

  client.businessName = businessName;
  client.businessType = businessType;
  client.businessDescription = businessDescription || "";

  client.address = {
    addressLine1: address?.addressLine1 || "",
    addressLine2: address?.addressLine2 || "",
    city: address?.city || "",
    state: address?.state || "",
    country: address?.country || "",
    postalCode: address?.postalCode || "",
    googleMapsUrl: address?.googleMapsUrl || "",
  };

  client.contact = {
    phone: contact?.phone || "",
    alternatePhone: contact?.alternatePhone || "",
    whatsapp: contact?.whatsapp || "",
    email: contact?.email || "",
    website: contact?.website || "",
  };

  client.clientKey = clientKey;
  client.slug = slug;
  client.status = status;

  client.chatbot = {
    name: chatbot.name,
    welcomeMessage: chatbot.welcomeMessage,
    language: chatbot.language,
    tone: chatbot.tone,
    aiInstructions: chatbot.aiInstructions || "",
    predefinedQuestions: chatbot.predefinedQuestions || [],
  };

  await client.save();

  return {
    client,
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profileImage: user.profileImage,
      accountStatus: user?.accountStatus || "active",
      role: user.role,
      clientId: user.clientId,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    },
  };
};
