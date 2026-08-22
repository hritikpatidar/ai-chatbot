import mongoose from "mongoose";
import bcrypt from "bcrypt";

import User from "../models/User.js";
import Client from "../models/Client.js";
import { sendClientWelcomeEmail } from "./email.service.js";

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
