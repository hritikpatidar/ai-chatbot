import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import socket from "../socket/socket";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const { profileDetails, token } = useSelector(
    (state) => state?.authReducer?.AuthSlice,
  );
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token || !profileDetails?._id) {
      socket.disconnect();
      setIsConnected(false);
      console.log("socket disconnected");
      return;
    }
    socket.auth = {
      token,
    };
    if (!socket.connected) {
      socket.connect();
    }
    const onConnect = () => {
      console.log("Connected:", socket.id);
      setIsConnected(true);
    };

    const onDisconnect = () => {
      console.log("❌ Disconnected");
      setIsConnected(false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [token, profileDetails]);

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
