import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    
    replyToMessageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    text: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["sending", "completed", "error"],
      default: "completed",
    },
  },
  {
    timestamps: true,
  },
);

const Message = mongoose.model("Message", messageSchema);

export default Message
