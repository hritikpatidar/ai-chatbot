import { motion, AnimatePresence } from "framer-motion";
import {
  SendHorizonal,
  Paperclip,
  Mic,
  Square,
  Check,
  Copy,
  ThumbsUp,
  ThumbsDown,
  MessageSquarePlus,
  MoreHorizontal,
} from "lucide-react";
import { useEffect, useRef } from "react";
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import AIMessage from "../components/Chat/AIMessage";
import { useSelector } from "react-redux";

export default function ChatContainer() {
  const {
    newMessageLoading,
    isSendDisable,
    messages,

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

    copiedIndex,
    handleCopy,
    handleFeedback,

    clientConfig,
    clientConfigLoading,
    isClientChatbot,
  } = useSpeechRecognition({
    enableSocketListeners: true,
  });

  debugger
  const messagesEndRef = useRef(null);
  const { conversationLoading } = useSelector((store) => store.chatSlice);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "auto",
    });
  }, [messages]);

  return (
    // <div className="flex h-full w-full flex-col bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-[#0b0f17] dark:text-white">
    <div className="flex h-full w-full flex-col bg-transparent text-gray-900 transition-colors duration-300 dark:text-white">
      <div className="flex-1 overflow-y-auto px-4">
        <div className="mx-auto flex min-h-full max-w-5xl flex-col py-1 md:px-28 lg:px-22">
          {conversationLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-cyan-500 dark:border-gray-600 dark:border-t-cyan-400" />

                <span>Loading conversation...</span>
              </div>
            </div>
          ) : (
            <>
              {isClientChatbot && clientConfig && messages.length === 0 && (
                <div className="mb-6 flex flex-col items-start">
                  {/* Welcome Message */}

                  <div className="max-w-2xl">
                    <AIMessage
                      content={
                        clientConfig.chatbot?.welcomeMessage ||
                        `Hi 👋 Welcome to ${
                          clientConfig.businessName || "our business"
                        }! How can I help you today?`
                      }
                    />
                  </div>

                  {/* Predefined Questions */}

                  {clientConfig.chatbot?.predefinedQuestions
                    ?.filter((item) => item.enabled)
                    ?.sort((a, b) => a.sortOrder - b.sortOrder)?.length > 0 && (
                    <div className="mt-4 flex max-w-2xl flex-wrap gap-2">
                      {clientConfig.chatbot.predefinedQuestions
                        .filter((item) => item.enabled)
                        .sort((a, b) => a.sortOrder - b.sortOrder)
                        .map((item) => (
                          <button
                            key={item._id}
                            type="button"
                            disabled={isSendDisable}
                            onClick={() => handleSend(item.question)}
                            className="
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  px-3
                  py-2
                  text-left
                  text-xs
                  text-gray-700
                  shadow-sm
                  transition
                  hover:border-cyan-400
                  hover:bg-cyan-50
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  dark:border-white/10
                  dark:bg-[#161f2d]
                  dark:text-gray-300
                  dark:hover:border-cyan-400
                  dark:hover:bg-cyan-400/10
                "
                          >
                            {item.question}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              )}
              {isClientChatbot && clientConfigLoading && (
                <div className="flex items-center gap-2 py-4 text-sm text-gray-500">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-cyan-500" />
                  <span>Loading chatbot...</span>
                </div>
              )}
              {messages.map((msg, index) => (
                <div
                  key={msg._id || `${msg.role}-${index}`}
                  className={`group mb-4 flex bg-transparent ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* Wrapper */}
                  <div className="relative  inline-block max-w-full">
                    {/* Message Bubble */}
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        msg.role === "user"
                          ? "border border-gray-200 bg-white text-gray-900 shadow-sm dark:border-white/10 dark:bg-[#161f2d] dark:text-white"
                          : ""
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <AIMessage content={msg.text} isError={msg.isError} />
                      ) : (
                        <p className="whitespace-pre-wrap wrap-break-word text-sm leading-6">
                          {msg.text}
                        </p>
                      )}
                    </div>

                    {msg.role === "user" && (
                      <div
                        className="
                        absolute
                        -bottom-7
                        right-1
                        flex
                        items-center
                        gap-2
                        opacity-0
                        transition
                        duration-200
                        group-hover:opacity-100
                      "
                      >
                        <button
                          onClick={() => handleCopy(msg.text, index)}
                          className="
                          rounded-md
                          p-1
                          text-gray-500
                          transition
                          hover:bg-gray-200
                          hover:text-gray-800
                          dark:text-gray-400
                          dark:hover:bg-gray-800
                          dark:hover:text-white
                        "
                        >
                          {copiedIndex === index ? (
                            <Check
                              size={15}
                              className="text-green-500 dark:text-green-400"
                            />
                          ) : (
                            <Copy size={15} />
                          )}
                        </button>
                      </div>
                    )}

                    {msg.role === "assistant" && !isSendDisable && (
                      <div className="ms-3 -mt-4 flex items-center gap-1">
                        {/* Copy */}
                        <button
                          onClick={() => handleCopy(msg.text, index)}
                          className="
                          rounded-md
                          p-1
                          text-gray-500
                          transition
                          hover:bg-gray-200
                          hover:text-gray-800
                          dark:text-gray-400
                          dark:hover:bg-gray-800
                          dark:hover:text-white
                        "
                        >
                          {copiedIndex === index ? (
                            <Check
                              size={15}
                              className="text-green-500 dark:text-green-400"
                            />
                          ) : (
                            <Copy size={15} />
                          )}
                        </button>

                        {/* More */}
                        <div className="relative group/more">
                          <button
                            className="
                            rounded-md
                            p-1
                            text-gray-500
                            transition
                            hover:bg-gray-200
                            hover:text-gray-800
                            dark:text-gray-400
                            dark:hover:bg-gray-800
                            dark:hover:text-white
                          "
                          >
                            <MoreHorizontal size={15} />
                          </button>

                          {/* Dropdown */}
                          <div
                            className="
                            invisible
                            absolute
                            left-0
                            top-7
                            z-50
                            w-32
                            overflow-hidden
                            rounded-lg
                            border
                            border-gray-200
                            bg-white
                            py-1
                            opacity-0
                            shadow-xl
                            transition-all
                            duration-150
                            group-hover/more:visible
                            group-hover/more:opacity-100
                            dark:border-white/10
                            dark:bg-[#1b2232]
                          "
                          >
                            <button
                              onClick={() => handleFeedback("up")}
                              className="
                              flex
                              w-full
                              items-center
                              gap-2
                              px-2.5
                              py-1.5
                              text-xs
                              text-gray-700
                              transition
                              hover:bg-gray-100
                              dark:text-gray-300
                              dark:hover:bg-white/10
                            "
                            >
                              <ThumbsUp size={13} />
                              Good
                            </button>

                            <button
                              onClick={() => handleFeedback("down")}
                              className="
                              flex
                              w-full
                              items-center
                              gap-2
                              px-2.5
                              py-1.5
                              text-xs
                              text-gray-700
                              transition
                              hover:bg-gray-100
                              dark:text-gray-300
                              dark:hover:bg-white/10
                            "
                            >
                              <ThumbsDown size={13} />
                              Bad
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Thinking */}
          {newMessageLoading && (
            <p className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
              Thinking
              <span className="animate-pulse">...</span>
            </p>
          )}

          {/* Spacer */}
          <div className="mt-auto" />

          <AnimatePresence mode="wait">
            {isListening && (
              <motion.div
                key="voice-animation"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3 }}
                className="relative mb-3 mt-3 flex items-center justify-center"
              >
                {/* Outer Ring 1 */}
                <motion.div
                  animate={{
                    scale: [1, 1.35, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.8,
                  }}
                  className="absolute h-10 w-10 rounded-full border border-cyan-400"
                />

                {/* Outer Ring 2 */}
                <motion.div
                  animate={{
                    scale: [1, 1.25, 1],
                    opacity: [0.35, 0, 0.35],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.4,
                  }}
                  className="absolute h-14 w-14 rounded-full border border-blue-500/70"
                />

                {/* Center Orb */}
                <motion.div
                  animate={{
                    scale: [1, 1.12, 1],
                    rotate: 360,
                    boxShadow: [
                      "0 0 10px #60A5FA",
                      "0 0 20px #60A5FA",
                      "0 0 10px #60A5FA",
                    ],
                  }}
                  transition={{
                    scale: {
                      repeat: Infinity,
                      duration: 1.5,
                    },
                    rotate: {
                      repeat: Infinity,
                      duration: 6,
                      ease: "linear",
                    },
                    boxShadow: {
                      repeat: Infinity,
                      duration: 1.5,
                    },
                  }}
                  className="h-8 w-8 rounded-full bg-linear-to-br from-cyan-300 via-blue-400 to-purple-500"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <p className="pb-2 text-center text-[11px] text-gray-500 dark:text-gray-500">
            AI can make mistakes. Verify important information.
          </p>

          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="py-1 md:px-28 lg:px-50">
        <div className="mx-auto max-w-5xl">
          <div
            className="
              rounded-2xl
              border
              border-gray-200
              bg-white
              px-3
              py-3
              shadow-sm
              transition-colors
              duration-300
              dark:border-white/10
              dark:bg-[#161f2d]
            "
          >
            {selectedFiles.length > 0 && (
              <div className="mb-3 flex gap-3 overflow-x-auto pb-1">
                {selectedFiles.map((file, index) => {
                  const isImage = file.type.startsWith("image/");

                  return (
                    <div key={index} className="relative ms-2 mt-2 shrink-0">
                      {isImage ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt=""
                          className="
                            h-16
                            w-16
                            rounded-xl
                            border
                            border-gray-200
                            object-cover
                            dark:border-white/10
                          "
                        />
                      ) : (
                        <div
                          className="
                            flex
                            h-16
                            w-28
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
                          <span className="truncate text-xs text-gray-800 dark:text-white">
                            {file.name}
                          </span>

                          <span className="text-[10px] text-gray-500 dark:text-gray-400">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      )}

                      <button
                        onClick={() => removeFile(index)}
                        className="
                          absolute
                          -right-1
                          -top-1
                          flex
                          h-5
                          w-5
                          items-center
                          justify-center
                          rounded-full
                          bg-black/70
                          text-xs
                          text-white
                          transition
                          hover:bg-red-500
                        "
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();

                if (isSendDisable) return;

                handleSend();
              }}
              className="flex flex-col gap-2"
            >
              {/* Textarea */}
              <textarea
                ref={textareaRef}
                rows={1}
                value={message}
                onChange={handleMessageChange}
                onPaste={handlePaste}
                placeholder={
                  isClientChatbot
                    ? `Ask ${clientConfig?.businessName || "us"} anything...`
                    : "Ask anything..."
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    e.currentTarget.form.requestSubmit();
                  }
                }}
                className="
                  w-full
                  resize-none
                  overflow-y-auto
                  bg-transparent
                  text-[13px]
                  leading-6
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
              <div className="flex items-center justify-between">
                {/* Attachment */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    text-gray-500
                    shadow-[0_0_15px_rgba(99,102,241,0.2)]
                    transition
                    hover:scale-110
                    hover:bg-gray-100
                    hover:text-gray-800
                    dark:text-gray-400
                    dark:hover:bg-white/5
                    dark:hover:text-white
                  "
                >
                  <Paperclip size={18} />
                </button>

                <div className="flex items-center gap-2">
                  {/* Mic */}
                  {!isSendDisable && (
                    <button
                      type="button"
                      onClick={toggleListening}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300 ${
                        isListening
                          ? "animate-pulse bg-red-500"
                          : "text-gray-600 hover:scale-110 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
                      }`}
                    >
                      <Mic
                        size={17}
                        className={isListening ? "text-white" : "text-current"}
                      />
                    </button>
                  )}

                  {/* Stop */}
                  {isSendDisable ? (
                    <button
                      type="button"
                      onClick={handleStopGenerating}
                      className="
                        flex
                        h-9
                        w-9
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
                  ) : (
                    /* Send */
                    <button
                      type="submit"
                      disabled={isSendDisable}
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-lg
                        text-gray-700
                        shadow-[0_0_15px_rgba(99,102,241,0.25)]
                        transition
                        hover:scale-110
                        hover:bg-gray-100
                        dark:text-white
                        dark:hover:bg-white/5
                      "
                    >
                      <SendHorizonal size={17} />
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
