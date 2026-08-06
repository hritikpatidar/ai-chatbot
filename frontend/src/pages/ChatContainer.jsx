import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, SendHorizonal, Paperclip, Mic } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useSpeechRecognition from "../hooks/useSpeechRecognition";

export default function ChatContainer() {
  const {
    conversationId,
    loading,
    setLoading,
    messages,
    setMessages,
    message,
    setMessage,
    selectedFiles,
    setSelectedFiles,
    isListening,
    toggleListening,
    handlePaste,
    handleSend,
    handleFileSelect,
    removeFile,
    fileInputRef,
    handleMessageChange,
  } = useSpeechRecognition();

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "auto",
    });
  }, [messages]);

  return (
    <div className="flex h-full w-full flex-col">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4">
        <div className="mx-auto w-full max-w-5xl px-3 py-6 md:px-28 lg:px-40">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-5 flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex max-w-[92%] items-start gap-3 lg:max-w-full ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                {/* Avatar */}

                {/* <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
                    msg.role === "assistant"
                      ? "bg-linear-to-br from-blue-500 to-violet-600"
                      : "bg-emerald-600"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <Bot size={15} className="text-white" />
                  ) : (
                    <User size={15} className="text-white" />
                  )}
                </div> */}

                {/* Bubble */}

                <div
                  className={`rounded-2xl px-4 py-3 shadow-sm ${
                    msg.role === "assistant"
                      ? "border border-white/10 bg-[#161f2d] text-gray-200"
                      : "bg-gray-600 text-white"
                  }`}
                >
                  <p className="text-[13px] leading-6 whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
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
          <p className=" text-center text-[11px] text-gray-500">
            AI can make mistakes. Verify important information.
          </p>
        </div>
      </div>

      {/* Input */}
      <div className="px-3 py-2 md:px-28 lg:px-50">
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
            <div className="flex flex-col gap-2">
              {/* Textarea */}
              <textarea
                ref={textareaRef}
                rows={1}
                value={message}
                onChange={handleMessageChange}
                onPaste={handlePaste}
                placeholder="Ask anything..."
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
                  onClick={() => fileInputRef.current.click()}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:scale-110 shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                >
                  <Paperclip size={18} />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleListening}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300 ${
                      isListening
                        ? "bg-red-500 animate-pulse"
                        : "hover:scale-110 shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                    }`}
                  >
                    <Mic size={17} className="text-white" />
                  </button>

                  <button
                    onClick={handleSend}
                    className="flex h-9 w-9 items-center justify-center rounded-lg hover:scale-110 shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                  >
                    <SendHorizonal size={17} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
