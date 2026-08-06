import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActivePage } from "../redux/features/Chat/chatSlice";
import { useNavigate, useParams } from "react-router-dom";

const messagesArray = [
  {
    id: 1,
    role: "assistant",
    content: `Hello! 👋 I'm your AI assistant.

I can help you with React, Node.js, MongoDB, Express, JavaScript, interview preparation, debugging, API integration, and much more.

Feel free to ask anything, and I'll provide step-by-step explanations with examples whenever needed.`,
  },

  {
    id: 2,
    role: "user",
    content: `Can you explain React Hooks in detail with a practical example?`,
  },

  {
    id: 3,
    role: "assistant",
    content: `Absolutely!

React Hooks are special functions introduced in React 16.8 that allow functional components to use state, lifecycle methods, and other React features without writing class components.

The most commonly used Hooks are:

• useState – Stores component state.
• useEffect – Handles side effects like API calls.
• useContext – Shares data across components.
• useMemo – Optimizes expensive calculations.
• useCallback – Prevents unnecessary function recreation.
• useRef – Accesses DOM elements or stores mutable values.

Example:

const [count, setCount] = useState(0);

<button onClick={() => setCount(count + 1)}>
  Count: {count}
</button>

Whenever the button is clicked, React updates the state and automatically re-renders the component.`,
  },

  {
    id: 4,
    role: "user",
    content: `I'm building a MERN AI chatbot. What folder structure would you recommend for scalability?`,
  },

  {
    id: 5,
    role: "assistant",
    content: `For a scalable MERN project, keep the frontend and backend well organized.

Frontend (React):

src/
 ├── components/
 ├── pages/
 ├── redux/
 ├── hooks/
 ├── services/
 ├── layouts/
 ├── utils/
 ├── routes/
 └── assets/

Backend (Node.js):

src/
 ├── controllers/
 ├── routes/
 ├── models/
 ├── middleware/
 ├── services/
 ├── utils/
 ├── config/
 └── validations/

This structure makes the project easier to maintain, test, and scale as new features are added.`,
  },

  {
    id: 6,
    role: "user",
    content: `How should I connect my React frontend with a Node.js API?`,
  },

  {
    id: 7,
    role: "assistant",
    content: `The recommended approach is to create a dedicated API layer instead of calling fetch() directly inside every component.

Example:

services/chatService.js

export const sendMessage = async (payload) => {
   return axios.post("/api/chat", payload);
};

Then inside your React component:

const response = await sendMessage({
   message: prompt,
});

setMessages(prev => [
   ...prev,
   {
      role: "assistant",
      content: response.data.answer,
   },
]);

This keeps your UI clean and makes future maintenance much easier.`,
  },

  {
    id: 8,
    role: "user",
    content: `Thanks! That makes sense.`,
  },

  {
    id: 9,
    role: "assistant",
    content: `You're welcome! 😄

As you continue building your AI chatbot, consider adding features like:

• Conversation history
• Markdown rendering
• Code syntax highlighting
• Streaming AI responses
• Copy message button
• Regenerate response
• Dark/Light mode
• Auto-scroll to latest message
• Typing animation
• File upload support

These features will make your chatbot feel much closer to modern AI assistants like ChatGPT and improve the overall user experience.`,
  },
];

export default function useSpeechRecognition() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { conversationId } = useParams();

  const recognitionRef = useRef(null);
  const finalTranscript = useRef("");
  const silenceTimer = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(messagesArray);
  const [isListening, setIsListening] = useState(false);
  const { newChat } = useSelector((store) => store.chatSlice);

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
      content: message,
    };
    setMessages([...messages, messagePayload]);
    setMessage("");

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
  };
}
