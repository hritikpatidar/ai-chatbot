import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from "../socket/socket";
import { handleLogout } from "../utils/logout";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profileDetails, token, refreshToken } = useSelector(
    (state) => state?.authReducer?.AuthSlice,
  );

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
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

    socket.off("connect", onConnect);
    socket.off("disconnect", onDisconnect);
    socket.off("connect_error", handleConnectError);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", handleConnectError);

     if (!socket.connected) {
      socket.connect();
    }


    return () => {
      console.log("🧹 SocketProvider cleanup");
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
       socket.off("connect_error", handleConnectError);
    };
  }, [token, profileDetails?._id, refreshToken, dispatch, navigate]);

  return (
    <SocketContext.Provider
      value={{
        socket: socket,
        isConnected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
