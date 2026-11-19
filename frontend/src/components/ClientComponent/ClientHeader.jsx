import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Menu, Sun, Moon, User } from "lucide-react";

import { useTheme } from "../../context/ThemeContext";
import profile from "../../assets/profile1.jpg";
import { getImageUrl } from "../../utils/imageUrl";
import NotificationDropdown from "../common/NotificationDropdown";
import LanguageSwitcher from "../common/LanguageSwitcher";
import { useLanguage } from "../../context/LanguageContext";

export default function ClientHeader({ onMenuClick }) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const { profileDetails } = useSelector(
    (state) => state?.authReducer?.AuthSlice,
  );
  const { client } = useSelector(
    (state) => state?.ClientReducer?.clientSlice || {},
  );
  const { isDarkMode, toggleTheme } = useTheme();
  const { t } = useLanguage();

  useEffect(() => {
    if (!isProfileMenuOpen) return;

    const handlePointerDown = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isProfileMenuOpen]);

  return (
    <header
      className="
        sticky
        top-0
        z-30
        flex
        w-full
        min-w-0
        h-18
        shrink-0
        items-center
        justify-between
        gap-2
        border-b
        border-gray-200
        bg-white/90
        px-3
        backdrop-blur-xl
        dark:border-white/10
        dark:bg-[#11151d]/90
        sm:px-6
      "
    >
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="
            rounded-lg
            p-2
            shrink-0
            text-gray-600
            hover:bg-gray-100
            dark:text-gray-300
            dark:hover:bg-white/10
            lg:hidden
          "
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0">
          <p className="truncate text-xs font-medium sm:text-sm">
            {t("Welcome back, {name}", {
              name: profileDetails?.fullName?.split(" ")[0] || "Admin",
            })}
            👋
          </p>

          <p className="hidden text-xs text-gray-500 dark:text-gray-400 sm:block">
            {t("Manage your AI chatbot from here.")}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
        {/* Notification */}
        <NotificationDropdown />

        {/* Profile */}
        <div
          ref={profileMenuRef}
          className="relative"
        >
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen((isOpen) => !isOpen)}
            aria-label={t("Profile settings")}
            aria-haspopup="true"
            aria-expanded={isProfileMenuOpen}
            aria-controls="client-profile-menu"
            className="
              hidden items-center gap-2 rounded-lg border border-gray-200
              bg-white px-2 py-1.5 transition hover:border-blue-500
              dark:border-white/10 dark:bg-[#171b23] sm:flex
            "
          >
            <span
              className="
                flex h-7 w-7 items-center justify-center overflow-hidden
                rounded-full bg-blue-500/10 text-xs font-semibold text-blue-600
                dark:text-blue-400
              "
            >
              {profileDetails?.profileImage ? (
                <img
                  src={getImageUrl(profileDetails.profileImage, profile)}
                  alt={t("Profile")}
                  className="h-full w-full object-cover"
                />
              ) : (
                profileDetails?.fullName?.charAt(0)?.toUpperCase() || "A"
              )}
            </span>
            <span className="max-w-36 min-w-0 text-left">
              <span className="block truncate text-xs font-medium">
                {profileDetails?.fullName || t("Admin")}
              </span>
              <span className="block truncate text-[10px] text-gray-500 dark:text-gray-400">
                {`${client?.active_plan || t("Free")} ${t("Plan")}`}
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsProfileMenuOpen((isOpen) => !isOpen)}
            aria-label={t("Profile settings")}
            aria-haspopup="true"
            aria-expanded={isProfileMenuOpen}
            aria-controls="client-profile-menu"
            className="
              flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
              bg-blue-500/10 text-blue-600 dark:text-blue-400 sm:hidden
            "
          >
            <User size={17} />
          </button>

          {isProfileMenuOpen && (
            <div
              id="client-profile-menu"
              className="
                absolute right-0 top-full z-50 mt-2 w-64
                rounded-xl border border-gray-200 bg-white p-3 shadow-xl
                dark:border-white/10 dark:bg-[#171b23]
              "
            >
              <p className="mb-2 px-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                {t("Appearance")}
              </p>
              <button
                type="button"
                onClick={() => {
                  toggleTheme();
                  setIsProfileMenuOpen(false);
                }}
                className="
                  flex w-full items-center gap-3 rounded-lg px-3 py-2.5
                  text-left text-sm text-gray-700 hover:bg-gray-100
                  dark:text-gray-200 dark:hover:bg-white/5
                "
              >
                {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
                {t(isDarkMode ? "Switch to light mode" : "Switch to dark mode")}
              </button>
              <div className="my-3 border-t border-gray-200 dark:border-white/10" />
              <p className="mb-2 px-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                {t("Language")}
              </p>
              <LanguageSwitcher
                className="w-full"
                onLanguageChange={() => setIsProfileMenuOpen(false)}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
