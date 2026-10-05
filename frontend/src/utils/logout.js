import toast from "react-hot-toast";
import { logoutUser } from "../redux/features/Auth/authSlice";
import socket from "../socket/socket";
import {
  clearLocalStorage,
  getItemLocalStorage,
  setItemLocalStorage,
} from "./browserServices";
import { queryClient } from "../lib/queryClient";

export const handleLogout = async ({
  dispatch,
  navigate,
  setProfileOpen,
  setIsLogoutLoading,
  refreshToken,
}) => {
  const fcmToken = getItemLocalStorage("fcm_token");
  const theme = getItemLocalStorage("theme");

  try {
    setIsLogoutLoading?.(true);

    await dispatch(
      logoutUser({
        refreshToken,
      }),
    ).unwrap();
  } catch (error) {
    console.error(error);
    toast.error(error?.message || "Logout failed", {
      id: "INVALID_TOKEN",
    });
  } finally {
    socket.disconnect();

    dispatch({
      type: "RESET",
    });
    queryClient.clear();
    clearLocalStorage();

    if (fcmToken) {
      setItemLocalStorage("fcm_token", fcmToken);
    }
    if (theme) {
      setItemLocalStorage("theme", theme);
    }
    window.location.href = "/login";
    // navigate("/login");
    // setIsLogoutLoading?.(false);
  }
};
