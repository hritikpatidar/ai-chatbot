import React, { useEffect, useRef, useState } from "react";
import {
  Menu,
  Sun,
  Moon,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../../utils/logout";

export default function AdminHeader({ onMenuClick, collapsed }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { profileDetails, refreshToken } = useSelector(
    (store) => store.authReducer.AuthSlice,
  );
  const profileRef = useRef(null);
  const fullName = profileDetails?.fullName || "Administrator";
  const email = profileDetails?.email || "admin@example.com";
  const profileImage = profileDetails?.profileImage || "";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileToggle = () => {
    setIsProfileOpen((previous) => !previous);
  };

  const handleAuth = async () => {
    await handleLogout({
      dispatch,
      navigate,
      setIsProfileOpen,
      setIsLogoutLoading,
      refreshToken,
    });
  };

  return (
    <header
      className={`
        fixed
        right-0
        top-0
        z-30
        flex
        h-18
        items-center
        justify-between
        border-b
        border-gray-200
        bg-white/95
        px-4
        backdrop-blur
        transition-all
        duration-300
        dark:border-white/10
        dark:bg-[#11151d]/95
        sm:px-6

        ${collapsed ? "lg:left-19.5" : "lg:left-65"}

        left-0
      `}
    >

      <div className="flex items-center gap-3">
        {/* Mobile Menu */}

        <button
          type="button"
          onClick={onMenuClick}
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-lg
            text-gray-600
            hover:bg-gray-100
            dark:text-gray-300
            dark:hover:bg-white/5
            lg:hidden
          "
        >
          <Menu size={20} />
        </button>

        {/* Dashboard Title */}

        <div className="hidden sm:block">
          <p
            className="
              text-sm
              font-semibold
              text-gray-900
              dark:text-white
            "
          >
            Admin Dashboard
          </p>

          <p
            className="
              text-xs
              text-gray-500
              dark:text-gray-400
            "
          >
            Manage your chatbot platform
          </p>
        </div>

        {/* Search */}

        <div
          className="
            hidden
            h-10
            w-65
            items-center
            gap-2
            rounded-lg
            border
            border-gray-200
            bg-gray-50
            px-3
            md:flex
            dark:border-white/10
            dark:bg-white/3
          "
        >
          <Search
            size={16}
            className="
              text-gray-400
              dark:text-gray-500
            "
          />

          <input
            type="text"
            placeholder="Search..."
            className="
              w-full
              bg-transparent
              text-sm
              text-gray-900
              outline-none
              placeholder:text-gray-400
              dark:text-white
            "
          />

          <span
            className="
              rounded
              border
              border-gray-200
              px-1.5
              py-0.5
              text-[10px]
              text-gray-400
              dark:border-white/10
            "
          >
            /
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme */}

        <button
          type="button"
          onClick={toggleTheme}
          title="Toggle theme"
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-lg
            text-gray-600
            transition
            hover:bg-gray-100
            dark:text-gray-300
            dark:hover:bg-white/5
          "
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notification */}

        <button
          type="button"
          className="
            relative
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-lg
            text-gray-600
            transition
            hover:bg-gray-100
            dark:text-gray-300
            dark:hover:bg-white/5
          "
        >
          <Bell size={18} />

          <span
            className="
              absolute
              right-2
              top-2
              h-2
              w-2
              rounded-full
              bg-red-500
              ring-2
              ring-white
              dark:ring-[#11151d]
            "
          />
        </button>

        {/* Divider */}

        <div
          className="
            hidden
            h-8
            w-px
            bg-gray-200
            sm:block
            dark:bg-white/10
          "
        />

        <div ref={profileRef} className="relative">
          {/* Profile Button */}

          <button
            type="button"
            onClick={handleProfileToggle}
            aria-expanded={isProfileOpen}
            className="
              flex
              items-center
              gap-2
              rounded-lg
              p-1.5
              transition
              hover:bg-gray-100
              dark:hover:bg-white/5
            "
          >
            {/* Profile Image */}

            {profileImage ? (
              <img
                src={profileImage}
                alt={fullName}
                className="
                  h-9
                  w-9
                  rounded-lg
                  object-cover
                "
              />
            ) : (
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  bg-blue-600
                  text-sm
                  font-semibold
                  text-white
                "
              >
                {fullName.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Name + Email */}

            <div className="hidden text-left md:block">
              <p
                className="
                  max-w-32.5
                  truncate
                  text-xs
                  font-semibold
                  text-gray-900
                  dark:text-white
                "
              >
                {fullName}
              </p>

              <p
                className="
                  max-w-32.5
                  truncate
                  text-[10px]
                  text-gray-500
                  dark:text-gray-400
                "
              >
                {email}
              </p>
            </div>

            {/* Arrow */}

            <ChevronDown
              size={15}
              className={`
                hidden
                text-gray-400
                transition-transform
                duration-200
                md:block

                ${isProfileOpen ? "rotate-180" : ""}
              `}
            />
          </button>

          {isProfileOpen && (
            <div
              className="
                absolute
                right-0
                top-12
                w-52
                rounded-xl
                border
                border-gray-200
                bg-white
                p-1.5
                shadow-xl
                dark:border-white/10
                dark:bg-[#171b23]
              "
            >
              {/* User Information */}

              <div
                className="
                  border-b
                  border-gray-100
                  px-3
                  py-2.5
                  dark:border-white/10
                "
              >
                <p
                  className="
                    truncate
                    text-xs
                    font-semibold
                    text-gray-900
                    dark:text-white
                  "
                >
                  {fullName}
                </p>

                <p
                  className="
                    truncate
                    text-[10px]
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  {email}
                </p>
              </div>

              {/* Profile */}

              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate('/admin/profile')
                }}
                className="
                  mt-1
                  flex
                  w-full
                  items-center
                  gap-2
                  rounded-lg
                  px-3
                  py-2.5
                  text-xs
                  text-gray-600
                  hover:bg-gray-100
                  dark:text-gray-300
                  dark:hover:bg-white/5
                "
              >
                <User size={15} />
                Profile
              </button>

              {/* Logout */}

              <button
                type="button"
                onClick={handleAuth}
                disabled={isLogoutLoading}
                className="
                  flex
                  w-full
                  items-center
                  gap-2
                  rounded-lg
                  px-3
                  py-2.5
                  text-xs
                  text-red-500
                  hover:bg-red-50
                  dark:hover:bg-red-500/10
                "
              >
                <LogOut size={15} />
                {isLogoutLoading ? "Logging out..." : "Logout"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
