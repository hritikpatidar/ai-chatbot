import mongoose from "mongoose";

const conversationFeedbackSchema = new mongoose.Schema(
    {
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
            required: true,
            index: true,
        },

        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
            index: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        guestId: {
            type: String,
            default: null,
        },

        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
        },

        comment: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: "",
        },
    },
    {
        timestamps: true,
    },
);

conversationFeedbackSchema.index(
    { clientId: 1, conversationId: 1, userId: 1, guestId: 1 },
);

export default mongoose.model(
    "ConversationFeedback",
    conversationFeedbackSchema,
);