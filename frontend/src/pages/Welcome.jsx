import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Image, Globe, Mic, Paperclip, X, SendHorizonal } from "lucide-react";
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import { useSelector } from "react-redux";
import socket from "../socket/socket";

export default function Welcome() {
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
  const [tags, setTags] = useState([]);
  const { profileDetails } = useSelector(
    (store) => store.authReducer.AuthSlice,
  );

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    return () => {
      socket.off("connect");
      socket.disconnect();
    };
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
      {/* Orb */}
      <AnimatePresence mode="wait">
        {isListening && (
          <motion.div
            key="voice-animation"
            initial={{
              opacity: 0,
              scale: 0.3,
              y: 40,
              filter: "blur(10px)",
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            exit={{
              opacity: 0,
              scale: 0.4,
              y: -20,
              filter: "blur(10px)",
            }}
            transition={{
              duration: 0.45,
              ease: "easeOut",
            }}
            className="relative mt-6 flex items-center justify-center"
          >
            {/* Outer Rings */}

            <motion.div
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.6, 0, 0.6],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
              }}
              className="absolute h-24 w-24 rounded-full border-2 border-cyan-400"
            />

            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 0, 0.4],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.8,
              }}
              className="absolute h-36 w-36 rounded-full border border-blue-500"
            />

            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0, 0.2],
              }}
              transition={{
                repeat: Infinity,
                duration: 3.5,
              }}
              className="absolute h-48 w-48 rounded-full border border-purple-500"
            />

            {/* Center Orb */}

            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                rotate: 360,
                boxShadow: [
                  "0 0 40px #60A5FA",
                  "0 0 90px #60A5FA",
                  "0 0 40px #60A5FA",
                ],
              }}
              transition={{
                scale: {
                  repeat: Infinity,
                  duration: 1.6,
                },
                rotate: {
                  repeat: Infinity,
                  duration: 8,
                  ease: "linear",
                },
                boxShadow: {
                  repeat: Infinity,
                  duration: 1.6,
                },
              }}
              className="h-24 w-24 rounded-full bg-linear-to-br from-pink-300 via-blue-300 to-purple-500"
            />
          </motion.div>
        )}
      </AnimatePresence>

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
                text-white
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
                text-gray-400
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
        <div className="rounded-3xl border border-white/10 bg-[#171b23]/80 p-4 backdrop-blur-xl">
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
                        className="h-15 w-15 rounded-xl object-cover border border-white/10"
                      />
                    ) : (
                      <div className="flex h-20 w-32 flex-col justify-center rounded-xl border border-white/10 bg-[#232936] px-3">
                        <span className="truncate text-sm text-white">
                          {file.name}
                        </span>
                        <span className="mt-1 text-xs text-gray-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    )}

                    <button
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
                <span className="text-sm font-semibold text-cyan-400">
                  {tag}
                </span>

                <button
                  onClick={() =>
                    setTags((prev) => prev.filter((_, i) => i !== index))
                  }
                  className="rounded-full p-0.5 text-cyan-300 transition hover:bg-red-500 hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <textarea
            rows={1}
            value={message}
            onChange={handleMessageChange}
            onPaste={handlePaste}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
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
              text-white
              outline-none
              placeholder:text-sm
              placeholder:text-gray-500
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
                onClick={() => fileInputRef.current.click()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#232936] transition hover:bg-[#2d3545]"
              >
                <Paperclip size={16} />
              </button>

              <button
                onClick={() => setTags((prev) => ["🖼️ Create Image"])}
                className="flex h-11 shrink-0 items-center gap-2 rounded-xl bg-[#232936] px-3 transition hover:bg-[#2d3545]"
              >
                <Image size={16} />
                <span className="hidden lg:inline text-xs">Create image</span>
              </button>

              <button
                onClick={() => setTags((prev) => ["🔍 Web Search"])}
                className="flex h-11 shrink-0 items-center gap-2 rounded-xl bg-[#232936] px-3 transition hover:bg-[#2d3545]"
              >
                <Globe size={16} />
                <span className="hidden lg:inline text-xs">Search web</span>
              </button>
            </div>

            {/* Right */}

            {message.trim() ? (
              <button
                onClick={handleSend}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg hover:scale-110 shadow-[0_0_15px_rgba(99,102,241,0.4)]"
              >
                <SendHorizonal size={16} />
              </button>
            ) : (
              <button
                onClick={toggleListening}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all duration-300
                    ${
                      isListening
                        ? "bg-red-500 animate-pulse shadow-[0_0_35px_red]"
                        : "hover:scale-110 shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                    }`}
              >
                <Mic size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="mt-8 grid w-full max-w-4xl grid-cols-1 gap-5 px-4 sm:grid-cols-2 xl:grid-cols-3">
        {["Smart Budget", "Analytics", "Spending"].map((item) => (
          <div
            key={item}
            className="
                    rounded-2xl
                    border border-white/10
                    bg-[#171b23]/80
                    p-5
                    backdrop-blur-xl
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-blue-500
                "
          >
            <h3 className="text-lg font-semibold">{item}</h3>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              AI powered assistant for {item.toLowerCase()}.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
