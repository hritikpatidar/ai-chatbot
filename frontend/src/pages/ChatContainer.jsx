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
import { useEffect, useRef, useState } from "react";
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
  } = useSpeechRecognition({
    enableSocketListeners: true,
  });

  const messagesEndRef = useRef(null);
  const { conversationLoading } = useSelector((store) => store.chatSlice);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "auto",
    });
  }, [messages]);

  return (
    <div className="flex h-full w-full flex-col">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4">
        <div className="mx-auto flex min-h-full max-w-5xl flex-col py-1 md:px-28 lg:px-22">
          {conversationLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-600 border-t-cyan-400" />
                <span>Loading conversation...</span>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={msg._id || `${msg.role}-${index}`}
                className={`group mb-4 flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* Wrapper */}
                <div className="relative inline-block max-w-full">
                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "border border-white/10 bg-[#161f2d]"
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

                  {/* Actions */}
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
                      group-hover:opacity-200
                    "
                    >
                      <button
                        onClick={() => handleCopy(msg.text, index)}
                        className="rounded-md p-1 text-gray-400 hover:bg-gray-800"
                      >
                        {copiedIndex === index ? (
                          <Check size={15} className="text-green-400" />
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
                        className="rounded-md p-1 text-gray-400 transition hover:bg-gray-800"
                      >
                        {copiedIndex === index ? (
                          <Check size={15} className="text-green-400" />
                        ) : (
                          <Copy size={15} />
                        )}
                      </button>

                      {/* More */}
                      <div className="relative group/more">
                        <button className="rounded-md p-1 text-gray-400 transition hover:bg-gray-800">
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
                          border-white/10
                          bg-[#1b2232]
                          py-1
                          opacity-0
                          shadow-xl
                          transition-all
                          duration-150
                          group-hover/more:visible
                          group-hover/more:opacity-100
                        "
                        >
                          <button
                            onClick={() => handleFeedback("up")}
                            className="flex w-full items-center gap-2 px-2.5 py-1.5 text-xs text-gray-300 hover:bg-white/10"
                          >
                            <ThumbsUp size={13} />
                            Good
                          </button>

                          <button
                            onClick={() => handleFeedback("down")}
                            className="flex w-full items-center gap-2 px-2.5 py-1.5 text-xs text-gray-300 hover:bg-white/10"
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
            ))
          )}
          {newMessageLoading && (
            <p className="mb-3 text-sm font-medium text-gray-400">
              Thinking<span className="animate-pulse">...</span>
            </p>
          )}
          {/* Spacer */}
          <div className="mt-auto" />
          {/* Mini Voice Orb */}
          <AnimatePresence mode="wait">
            {isListening && (
              <motion.div
                key="voice-animation"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3 }}
                className="relative mt-3 flex items-center justify-center mb-3"
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
          <p className="pb-2 text-center text-[11px] text-gray-500">
            AI can make mistakes. Verify important information.
          </p>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="py-1 md:px-28 lg:px-50">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-white/10 bg-[#161f2d] px-3 py-3">
            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="mb-3 flex gap-3 overflow-x-auto pb-1">
                {selectedFiles.map((file, index) => {
                  const isImage = file.type.startsWith("image/");

                  return (
                    <div key={index} className="relative shrink-0 ms-2 mt-2">
                      {isImage ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt=""
                          className="h-16 w-16 rounded-xl border border-white/10 object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-28 flex-col justify-center rounded-xl border border-white/10 bg-[#232936] px-3">
                          <span className="truncate text-xs text-white">
                            {file.name}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      )}

                      <button
                        onClick={() => removeFile(index)}
                        className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-xs text-white hover:bg-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Input Row */}
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
                placeholder="Ask anything..."
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
                  text-white
                  outline-none
                  placeholder:text-gray-500
                  leading-6
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

              {/* Bottom Icons */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:scale-110 shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                >
                  <Paperclip size={18} />
                </button>

                <div className="flex items-center gap-2">
                  {!isSendDisable && (
                    <button
                      type="button"
                      onClick={toggleListening}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300 ${
                        isListening
                          ? "bg-red-500 animate-pulse"
                          : "hover:scale-110 shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                      }`}
                    >
                      <Mic size={17} className="text-white" />
                    </button>
                  )}
                  {isSendDisable ? (
                    <button
                      type="button"
                      onClick={handleStopGenerating} // stop api/socket emit
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-400 transition hover:bg-red-500/20 hover:scale-110 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                    >
                      <Square size={15} fill="currentColor" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSendDisable}
                      className="flex h-9 w-9 items-center justify-center rounded-lg hover:scale-110 shadow-[0_0_15px_rgba(99,102,241,0.4)]"
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
