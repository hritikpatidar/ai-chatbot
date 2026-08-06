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
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { setActivePage } from "../redux/features/Chat/chatSlice";

export default function Sidebar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(null);
  const [deleteChat, setDeleteChat] = useState(null);
  const { activePage } = useSelector((store) => store.chatSlice);
  const location = useLocation();

  const activeChatId = location.pathname.startsWith("/c/")
    ? location.pathname.split("/c/")[1]
    : null;

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
    // API Call
    // await deleteConversation(id)

    console.log("Delete:", id);

    setDeleteChat(null);
  };

  const chats = [
    {
      _id: "1",
      title: "React Interview",
    },
    {
      _id: "2",
      title: "Node API",
    },
    {
      _id: "3",
      title: "MongoDB",
    },
    {
      _id: "4",
      title: "Stripe Integration",
    },
    {
      _id: "5",
      title: "MERN Project",
    },
    {
      _id: "6",
      title: "React Interview",
    },
    {
      _id: "7",
      title: "Node API",
    },
    {
      _id: "8",
      title: "MongoDB",
    },
    {
      _id: "9",
      title: "Stripe Integration",
    },
    {
      _id: "10",
      title: "MERN Project",
    },
  ];

  const handleMenu = (page) => {
    dispatch(setActivePage(page));
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
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static
          top-0 left-0
          z-50
          flex h-screen
          w-72
          flex-col
          border-r border-white/10
          bg-[#111827]
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
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
        <div className="overflow-y-auto">
          {/* Search */}
          <div className="px-3 py-2">
            <div className="flex h-10 items-center rounded-xl border border-white/10 bg-white/5 px-3 transition-all duration-200 hover:bg-white/8 focus-within:border-blue-500">
              <Search size={16} className="mr-2 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-400 outline-none"
              />
            </div>
          </div>
          {/* New Chat */}
          <div className="px-2 py-2">
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

              {/* Scheduled */}
              {/* <button
                onClick={() => handleMenu("scheduled")}
                className={getMenuClass("scheduled")}
              >
                <div className={getIconClass("scheduled")}>
                  <CalendarClock size={16} />
                </div>
                <span>Scheduled</span>
              </button> */}

              {/* Plugins */}
              {/* <button
                onClick={() => handleMenu("plugins")}
                className={getMenuClass("plugins")}
              >
                <div className={getIconClass("plugins")}>
                  <Puzzle size={16} />
                </div>
                <span>Plugins</span>
              </button> */}
            </nav>
          </div>

          {/* Chats */}
          <div className="mt-5 flex-1  px-3">
            <p className="mb-3 px-3 text-xs uppercase tracking-widest text-gray-500">
              Recent Chats
            </p>

            <div className="space-y-1">
              {chats.map((chat) => (
                <div
                  key={chat._id}
                  className={`group relative flex items-center rounded-xl transition ${
                    activeChatId === chat._id
                      ? "bg-blue-500/15"
                      : "hover:bg-[#1d2432]"
                  }`}
                >
                  <button
                    onClick={() => {
                      dispatch(setActivePage(""));
                      navigate(`/c/${chat._id}`);
                    }}
                    className={`flex h-8 flex-1 items-center gap-3 px-3 text-left text-sm ${
                      activeChatId === chat._id
                        ? "text-blue-400"
                        : "text-gray-300"
                    }`}
                  >
                    <MessageSquare
                      size={17}
                      className={
                        activeChatId === chat._id
                          ? "text-blue-400"
                          : "text-gray-500 group-hover:text-blue-400"
                      }
                    />

                    <span className="flex-1 truncate">{chat.title}</span>
                  </button>

                  {/* Three Dots */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(menuOpen === chat._id ? null : chat._id);
                    }}
                    className="mr-2 rounded-md p-1 opacity-0 transition group-hover:opacity-100 hover:bg-white/10 "
                  >
                    <MoreHorizontal size={16} className="text-gray-400" />
                  </button>

                  {/* Dropdown */}
                  {menuOpen === chat._id && (
                    <div className="absolute right-2 top-9 z-50 w-40 rounded-xl border border-white/10 bg-[#1a202c] py-1 shadow-xl">
                      <button
                        onClick={() => {
                          setMenuOpen(null);
                          handleShare(chat._id);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/10"
                      >
                        <Share2 size={16} />
                        Share
                      </button>

                      <button
                        onClick={() => {
                          setMenuOpen(null);
                          setDeleteChat(chat);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Bottom */}
        <div className="border-t border-white/10 p-4">
          <button
            onClick={() => handleMenu("settings")}
            className={getMenuClass("settings")}
          >
            <Settings size={17} className={getIconClass("settings")} />
            Settings
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
                  onClick={() => setDeleteChat(null)}
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/10"
                >
                  Cancel
                </button>

                <button
                  onClick={() => handleDelete(deleteChat._id)}
                  className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
