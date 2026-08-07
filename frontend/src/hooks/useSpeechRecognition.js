import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActivePage } from "../redux/features/Chat/chatSlice";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSocket } from "../context/SocketContext";
import {
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
} from "../service/socket.service";
import toast from "react-hot-toast";
import { onConversationCreated, removeConversationCreated } from "../service/conversation.services";

export default function useSpeechRecognition() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();
  const { conversationId } = useParams();
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const finalTranscript = useRef("");
  const silenceTimer = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [newMessageLoading, setNewMessageLoading] = useState(false);
  const [isSendDisable, setIsSendDisable] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const { activePage } = useSelector((store) => store.chatSlice);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    const handleChunk = ({ text }) => {
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
      setNewMessageLoading(false);
      setIsSendDisable(false);
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
    const handleEnd = (data) => {
      setIsSendDisable(false);
    };

    const handleStopeGeneration = (message) => {
      setNewMessageLoading(false);
      setIsSendDisable(false);
    };

    const handleConversationCreate=({conversationId})=>{
      navigate(`/c/${conversationId}`)
    }


    onAIChunk(handleChunk);
    onAIEnd(handleEnd);
    onAIError(handleError);
    onAIStopped(handleStopeGeneration);
    onConversationCreated(handleConversationCreate);

    return () => {
      removeAIChunk(handleChunk);
      removeAIEnd(handleEnd);
      removeAIError(handleError);
      removeAIStopped(handleStopeGeneration);
      removeConversationCreated(handleConversationCreate);
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
    if (activePage === "newChat") {
      await dispatch(setActivePage("recentChat"));
      navigate(`/c/${new Date().getTime()}`);
    }
    const messagePayload = {
      id: new Date(),
      role: "user",
      text: message,
    };
    const newMessages = [...messages, messagePayload];
    setMessages(newMessages);
    setMessage("");
    setNewMessageLoading(true);
    setIsSendDisable(true);
    sendAIMessage(conversationId,message);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleStopGenerating = () => {
    setIsSendDisable(false);
    setNewMessageLoading(false);
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
    setNewMessageLoading,
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
  };
}
