import mongoose from "mongoose";

const predefinedQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    enabled: {
      type: Boolean,
      default: true,
    },

    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: true,
  },
);

const clientSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
      trim: true,
    },

    businessType: {
      type: String,
      required: true,
      trim: true,
    },

    /*
     * Short description of the business.
     *
     * Example:
     * "ABC Books is an online and offline
     * bookstore selling educational and
     * general books."
     */
    businessDescription: {
      type: String,
      default: "",
      trim: true,
    },

    clientKey: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    chatbot: {
      name: {
        type: String,
        default: "AI Assistant",
        trim: true,
      },

      welcomeMessage: {
        type: String,
        default: "Hi 👋 Welcome! How can I help you today?",
        trim: true,
      },

      language: {
        type: String,
        default: "english",
        trim: true,
      },

      tone: {
        type: String,
        default: "friendly",
        trim: true,
      },

      /*
       * Additional instructions for Gemini.
       *
       * Example:
       * "Always be polite. Help users with
       * books, availability, pricing and
       * delivery related questions."
       */
      aiInstructions: {
        type: String,
        default: "",
        trim: true,
      },

      predefinedQuestions: {
        type: [predefinedQuestionSchema],
        default: [],
      },
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

const Client = mongoose.model("Client", clientSchema);

export default Client;
