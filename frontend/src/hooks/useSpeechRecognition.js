import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActivePage } from "../redux/features/Chat/chatSlice";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSocket } from "../context/SocketContext";
import {
  onAIChunk,
  onAIError,
  removeAIChunk,
  sendAIMessage,
} from "../service/socket.service";

// const messagesArray = [
//   {
//     id: 1,
//     role: "assistant",
//     text: `# 👋 Hello!

// I'm your AI assistant.

// I can help you with:

// - ⚛️ React
// - 🚀 Node.js
// - 🍃 MongoDB
// - 🌐 Express.js
// - 📜 JavaScript
// - 💼 Interview Preparation
// - 🐞 Debugging
// - 🔌 API Integration

// Feel free to ask **anything**. I'll explain concepts **step by step** with practical examples whenever possible.`,
//   },

//   {
//     id: 2,
//     role: "user",
//     text: `Can you explain React Hooks in detail with a practical example?`,
//   },

//   {
//     id: 3,
//     role: "assistant",
//     text: `# React Hooks

// React Hooks were introduced in **React 16.8**. They allow functional components to use state and lifecycle features without class components.

// ## Most Common Hooks

// | Hook | Purpose |
// |------|---------|
// | \`useState\` | Manage state |
// | \`useEffect\` | Handle side effects |
// | \`useContext\` | Share data globally |
// | \`useMemo\` | Optimize expensive calculations |
// | \`useCallback\` | Memoize functions |
// | \`useRef\` | Access DOM or store mutable values |

// ## Example

// \`\`\`jsx
// import { useState } from "react";

// export default function Counter() {
//   const [count, setCount] = useState(0);

//   return (
//     <button onClick={() => setCount(count + 1)}>
//       Count: {count}
//     </button>
//   );
// }
// \`\`\`

// ### How it works

// 1. The initial value is **0**.
// 2. Clicking the button updates the state.
// 3. React automatically re-renders the component.
// 4. The updated count appears on the screen.

// > **Tip:** Always use the setter function returned by \`useState\`. Never modify state directly.`,
//   },

//   {
//     id: 4,
//     role: "user",
//     text: `I'm building a MERN AI chatbot. What folder structure would you recommend for scalability?`,
//   },

//   {
//     id: 5,
//     role: "assistant",
//     text: `# Recommended Folder Structure

// A scalable project keeps responsibilities separated.

// ## 📁 Frontend (React)

// \`\`\`
// src/
// ├── assets/
// ├── components/
// ├── layouts/
// ├── pages/
// ├── hooks/
// ├── services/
// ├── redux/
// ├── routes/
// ├── utils/
// └── App.jsx
// \`\`\`

// ## 📁 Backend (Node.js)

// \`\`\`
// src/
// ├── config/
// ├── controllers/
// ├── middleware/
// ├── models/
// ├── routes/
// ├── services/
// ├── validations/
// ├── utils/
// └── app.js
// \`\`\`

// ## Why this structure?

// - ✅ Easy to maintain
// - ✅ Easy to scale
// - ✅ Better code organization
// - ✅ Team-friendly
// - ✅ Easier testing

// > As your project grows, you can also separate features into modules.`,
//   },

//   {
//     id: 6,
//     role: "user",
//     text: `How should I connect my React frontend with a Node.js API?`,
//   },

//   {
//     id: 7,
//     role: "assistant",
//     text: `# Connecting React with Node.js API

// Instead of calling \`fetch()\` inside every component, create a dedicated API layer.

// ## Step 1 — Create a service

// \`\`\`js
// // services/chatService.js

// import axios from "axios";

// export const sendMessage = async (payload) => {
//   return axios.post("/api/chat", payload);
// };
// \`\`\`

// ---

// ## Step 2 — Use it inside your component

// \`\`\`jsx
// const response = await sendMessage({
//   message: prompt,
// });

// setMessages((prev) => [
//   ...prev,
//   {
//     role: "assistant",
//     text: response.data.answer,
//   },
// ]);
// \`\`\`

// ## Benefits

// - 📦 Reusable API calls
// - 🧹 Cleaner components
// - 🔄 Easier maintenance
// - 🧪 Better testing

// > This is the approach used in most production React applications.`,
//   },

//   {
//     id: 8,
//     role: "user",
//     text: `Thanks! That makes sense.`,
//   },

//   {
//     id: 9,
//     role: "assistant",
//     text: `# You're Welcome! 🎉

// Glad it helped.

// As you continue building your **MERN AI Chatbot**, here are some features worth adding:

// ## Core Features

// - 💬 Conversation History
// - ✍️ Markdown Rendering
// - 🌈 Code Syntax Highlighting
// - ⚡ Streaming Responses
// - 📋 Copy Message Button
// - 🔄 Regenerate Response
// - 🌓 Dark / Light Mode
// - 📜 Auto Scroll
// - ⌨️ Typing Animation
// - 📎 File Upload
// - 🖼️ Image Upload
// - 🎤 Voice Input
// - 🔊 Text-to-Speech

// ## Advanced Features

// - AI Conversation Memory
// - Chat Search
// - Pinned Chats
// - Export Conversation
// - Share Conversation
// - Multi-model Support
// - Token Usage
// - Usage Analytics
// - Custom Prompts
// - Authentication
// - Real-time Socket.IO Chat

// ---

// ### 🚀 Production Tech Stack

// - React + Vite
// - Redux Toolkit
// - React Router
// - Tailwind CSS
// - Framer Motion
// - React Markdown
// - react-syntax-highlighter
// - Axios
// - Socket.IO
// - Node.js
// - Express.js
// - MongoDB
// - Redis
// - JWT Authentication

// ---

// > Keep your components small, APIs reusable, and UI responsive. That's the key to building a production-ready AI chatbot similar to ChatGPT.`,
//   },
// ];

export default function useSpeechRecognition() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const finalTranscript = useRef("");
  const silenceTimer = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [newMessageLoading, setNewMessageLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const { newChat } = useSelector((store) => store.chatSlice);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    const handleChunk = ({ text }) => {
      debugger;
      setNewMessageLoading(false);
      setMessages((prev) => {
        const list = [...prev];
        const last = list[list.length - 1];
        if (last?.role === "assistant") {
          last.text += text;
        } else {
          list.push({
            role: "assistant",
            text: text,
          });
        }
        return [...list];
      });
    };

    const handleError = ({ message }) => {
      console.log("error", message);
      setNewMessageLoading(false);
      setMessages((prev) => {
        const list = [...prev];
        const last = list[list.length - 1];
        if (last?.isError) {
          last.text = message;
        } else {
          list.push({
            role: "assistant",
            text: message,
            isError: true,
          });
        }
        return list;
      });
    };

    onAIChunk(handleChunk);
    onAIError(handleError);

    return () => {
      removeAIChunk(handleChunk);
    };
  }, []);

  const notificationSound = useRef(
    new Audio("/sounds/mixkit-unlock-game-notification-253.wav"),
  );

  const playMicSound = () => {
    notificationSound.current.currentTime = 0;
    notificationSound.current.play();
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    // recognition.lang = "hi-IN"; // Hindi (India)
    // recognition.lang = "en-US"; // English (US)
    recognition.lang = "en-IN"; // English (India)
    // recognition.lang = "en-GB"; // English (UK)

    recognition.onresult = (event) => {
      resetSilenceTimer();

      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript.current += text + " ";
        } else {
          interim += text;
        }
      }

      setMessage(finalTranscript.current + interim);
    };

    recognition.onend = () => {
      clearTimeout(silenceTimer.current);
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      clearTimeout(silenceTimer.current);
      recognition.stop();
    };
  }, []);

  const resetSilenceTimer = () => {
    clearTimeout(silenceTimer.current);

    silenceTimer.current = setTimeout(() => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    }, 5000);
  };

  const toggleListening = () => {
    playMicSound();

    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      clearTimeout(silenceTimer.current);
      setIsListening(false);
    } else {
      finalTranscript.current = message.trim() ? message.trim() + " " : "";

      recognitionRef.current.start();
      setIsListening(true);
      resetSilenceTimer();
    }
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const pastedFiles = [];
    for (const item of items) {
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file) {
          pastedFiles.push(file);
        }
      }
    }
    if (!pastedFiles.length) return;
    e.preventDefault();
    if (selectedFiles.length + pastedFiles.length > 5) {
      alert("You can upload a maximum of 5 files.");
      return;
    }
    setSelectedFiles((prev) => [...prev, ...pastedFiles]);
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    if (newChat) {
      await dispatch(setActivePage("newChat"));
      navigate(`/c/${new Date().getTime()}`);
    }
    console.log(message);
    const messagePayload = {
      id: new Date(),
      role: "user",
      text: message,
    };
    const newMessages = [...messages, messagePayload];
    setMessages(newMessages);
    setMessage("");
    setNewMessageLoading(true);
    sendAIMessage(message);
    // try {
    //   // chatGPT api integrate
    //   // const response = await axios.post(
    //   //   "https://api.openai.com/v1/chat/completions",
    //   //   {
    //   //     model: "gpt-4.1-mini",
    //   //     messages: [
    //   //       {
    //   //         role: "user",
    //   //         content: message,
    //   //       },
    //   //     ],
    //   //   },
    //   //   {
    //   //     headers: {
    //   //       "Content-Type": "application/json",
    //   //       Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    //   //     },
    //   //   },
    //   // );
    //   // gemini api integrate
    //   // const response = await axios.post(
    //   //   `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${
    //   //     import.meta.env.VITE_GEMINI_API_KEY
    //   //   }`,
    //   //   {
    //   //     contents: [
    //   //       {
    //   //         parts: [
    //   //           {
    //   //             text: message,
    //   //           },
    //   //         ],
    //   //       },
    //   //     ],
    //   //   },
    //   //   {
    //   //     headers: {
    //   //       "Content-Type": "application/json",
    //   //     },
    //   //   },
    //   // );
    //   // console.log("response", response);
    //   // const botMessage =
    //   //   response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
    //   //   "Sorry, I couldn't generate a response.";
    //   // setMessages([
    //   //   ...newMessages,
    //   //   { id: new Date(), role: "bot", text: botMessage },
    //   // ]);
    // } catch (error) {
    //   console.error("Error generating response", error);
    // }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    if (selectedFiles.length + files.length > 5) {
      alert("You can upload a maximum of 5 files.");
      e.target.value = "";
      return;
    }

    setSelectedFiles((prev) => [...prev, ...files]);

    // same file dobara select ho sake
    e.target.value = "";
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);

    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 140)}px`;
  };

  return {
    conversationId,
    newMessageLoading,
    setNewMessageLoading,
    messages,
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
    textareaRef,
    handleMessageChange,
  };
}
