import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Image,
  Globe,
  Mic,
  Paperclip,
  X,
  SendHorizonal,
  Square,
} from "lucide-react";
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getConversations } from "../service/conversation.services";

export default function Welcome() {
  const navigate = useNavigate();
  const {
    isSendDisable,
    message,
    selectedFiles,
    isListening,
    toggleListening,
    handlePaste,
    handleSend,
    handleStopGenerating,
    handleFileSelect,
    removeFile,
    fileInputRef,
    textareaRef,
    handleMessageChange,
  } = useSpeechRecognition({
    enableSocketListeners: false,
  });
  const [tags, setTags] = useState([]);
  const { profileDetails } = useSelector(
    (store) => store.authReducer.AuthSlice,
  );

  useEffect(() => {
    getConversations();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return "Good Morning";
    }

    if (hour >= 12 && hour < 17) {
      return "Good Afternoon";
    }

    if (hour >= 17 && hour < 21) {
      return "Good Evening";
    }

    return "Good Night";
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative z-0 pt-15">
      {/* Heading */}
      <div className="mt-8 sm:mt-10 lg:mt-12 text-center px-4">
        <h1
          className="
            text-3xl
            sm:text-4xl
            md:text-5xl
            lg:text-6xl
            font-bold
            tracking-tight
            text-gray-900
            dark:text-white
          "
        >
          {getGreeting()},
          <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            {" "}
            {profileDetails?.fullName?.split(" ")[0] || "Ritik"}
          </span>
        </h1>

        <p
          className="
            mt-3
            text-sm
            sm:text-base
            md:text-lg
            lg:text-xl
            text-gray-600
            dark:text-gray-400
            max-w-2xl
            mx-auto
            leading-relaxed
          "
        >
          Can I help you with anything today?
        </p>
      </div>

      {/* Input */}
      <div className="mt-10 w-full max-w-4xl px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (isSendDisable) return;
            handleSend();
          }}
          className="
            rounded-3xl
            border
            border-gray-200
            bg-white/90
            p-4
            shadow-xl
            backdrop-blur-xl
            transition-colors
            dark:border-white/10
            dark:bg-[#171b23]/80
          "
        >
          {selectedFiles.length > 0 && (
            <div className="mb-4 flex gap-3 overflow-x-auto pb-2">
              {selectedFiles.map((file, index) => {
                const isImage = file.type.startsWith("image/");

                return (
                  <div key={index} className="relative shrink-0 ms-2 mt-2">
                    {isImage ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt=""
                        className="
                          h-15
                          w-15
                          rounded-xl
                          object-cover
                          border
                          border-gray-200
                          dark:border-white/10
                        "
                      />
                    ) : (
                      <div
                        className="
                          flex
                          h-20
                          w-32
                          flex-col
                          justify-center
                          rounded-xl
                          border
                          border-gray-200
                          bg-gray-100
                          px-3
                          dark:border-white/10
                          dark:bg-[#232936]
                        "
                      >
                        <span className="truncate text-sm text-gray-900 dark:text-white">
                          {file.name}
                        </span>
                        <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-500 text-xs text-white hover:bg-red-600 z-1"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {tags?.map((tag, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1"
              >
                <span className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">
                  {tag}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setTags((prev) => prev.filter((_, i) => i !== index))
                  }
                  className="rounded-full p-0.5 text-cyan-500 transition hover:bg-red-500 hover:text-white dark:text-cyan-300"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <textarea
            ref={textareaRef}
            rows={1}
            value={message}
            onChange={handleMessageChange}
            onPaste={handlePaste}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                e.currentTarget.form.requestSubmit();
              }
            }}
            placeholder="Message AI Chat..."
            className="
              w-full
              min-h-10
              max-h-40
              resize-none
              overflow-y-auto
              bg-transparent
              py-1
              text-sm
              leading-5
              text-gray-900
              outline-none
              placeholder:text-gray-400
              dark:text-white
              dark:placeholder:text-gray-500
            "
          />

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt,.zip"
            className="hidden"
            onChange={handleFileSelect}
          />

          {/* Bottom */}

          <div className="mt-5 flex items-center justify-between gap-3">
            {/* Left */}

            <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-gray-100
                  text-gray-600
                  transition
                  hover:bg-gray-200
                  dark:bg-[#232936]
                  dark:text-gray-300
                  dark:hover:bg-[#2d3545]
                "
              >
                <Paperclip size={16} />
              </button>
              <button
                type="button"
                onClick={() => setTags((prev) => ["🖼️ Create Image"])}
                className="
                  flex
                  h-11
                  shrink-0
                  items-center
                  gap-2
                  rounded-xl
                  bg-gray-100
                  px-3
                  text-gray-600
                  transition
                  hover:bg-gray-200
                  dark:bg-[#232936]
                  dark:text-gray-300
                  dark:hover:bg-[#2d3545]
                "
              >
                <Image size={16} />
                <span className="hidden text-xs lg:inline">Create image</span>
              </button>

              <button
                type="button"
                onClick={() => setTags((prev) => ["🔍 Web Search"])}
                className="
                  flex
                  h-11
                  shrink-0
                  items-center
                  gap-2
                  rounded-xl
                  bg-gray-100
                  px-3
                  text-gray-600
                  transition
                  hover:bg-gray-200
                  dark:bg-[#232936]
                  dark:text-gray-300
                  dark:hover:bg-[#2d3545]
                "
              >
                <Globe size={16} />
                <span className="hidden text-xs lg:inline">Search web</span>
              </button>
            </div>

            <div className="flex items-center">
              {isSendDisable ? (
                // Stop Button
                <button
                  type="button"
                  onClick={handleStopGenerating}
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-lg
                    bg-red-500/10
                    text-red-500
                    shadow-[0_0_15px_rgba(239,68,68,0.25)]
                    transition
                    hover:scale-110
                    hover:bg-red-500/20
                    dark:text-red-400
                  "
                >
                  <Square size={15} fill="currentColor" />
                </button>
              ) : message.trim() ? (
                // Send Button
                <button
                  type="submit"
                  disabled={isSendDisable}
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-lg
                    bg-blue-500
                    text-white
                    transition
                    hover:scale-110
                    hover:bg-blue-600
                    shadow-[0_0_15px_rgba(99,102,241,0.4)]
                  "
                >
                  <SendHorizonal size={17} />
                </button>
              ) : (
                // Mic Button
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300 ${
                    isListening
                      ? "bg-red-500 animate-pulse shadow-[0_0_35px_red]"
                      : "bg-blue-500 text-white hover:scale-110 hover:bg-blue-600 shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                  }`}
                >
                  <Mic size={18} className="text-white" />
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Cards */}
      <div className="mt-8 grid w-full max-w-4xl grid-cols-1 gap-5 px-4 sm:grid-cols-2 xl:grid-cols-3">
        {["Smart Budget", "Analytics", "Spending"].map((item) => (
          <div
            key={item}
            className="
              rounded-2xl
              border
              border-gray-200
              bg-white
              p-5
              shadow-sm
              backdrop-blur-xl
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-blue-500
              dark:border-white/10
              dark:bg-[#171b23]/80
            "
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {item}
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              AI powered assistant for {item.toLowerCase()}.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
