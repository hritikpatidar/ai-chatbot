// import React, { useEffect, useMemo, useRef, useState } from "react";
// import {
//   Search,
//   MessageSquare,
//   Menu,
//   X,
//   MoreHorizontal,
//   Share2,
//   Trash2,
// } from "lucide-react";
// import { useTheme } from "../../context/ThemeContext";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   deleteConversation,
//   getConversations,
//   onConversationDeleted,
//   onConversationError,
//   onConversationList,
//   removeConversationDeleted,
//   removeConversationError,
//   removeConversationList,
// } from "../../service/conversation.services";

// import {
//   clearMessages,
//   removeConversation,
//   setConversationList,
//   setConversationLoading,
//   setMessages,
// } from "../../redux/features/Chat/chatSlice";
// import { useSocket } from "../../context/SocketContext";
// import { useNavigate } from "react-router-dom";
// import {
//   getConversationMessages,
//   onConversationMessages,
//   removeConversationMessages,
// } from "../../service/message.services";
// import toast from "react-hot-toast";
// import AIMessage from "../Chat/AIMessage";
// import { motion, AnimatePresence } from "framer-motion";

// const ConversationHistory = ({ onConversationSelect }) => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { socket } = useSocket();
//   const [search, setSearch] = useState("");
//   const [mobileSidebarOpen, setMobileSidebarOpen] = useState(true);
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [selectedConversation, setSelectedConversation] = useState(null);
//   const [deleteChat, setDeleteChat] = useState(null);
//   const [isLoading, setLoading] = useState(false);

//   const [menuOpen, setMenuOpen] = useState(null);
//   const menuRef = useRef(null);

//   const {
//     messages,
//     conversationList
//   } = useSelector((store) => store.chatSlice);

//   const [selectedId, setSelectedId] = useState(null);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     const handleOutsideClick = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setMenuOpen(null);
//       }
//     };

//     document.addEventListener("mousedown", handleOutsideClick);
//     document.addEventListener("touchstart", handleOutsideClick);

//     return () => {
//       document.removeEventListener("mousedown", handleOutsideClick);
//       document.removeEventListener("touchstart", handleOutsideClick);
//     };
//   }, []);

//   useEffect(() => {
//     getConversations();
//   }, []);

//   // useEffect(() => {
//   //   selectedIdRef.current = selectedId;
//   //   if (conversationList.length > 0 && selectedId) {
//   //     const selectedConversations = conversationList.find(
//   //       (conversation) => conversation?._id === selectedId,
//   //     );
//   //     selectConversation(selectedConversations);
//   //   }
//   // }, [conversationList]);

//   //   useEffect(() => {
//   //     const selectedConversations = conversationList.find(
//   //       (conversation) => conversation._id === selectedId,
//   //     );
//   //     setSelectedConversation(selectedConversations);
//   //     setSelectedId(conversationList[0]?._id ?? null);
//   //   }, [conversationList]);

//   useEffect(() => {
//     const handleConversation = async (data) => {
//       setSelectedId(data.conversations[0]?._id ?? null);
//       await dispatch(setConversationList(data.conversations));
//     };

//     const handleMessageList = (data) => {
//       dispatch(setConversationLoading(false));
//       dispatch(setMessages(data.messages));
//     };

//     const handleConversationError = async (data) => {
//       navigate("/", {
//         replace: true,
//       });
//       toast.error(data?.message || "Somthing went wrong", {
//         id: "conversation-error",
//       });
//     };

//     const handleConversationDeleteRes = (data) => {
//       const deletedId = data?.conversationId;
//       setDeleteChat(null);
//       setLoading(false);
//       dispatch(removeConversation(deletedId));
//       if (selectedConversation._id === deletedId) {
//         dispatch(clearMessages([]));
//         setSelectedConversation(null);
//         setSelectedId(null);
//       }

//       toast.success(data?.message || "Conversation deleted successfully", {
//         id: "conversation-delete",
//       });
//     };

//     onConversationList(handleConversation);
//     onConversationError(handleConversationError);
//     onConversationMessages(handleMessageList);
//     onConversationDeleted(handleConversationDeleteRes);
//     return () => {
//       removeConversationList(handleConversation);
//       removeConversationError(handleConversationError);
//       removeConversationMessages(handleMessageList);
//       removeConversationDeleted(handleConversationDeleteRes);
//     };
//   }, [socket, dispatch]);

//   const filteredConversations = useMemo(() => {
//     const query = search?.trim()?.toLowerCase();
//     if (!query) return conversationList;
//     return conversationList?.filter((conversation) => {
//       const titleMatches = conversation?.title.toLowerCase().includes(query);
//       const messageMatches = conversation?.messages?.some((message) =>
//         message.content.toLowerCase().includes(query),
//       );
//       return titleMatches || messageMatches;
//     });
//   }, [conversationList, search]);

//   const selectConversation = (conversation) => {
//     setSelectedConversation(conversation);
//     setSelectedId(conversation?._id);
//     setMobileSidebarOpen(false);
//     onConversationSelect?.(conversation);
//     getConversationMessages(conversation?._id);
//   };

//   const sidebarWidth = sidebarCollapsed ? "lg:w-[76px]" : "lg:w-[336px]";

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({
//       behavior: "auto",
//     });
//   }, [messages]);

//   const handleDelete = (id) => {
//     if (!id) return;
//     setLoading(true);
//     deleteConversation(id);
//   };

//   return (
//     <div className="flex h-full p-5 min-h-0 w-full overflow-hidden bg-[#f7f8fc] text-gray-900 dark:bg-[#11151d]/95 dark:text-gray-100">
//       {/* Mobile overlay */}
//       {mobileSidebarOpen && (
//         <button
//           type="button"
//           aria-label="Close sidebar overlay"
//           onClick={() => setMobileSidebarOpen(false)}
//           className="fixed inset-0 z-40 bg-black/60 lg:hidden"
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`fixed inset-y-0 left-0 z-50 flex w-72.5 flex-col border border-gray-200 bg-white transition-all duration-300 dark:border-white/10 dark:bg-[#171b23] rounded-2xl lg:static lg:z-auto ${sidebarWidth} ${
//           mobileSidebarOpen
//             ? "translate-x-0"
//             : "-translate-x-full lg:translate-x-0"
//         }`}
//       >
//         {/* Search */}
//         <div
//           className={`flex h-19 shrink-0 items-center border-b border-gray-200 px-4 dark:border-white/10 ${
//             sidebarCollapsed ? "lg:justify-center lg:px-2" : "gap-3"
//           }`}
//         >
//           <Search
//             size={18}
//             className="shrink-0 text-gray-500 dark:text-gray-400"
//           />

//           <input
//             type="search"
//             value={search}
//             onChange={(event) => setSearch(event.target.value)}
//             placeholder="Search conversations..."
//             aria-label="Search conversations"
//             className={`min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-gray-400 ${
//               sidebarCollapsed ? "lg:hidden" : ""
//             }`}
//           />

//           <button
//             type="button"
//             aria-label="Close sidebar"
//             onClick={() => setMobileSidebarOpen(false)}
//             className="ml-auto rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/6 lg:hidden"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         {/* Conversation list */}
//         <div className="flex min-h-0 flex-1 flex-col">
//           <div
//             className={`px-5 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-[0.13em] text-gray-500 dark:text-gray-500 ${
//               sidebarCollapsed ? "lg:hidden" : ""
//             }`}
//           >
//             Recent Conversations
//           </div>

//           <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
//             {filteredConversations.length === 0 ? (
//               <div
//                 className={`flex flex-col items-center px-4 py-10 text-center ${
//                   sidebarCollapsed ? "lg:hidden" : ""
//                 }`}
//               >
//                 <Search
//                   size={25}
//                   className="text-gray-500 dark:text-gray-500"
//                 />

//                 <p className="mt-3 text-sm font-medium text-gray-900 dark:text-gray-100">
//                   No conversations found
//                 </p>

//                 <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
//                   Try another search term.
//                 </p>
//               </div>
//             ) : (
//               filteredConversations.map((conversation) => {
//                 const active = selectedId === conversation?._id;
//                 const isMenuOpen = menuOpen === conversation?._id;

//                 return (
//                   <div
//                     key={conversation?._id}
//                     ref={isMenuOpen ? menuRef : null}
//                     className={`group relative mb-1 flex w-full min-w-0 items-center rounded-xl border transition-colors ${
//                       active
//                         ? "border-blue-200 bg-blue-50 dark:border-blue-500/20 dark:bg-blue-500/10"
//                         : "border-transparent hover:bg-gray-100 dark:hover:bg-white/5"
//                     }`}
//                   >
//                     {/* Conversation Button */}
//                     <button
//                       type="button"
//                       title={conversation.title}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setMenuOpen(null);
//                         selectConversation(conversation);
//                       }}
//                       className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-3 py-3 text-left"
//                     >
//                       <MessageSquare
//                         size={18}
//                         className={`shrink-0 ${
//                           active
//                             ? "text-blue-600 dark:text-blue-400"
//                             : "text-gray-500 dark:text-gray-400"
//                         }`}
//                       />

//                       <span
//                         className={`min-w-0 flex-1 truncate text-sm ${
//                           active
//                             ? "font-medium text-blue-700 dark:text-blue-400"
//                             : "text-gray-700 dark:text-gray-300"
//                         }`}
//                       >
//                         {conversation.title || "New Conversation"}
//                       </span>
//                     </button>

//                     {/* Three Dots */}
//                     <button
//                       type="button"
//                       aria-label={`More options for ${conversation.title}`}
//                       aria-expanded={isMenuOpen}
//                       onClick={(event) => {
//                         event.stopPropagation();

//                         setMenuOpen((current) =>
//                           current === conversation?._id
//                             ? null
//                             : conversation?._id,
//                         );

//                         // Remove focus after click so dots don't look selected
//                         event.currentTarget.blur();
//                       }}
//                       className={`mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-0 ${
//                         isMenuOpen
//                           ? "bg-gray-200 text-gray-800 dark:bg-white/10 dark:text-white"
//                           : "text-gray-500 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white sm:opacity-0 sm:group-hover:opacity-100"
//                       }`}
//                     >
//                       <MoreHorizontal size={19} />
//                     </button>

//                     {/* Dropdown */}
//                     {isMenuOpen && (
//                       <div
//                         className="
//             absolute right-2 top-full z-50 mt-1
//             w-44 rounded-xl border border-gray-200
//             bg-white p-1.5 shadow-xl shadow-black/10
//             dark:border-white/10 dark:bg-[#1b202b]
//             dark:shadow-black/30
//           "
//                       >
//                         <button
//                           type="button"
//                           onClick={(event) => {
//                             event.stopPropagation();
//                             setMenuOpen(null);
//                             setDeleteChat(conversation);
//                           }}
//                           className="
//               flex w-full items-center gap-2.5 rounded-lg
//               px-3 py-2.5 text-sm font-medium text-red-600
//               transition-colors hover:bg-red-50
//               focus:outline-none focus:ring-2 focus:ring-red-500/30
//               dark:text-red-400 dark:hover:bg-red-500/10
//             "
//                         >
//                           <Trash2 size={16} />
//                           <span>Delete</span>
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         </div>
//       </aside>

//       {/* Main area */}
//       <main className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
//         {/* Fixed Header */}
//         {selectedConversation && (
//           <div className="mx-auto w-full max-w-5xl shrink-0 px-4 pt-3 sm:px-8 lg:px-12">
//             <div className="flex items-center gap-3 border-b border-gray-200 pb-4 dark:border-white/10">
//               {/* Mobile Sidebar Button */}
//               <button
//                 type="button"
//                 aria-label="Open conversations sidebar"
//                 onClick={() => setMobileSidebarOpen(true)}
//                 className="shrink-0 rounded-xl border border-gray-200 bg-white p-2.5 text-gray-700 transition hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10 lg:hidden"
//               >
//                 <Menu size={20} />
//               </button>

//               {/* User Avatar */}
//               <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-base font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-400">
//                 {(selectedConversation?.visitor?.fullName || "U")
//                   .charAt(0)
//                   .toUpperCase()}
//               </div>

//               {/* User Details */}
//               <div className="min-w-0 flex-1">
//                 <h1 className="truncate text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
//                   {selectedConversation?.visitor?.fullName || "Unknown User"}
//                 </h1>

//                 <p className="truncate text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
//                   {selectedConversation?.visitor?.email ||
//                     "Email not available"}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Only Messages Scroll */}
//         <section className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
//           {!selectedConversation ? (
//             <div className="flex h-full flex-col items-center justify-center px-6 text-center">
//               <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
//                 <MessageSquare size={30} />
//               </div>

//               <h2 className="mt-5 text-xl font-semibold text-gray-900 dark:text-gray-100">
//                 {conversationList.length === 0
//                   ? "No conversations yet"
//                   : "Select a conversation"}
//               </h2>

//               <p className="mt-2 max-w-sm text-sm leading-6 text-gray-600 dark:text-gray-400">
//                 Choose a conversation from the sidebar to view its complete
//                 message history.
//               </p>
//             </div>
//           ) : (
//             <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-8 lg:px-12">
//               {messages?.map((message) => {
//                 const isUser = message?.role === "user";

//                 return (
//                   <article
//                     key={message?._id}
//                     className={`mb-5 flex w-full gap-3 sm:gap-4 ${
//                       isUser ? "justify-end" : "justify-start"
//                     }`}
//                   >
//                     <div
//                       className={`min-w-0 ${
//                         isUser
//                           ? "max-w-[88%] sm:max-w-[75%] rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm dark:border-white/10 dark:bg-[#161f2d] dark:text-white"
//                           : "max-w-[95%] flex-1 sm:max-w-[85%]"
//                       }`}
//                     >
//                       {!isUser ? (
//                         <AIMessage
//                           content={message.text}
//                           isError={message.isError}
//                         />
//                       ) : (
//                         <p className="whitespace-pre-wrap wrap-break-word text-sm leading-6">
//                           {message.text}
//                         </p>
//                       )}
//                     </div>
//                   </article>
//                 );
//               })}

//               <div ref={messagesEndRef} />
//             </div>
//           )}
//         </section>
//       </main>

//       <AnimatePresence>
//         {deleteChat && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm dark:bg-black/60"
//           >
//             <motion.div
//               initial={{ scale: 0.9 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.9 }}
//               className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#171b23]"
//             >
//               <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
//                 Delete Conversation?
//               </h2>

//               <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
//                 Are you sure you want to delete this conversation? This action
//                 cannot be undone.
//               </p>

//               <div className="mt-6 flex justify-end gap-3">
//                 <button
//                   type="button"
//                   onClick={(e) => {
//                     setDeleteChat(null);
//                     setLoading(false);
//                   }}
//                   disabled={isLoading}
//                   className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="button"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleDelete(deleteChat._id);
//                   }}
//                   disabled={isLoading}
//                   className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
//                 >
//                   {isLoading ? "Deleting..." : "Delete"}
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default ConversationHistory;

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  MessageSquare,
  Menu,
  X,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import {
  deleteConversation,
  getConversations,
  onConversationDeleted,
  onConversationError,
  onConversationList,
  removeConversationDeleted,
  removeConversationError,
  removeConversationList,
} from "../../service/conversation.services";

import {
  clearMessages,
  removeConversation,
  setConversationList,
  setConversationLoading,
  setMessages,
} from "../../redux/features/Chat/chatSlice";

import { useSocket } from "../../context/SocketContext";
import {
  getConversationMessages,
  onConversationMessages,
  removeConversationMessages,
} from "../../service/message.services";

import AIMessage from "../Chat/AIMessage";

const ConversationHistory = ({ onConversationSelect }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { socket } = useSocket();

  const { messages = [], conversationList = [] } = useSelector(
    (store) => store.chatSlice
  );

  const [search, setSearch] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [deleteChat, setDeleteChat] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);

  const menuRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Refs keep socket callbacks updated with the latest selection.
  const selectedIdRef = useRef(null);
  const selectedConversationRef = useRef(null);
  const deleteRequestIdRef = useRef(null);
  const messageRequestIdRef = useRef(null);
  const mountedRef = useRef(false);

  const updateSelectedConversation = (conversation) => {
    const id = conversation?._id ? String(conversation._id) : null;

    selectedIdRef.current = id;
    selectedConversationRef.current = conversation ?? null;

    setSelectedId(id);
    setSelectedConversation(conversation ?? null);
  };

  const clearSelectedConversation = () => {
    selectedIdRef.current = null;
    selectedConversationRef.current = null;
    messageRequestIdRef.current = null;

    setSelectedId(null);
    setSelectedConversation(null);

    dispatch(setConversationLoading(false));
    dispatch(clearMessages([]));
  };

  // Close the dropdown when the user clicks outside.
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, []);

  // Fetch the conversation list when the component mounts.
  useEffect(() => {
    getConversations();
  }, []);

  // Register socket listeners.
  useEffect(() => {
    mountedRef.current = true;

    const handleConversation = (data) => {
      const conversations = Array.isArray(data?.conversations)
        ? data.conversations
        : [];

      dispatch(setConversationList(conversations));

      const currentId = selectedIdRef.current;

      // Preserve the currently selected conversation if it still exists.
      if (currentId) {
        const currentConversation = conversations.find(
          (conversation) => String(conversation?._id) === currentId
        );

        if (currentConversation) {
          selectedConversationRef.current = currentConversation;
          setSelectedConversation(currentConversation);
          return;
        }

        // A previously selected conversation disappeared from the list.
        // Clear the chat instead of silently selecting another conversation.
        clearSelectedConversation();
        return;
      }

      // First visit: automatically select the first conversation.
      if (conversations.length > 0) {
        const firstConversation = conversations[0];

        updateSelectedConversation(firstConversation);
        setMobileSidebarOpen(false);

        onConversationSelect?.(firstConversation);

        const requestId = String(firstConversation._id);
        messageRequestIdRef.current = requestId;

        dispatch(setConversationLoading(true));
        dispatch(clearMessages([]));

        getConversationMessages(firstConversation._id);
      } else {
        clearSelectedConversation();
      }
    };

    const handleMessageList = (data) => {
      dispatch(setConversationLoading(false));
      const responseConversationId = data?.conversationId;

      if (
        responseConversationId &&
        selectedIdRef.current &&
        String(responseConversationId) !== selectedIdRef.current
      ) {
        return;
      }

      dispatch(setMessages(Array.isArray(data?.messages) ? data.messages : []));
    };

    const handleConversationError = (data) => {
      dispatch(setConversationLoading(false));

      navigate("/", { replace: true });

      toast.error(data?.message || "Something went wrong", {
        id: "conversation-error",
      });
    };

    const handleConversationDeleteRes = (data) => {
      const deletedId = data?.conversationId;

      setLoading(false);
      setDeleteChat(null);
      deleteRequestIdRef.current = null;

      if (!deletedId) {
        toast.error(data?.message || "Could not identify the deleted conversation");
        return;
      }

      const deletedIdString = String(deletedId);
      const wasSelected =
        selectedIdRef.current === deletedIdString;

      dispatch(removeConversation(deletedId));

      if (wasSelected) {
        clearSelectedConversation();
        onConversationSelect?.(null);
      }

      toast.success(data?.message || "Conversation deleted successfully", {
        id: "conversation-delete",
      });
    };

    onConversationList(handleConversation);
    onConversationError(handleConversationError);
    onConversationMessages(handleMessageList);
    onConversationDeleted(handleConversationDeleteRes);

    return () => {
      mountedRef.current = false;

      removeConversationList(handleConversation);
      removeConversationError(handleConversationError);
      removeConversationMessages(handleMessageList);
      removeConversationDeleted(handleConversationDeleteRes);
    };
  }, [socket, dispatch, navigate, onConversationSelect]);

  // Keep the selected conversation in sync with the Redux list.
  useEffect(() => {
    if (!selectedId) return;

    const currentConversation = conversationList.find(
      (conversation) => String(conversation?._id) === String(selectedId)
    );

    if (currentConversation) {
      selectedConversationRef.current = currentConversation;
      setSelectedConversation(currentConversation);
    }
  }, [conversationList, selectedId]);

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return conversationList;

    return conversationList.filter((conversation) => {
      const titleMatches = (conversation?.title || "")
        .toLowerCase()
        .includes(query);

      const messageMatches = (conversation?.messages || []).some((message) =>
        (message?.content || message?.text || "")
          .toLowerCase()
          .includes(query)
      );

      return titleMatches || messageMatches;
    });
  }, [conversationList, search]);

  const selectConversation = (conversation) => {
    if (!conversation?._id) return;
    const conversationId = String(conversation._id);
    if (selectedIdRef.current === conversationId) {
      setMobileSidebarOpen(false);
      setMenuOpen(null);
      return;
    }

    updateSelectedConversation(conversation);
    setMobileSidebarOpen(false);
    setMenuOpen(null);
    onConversationSelect?.(conversation);
    dispatch(clearMessages([]));
    dispatch(setConversationLoading(true));
    messageRequestIdRef.current = conversationId;
    getConversationMessages(conversation._id);
  };

  const handleDelete = (id) => {
    if (!id || isLoading) return;

    setLoading(true);
    deleteRequestIdRef.current = String(id);

    deleteConversation(id);
  };

  // Scroll to the latest message whenever the messages change.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "auto",
      block: "end",
    });
  }, [messages]);

  const sidebarWidth = sidebarCollapsed ? "lg:w-[76px]" : "lg:w-[336px]";

  return (
    <div className="flex h-full min-h-0 w-full overflow-hidden bg-[#f7f8fc] p-5 text-gray-900 dark:bg-[#11151d]/95 dark:text-gray-100">
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
        className={`fixed inset-y-0 left-0 z-50 flex w-72.5 flex-col rounded-2xl border border-gray-200 bg-white transition-all duration-300 dark:border-white/10 dark:bg-[#171b23] lg:static lg:z-auto ${sidebarWidth} ${
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
            className={`px-5 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-[0.13em] text-gray-500 ${
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
                  {search.trim()
                    ? "No conversations found"
                    : "No conversations yet"}
                </p>

                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  {search.trim()
                    ? "Try another search term."
                    : "Your conversations will appear here."}
                </p>
              </div>
            ) : (
              filteredConversations.map((conversation) => {
                const conversationId = String(conversation?._id);
                const active = selectedId === conversationId;
                const isMenuOpen = menuOpen === conversationId;

                return (
                  <div
                    key={conversationId}
                    ref={isMenuOpen ? menuRef : null}
                    className={`group relative mb-1 flex w-full min-w-0 items-center rounded-xl border transition-colors ${
                      active
                        ? "border-blue-200 bg-blue-50 dark:border-blue-500/20 dark:bg-blue-500/10"
                        : "border-transparent hover:bg-gray-100 dark:hover:bg-white/5"
                    }`}
                  >
                    {/* Conversation button */}
                    <button
                      type="button"
                      title={conversation?.title || "New Conversation"}
                      onClick={() => selectConversation(conversation)}
                      className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-3 py-3 text-left"
                    >
                      <MessageSquare
                        size={18}
                        className={`shrink-0 ${
                          active
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      />

                      <span
                        className={`min-w-0 flex-1 truncate text-sm ${
                          active
                            ? "font-medium text-blue-700 dark:text-blue-400"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {conversation?.title || "New Conversation"}
                      </span>
                    </button>

                    {/* Three dots */}
                    <button
                      type="button"
                      aria-label={`More options for ${
                        conversation?.title || "conversation"
                      }`}
                      aria-expanded={isMenuOpen}
                      onClick={(event) => {
                        event.stopPropagation();

                        setMenuOpen((current) =>
                          current === conversationId ? null : conversationId
                        );

                        event.currentTarget.blur();
                      }}
                      className={`mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-0 ${
                        isMenuOpen
                          ? "bg-gray-200 text-gray-800 dark:bg-white/10 dark:text-white"
                          : "text-gray-500 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white sm:opacity-0 sm:group-hover:opacity-100"
                      }`}
                    >
                      <MoreHorizontal size={19} />
                    </button>

                    {/* Dropdown */}
                    {isMenuOpen && (
                      <div className="absolute right-2 top-full z-50 mt-1 w-44 rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl shadow-black/10 dark:border-white/10 dark:bg-[#1b202b] dark:shadow-black/30">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setMenuOpen(null);
                            setDeleteChat(conversation);
                          }}
                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
                        >
                          <Trash2 size={16} />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </aside>

      {/* Main area */}
      <main className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {/* Header */}
        {selectedConversation && (
          <div className="mx-auto w-full max-w-5xl shrink-0 px-4 pt-3 sm:px-8 lg:px-12">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4 dark:border-white/10">
              <button
                type="button"
                aria-label="Open conversations sidebar"
                onClick={() => setMobileSidebarOpen(true)}
                className="shrink-0 rounded-xl border border-gray-200 bg-white p-2.5 text-gray-700 transition hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10 lg:hidden"
              >
                <Menu size={20} />
              </button>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-base font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-400">
                {(selectedConversation?.visitor?.fullName || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="truncate text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
                  {selectedConversation?.visitor?.fullName || "Unknown User"}
                </h1>

                <p className="truncate text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                  {selectedConversation?.visitor?.email ||
                    "Email not available"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <section className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
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
              {messages.map((message, index) => {
                const isUser = message?.role === "user";

                return (
                  <article
                    key={message?._id || `${message?.role}-${index}`}
                    className={`mb-5 flex w-full gap-3 sm:gap-4 ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`min-w-0 ${
                        isUser
                          ? "max-w-[88%] rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm dark:border-white/10 dark:bg-[#161f2d] dark:text-white sm:max-w-[75%]"
                          : "max-w-[95%] flex-1 sm:max-w-[85%]"
                      }`}
                    >
                      {!isUser ? (
                        <AIMessage
                          content={message?.text || ""}
                          isError={message?.isError}
                        />
                      ) : (
                        <p className="whitespace-pre-wrap wrap-break-word text-sm leading-6">
                          {message?.text || ""}
                        </p>
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

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm dark:bg-black/60"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#171b23]"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete Conversation?
              </h2>

              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to delete this conversation? This action
                cannot be undone.
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (isLoading) return;
                    setDeleteChat(null);
                  }}
                  disabled={isLoading}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(deleteChat?._id)}
                  disabled={isLoading}
                  className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
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
};

export default ConversationHistory;
