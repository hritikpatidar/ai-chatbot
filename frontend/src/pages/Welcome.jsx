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

import { useDispatch, useSelector } from "react-redux";

import {
  getConversations,
  onConversationCreated,
  onConversationError,
  onConversationList,
  removeConversationCreated,
  removeConversationError,
  removeConversationList,
} from "../service/conversation.services";
import {
  addConversation,
  setActivePage,
  setConversationList,
} from "../redux/features/Chat/chatSlice";
import { useNavigate } from "react-router-dom";
import { getFileIcon } from "../utils/Auth";

export default function Welcome() {
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
    clientConfig,
    clientConfigLoading,
    isClientChatbot,
    clientKey,
  } = useSpeechRecognition({
    enableSocketListeners: false,
  });

  const [tags, setTags] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { profileDetails } = useSelector(
    (store) => store.authReducer.AuthSlice,
  );

  useEffect(() => {
    const handleConversationCreate = async ({ conversation }) => {
      await dispatch(addConversation(conversation));
      dispatch(setActivePage("recentChat"));
      if (clientKey) {
        navigate(`/c/${conversation?._id}?clientKey=${clientKey}`, {
          state: {
            isNewConversation: true,
          },
        });
      } else {
        navigate(`/c/${conversation?._id}`, {
          state: {
            isNewConversation: true,
          },
        });
      }
    };

    const handleConversation = async (data) => {
      await dispatch(setConversationList(data.conversations));
    };

    const handleConversationError = async (data) => {
      dispatch(setActivePage("newChat"));
      navigate("/", {
        replace: true,
      });
      toast.error(data?.message || "Somthing went wrong", {
        id: "conversation-error",
      });
    };

    onConversationCreated(handleConversationCreate);
    onConversationList(handleConversation);
    onConversationError(handleConversationError);
    return () => {
      removeConversationCreated(handleConversationCreate);
      removeConversationList(handleConversation);
      removeConversationError(handleConversationError);
    };
  }, []);

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

  const chatbot = clientConfig?.chatbot;
  const chatbotName =
    chatbot?.name || `${clientConfig?.businessName || "Business"} Assistant`;
  const welcomeMessage =
    chatbot?.welcomeMessage ||
    `Hi 👋 Welcome to ${
      clientConfig?.businessName || "our business"
    }! How can I help you today?`;

  const predefinedQuestions =
    chatbot?.predefinedQuestions
      ?.filter((item) => item.enabled)
      ?.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)) || [];

  const handlePredefinedQuestion = (question) => {
    if (!question) return;
    if (isSendDisable) return;
    handleSend(question);
  };

  return (
    <div
      className={`
        relative
        z-0
        flex
        w-full
        min-h-full
        flex-col
        items-center
        px-3
        pt-6
        pb-8
        sm:px-4
        sm:pt-10
        sm:pb-10
        ${isClientChatbot ? "justify-start" : "justify-center"}
      `}
    >
      {isClientChatbot ? (
        <>
          {/* Client Heading */}

          <div className="mt-8 px-4 text-center sm:mt-10 lg:mt-12">
            <h1
              className="
                px-2
                text-2xl
                font-bold
                leading-tight
                tracking-tight
                text-gray-900
                sm:text-4xl
                md:text-5xl
                lg:text-6xl
                dark:text-white
              "
            >
              <span
                className="
                  bg-linear-to-r
                  from-cyan-400
                  to-blue-500
                  bg-clip-text
                  text-transparent
                "
              >
                {chatbotName}
              </span>
            </h1>

            <p
              className="
                mx-auto
                mt-3
                max-w-2xl
                px-2
                text-sm
                leading-6
                text-gray-600
                sm:text-base
                md:text-lg
                dark:text-gray-400
              "
            >
              {clientConfig?.businessName
                ? `Ask anything about ${clientConfig.businessName}`
                : "How can I help you today?"}
            </p>
          </div>

          {/* Client Input */}

          <div className="mt-8 w-full max-w-4xl px-3 sm:mt-10 sm:px-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (isSendDisable) return;
                handleSend();
              }}
              className="
                w-full
                rounded-3xl
                border
                border-gray-200
                bg-white/90
                p-3
                shadow-xl
                backdrop-blur-xl
                sm:p-4
                dark:border-white/10
                dark:bg-[#171b23]/80
              "
            >
              {/* Selected Files */}

              {selectedFiles.length > 0 && (
                <div className="mb-4 flex gap-3 overflow-x-auto pb-2">
                  {selectedFiles.map((file, index) => {
                    const isImage = file.type.startsWith("image/");

                    return (
                      <div key={index} className="relative ms-2 mt-2 shrink-0">
                        {isImage ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt=""
                            className="
                              h-15
                              w-15
                              rounded-xl
                              border
                              border-gray-200
                              object-cover
                              dark:border-white/10
                            "
                          />
                        ) : (
                          (() => {
                            const FileIcon = getFileIcon(file);

                            return (
                              <div
                                className="
                                  flex
                                  h-20
                                  w-32
                                  items-center
                                  gap-3
                                  rounded-xl
                                  border
                                  border-gray-200
                                  bg-gray-100
                                  px-3
                                  dark:border-white/10
                                  dark:bg-[#232936]
                                "
                              >
                                {/* File Icon */}
                                <div
                                  className="
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-white
                                    text-gray-500
                                    dark:bg-[#171b23]
                                    dark:text-gray-300
                                  "
                                >
                                  <FileIcon size={22} />
                                </div>

                                {/* File Info */}
                                <div className="min-w-0">
                                  <span
                                    className="
                                      block
                                      truncate
                                      text-sm
                                      font-medium
                                      text-gray-900
                                      dark:text-white
                                    "
                                  >
                                    {file.name}
                                  </span>

                                  <span
                                    className="
                                      mt-1
                                      block
                                      text-xs
                                      text-gray-500
                                      dark:text-gray-400
                                    "
                                  >
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                  </span>
                                </div>
                              </div>
                            );
                          })()
                        )}

                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="
                              absolute
                              -right-2
                              -top-1
                              z-1
                              flex
                              h-4
                              w-4
                              items-center
                              justify-center
                              rounded-full
                              bg-gray-500
                              text-xs
                              text-white
                              hover:bg-red-600
                            "
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tags */}

              <div className="flex flex-wrap gap-2">
                {tags?.map((tag, index) => (
                  <div
                    key={index}
                    className="
                        flex
                        items-center
                        gap-2
                        rounded-full
                        border
                        border-cyan-500/30
                        bg-cyan-500/10
                        px-3
                        py-1
                      "
                  >
                    <span
                      className="
                          text-sm
                          font-semibold
                          text-cyan-600
                          dark:text-cyan-400
                        "
                    >
                      {tag}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setTags((prev) => prev.filter((_, i) => i !== index))
                      }
                      className="
                          rounded-full
                          p-0.5
                          text-cyan-500
                          transition
                          hover:bg-red-500
                          hover:text-white
                          dark:text-cyan-300
                        "
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Textarea */}

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
                placeholder={
                  clientConfig?.businessName
                    ? `Ask ${clientConfig.businessName} anything...`
                    : "Ask anything..."
                }
                className="
                  min-h-10
                  max-h-40
                  w-full
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

              <div className="mt-4 flex items-center justify-between gap-2 sm:mt-5 sm:gap-3">
                <div
                  className="flex
                    min-w-0
                    flex-1
                    items-center
                    gap-2
                    overflow-x-auto
                    whitespace-nowrap
                    pb-1
                  "
                >
                  {/* Attachment */}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
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

                  {/* Create Image */}

                  <button
                    type="button"
                    onClick={() => setTags(["🖼️ Create Image"])}
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

                    <span className="hidden text-xs lg:inline">
                      Create image
                    </span>
                  </button>

                  {/* Search */}

                  <button
                    type="button"
                    onClick={() => setTags(["🔍 Web Search"])}
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
                        shadow-[0_0_15px_rgba(99,102,241,0.4)]
                        transition
                        hover:scale-110
                        hover:bg-blue-600
                      "
                    >
                      <SendHorizonal size={17} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={toggleListening}
                      className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300 ${
                        isListening
                          ? "animate-pulse bg-red-500 shadow-[0_0_35px_red]"
                          : "bg-blue-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:scale-110 hover:bg-blue-600"
                      }`}
                    >
                      <Mic size={18} className="text-white" />
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

          <div className="mt-6 w-full max-w-4xl px-4">
            {clientConfigLoading ? (
              <div className="flex items-center justify-center gap-2 py-5 text-sm text-gray-500 dark:text-gray-400">
                <div
                  className="
                    h-4
                    w-4
                    animate-spin
                    rounded-full
                    border-2
                    border-gray-300
                    border-t-cyan-500
                    dark:border-gray-600
                    dark:border-t-cyan-400
                  "
                />

                <span>Loading questions...</span>
              </div>
            ) : predefinedQuestions.length > 0 ? (
              <div>
                <p className="mb-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                  You can ask
                </p>

                <div className="flex flex-wrap justify-center gap-2">
                  {predefinedQuestions.map((item) => (
                    <button
                      key={item._id}
                      type="button"
                      disabled={isSendDisable}
                      onClick={() => handlePredefinedQuestion(item.question)}
                      className="
                          rounded-xl
                          border
                          border-gray-200
                          bg-white
                          px-4
                          py-2.5
                          text-left
                          text-xs
                          font-medium
                          text-gray-700
                          shadow-sm
                          transition-all
                          hover:-translate-y-0.5
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
              </div>
            ) : null}
          </div>

          {!clientConfigLoading && welcomeMessage && (
            <div className="mt-6 w-full max-w-3xl px-4 text-center">
              <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
                {welcomeMessage}
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Heading */}

          <div className="mt-8 px-4 text-center sm:mt-10 lg:mt-12">
            <h1
              className="
                text-3xl
                font-bold
                tracking-tight
                text-gray-900
                sm:text-4xl
                md:text-5xl
                lg:text-6xl
                dark:text-white
              "
            >
              {getGreeting()},
              <span
                className="
                  bg-linear-to-r
                  from-cyan-400
                  to-blue-500
                  bg-clip-text
                  text-transparent
                "
              >
                {" "}
                {profileDetails?.fullName?.split(" ")[0] || "Ritik"}
              </span>
            </h1>

            <p
              className="
                mx-auto
                mt-3
                max-w-2xl
                text-sm
                leading-relaxed
                text-gray-600
                sm:text-base
                md:text-lg
                lg:text-xl
                dark:text-gray-400
              "
            >
              Can I help you with anything today?
            </p>
          </div>

          {/* Normal Input */}

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
              {/* Selected files */}

              {selectedFiles.length > 0 && (
                <div className="mb-4 flex gap-3 overflow-x-auto pb-2">
                  {selectedFiles.map((file, index) => {
                    const isImage = file.type.startsWith("image/");

                    return (
                      <div key={index} className="relative ms-2 mt-2 shrink-0">
                        {isImage ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt=""
                            className="
                                h-15
                                w-15
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
                          className="
                              absolute
                              -right-2
                              -top-1
                              z-1
                              flex
                              h-4
                              w-4
                              items-center
                              justify-center
                              rounded-full
                              bg-gray-500
                              text-xs
                              text-white
                              hover:bg-red-600
                            "
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tags */}

              <div className="flex flex-wrap gap-2">
                {tags?.map((tag, index) => (
                  <div
                    key={index}
                    className="
                        flex
                        items-center
                        gap-2
                        rounded-full
                        border
                        border-cyan-500/30
                        bg-cyan-500/10
                        px-3
                        py-1
                      "
                  >
                    <span className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">
                      {tag}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setTags((prev) => prev.filter((_, i) => i !== index))
                      }
                      className="
                          rounded-full
                          p-0.5
                          text-cyan-500
                          transition
                          hover:bg-red-500
                          hover:text-white
                          dark:text-cyan-300
                        "
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
                  min-h-10
                  max-h-40
                  w-full
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

              <div className="mt-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
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
                    onClick={() => setTags(["🖼️ Create Image"])}
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

                    <span className="hidden text-xs lg:inline">
                      Create image
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTags(["🔍 Web Search"])}
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
                        transition
                        hover:scale-110
                      "
                    >
                      <Square size={15} fill="currentColor" />
                    </button>
                  ) : message.trim() ? (
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
                      "
                    >
                      <SendHorizonal size={17} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={toggleListening}
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        isListening
                          ? "animate-pulse bg-red-500"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                    >
                      <Mic size={18} className="text-white" />
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Normal Cards */}

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
        </>
      )}
    </div>
  );
}
