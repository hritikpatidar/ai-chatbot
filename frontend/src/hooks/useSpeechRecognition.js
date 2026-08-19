import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addConversation,
  addErrorMessage,
  addMessage,
  appendAssistantChunk,
  clearMessages,
  fetchClientConfig,
  setActivePage,
  setConversationList,
  setConversationLoading,
  setIsSendDisable,
  setMessages,
  setNewMessageLoading,
} from "../redux/features/Chat/chatSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import toast from "react-hot-toast";
import {
  getConversationMessages,
  onAIChunk,
  onAIEnd,
  onAIError,
  onAIStopped,
  removeAIChunk,
  removeAIEnd,
  removeAIError,
  removeAIStopped,
  sendAIMessage,
  stopAIMessage,
  onConversationMessages,
  removeConversationMessages,
} from "../service/message.services";
import {
  onConversationCreated,
  onConversationError,
  onConversationList,
  removeConversationCreated,
  removeConversationError,
  removeConversationList,
} from "../service/conversation.services";

export default function useSpeechRecognition({
  enableSocketListeners = true,
} = {}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { socket, isConnected, clientKey, isClientChatbot } = useSocket();
  const { conversationId } = useParams();
  const location = useLocation();
  const { isNewConversation } = location.state || {};
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const finalTranscript = useRef("");
  const silenceTimer = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const {
    messages,
    newMessageLoading,
    isSendDisable,
    clientConfig,
    clientConfigLoading,
    clientConfigError,
  } = useSelector((store) => store.chatSlice);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    if (!conversationId) {
      dispatch(setConversationLoading(false));
      return;
    }
    if (isNewConversation) {
      console.log("🆕 New conversation - skipping messages fetch");
      dispatch(setConversationLoading(false));
      return;
    }

    console.log("📨 Fetching existing conversation:", conversationId);
    dispatch(setConversationLoading(true));
    dispatch(setActivePage("recentChat"));
    getConversationMessages(conversationId);
  }, [conversationId, dispatch]);

  useEffect(() => {
    if (!isClientChatbot) {
      return;
    }
    if (!clientKey) {
      return;
    }
    console.log("🏪 Fetching client config:", clientKey);
    dispatch(fetchClientConfig(clientKey));
  }, [clientKey, isClientChatbot, dispatch]);

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
    if (!enableSocketListeners) return;
    const handleChunk = ({ text }) => {
      console.log("📥 ai:chunk", text);
      dispatch(setNewMessageLoading(false));
      dispatch(appendAssistantChunk(text));
    };

    const handleError = ({ message }) => {
      console.log("❌ ai:error", message);
      dispatch(setNewMessageLoading(false));
      dispatch(setIsSendDisable(false));
      dispatch(addErrorMessage(message));
    };
    const handleEnd = (data) => {
      console.log("✅ ai:end", data);
      dispatch(setIsSendDisable(false));
    };

    const handleStopeGeneration = (message) => {
      console.log("🛑 ai:stopped", message);
      dispatch(setNewMessageLoading(false));
      dispatch(setIsSendDisable(false));
    };

    const handleMessageList = (data) => {
      console.log("📨 conversation:messages", data);
      dispatch(setConversationLoading(false));
      dispatch(setMessages(data.messages));
    };

    console.log("Registering socket listeners");
    onAIChunk(handleChunk);
    onAIEnd(handleEnd);
    onAIError(handleError);
    onAIStopped(handleStopeGeneration);
    onConversationMessages(handleMessageList);
    onConversationCreated(handleConversationCreate);
    onConversationList(handleConversation);
    onConversationError(handleConversationError);
    return () => {
      console.log("🔴 Removing AI socket listeners");
      removeAIChunk(handleChunk);
      removeAIEnd(handleEnd);
      removeAIError(handleError);
      removeAIStopped(handleStopeGeneration);
      removeConversationMessages(handleMessageList);
      removeConversationCreated(handleConversationCreate);
      removeConversationList(handleConversation);
      removeConversationError(handleConversationError);
    };
  }, [enableSocketListeners, dispatch]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [conversationId]);

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

  const handleSend = async (predefinedMessage = null) => {
    const textToSend =
      typeof predefinedMessage === "string" ? predefinedMessage : message;

    if (!textToSend.trim()) {
      return;
    }

    if (isSendDisable) {
      console.log("⚠️ Send blocked - AI request already running");

      return;
    }

    const trimmedMessage = textToSend.trim();
    const messagePayload = {
      id: Date.now().toString(),
      role: "user",
      text: trimmedMessage,
    };

    dispatch(setIsSendDisable(true));
    dispatch(setNewMessageLoading(true));
    dispatch(addMessage(messagePayload));

    setMessage("");

    sendAIMessage(conversationId, trimmedMessage);

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleStopGenerating = () => {
    dispatch(setIsSendDisable(false));
    dispatch(setNewMessageLoading(false));
    stopAIMessage();
    // baad me socket.emit("stop-generation") ya abort controller laga dena
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

  const handleFeedback = (type) => {
    console.log(type); // "up" | "down"
    toast.success("Thank you for message response");
  };

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      toast.success("Copied to clipboard", {
        id: "copy-toast",
      });
      setTimeout(() => {
        setCopiedIndex(null);
      }, 1500);
    } catch (err) {
      console.error(err);
    }
  };

  return {
    conversationId,

    newMessageLoading,
    isSendDisable,

    messages,
    message,
    setMessage,

    selectedFiles,
    setSelectedFiles,

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

    // Client chatbot
    clientKey,
    isClientChatbot,
    clientConfig,
    clientConfigLoading,
    clientConfigError,
  };
}
