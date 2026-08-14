import mongoose from "mongoose";
import bcrypt from "bcrypt";

import User from "../models/User.js";
import Client from "../models/Client.js";

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
      clientKey,
      slug,
      chatbot = {},
    } = data;

    const existingUser = await User.findOne({ email }).session(session);

    if (existingUser) {
      throw new Error("USER_ALREADY_EXISTS");
    }

    /*
     * ------------------------------------------
     * Check clientKey
     * ------------------------------------------
     */

    const existingClientKey = await Client.findOne({
      clientKey,
    }).session(session);

    if (existingClientKey) {
      throw new Error("CLIENT_KEY_ALREADY_EXISTS");
    }

    /*
     * ------------------------------------------
     * Check slug
     * ------------------------------------------
     */

    const existingSlug = await Client.findOne({
      slug,
    }).session(session);

    if (existingSlug) {
      throw new Error("CLIENT_SLUG_ALREADY_EXISTS");
    }

    /*
     * ------------------------------------------
     * Hash password
     * ------------------------------------------
     */

    const hashedPassword = await bcrypt.hash(password, 12);

    /*
     * ------------------------------------------
     * Create Client
     * ------------------------------------------
     */

    const [client] = await Client.create(
      [
        {
          businessName,
          businessType,
          businessDescription,

          clientKey: clientKey.toLowerCase(),

          slug: slug.toLowerCase(),

          chatbot: {
            name: chatbot.name || "AI Assistant",

            welcomeMessage:
              chatbot.welcomeMessage ||
              "Hi 👋 Welcome! How can I help you today?",

            language: chatbot.language || "english",

            tone: chatbot.tone || "friendly",

            aiInstructions: chatbot.aiInstructions || "",

            predefinedQuestions: chatbot.predefinedQuestions || [],
          },

          status: "active",
        },
      ],
      { session },
    );

    /*
     * ------------------------------------------
     * Create Client User
     * ------------------------------------------
     */

    const [user] = await User.create(
      [
        {
          fullName,

          email: email.toLowerCase(),

          password: hashedPassword,

          role: "client",

          clientId: client._id,

          terms: true,

          authProvider: "local",

          isEmailVerified: true,

          accountStatus: "active",
        },
      ],
      { session },
    );

    await session.commitTransaction();

    return {
      client,
      user,
    };
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};
