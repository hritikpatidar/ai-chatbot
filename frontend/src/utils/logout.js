import toast from "react-hot-toast";
import { logoutUser } from "../redux/features/Auth/authSlice";
import socket from "../socket/socket";
import { clearLocalStorage, getItemLocalStorage, setItemLocalStorage } from "./browserServices";

export const handleLogout = async ({
  dispatch,
  navigate,
  setProfileOpen,
  setIsLogoutLoading,
  refreshToken,
}) => {
  const fcmToken = getItemLocalStorage("fcm_token");

  try {
    setIsLogoutLoading?.(true);

    await dispatch(
      logoutUser({
        refreshToken,
      }),
    ).unwrap();

    setProfileOpen?.(false);

    navigate("/login");
  } catch (error) {
    console.error(error);
    toast.error(error?.message || "Logout failed");
  } finally {
    socket.disconnect();

    dispatch({
      type: "RESET",
    });

    clearLocalStorage();

    if (fcmToken) {
      setItemLocalStorage("fcm_token", fcmToken);
    }

    setIsLogoutLoading?.(false);
  }
};