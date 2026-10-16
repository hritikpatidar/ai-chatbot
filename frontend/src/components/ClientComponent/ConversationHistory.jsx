import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, MessageSquare, Menu, X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import {
  getConversations,
  onConversationError,
  onConversationList,
  removeConversationError,
  removeConversationList,
} from "../../service/conversation.services";
import useSpeechRecognition from "../../hooks/useSpeechRecognition";
import {
  setConversationList,
  setConversationLoading,
  setMessages,
} from "../../redux/features/Chat/chatSlice";
import { useSocket } from "../../context/SocketContext";
import { useNavigate } from "react-router-dom";
import {
  getConversationMessages,
  onConversationMessages,
  removeConversationMessages,
} from "../../service/message.services";
import toast from "react-hot-toast";

const ConversationHistory = ({ onConversationSelect }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const [search, setSearch] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const [selectedConversation, setSelectedConversation] = useState(null);

  const {
    messages,
    conversationList,
    newMessageLoading,
    isSendDisable,
    clientConfig,
    clientConfigLoading,
    clientConfigError,
  } = useSelector((store) => store.chatSlice);

  const [selectedId, setSelectedId] = useState(
    conversationList[0]?._id ?? null,
  );

  const messagesEndRef = useRef(null);

  useEffect(() => {
    getConversations();
  }, []);

  //   useEffect(() => {
  //     const selectedConversations = conversationList.find(
  //       (conversation) => conversation._id === selectedId,
  //     );
  //     setSelectedConversation(selectedConversations);
  //     setSelectedId(conversationList[0]?._id ?? null);
  //   }, [conversationList]);

  useEffect(() => {
    const handleConversation = async (data) => {
      await dispatch(setConversationList(data.conversations));
    };

    const handleMessageList = (data) => {
      dispatch(setConversationLoading(false));
      dispatch(setMessages(data.messages));
    };

    const handleConversationError = async (data) => {
      navigate("/", {
        replace: true,
      });
      toast.error(data?.message || "Somthing went wrong", {
        id: "conversation-error",
      });
    };

    onConversationList(handleConversation);
    onConversationError(handleConversationError);
    onConversationMessages(handleMessageList);

    return () => {
      removeConversationList(handleConversation);
      removeConversationError(handleConversationError);
      removeConversationMessages(handleMessageList);
    };
  }, [socket, dispatch]);

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return conversationList;
    return conversationList.filter((conversation) => {
      const titleMatches = conversation.title.toLowerCase().includes(query);
      const messageMatches = conversation.messages.some((message) =>
        message.content.toLowerCase().includes(query),
      );
      return titleMatches || messageMatches;
    });
  }, [conversationList, search]);

  const selectConversation = (conversation) => {
    debugger;
    setSelectedConversation(conversation);
    setSelectedId(conversation._id);
    setMobileSidebarOpen(false);
    onConversationSelect?.(conversation);
    getConversationMessages(conversation._id);
  };

  const sidebarWidth = sidebarCollapsed ? "lg:w-[76px]" : "lg:w-[336px]";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "auto",
    });
  }, [messages]);

  console.log("messages", messages);

  return (
    <div
      className={`flex h-dvh max-h-155 w-full overflow-hidden bg-[#f7f8fc] text-gray-900 dark:bg-[#11151d]/95 dark:text-gray-100 ${
        isDarkMode ? "dark" : ""
      }`}
    >
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72.5 flex-col border-r border-gray-200 bg-white transition-all duration-300 dark:border-white/10 dark:bg-[#171b23] lg:static lg:z-auto ${sidebarWidth} ${
          mobileSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Search */}
        <div
          className={`flex h-19 shrink-0 items-center border-b border-gray-200 px-4 dark:border-white/10 ${
            sidebarCollapsed ? "lg:justify-center lg:px-2" : "gap-3"
          }`}
        >
          <Search
            size={18}
            className="shrink-0 text-gray-500 dark:text-gray-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search conversations..."
            aria-label="Search conversations"
            className={`min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-gray-400 ${
              sidebarCollapsed ? "lg:hidden" : ""
            }`}
          />

          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setMobileSidebarOpen(false)}
            className="ml-auto rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/6 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Conversation list */}
        <div className="flex min-h-0 flex-1 flex-col">
          <div
            className={`px-5 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-[0.13em] text-gray-500 dark:text-gray-500 ${
              sidebarCollapsed ? "lg:hidden" : ""
            }`}
          >
            Recent Conversations
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
            {filteredConversations.length === 0 ? (
              <div
                className={`flex flex-col items-center px-4 py-10 text-center ${
                  sidebarCollapsed ? "lg:hidden" : ""
                }`}
              >
                <Search
                  size={25}
                  className="text-gray-500 dark:text-gray-500"
                />

                <p className="mt-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                  No conversations found
                </p>

                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  Try another search term.
                </p>
              </div>
            ) : (
              filteredConversations.map((conversation) => {
                const active = selectedId === conversation.id;

                return (
                  <button
                    key={conversation.id}
                    type="button"
                    title={conversation.title}
                    onClick={() => selectConversation(conversation)}
                    className={`group mb-1 flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                      active
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/6"
                    } ${sidebarCollapsed ? "lg:justify-center lg:px-0" : ""}`}
                  >
                    <MessageSquare
                      size={19}
                      className={`shrink-0 ${
                        active
                          ? "text-blue-500"
                          : "text-gray-500 dark:text-gray-500"
                      }`}
                    />

                    <span
                      className={`min-w-0 flex-1 truncate ${
                        active ? "font-medium" : ""
                      } ${sidebarCollapsed ? "lg:hidden" : ""}`}
                    >
                      {conversation.title}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </aside>

      {/* Main area */}
      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {/* Fixed Header */}
        {selectedConversation && (
          <div className="mx-auto w-full max-w-5xl shrink-0 px-4 pt-3 sm:px-8 lg:px-12">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4 dark:border-gray-500/20">
              <button
                type="button"
                aria-label="Open conversations sidebar"
                onClick={() => setMobileSidebarOpen(true)}
                className="shrink-0 rounded-xl border border-gray-200 bg-white p-2.5 text-gray-700 transition hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10 lg:hidden"
              >
                <Menu size={20} />
              </button>

              <div className="min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Conversation history
                </p>

                <h1 className="mt-1 break-words text-lg font-semibold text-gray-900 dark:text-gray-100 sm:text-xl">
                  {selectedConversation.title}
                </h1>
              </div>
            </div>
          </div>
        )}

        {/* Only Messages Scroll */}
        <section className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {!selectedConversation ? (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
                <MessageSquare size={30} />
              </div>

              <h2 className="mt-5 text-xl font-semibold text-gray-900 dark:text-gray-100">
                {conversationList.length === 0
                  ? "No conversations yet"
                  : "Select a conversation"}
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-gray-600 dark:text-gray-400">
                Choose a conversation from the sidebar to view its complete
                message history.
              </p>
            </div>
          ) : (
            <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-8 lg:px-12">
              {messages?.map((message) => {
                const isUser = message?.role === "user";

                return (
                  <article
                    key={message._id}
                    className={`mb-5 flex w-full gap-3 sm:gap-4 ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`min-w-0 ${
                        isUser
                          ? "max-w-[88%] sm:max-w-[75%]"
                          : "max-w-[95%] flex-1 sm:max-w-[85%]"
                      }`}
                    >
                      {isUser ? (
                        <div className="rounded-2xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm leading-6 text-gray-800 dark:border-white/[0.07] dark:bg-[#172131] dark:text-gray-100 sm:px-5">
                          <p className="whitespace-pre-wrap break-words">
                            {message.text}
                          </p>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap break-words text-sm leading-7 text-gray-800 dark:text-gray-100 sm:text-[15px] sm:leading-8">
                          {message.text}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}

              <div ref={messagesEndRef} />
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ConversationHistory;
