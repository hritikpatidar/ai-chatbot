import {
  User,
  ChevronRight,
  Shield,
  Bell,
  Palette,
  MessageSquare,
  SlidersHorizontal,
  Moon,
  LogOut,
  Lock,
  Sun,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import profile from "../assets/profile1.jpg";
import { useState } from "react";

import { motion } from "framer-motion";

import { handleLogout } from "../utils/logout";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import EditProfileModal from "../components/EditProfileModal";
import { setIsProfileModalOpen } from "../redux/features/Auth/authSlice";
import { getImageUrl } from "../utils/imageUrl";

const settingsSections = [
  {
    title: "Account",
    items: [
      {
        title: "Profile",
        description: "Manage your profile information",
        icon: User,
        route: "/profile",
      },
      {
        title: "Security",
        description: "Manage your password and account security",
        icon: Shield,
        route: "/security",
      },
    ],
  },
  {
    title: "Preferences",
    items: [
      {
        title: "Notifications",
        description: "Manage your notification preferences",
        icon: Bell,
      },
      {
        title: "Appearance",
        description: "Customize the look and feel of the application",
        icon: Palette,
      },
    ],
  },
  {
    title: "Chat",
    items: [
      {
        title: "Chat Preferences",
        description: "Manage your AI chat preferences",
        icon: MessageSquare,
      },
      {
        title: "Advanced Settings",
        description: "Manage advanced chatbot settings",
        icon: SlidersHorizontal,
      },
    ],
  },
];

export default function Settings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profileDetails, refreshToken } = useSelector(
    (store) => store.authReducer.AuthSlice,
  );
  const { isDarkMode, toggleTheme } = useTheme();
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const handleOpenProfileModal = () => {
    dispatch(setIsProfileModalOpen(true));
  };

  const handleAuth = async () => {
    await handleLogout({
      dispatch,
      navigate,
      setIsLogoutLoading,
      refreshToken,
    });
  };

  return (
    <div
      className="
        min-h-full
        w-full
        bg-transparent
        overflow-x-hidden
        text-gray-900
        transition-colors
        duration-300
        dark:text-white
      "
    >
      <div className="w-full px-3 py-5 sm:px-6 sm:py-6">
        <div>
          <h1
            className="
              text-2xl
              font-semibold
              text-gray-900
              dark:text-white
            "
          >
            Settings
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            Manage your account and application preferences.
          </p>
        </div>

        <div
          className="
            mt-6
            rounded-2xl
            border
            border-gray-200
            bg-white
            p-4
            transition
            hover:border-blue-500
            dark:border-white/10
            dark:bg-[#171b23]
          "
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="relative h-12 w-12 shrink-0">
                <img
                  src={getImageUrl(profileDetails?.profileImage, profile)}
                  alt="Profile"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = profile;
                  }}
                  className="h-12 w-12 rounded-full object-cover"
                />

                <span
                  className="
                    absolute
                    bottom-0
                    right-0
                    h-3
                    w-3
                    rounded-full
                    border-2
                    border-white
                    bg-green-500
                    dark:border-[#171b23]
                  "
                />
              </div>

              <div className="min-w-0">
                <h3
                  className="
                    truncate
                    text-sm
                    font-semibold
                    text-gray-900
                    dark:text-white
                  "
                >
                  {profileDetails?.fullName || "User"}

                  {profileDetails?.email && (
                    <span className="font-normal text-gray-500 dark:text-gray-400">
                      {" "}
                      ({profileDetails.email})
                    </span>
                  )}
                </h3>

                <p
                  className="
                    mt-1
                    text-xs
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Manage your profile information
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenProfileModal}
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                px-4
                py-2.5
                text-xs
                font-medium
                text-gray-700
                transition
                hover:bg-gray-100
                sm:w-auto
                dark:border-white/10
                dark:bg-white/5
                dark:text-gray-300
                dark:hover:bg-white/10
              "
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          {settingsSections.map((section) => (
            <div key={section.title}>
              <h2
                className="
                  mb-3
                  text-lg
                  font-semibold
                  text-gray-900
                  dark:text-white
                "
              >
                {section.title}
              </h2>

              <div className="grid gap-3">
                {section.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.title}
                      type="button"
                      className="
                        group
                        flex
                        w-full
                        items-center
                        gap-4
                        rounded-2xl
                        border
                        border-gray-200
                        bg-white
                        p-4
                        text-left
                        transition
                        hover:border-blue-500
                        dark:border-white/10
                        dark:bg-[#171b23]
                      "
                      onClick={() => navigate(item?.route)}
                    >
                      {/* Icon */}

                      <div
                        className="
                          flex
                          h-11
                          w-11
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-blue-500/10
                          text-blue-600
                          transition
                          group-hover:bg-blue-500/15
                          dark:text-blue-400
                        "
                      >
                        <Icon size={19} />
                      </div>

                      {/* Content */}

                      <div className="min-w-0 flex-1">
                        <h3
                          className="
                            text-sm
                            font-medium
                            text-gray-900
                            dark:text-white
                          "
                        >
                          {item.title}
                        </h3>

                        <p
                          className="
                            mt-1
                            text-xs
                            leading-5
                            text-gray-500
                            dark:text-gray-400
                          "
                        >
                          {item.description}
                        </p>
                      </div>

                      <ChevronRight
                        size={17}
                        className="
                          shrink-0
                          text-gray-400
                          transition
                          group-hover:translate-x-1
                          group-hover:text-blue-500
                          dark:text-gray-500
                          dark:group-hover:text-blue-400
                        "
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <div>
            <h2
              className="
                mb-3
                text-lg
                font-semibold
                text-gray-900
                dark:text-white
              "
            >
              Appearance
            </h2>

            <motion.div
              whileHover={{ scale: 1.005 }}
              transition={{ duration: 0.2 }}
              className="
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-4
                transition
                hover:border-blue-500
                dark:border-white/10
                dark:bg-[#171b23]
              "
            >
              <div className="flex items-center gap-4">
                {/* Icon */}

                <motion.div
                  animate={{
                    rotate: isDarkMode ? 0 : 180,
                  }}
                  transition={{
                    duration: 0.4,
                  }}
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-500/10
                    text-blue-600
                    dark:text-blue-400
                  "
                >
                  {isDarkMode ? (
                    <Sun
                      size={17}
                      className="
                           transition-transform
                           duration-300
                           group-hover:rotate-45
                         "
                    />
                  ) : (
                    <Moon
                      size={17}
                      className="
                           transition-transform
                           duration-300
                           group-hover:-rotate-12
                         "
                    />
                  )}
                </motion.div>

                {/* Content */}

                <div className="min-w-0 flex-1">
                  <h3
                    className="
                      text-sm
                      font-medium
                      text-gray-900
                      dark:text-white
                    "
                  >
                    Dark Mode
                  </h3>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    {isDarkMode
                      ? "Dark theme is currently enabled"
                      : "Dark theme is currently disabled"}
                  </p>
                </div>

                {/* Toggle */}

                <motion.button
                  type="button"
                  aria-label="Toggle dark mode"
                  onClick={toggleTheme}
                  whileTap={{ scale: 0.92 }}
                  className={`
                    relative
                    h-6
                    w-11
                    shrink-0
                    rounded-full
                    p-0.5
                    transition-colors
                    duration-300
                    ${isDarkMode ? "bg-blue-500" : "bg-gray-300"}
                  `}
                >
                  <motion.span
                    animate={{
                      x: isDarkMode ? 20 : 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                    className="
                      block
                      h-5
                      w-5
                      rounded-full
                      bg-white
                      shadow-md
                    "
                  />
                </motion.button>
              </div>
            </motion.div>
          </div>

          <div>
            <h2
              className="
                mb-3
                text-lg
                font-semibold
                text-gray-900
                dark:text-white
              "
            >
              Privacy
            </h2>

            <button
              type="button"
              className="
                group
                flex
                w-full
                items-center
                gap-4
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-4
                text-left
                transition
                hover:border-blue-500
                dark:border-white/10
                dark:bg-[#171b23]
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-500/10
                  text-blue-600
                  dark:text-blue-400
                "
              >
                <Lock size={19} />
              </div>

              <div className="min-w-0 flex-1">
                <h3
                  className="
                    text-sm
                    font-medium
                    text-gray-900
                    dark:text-white
                  "
                >
                  Privacy & Data
                </h3>

                <p
                  className="
                    mt-1
                    text-xs
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Manage your data and privacy preferences
                </p>
              </div>

              <ChevronRight
                size={17}
                className="
                  shrink-0
                  text-gray-400
                  transition
                  group-hover:translate-x-1
                  group-hover:text-blue-500
                  dark:text-gray-500
                  dark:group-hover:text-blue-400
                "
              />
            </button>
          </div>

          <div>
            <h2
              className="
                mb-3
                text-lg
                font-semibold
                text-gray-900
                dark:text-white
              "
            >
              Account
            </h2>

            <button
              type="button"
              onClick={handleAuth}
              disabled={isLogoutLoading}
              className="
                group
                flex
                w-full
                items-center
                gap-4
                rounded-2xl
                border
                border-red-200
                bg-white
                p-4
                text-left
                transition
                hover:border-red-400
                dark:border-red-500/10
                dark:bg-[#171b23]
                dark:hover:border-red-500/40
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-red-500/10
                  text-red-500
                  dark:text-red-400
                "
              >
                <LogOut size={19} />
              </div>

              <div className="min-w-0 flex-1">
                <h3
                  className="
                    text-sm
                    font-medium
                    text-red-500
                    dark:text-red-400
                  "
                >
                  {isLogoutLoading ? "Logging out..." : "Log Out"}
                </h3>

                <p
                  className="
                    mt-1
                    text-xs
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Sign out from your account
                </p>
              </div>

              <ChevronRight
                size={17}
                className="
                  shrink-0
                  text-gray-400
                  transition
                  group-hover:translate-x-1
                  group-hover:text-red-500
                  dark:text-gray-600
                  dark:group-hover:text-red-400
                "
              />
            </button>
          </div>
        </div>

        {/* Footer */}

        <div className="py-6 text-center">
          <p
            className="
              text-[11px]
              text-gray-500
              dark:text-gray-600
            "
          >
            Saviesa Infotech • AI Chatbot
          </p>
        </div>
      </div>

      <EditProfileModal />
    </div>
  );
}
