import { ChevronDown, LogIn, LogOut, Share2, User } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutSuccess, logoutUser } from "../../redux/features/Auth/authSlice";
import { useNavigate } from "react-router-dom";
import useSpeechRecognition from "../../hooks/useSpeechRecognition";
import { setActivePage } from "../../redux/features/Chat/chatSlice";
import { isLogin } from "../../Utils/Auth";
import {
  clearLocalStorage,
  getItemLocalStorage,
  removeItemLocalStorage,
  setItemLocalStorage,
} from "../../utils/browserServices";
import profile from "../../assets/profile1.jpg";
import toast from "react-hot-toast";

const ChatHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activePage } = useSelector((store) => store.chatSlice);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const token = isLogin();
  const { conversationId } = useSpeechRecognition();
  const { profileDetails, refreshToken } = useSelector(
    (store) => store.authReducer.AuthSlice,
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // const handleAuth = async () => {
  //   if (token) {
  //     // Logout
  //     await dispatch(logoutSuccess(false));
  //     removeItemLocalStorage("token");
  //     dispatch(setActivePage("newChat"));
  //     setProfileOpen(false);
  //     navigate("/login");
  //   } else {
  //     navigate("/login");
  //   }
  // };

  const handleAuth = async () => {
    const fcmToken = getItemLocalStorage("fcm_token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await dispatch(logoutUser({ refreshToken: refreshToken })).unwrap();
      await navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Logout failed");
    } finally {
      dispatch({ type: "RESET" });
      clearLocalStorage();
      setItemLocalStorage("fcm_token", fcmToken);
      setProfileOpen(false);
    }
  };

  return (
    <div className="absolute top-4 left-4 right-4 sm:top-5 sm:left-5 sm:right-5 lg:top-6 lg:left-8 lg:right-8 flex items-center justify-end gap-2 z-50 ">
      {/* AI Assistant */}
      {activePage === "newChat" && (
        <button className="flex h-9 items-center gap-1.5 rounded-lg border border-white/10 bg-[#171b23] px-3 text-xs font-medium text-white transition-all duration-200 hover:border-blue-500 hover:bg-[#1d2432]">
          <span className=" sm:block">SI Assistant</span>
          <ChevronDown size={14} className="text-gray-400" />
        </button>
      )}

      {conversationId && (
        <button
          onClick={async () => {
            const url = window.location.href;

            try {
              // Mobile/Desktop share (supported browsers)
              if (navigator.share) {
                await navigator.share({
                  title: "Chat",
                  text: "Check out this chat",
                  url,
                });
              } else {
                // Fallback: Copy link
                await navigator.clipboard.writeText(url);
                alert("Chat link copied!");
              }
            } catch (err) {
              console.error(err);

              // If user cancels share, still copy the link
              try {
                await navigator.clipboard.writeText(url);
                alert("Chat link copied!");
              } catch {
                alert("Unable to copy link.");
              }
            }
          }}
          className="flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-[#171b23] px-3 text-xs font-medium text-white transition-all duration-200 hover:border-blue-500 hover:bg-[#1d2432]"
        >
          <Share2 size={15} className="text-gray-400" />
          <span>Share</span>
        </button>
      )}

      <div className="flex items-center">
        {token ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-[#171b23] px-3 text-xs font-medium text-white transition-all duration-200 hover:border-blue-500 hover:bg-[#1d2432]"
            >
              {/* <img
                src="/profile.jpg"
                alt="Profile"
                className="h-7 w-7 rounded-full border border-white/20 object-cover"
              /> */}
              {profileDetails?.profileImage ? (
                <img
                  src={profileDetails?.profileImage}
                  alt="Profile"
                  className="h-7 w-7 rounded-full border border-white/20 object-cover"
                />
              ) : (
                // <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#232936] border border-white/10">
                //   <User size={15} className="text-gray-300" />
                // </div>
                <img
                  src={profile}
                  alt="Profile"
                  className="h-7 w-7 rounded-full border border-white/20 object-cover"
                />
              )}

              <ChevronDown
                size={14}
                className={`transition-transform ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl overflow-hidden border border-white/10 bg-[#171b23] shadow-2xl z-50">
                <div className="border-b border-white/10 px-3 py-2.5">
                  <p className="truncate text-sm font-semibold">
                    {profileDetails?.fullName || "User"}{" "}
                  </p>
                  <p className="truncate text-xs text-gray-400">
                    {profileDetails?.email}{" "}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setProfileOpen(false);
                    handleAuth();
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleAuth}
            className="flex h-9 items-center gap-1.5 rounded-lg bg-linear-to-r from-blue-500 to-purple-600 px-3 text-xs font-medium text-white transition hover:scale-105"
          >
            <LogIn size={16} />
            <span className="hidden sm:block">Login</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
