// This code for after login connect with socket 
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
  const { profileDetails, token, refreshToken } = useSelector(
    (state) => state?.authReducer?.AuthSlice,
  );
  const [isConnected, setIsConnected] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const clientKey = searchParams.get("clientKey");
  const isClientChatbot = Boolean(clientKey);

  useEffect(() => {
    //  Client Chatbot
    if (isClientChatbot) {
      if (!clientKey) {
        return;
      }

      //  If old socket connection exists,
      //  disconnect first.

      if (socket.connected) {
        socket.disconnect();
      }

      socket.auth = {
        clientKey,
      };

      console.log("🔌 Connecting Client Chatbot Socket:", clientKey);
    } else {
      //  Normal Authenticated Chatbot
      if (!token || !profileDetails?._id) {
        if (socket.connected) {
          socket.disconnect();
        }

        setIsConnected(false);
        console.log("Socket disconnected - no auth");
        return;
      }

      socket.auth = {
        token,
      };

      console.log("🔐 Connecting User Socket");
    }

    const onConnect = () => {
      console.log("✅ Socket connected:", socket.id);
      setIsConnected(true);
    };

    const onDisconnect = (reason) => {
      console.log("❌ Socket disconnected:", reason);
      setIsConnected(false);
    };

    const handleConnectError = async (err) => {
      console.log("❌ connect_error:", err.message);

      //  Client chatbot should NOT
      //  logout the user because it
      //  doesn't depend on JWT.

      if (isClientChatbot) {
        if (err.message === "INVALID_CLIENT") {
          toast.error("Invalid or inactive client.");
        } else if (err.message === "AUTH_OR_CLIENT_REQUIRED") {
          toast.error("Client configuration is missing.");
        } else {
          toast.error(err.message || "Client chatbot connection failed.");
        }
        return;
      }

      //  Normal user chatbot

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

    // Remove previous listeners

    socket.off("connect", onConnect);
    socket.off("disconnect", onDisconnect);
    socket.off("connect_error", handleConnectError);

    //  Register listeners

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", handleConnectError);

    // Connect socket

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      console.log("🧹 SocketProvider cleanup");
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", handleConnectError);
    };
  }, [
    clientKey,
    isClientChatbot,
    token,
    profileDetails?._id,
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

//   const { profileDetails, token, refreshToken } = useSelector(
//     (state) => state?.authReducer?.AuthSlice,
//   );

//   const [isConnected, setIsConnected] = useState(false);

//   /*
//    * ==========================================
//    * CLIENT KEY
//    * ==========================================
//    *
//    * First URL se clientKey lo.
//    *
//    * Example:
//    * /?clientKey=abc-books
//    *
//    * Agar URL me nahi hai to sessionStorage se
//    * previously stored clientKey lo.
//    */

//   const searchParams = new URLSearchParams(location.search);

//   const urlClientKey = searchParams.get("clientKey");

//   /*
//    * URL me clientKey mil gaya
//    * to sessionStorage me save kar do.
//    */

//   useEffect(() => {
//     if (urlClientKey) {
//       sessionStorage.setItem("clientKey", urlClientKey);
//     }
//   }, [urlClientKey]);

//   /*
//    * Current clientKey
//    */

//   const clientKey = urlClientKey || sessionStorage.getItem("clientKey") || "";

//   const isClientChatbot = Boolean(clientKey);

//   useEffect(() => {
//     /*
//      * ==========================================
//      * CLEAN OLD SOCKET LISTENERS
//      * ==========================================
//      */

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

//       /*
//        * ========================================
//        * CLIENT CHATBOT
//        * ========================================
//        */

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

//       /*
//        * ========================================
//        * NORMAL AUTHENTICATED USER
//        * ========================================
//        */

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

//     /*
//      * Remove old listeners
//      */

//     socket.off("connect", onConnect);
//     socket.off("disconnect", onDisconnect);
//     socket.off("connect_error", handleConnectError);

//     /*
//      * Add listeners
//      */

//     socket.on("connect", onConnect);
//     socket.on("disconnect", onDisconnect);
//     socket.on("connect_error", handleConnectError);

//     /*
//      * ==========================================
//      * CLIENT CHATBOT SOCKET
//      * ==========================================
//      */

//     if (isClientChatbot) {
//       /*
//        * Existing connection ko disconnect karo
//        * agar connection kisi aur auth ke saath hai.
//        */

//       if (socket.connected) {
//         socket.disconnect();
//       }

//       /*
//        * Client chatbot authentication
//        */

//       socket.auth = {
//         clientKey,
//       };

//       console.log("🌐 Connecting Client Chatbot Socket:", clientKey);

//       setIsConnected(false);

//       socket.connect();
//     } else if (token && profileDetails?._id) {

//     /*
//      * ==========================================
//      * NORMAL USER SOCKET
//      * ==========================================
//      */
//       /*
//        * User JWT authentication
//        */

//       if (socket.connected) {
//         socket.disconnect();
//       }

//       socket.auth = {
//         token,
//       };

//       console.log("🔐 Connecting User Socket");

//       setIsConnected(false);

//       socket.connect();
//     } else {

//     /*
//      * ==========================================
//      * NO CLIENT + NO LOGIN
//      * ==========================================
//      */
//       if (socket.connected) {
//         socket.disconnect();
//       }

//       setIsConnected(false);

//       console.log("⛔ Socket disconnected - no clientKey and no auth");
//     }

//     /*
//      * ==========================================
//      * CLEANUP
//      * ==========================================
//      */

//     return () => {
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
