// import { createContext, useContext, useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";
// import socket from "../socket/socket";
// import { handleLogout } from "../utils/logout";
// import toast from "react-hot-toast";
// const SocketContext = createContext(null);

// export const useSocket = () => {
//   return useContext(SocketContext);
// };

// export const SocketProvider = ({ children }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const searchParams = new URLSearchParams(location.search);
//   const clientKey = searchParams.get("clientKey");
//   const isClientChatbot = Boolean(clientKey);
//   const { profileDetails, token, refreshToken } = useSelector(
//     (state) => state?.authReducer?.AuthSlice,
//   );
//   const [isConnected, setIsConnected] = useState(false);

//   useEffect(() => {
//     //  Client Chatbot
//     if (isClientChatbot) {
//       if (!clientKey) {
//         return;
//       }
//       if (socket.connected) {
//         socket.disconnect();
//       }
//       socket.auth = {
//         clientKey,
//       };
//       console.log("🔌 Connecting Client Chatbot Socket:", clientKey);
//     } else {
//       //  Normal Authenticated Chatbot
//       if (!token || !profileDetails?._id) {
//         if (socket.connected) {
//           socket.disconnect();
//         }

//         setIsConnected(false);
//         console.log("Socket disconnected - no auth");
//         return;
//       }

//       socket.auth = {
//         token,
//       };

//       console.log("🔐 Connecting User Socket");
//     }

//     const onConnect = () => {
//       console.log("✅ Socket connected:", socket.id);
//       setIsConnected(true);
//     };

//     const onDisconnect = (reason) => {
//       console.log("❌ Socket disconnected:", reason);
//       setIsConnected(false);
//     };

//     const handleConnectError = async (err) => {
//       console.log("❌ connect_error:", err.message);

//       //  Client chatbot should NOT
//       //  logout the user because it
//       //  doesn't depend on JWT.

//       if (isClientChatbot) {
//         if (err.message === "INVALID_CLIENT") {
//           toast.error("Invalid or inactive client.");
//         } else if (err.message === "AUTH_OR_CLIENT_REQUIRED") {
//           toast.error("Client configuration is missing.");
//         } else {
//           toast.error(err.message || "Client chatbot connection failed.");
//         }
//         return;
//       }

//       //  Normal user chatbot

//       if (
//         err.message === "TOKEN_EXPIRED" ||
//         err.message === "INVALID_TOKEN" ||
//         err.message === "websocket error"
//       ) {
//         toast.error(err.message, {
//           id: "TOKEN_EXPIRED",
//         });

//         await handleLogout({
//           dispatch,
//           navigate,
//           refreshToken,
//         });
//       }
//     };

//     // Remove previous listeners

//     socket.off("connect", onConnect);
//     socket.off("disconnect", onDisconnect);
//     socket.off("connect_error", handleConnectError);

//     //  Register listeners

//     socket.on("connect", onConnect);
//     socket.on("disconnect", onDisconnect);
//     socket.on("connect_error", handleConnectError);

//     // Connect socket

//     if (!socket.connected) {
//       socket.connect();
//     }

//     return () => {
//       console.log("🧹 SocketProvider cleanup");
//       socket.off("connect", onConnect);
//       socket.off("disconnect", onDisconnect);
//       socket.off("connect_error", handleConnectError);
//     };
//   }, [
//     clientKey,
//     isClientChatbot,
//     token,
//     profileDetails?._id,
//     refreshToken,
//     dispatch,
//     navigate,
//   ]);

//   return (
//     <SocketContext.Provider
//       value={{
//         socket,
//         isConnected,
//         clientKey,
//         isClientChatbot,
//       }}
//     >
//       {children}
//     </SocketContext.Provider>
//   );
// };


import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import socket from "../socket/socket";
import { handleLogout } from "../utils/logout";
import toast from "react-hot-toast";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const clientKey = searchParams.get("clientKey");

  const { profileDetails, token, refreshToken } = useSelector(
    (state) => state?.authReducer?.AuthSlice,
  );

  const [isConnected, setIsConnected] = useState(false);

  const isAuthenticated =
    Boolean(token) && Boolean(profileDetails?._id);

  const isClientChatbot =
    Boolean(clientKey) && !isAuthenticated;

  /*
   * ==========================================
   * SOCKET CONNECTION
   * ==========================================
   *
   * IMPORTANT:
   *
   * location.pathname is NOT dependency.
   *
   * Therefore:
   *
   * /?clientKey=abc
   *       ↓
   * /c/123?clientKey=abc
   *
   * socket reconnect nahi karega.
   */

  useEffect(() => {
    /*
     * ==========================================
     * SOCKET AUTH CONFIG
     * ==========================================
     */

    if (isClientChatbot) {
      if (!clientKey) {
        return;
      }

      socket.auth = {
        clientKey,
      };

      console.log(
        "🔌 Client Chatbot Socket Auth:",
        clientKey,
      );
    } else if (isAuthenticated) {
      socket.auth = {
        token,
      };

      console.log("🔐 User Socket Auth");
    } else {
      /*
       * No user + no clientKey
       */

      if (socket.connected) {
        socket.disconnect();
      }

      setIsConnected(false);

      console.log(
        "🔌 Socket disconnected - no auth/clientKey",
      );

      return;
    }

    /*
     * ==========================================
     * SOCKET EVENTS
     * ==========================================
     */

    const onConnect = () => {
      console.log("✅ Socket connected:", socket.id);

      setIsConnected(true);
    };

    const onDisconnect = (reason) => {
      console.log(
        "❌ Socket disconnected:",
        reason,
      );

      setIsConnected(false);
    };

    const handleConnectError = async (err) => {
      console.log(
        "❌ connect_error:",
        err.message,
      );

      /*
       * ========================================
       * CLIENT CHATBOT ERROR
       * ========================================
       */

      if (isClientChatbot) {
        if (err.message === "INVALID_CLIENT") {
          toast.error(
            "Invalid or inactive client.",
          );
        } else if (
          err.message === "AUTH_OR_CLIENT_REQUIRED"
        ) {
          toast.error(
            "Client configuration is missing.",
          );
        } else {
          toast.error(
            err.message ||
              "Client chatbot connection failed.",
          );
        }

        return;
      }

      /*
       * ========================================
       * NORMAL USER SOCKET ERROR
       * ========================================
       */

      if (
        err.message === "TOKEN_EXPIRED" ||
        err.message === "INVALID_TOKEN" ||
        err.message === "websocket error"
      ) {
        toast.error(err.message, {
          id: "TOKEN_EXPIRED",
        });

        await handleLogout({
          dispatch,
          navigate,
          refreshToken,
        });
      }
    };

    /*
     * ==========================================
     * REGISTER EVENTS
     * ==========================================
     */

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on(
      "connect_error",
      handleConnectError,
    );

    /*
     * ==========================================
     * CONNECT ONLY IF NOT CONNECTED
     * ==========================================
     */

    if (!socket.connected) {
      console.log("🚀 Connecting socket...");

      socket.connect();
    } else {
      console.log(
        "♻️ Socket already connected:",
        socket.id,
      );

      setIsConnected(true);
    }

    /*
     * ==========================================
     * CLEANUP
     * ==========================================
     *
     * IMPORTANT:
     *
     * Yaha socket.disconnect() nahi karna.
     *
     * Sirf listeners remove karne hain.
     */

    return () => {
      console.log(
        "🧹 Removing socket listeners",
      );

      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off(
        "connect_error",
        handleConnectError,
      );
    };
  }, [
    clientKey,
    isClientChatbot,
    isAuthenticated,
    token,
    refreshToken,
    dispatch,
    navigate,
  ]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        clientKey,
        isClientChatbot,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};