import { ChevronDown, LogOut, Share2, Sun, Moon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import useSpeechRecognition from "../../hooks/useSpeechRecognition";
import { isLogin } from "../../utils/Auth";
import profile from "../../assets/profile1.jpg";
import { useSocket } from "../../context/SocketContext";
import { handleLogout } from "../../utils/logout";
import { useTheme } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { getImageUrl } from "../../utils/imageUrl";

const ChatHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { activePage } = useSelector((store) => store.chatSlice);

  const [profileOpen, setProfileOpen] = useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const dropdownRef = useRef(null);

  const token = isLogin();

  const { conversationId } = useSpeechRecognition();

  const { profileDetails, refreshToken } = useSelector(
    (store) => store.authReducer.AuthSlice,
  );

  const { isConnected } = useSocket();
  const { isDarkMode, toggleTheme } = useTheme();

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

  const handleAuth = async () => {
    await handleLogout({
      dispatch,
      navigate,
      setProfileOpen,
      setIsLogoutLoading,
      refreshToken,
    });
  };

  const handleShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Chat",
          text: "Check out this chat",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Chat link copied!");
      }
    } catch (err) {
      console.error(err);

      try {
        await navigator.clipboard.writeText(url);
        alert("Chat link copied!");
      } catch {
        alert("Unable to copy link.");
      }
    }
  };

  return (
    <div className="flex h-full p-4 w-full items-center justify-between gap-3">
      <div className="flex min-w-0 items-center">
        {activePage === "newChat" && (
          <button
            type="button"
            className="
              group
              flex
              h-9
              items-center
              gap-2
              rounded-xl
              border
              border-gray-200
              bg-white
              px-3
              text-xs
              font-medium
              text-gray-800
              shadow-sm
              transition-all
              duration-200
              hover:border-blue-400
              hover:bg-blue-50
              hover:shadow-md
              dark:border-white/10
              dark:bg-[#171b23]
              dark:text-gray-100
              dark:hover:border-blue-500/60
              dark:hover:bg-[#1d2432]
            "
          >
            <span className="truncate">SI Assistant</span>

            <ChevronDown
              size={14}
              className="
                shrink-0
                text-gray-500
                transition-transform
                duration-200
                group-hover:text-blue-500
                dark:text-gray-400
                dark:group-hover:text-blue-400
              "
            />
          </button>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={
            isDarkMode ? "Switch to light mode" : "Switch to dark mode"
          }
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="
            group
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            border
            border-gray-200
            bg-white
            text-gray-600
            shadow-sm
            transition-all
            duration-200
            hover:border-blue-400
            hover:bg-blue-50
            hover:text-blue-600
            hover:shadow-md
            dark:border-white/10
            dark:bg-[#171b23]
            dark:text-gray-300
            dark:hover:border-blue-500/60
            dark:hover:bg-[#1d2432]
            dark:hover:text-blue-400
          "
        >
          <AnimatePresence mode="wait" initial={false}>
            {isDarkMode ? (
              <motion.span
                key="sun"
                initial={{
                  opacity: 0,
                  rotate: -90,
                  scale: 0.5,
                }}
                animate={{
                  opacity: 1,
                  rotate: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  rotate: 90,
                  scale: 0.5,
                }}
                transition={{
                  duration: 0.25,
                  ease: "easeOut",
                }}
                className="flex items-center justify-center"
              >
                <Sun size={17} />
              </motion.span>
            ) : (
              <motion.span
                key="moon"
                initial={{
                  opacity: 0,
                  rotate: 90,
                  scale: 0.5,
                }}
                animate={{
                  opacity: 1,
                  rotate: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  rotate: -90,
                  scale: 0.5,
                }}
                transition={{
                  duration: 0.25,
                  ease: "easeOut",
                }}
                className="flex items-center justify-center"
              >
                <Moon size={17} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        {conversationId && (
          <button
            type="button"
            onClick={handleShare}
            className="
              flex
              h-9
              items-center
              gap-2
              rounded-xl
              border
              border-gray-200
              bg-white
              px-3
              text-xs
              font-medium
              text-gray-700
              shadow-sm
              transition-all
              duration-200
              hover:border-blue-400
              hover:bg-blue-50
              hover:text-blue-600
              hover:shadow-md
              dark:border-white/10
              dark:bg-[#171b23]
              dark:text-gray-300
              dark:hover:border-blue-500/60
              dark:hover:bg-[#1d2432]
              dark:hover:text-blue-400
            "
          >
            <Share2
              size={15}
              className="
                text-gray-500
                dark:text-gray-400
              "
            />

            <span className="hidden sm:block">Share</span>
          </button>
        )}

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setProfileOpen((prev) => !prev)}
            aria-expanded={profileOpen}
            className="
              group
              flex
              h-9
              items-center
              gap-2
              rounded-xl
              border
              border-gray-200
              bg-white
              px-2
              shadow-sm
              transition-all
              duration-200
              hover:border-blue-400
              hover:bg-blue-50
              hover:shadow-md
              dark:border-white/10
              dark:bg-[#171b23]
              dark:hover:border-blue-500/60
              dark:hover:bg-[#1d2432]
            "
          >
            <div className="relative shrink-0">
              <img
                src={getImageUrl(profileDetails?.profileImage, profile)}
                alt="Profile"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = profile;
                }}
                className="
                  h-7
                  w-7
                  rounded-lg
                  border
                  border-gray-200
                  object-cover
                  dark:border-white/20
                "
              />
              {isConnected && (
                <span
                  className="
                    absolute
                    -bottom-0.5
                    -right-0.5
                    h-2.5
                    w-2.5
                    rounded-full
                    border-2
                    border-white
                    bg-green-500
                    shadow-sm
                    dark:border-[#171b23]
                  "
                />
              )}
            </div>

            <span
              className="
                hidden
                max-w-24
                truncate
                text-xs
                font-medium
                text-gray-700
                sm:block
                dark:text-gray-200
              "
            >
              {profileDetails?.fullName || "User"}
            </span>

            <ChevronDown
              size={14}
              className={`
                shrink-0
                text-gray-500
                transition-transform
                duration-200
                dark:text-gray-400
                ${profileOpen ? "rotate-180" : ""}
              `}
            />
          </button>

          {profileOpen && (
            <div
              className="
                absolute
                right-0
                top-full
                z-50
                mt-2
                w-60
                overflow-hidden
                rounded-2xl
                border
                border-gray-200
                bg-white
                shadow-xl
                shadow-black/10
                dark:border-white/10
                dark:bg-[#171b23]
                dark:shadow-black/40
              "
            >
              <div
                className="
                  border-b
                  border-gray-200
                  p-3
                  dark:border-white/10
                "
              >
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={getImageUrl(profileDetails?.profileImage, profile)}
                      alt="Profile"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = profile;
                      }}
                      className="
                        h-9
                        w-9
                        rounded-xl
                        border
                        border-gray-200
                        object-cover
                        dark:border-white/10
                      "
                    />

                    {isConnected && (
                      <span
                        className="
                          absolute
                          -bottom-0.5
                          -right-0.5
                          h-2.5
                          w-2.5
                          rounded-full
                          border-2
                          border-white
                          bg-green-500
                          dark:border-[#171b23]
                        "
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className="
                        truncate
                        text-sm
                        font-semibold
                        text-gray-900
                        dark:text-white
                      "
                      title={profileDetails?.fullName}
                    >
                      {profileDetails?.fullName || "User"}
                    </p>

                    <p
                      className="
                        mt-0.5
                        truncate
                        text-[11px]
                        text-gray-500
                        dark:text-gray-400
                      "
                      title={profileDetails?.email}
                    >
                      {profileDetails?.email || "No email available"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-1.5">
                <button
                  type="button"
                  onClick={handleAuth}
                  disabled={isLogoutLoading}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-2.5
                    text-left
                    text-sm
                    text-red-500
                    transition-all
                    duration-200
                    hover:bg-red-50
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    dark:text-red-400
                    dark:hover:bg-red-500/10
                  "
                >
                  <span
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-lg
                      bg-red-500/10
                    "
                  >
                    <LogOut size={16} />
                  </span>

                  <span className="flex-1">
                    {isLogoutLoading ? "Logging out..." : "Logout"}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
