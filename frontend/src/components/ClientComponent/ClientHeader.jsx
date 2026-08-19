import { useSelector } from "react-redux";
import { Menu, Bell, Sun, Moon, User } from "lucide-react";

import { useTheme } from "../../context/ThemeContext";
import profile from "../../assets/profile1.jpg";
import { getImageUrl } from "../../utils/imageUrl";

export default function ClientHeader({ onMenuClick }) {
  const { profileDetails } = useSelector(
    (state) => state?.authReducer?.AuthSlice,
  );

  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header
      className="
        sticky
        top-0
        z-30
        flex
        h-18
        shrink-0
        items-center
        justify-between
        border-b
        border-gray-200
        bg-white/90
        px-4
        backdrop-blur-xl
        dark:border-white/10
        dark:bg-[#11151d]/90
        sm:px-6
      "
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="
            rounded-lg
            p-2
            text-gray-600
            hover:bg-gray-100
            dark:text-gray-300
            dark:hover:bg-white/10
            lg:hidden
          "
        >
          <Menu size={20} />
        </button>

        <div>
          <p className="text-sm font-medium">
            Welcome back, {profileDetails?.fullName?.split(" ")[0] || "Admin"}
            👋
          </p>

          <p className="hidden text-xs text-gray-500 dark:text-gray-400 sm:block">
            Manage your AI chatbot from here.
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Theme */}
        <button
          type="button"
          onClick={toggleTheme}
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-lg
            border
            border-gray-200
            bg-white
            text-gray-600
            transition
            hover:border-blue-500
            hover:text-blue-600
            dark:border-white/10
            dark:bg-[#171b23]
            dark:text-gray-300
            dark:hover:text-blue-400
          "
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Notification */}
        <button
          type="button"
          className="
            relative
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-lg
            border
            border-gray-200
            bg-white
            text-gray-600
            transition
            hover:border-blue-500
            hover:text-blue-600
            dark:border-white/10
            dark:bg-[#171b23]
            dark:text-gray-300
            dark:hover:text-blue-400
          "
        >
          <Bell size={17} />

          <span
            className="
              absolute
              right-2
              top-2
              h-1.5
              w-1.5
              rounded-full
              bg-red-500
            "
          />
        </button>

        {/* Profile */}
        <div
          className="
            ml-1
            hidden
            items-center
            gap-2
            rounded-lg
            border
            border-gray-200
            bg-white
            px-2
            py-1.5
            dark:border-white/10
            dark:bg-[#171b23]
            sm:flex
          "
        >
          <div
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              overflow-hidden
              rounded-full
              bg-blue-500/10
              text-xs
              font-semibold
              text-blue-600
              dark:text-blue-400
            "
          >
            {profileDetails?.profileImage ? (
              <img
                src={getImageUrl(profileDetails?.profileImage, profile)}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              profileDetails?.fullName?.charAt(0)?.toUpperCase() || "A"
            )}
          </div>

          <div className="max-w-30">
            <p className="truncate text-xs font-medium">
              {profileDetails?.fullName || "Admin"}
            </p>
          </div>
        </div>

        {/* Mobile profile icon */}
        <div
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-lg
            bg-blue-500/10
            text-blue-600
            dark:text-blue-400
            sm:hidden
          "
        >
          <User size={17} />
        </div>
      </div>
    </header>
  );
}
