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

    socket.on("connect_error", async (err) => {
      console.log(err.message);
      toast.success(err.message)
      if (err.message === "TOKEN_EXPIRED") {
        // socket.auth = {
        //   token: token,
        // };
        // socket.connect();
        await handleLogout({
          dispatch,
          navigate,
          refreshToken,
        });
        navigate("/login");
      }
      if (err.message === "INVALID_TOKEN") {
        await handleLogout({
          dispatch,
          navigate,
          refreshToken,
        });
        navigate("/login");
      }
    });

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
