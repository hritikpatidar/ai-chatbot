import {
  Plus,
  Search,
  MessageSquare,
  Settings,
  Sparkles,
  Menu,
  X,
  BookOpen,
  FolderKanban,
  CalendarClock,
  Puzzle,
  Share2,
  Trash2,
  MoreHorizontal,
  Pin,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  addConversation,
  clearMessages,
  removeConversation,
  setActivePage,
  setConversationList,
  setConversationLoading,
} from "../redux/features/Chat/chatSlice";
import {
  deleteConversation,
  onConversationCreated,
  onConversationDeleted,
  onConversationError,
  onConversationList,
  removeConversationCreated,
  removeConversationDeleted,
  removeConversationError,
  removeConversationList,
} from "../service/conversation.services";
import toast from "react-hot-toast";

export default function Sidebar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(null);
  const [deleteChat, setDeleteChat] = useState(null);
  const { activePage, conversationList } = useSelector(
    (store) => store.chatSlice,
  );
  const { conversationId } = useParams();

  const location = useLocation();

  const activeChatId = location.pathname.startsWith("/c/")
    ? location.pathname.split("/c/")[1]
    : null;
  const [dropdownPosition, setDropdownPosition] = useState("bottom");
  const [isLoading, setLoading] = useState(false);
  const activeChatIdRef = useRef(null);

  useEffect(() => {
    activeChatIdRef.current = activeChatId;
  }, [activeChatId]);

  useEffect(() => {
    const handleConversationCreate = async ({ conversation }) => {
      await dispatch(addConversation(conversation));
      dispatch(setActivePage("recentChat"));
      navigate(`/c/${conversation?._id}`, {
        state: {
          isNewConversation: true,
        },
      });
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

    const handleConversationDeleteRes = (data) => {
      const deletedId = data?.conversationId;
      const currentActiveId = activeChatIdRef.current;
      setDeleteChat(null);
      setLoading(false);
      dispatch(removeConversation(deletedId));
      if (currentActiveId === deletedId) {
        dispatch(setActivePage("newChat"));
        navigate("/", {
          replace: true,
        });
      }

      toast.success(data?.message || "Conversation deleted successfully", {
        id: "conversation-delete",
      });
    };

    onConversationCreated(handleConversationCreate);
    onConversationList(handleConversation);
    onConversationError(handleConversationError);
    onConversationDeleted(handleConversationDeleteRes);
    return () => {
      removeConversationCreated(handleConversationCreate);
      removeConversationList(handleConversation);
      removeConversationError(handleConversationError);
      removeConversationDeleted(handleConversationDeleteRes);
    };
  }, []);

  const handleShare = async (chatId) => {
    const url = `${window.location.origin}/c/${chatId}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Chat",
          text: "Check out this conversation",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Conversation link copied!");
      }
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        alert("Conversation link copied!");
      } catch {
        alert("Unable to copy link.");
      }
    }
  };

  const handleDelete = (id) => {
    if (!id) return;
    setLoading(true);
    deleteConversation(id);
  };

  const handleMenu = (page) => {
    setOpen(false);
    dispatch(setActivePage(page));
    dispatch(clearMessages([]));
    if (page === "newChat") navigate(`/`);
    else if (page === "recentChat") navigate(`/c/${new Date().getTime()}`);
    else navigate(`/${page}`);
  };

  const getMenuClass = (page) =>
    `group flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-all duration-200 ${
      activePage === page
        ? "bg-blue-500/15 text-blue-400"
        : "text-gray-300 hover:bg-white/10 hover:text-white"
    }`;

  const getIconClass = (page) =>
    `flex h-7 w-7 items-center justify-center rounded-md transition-all ${
      activePage === page
        ? "bg-blue-500/20 text-blue-400"
        : "bg-white/5 text-gray-400 group-hover:text-blue-400"
    }`;

  const handleConversationNavigate = async (chat) => {
    await dispatch(clearMessages([]));
    await dispatch(setConversationLoading(true));
    await dispatch(setActivePage("recentChat"));
    setOpen(false);
    navigate(`/c/${chat._id}`);
  };

  return (
    <div className="z-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-5 left-5 z-50 flex h-8 w-8 items-center justify-center rounded-xl bg-[#171b23] text-white shadow-lg lg:hidden"
      >
        <Menu size={22} />
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed
          lg:static
          top-0
          left-0
          z-50
          flex
          h-screen
          w-72
          flex-col
          border-r
          border-white/10
          bg-[#111827]
          transition-transform
          duration-300
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-4">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-purple-600">
              <Sparkles size={20} className="text-white" />
            </div>

            <div>
              <h2 className="text-[15px] font-semibold text-white">
                Saviesa Infotech
              </h2>
              <p className="text-xs text-gray-400">Smart Conversations</p>
            </div>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-[#1f2937] lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Main Sidebar Content */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {/* Search */}
          <div className="shrink-0 px-3 py-2">
            <div className="flex h-10 items-center rounded-xl border border-white/10 bg-white/5 px-3 transition-all duration-200 hover:bg-white/8 focus-within:border-blue-500">
              <Search size={16} className="mr-2 text-gray-400" />

              <input
                type="text"
                placeholder="Search"
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="shrink-0 px-2 py-2">
            <nav className="space-y-0.5">
              {/* New Chat */}
              <button
                onClick={() => handleMenu("newChat")}
                className={getMenuClass("newChat")}
              >
                <div className={getIconClass("newChat")}>
                  <Plus size={16} />
                </div>

                <span>New Chat</span>
              </button>

              {/* Library */}
              <button
                onClick={() => handleMenu("library")}
                className={getMenuClass("library")}
              >
                <div className={getIconClass("library")}>
                  <BookOpen size={16} />
                </div>

                <span>Library</span>
              </button>

              {/* Projects */}
              <button
                onClick={() => handleMenu("projects")}
                className={getMenuClass("projects")}
              >
                <div className={getIconClass("projects")}>
                  <FolderKanban size={16} />
                </div>

                <span>Projects</span>
              </button>
            </nav>
          </div>

          {/* Recent Chats */}
          <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
            <p className="mb-3 px-3 text-xs uppercase tracking-widest text-gray-500">
              Recent Chats
            </p>

            {conversationList?.length > 0 ? (
              <div className="space-y-1">
                {conversationList.map((chat, index) => {
                  const isLastItem =
                    conversationList.length <= 2
                      ? false
                      : index >= conversationList.length - 3;
                  const isSelected = conversationId === chat._id;
                  return (
                    <div
                      className={`
                        group
                        relative
                        flex
                        w-full
                        min-w-0
                        items-center
                        rounded-lg
                        transition-colors
                        hover:bg-blue-500/15
                        ${isSelected ? "bg-blue-500/15" : ""}
                      `}
                    >
                      {/* Chat Button */}
                      <button
                        type="button"
                        onClick={() => {
                          navigate(`/c/${chat._id}`);
                          setMenuOpen(null);
                        }}
                        className="
                          flex
                          min-w-0
                          flex-1
                          items-center
                          gap-3
                          overflow-hidden
                          rounded-lg
                          px-4
                          py-2.5
                          text-left
                        "
                      >
                        {/* Chat Icon */}
                        <MessageSquare
                          size={18}
                          className={`
                            shrink-0
                            transition-colors
                            ${
                              isSelected
                                ? "text-blue-400"
                                : "text-gray-500 group-hover:text-blue-400"
                            }
                          `}
                        />

                        {/* Title */}
                        <span
                          className={`
                            min-w-0
                            flex-1
                            truncate
                            text-sm
                            transition-colors
                            ${isSelected ? "text-blue-400" : "text-gray-300"}
                          `}
                        >
                          {chat.title || "New Conversation"}
                        </span>
                      </button>

                      {/* Hover Actions */}
                      <div
                        className="
                          absolute
                          right-2
                          top-1/2
                          z-10
                          flex
                          -translate-y-1/2
                          items-center
                          gap-1
                          rounded-md
                          bg-[#1f1f1f]
                          px-1
                          pointer-events-none
                          opacity-0
                          transition-opacity
                          duration-150
                          group-hover:pointer-events-auto
                          group-hover:opacity-100
                        "
                      >
                        {/* Pin */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();

                            console.log("Pin conversation:", chat._id);
                          }}
                          className="
                            flex
                            h-7
                            w-7
                            items-center
                            justify-center
                            rounded-md
                            text-gray-400
                            transition
                            hover:bg-white/10
                            hover:text-blue-400
                          "
                          title="Pin"
                        >
                          <Pin size={15} />
                        </button>

                        {/* Three Dots */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();

                            setMenuOpen(
                              menuOpen === chat._id ? null : chat._id,
                            );
                          }}
                          className="
                            flex
                            h-7
                            w-7
                            items-center
                            justify-center
                            rounded-md
                            text-gray-400
                            transition
                            hover:bg-white/10
                            hover:text-blue-400
                          "
                          title="More"
                        >
                          <MoreHorizontal size={17} />
                        </button>
                      </div>

                      {/* Dropdown */}
                      {menuOpen === chat._id && (
                        <div
                          className={`
                            absolute
                            right-2
                            z-50
                            w-40
                            rounded-xl
                            border
                            border-white/10
                            bg-[#1a202c]
                            py-1
                            shadow-xl
                            ${isLastItem ? "bottom-10" : "top-10"}
                          `}
                        >
                          {/* Share */}
                          <button
                            type="button"
                            onClick={() => {
                              setMenuOpen(null);
                              handleShare(chat._id);
                            }}
                            className="
                              flex
                              w-full
                              items-center
                              gap-2
                              px-3
                              py-2
                              text-sm
                              text-white
                              transition
                              hover:bg-white/10
                            "
                          >
                            <Share2 size={16} />
                            Share
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => {
                              setMenuOpen(null);
                              setDeleteChat(chat);
                            }}
                            className="
                              flex
                              w-full
                              items-center
                              gap-2
                              px-3
                              py-2
                              text-sm
                              text-red-400
                              transition
                              hover:bg-red-500/10
                            "
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* No Conversations */
              <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                  <MessageSquare size={18} className="text-gray-500" />
                </div>

                <p className="text-sm font-medium text-gray-400">
                  No conversations
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-600">
                  Start a new chat to see your conversations here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Settings - Always Bottom */}
        <div className="shrink-0 border-t border-white/10 bg-[#111827] p-4">
          <button
            onClick={() => handleMenu("settings")}
            className={getMenuClass("settings")}
          >
            <Settings size={17} className={getIconClass("settings")} />

            <span>Settings</span>
          </button>
        </div>
      </aside>
      <AnimatePresence>
        {deleteChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#171b23] p-6"
            >
              <h2 className="text-lg font-semibold text-white">
                Delete Conversation?
              </h2>

              <p className="mt-2 text-sm text-gray-400">
                Are you sure you want to delete this conversation? This action
                cannot be undone.
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    setDeleteChat(null);
                    setLoading(false);
                  }}
                  disabled={isLoading}
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/10"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(deleteChat._id);
                  }}
                  disabled={isLoading}
                  className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
