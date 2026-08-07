import ai from "../../config/gemini.js";

export const registerAIEvents = (io, socket) => {
  socket.on("ai:message", async (data) => {
    try {
      const { message } = data;

      if (!message) {
        socket.emit("ai:error", {
          success: false,
          message: "Message is required",
        });
        return;
      }

      const stream = await ai.models.generateContentStream({
        model: "gemini-3.6-flash",
        contents: message,
      });

      let fullResponse = "";

      for await (const chunk of stream) {
        const text = chunk.text || "";

        fullResponse += text;
        socket.emit("ai:chunk", {
          text,
        });
      }

      socket.emit("ai:end", {
        success: true,
        message: "Response completed",
        response: fullResponse,
      });
    } catch (error) {
      console.error(error);
      let message = "Something went wrong. Please try again.";
      if (error.status === 429) {
        message =
          "AI request limit exceeded. Please wait a few seconds and try again.";
      } else if (error.status === 401) {
        message = "Invalid Gemini API Key.";
      } else if (error.status === 403) {
        message = "Access denied. Please check your API permissions.";
      } else if (error.status === 400) {
        message = "Invalid request.";
      }

      socket.emit("ai:error", {
        success: false,
        status: error.status || 500,
        message,
      });
    }
  });
};
