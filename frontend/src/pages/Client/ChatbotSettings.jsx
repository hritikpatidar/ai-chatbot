import { useEffect, useState } from "react";
import { Bot, Save, RotateCcw, CheckCircle2, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updateClient } from "../../redux/features/Client/clientSlice";

export default function ChatbotSettings() {
  const dispatch = useDispatch();
  const { client, loading, error } = useSelector(
    (state) => state?.ClientReducer?.clientSlice || {},
  );
  const [formData, setFormData] = useState({
    name: "",
    welcomeMessage: "",
    language: "english",
    tone: "friendly",
    aiInstructions: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  useEffect(() => {
    if (client?.chatbot) {
      setFormData({
        name: client.chatbot.name || "",
        welcomeMessage: client.chatbot.welcomeMessage || "",
        language: client.chatbot.language || "english",
        tone: client.chatbot.tone || "friendly",
        aiInstructions: client.chatbot.aiInstructions || "",
      });
    }
  }, [client]);

  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [successMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!client?._id) {
      return;
    }
    try {
      const result = await dispatch(
        updateClient({
          clientId: client._id,
          data: {
            chatbot: formData,
          },
        }),
      );

      if (updateClient.fulfilled.match(result)) {
        setSuccessMessage("Chatbot settings updated successfully.");
      }
    } catch (error) {
      console.error("Chatbot settings update failed:", error);
    }
  };

  const handleReset = () => {
    setFormData({
      name: client?.chatbot?.name || "",
      welcomeMessage: client?.chatbot?.welcomeMessage || "",
      language: client?.chatbot?.language || "english",
      tone: client?.chatbot?.tone || "friendly",
      aiInstructions: client?.chatbot?.aiInstructions || "",
    });

    setSuccessMessage("");
  };

  const inputClass = `
    w-full
    rounded-xl
    border
    border-gray-200
    bg-white
    px-4
    py-3
    text-sm
    text-gray-900
    outline-none
    transition-all
    duration-200
    placeholder:text-gray-400
    focus:border-blue-500
    focus:ring-2
    focus:ring-blue-500/10

    dark:border-white/10
    dark:bg-[#171b23]
    dark:text-white
    dark:placeholder:text-gray-500
  `;

  if (!client?._id) {
    return (
      <div className="flex min-h-100 items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
            <Bot size={24} />
          </div>

          <h2 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">
            Client not found
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Please select a client before configuring the chatbot.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full bg-transparent text-gray-900 dark:text-white">
      <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <div className="mb-6">
          <div className="flex items-start gap-3">
            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-blue-500/10
                text-blue-600
                dark:text-blue-400
              "
            >
              <Bot size={22} />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                Chatbot Settings
              </h1>

              <p className="mt-1 max-w-2xl text-xs leading-5 text-gray-500 dark:text-gray-400 sm:text-sm">
                Configure how your AI chatbot looks, communicates, and responds
                to your customers.
              </p>
            </div>
          </div>
        </div>

        {successMessage && (
          <div
            className="
              mb-5
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-green-200
              bg-green-50
              px-4
              py-3
              text-sm
              text-green-700

              dark:border-green-500/20
              dark:bg-green-500/10
              dark:text-green-400
            "
          >
            <CheckCircle2 size={18} className="shrink-0" />

            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div
            className="
              mb-5
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-sm
              text-red-600

              dark:border-red-500/20
              dark:bg-red-500/10
              dark:text-red-400
            "
          >
            <AlertCircle size={18} className="shrink-0" />

            <span>
              {typeof error === "string"
                ? error
                : error?.message || "Something went wrong."}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-gray-200
              bg-white
              shadow-sm

              dark:border-white/10
              dark:bg-[#171b23]
            "
          >
            <div className="border-b border-gray-200 p-5 dark:border-white/10 sm:p-6">
              <div className="mb-5">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  General Settings
                </h2>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Basic chatbot configuration.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Bot Name */}

                <div>
                  <label
                    htmlFor="name"
                    className="
                      mb-2
                      block
                      text-sm
                      font-medium
                      text-gray-700
                      dark:text-gray-300
                    "
                  >
                    Chatbot Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="AI Assistant"
                    className={inputClass}
                  />
                </div>

                {/* Language */}

                <div>
                  <label
                    htmlFor="language"
                    className="
                      mb-2
                      block
                      text-sm
                      font-medium
                      text-gray-700
                      dark:text-gray-300
                    "
                  >
                    Language
                  </label>

                  <select
                    id="language"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="english">English</option>

                    <option value="hindi">Hindi</option>

                    <option value="hinglish">Hinglish</option>
                  </select>
                </div>

                {/* Tone */}

                <div>
                  <label
                    htmlFor="tone"
                    className="
                      mb-2
                      block
                      text-sm
                      font-medium
                      text-gray-700
                      dark:text-gray-300
                    "
                  >
                    Response Tone
                  </label>

                  <select
                    id="tone"
                    name="tone"
                    value={formData.tone}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="friendly">Friendly</option>

                    <option value="professional">Professional</option>

                    <option value="casual">Casual</option>

                    <option value="formal">Formal</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 p-5 dark:border-white/10 sm:p-6">
              <div className="mb-5">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  Welcome Message
                </h2>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  This message will be shown when a customer opens the chatbot.
                </p>
              </div>

              <textarea
                name="welcomeMessage"
                value={formData.welcomeMessage}
                onChange={handleChange}
                rows={4}
                placeholder="Hi 👋 Welcome! How can I help you today?"
                className={inputClass}
              />

              <div className="mt-2 flex justify-end">
                <span className="text-[11px] text-gray-400 dark:text-gray-500">
                  {formData.welcomeMessage.length} characters
                </span>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="mb-5">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  AI Instructions
                </h2>

                <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                  Give additional instructions to guide how the AI should answer
                  customer questions.
                </p>
              </div>

              <textarea
                name="aiInstructions"
                value={formData.aiInstructions}
                onChange={handleChange}
                rows={7}
                placeholder="Always be polite. Help users with products, pricing, availability and delivery related questions..."
                className={inputClass}
              />

              <div className="mt-2 flex flex-col gap-1 text-[11px] text-gray-500 dark:text-gray-400 sm:flex-row sm:items-center sm:justify-between">
                <span>These instructions guide the AI response behavior.</span>

                <span>{formData.aiInstructions.length} characters</span>
              </div>
            </div>

            <div
              className="
                flex
                flex-col-reverse
                gap-3
                border-t
                border-gray-200
                bg-gray-50/50
                p-5

                dark:border-white/10
                dark:bg-white/2

                sm:flex-row
                sm:items-center
                sm:justify-end
                sm:p-6
              "
            >
              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-gray-700
                  transition
                  hover:bg-gray-50
                  disabled:cursor-not-allowed
                  disabled:opacity-50

                  dark:border-white/10
                  dark:bg-[#171b23]
                  dark:text-gray-300
                  dark:hover:bg-white/5
                "
              >
                <RotateCcw size={16} />
                Reset
              </button>

              <button
                type="submit"
                disabled={loading}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-blue-600
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-white
                  shadow-sm
                  transition
                  hover:bg-blue-700
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500/30
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                <Save size={16} />

                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
