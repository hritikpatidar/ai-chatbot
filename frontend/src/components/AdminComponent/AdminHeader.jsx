import { useEffect, useRef, useState } from "react";
import {
  Menu,
  Sun,
  Moon,
  Search,
  ChevronDown,
  LogOut,
  User,
  Building2,
  Ticket,
  CreditCard,
  Layers3,
  Receipt,
  LoaderCircle,
  X,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../../utils/logout";
import NotificationDropdown from "../common/NotificationDropdown";
import ConfirmModal from "../ClientComponent/ConfirmModal";
import LanguageSwitcher from "../common/LanguageSwitcher";
import { useLanguage } from "../../context/LanguageContext";
import { useAdminGlobalSearch } from "../../hooks/Admin/useAdminGlobalSearch";

const searchResultTypes = {
  client: { label: "Clients", icon: Building2 },
  ticket: { label: "Support tickets", icon: Ticket },
  subscription: { label: "Subscriptions", icon: CreditCard },
  plan: { label: "Subscription Plans", icon: Layers3 },
  transaction: { label: "Transactions", icon: Receipt },
};

export default function AdminHeader({ onMenuClick, collapsed }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const [logOutModalOpen, setLogOutModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeResultIndex, setActiveResultIndex] = useState(0);
  const { profileDetails, refreshToken } = useSelector(
    (store) => store.authReducer.AuthSlice,
  );
  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const fullName = profileDetails?.fullName || t("Administrator");
  const email = profileDetails?.email || "admin@example.com";
  const profileImage = profileDetails?.profileImage || "";
  const {
    data: searchResults = [],
    isFetching: isSearchLoading,
    isDebouncing: isSearchDebouncing,
    isError: isSearchError,
  } = useAdminGlobalSearch(searchValue, isSearchOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleSearchShortcut = (event) => {
      const target = event.target;
      const isTyping =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener("keydown", handleSearchShortcut);
    return () => document.removeEventListener("keydown", handleSearchShortcut);
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

  const handleSearchResultSelect = (result) => {
    setIsSearchOpen(false);
    setSearchValue("");
    searchInputRef.current?.blur();
    navigate(result.route);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Escape") {
      setIsSearchOpen(false);
      searchInputRef.current?.blur();
      return;
    }

    if (!searchResults.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveResultIndex((index) =>
        Math.min(index + 1, searchResults.length - 1),
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveResultIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      handleSearchResultSelect(searchResults[activeResultIndex] || searchResults[0]);
    }
  };

  return (
    <>
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
        <div className="flex min-w-0 flex-1 items-center gap-3">
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
              {t("Admin Dashboard")}
            </p>

            <p
              className="
              text-xs
              text-gray-500
              dark:text-gray-400
            "
            >
              {t("Manage your chatbot platform")}
            </p>
          </div>

          {/* Search */}

          <div
            ref={searchRef}
            className="
            relative
            flex
            flex-1
            min-w-0
            h-10
            items-center
            gap-2
            rounded-lg
            border
            border-gray-400
            bg-gray-50
            px-3
            dark:border-white/10
            dark:bg-white/3
            md:w-65
            md:flex-none
          "
          >
            <Search
              size={16}
              className="
              text-gray-600
              dark:text-gray-500
            "
            />

            <input
              ref={searchInputRef}
              type="text"
              value={searchValue}
              onFocus={() => setIsSearchOpen(true)}
              onChange={(event) => {
                setSearchValue(event.target.value);
                setActiveResultIndex(0);
                setIsSearchOpen(true);
              }}
              onKeyDown={handleSearchKeyDown}
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={isSearchOpen}
              aria-controls="admin-global-search-results"
              placeholder={t("Search admin records...")}
              autoComplete="off"
              className="
              min-w-0
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
              border-gray-400
              px-1.5
              py-0.5
              text-[10px]
              text-gray-600
              dark:border-white/10
            "
            >
              /
            </span>
            {searchValue && (
              <button
                type="button"
                onClick={() => {
                  setSearchValue("");
                  setActiveResultIndex(0);
                  searchInputRef.current?.focus();
                }}
                aria-label={t("Clear search")}
                className="rounded p-1 text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10"
              >
                <X size={14} />
              </button>
            )}

            {isSearchOpen && (
              <div
                id="admin-global-search-results"
                role="listbox"
                aria-label={t("Search results")}
                className="
                  fixed left-3 right-3 top-18 z-50 max-h-[70vh] overflow-y-auto
                  rounded-xl border border-gray-200 bg-white p-2 shadow-xl
                  dark:border-white/10 dark:bg-[#171b23]
                  md:absolute md:left-0 md:right-auto md:top-full md:mt-2
                  md:w-96
                "
              >
                {searchValue.trim().length < 2 ? (
                  <p className="px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    {t("Type at least 2 characters")}
                  </p>
                ) : isSearchDebouncing || isSearchLoading ? (
                  <div className="flex items-center justify-center gap-2 px-3 py-5 text-sm text-gray-500 dark:text-gray-400">
                    <LoaderCircle size={16} className="animate-spin" />
                    {t("Searching...")}
                  </div>
                ) : isSearchError ? (
                  <p role="alert" className="px-3 py-4 text-center text-sm text-red-600 dark:text-red-400">
                    {t("Search failed. Please try again.")}
                  </p>
                ) : searchResults.length === 0 ? (
                  <p className="px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    {t("No results found")}
                  </p>
                ) : (
                  <div className="space-y-1">
                    {searchResults.map((result, index) => {
                      const resultType =
                        searchResultTypes[result.type] || searchResultTypes.client;
                      const ResultIcon = resultType.icon;
                      const isActive = index === activeResultIndex;

                      return (
                        <button
                          key={`${result.type}-${result.id}`}
                          type="button"
                          role="option"
                          aria-selected={isActive}
                          onMouseEnter={() => setActiveResultIndex(index)}
                          onClick={() => handleSearchResultSelect(result)}
                          className={`
                            flex w-full min-w-0 items-center gap-3 rounded-lg
                            px-3 py-2.5 text-left transition-colors
                            ${
                              isActive
                                ? "bg-blue-50 dark:bg-blue-500/10"
                                : "hover:bg-gray-50 dark:hover:bg-white/5"
                            }
                          `}
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300">
                            <ResultIcon size={17} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-gray-900 dark:text-white">
                              {result.title}
                            </span>
                            <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                              {result.subtitle}
                            </span>
                          </span>
                          <span className="shrink-0 text-[10px] text-gray-400 dark:text-gray-500">
                            {t(resultType.label)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Notification */}

          {/* <button
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
        </button> */}
          <NotificationDropdown />

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
              aria-haspopup="true"
              aria-controls="admin-profile-menu"
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
                id="admin-profile-menu"
                className="
                absolute
                right-0
                top-12
                w-64
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

                <p className="px-3 pt-2.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  {t("Appearance")}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    toggleTheme();
                    setIsProfileOpen(false);
                  }}
                  className="
                    mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5
                    text-xs text-gray-600 hover:bg-gray-100
                    dark:text-gray-300 dark:hover:bg-white/5
                  "
                >
                  {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
                  {t(isDarkMode ? "Switch to light mode" : "Switch to dark mode")}
                </button>

                <div className="my-1 border-t border-gray-100 dark:border-white/10" />
                <p className="px-3 pt-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  {t("Language")}
                </p>
                <div className="px-2 py-1">
                  <LanguageSwitcher
                    className="w-full"
                    onLanguageChange={() => setIsProfileOpen(false)}
                  />
                </div>
                <div className="my-1 border-t border-gray-100 dark:border-white/10" />

                {/* Profile */}

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate("/admin/profile");
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
                  {t("Profile")}
                </button>

                {/* Logout */}

                <button
                  type="button"
                  onClick={() => setLogOutModalOpen(true)}
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
                  {t("Logout")}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <ConfirmModal
        isOpen={logOutModalOpen}
        onCancel={() => {
          setLogOutModalOpen(false);
        }}
        onConfirm={handleAuth}
        loading={isLogoutLoading}
        title={t("Logout Confirmation")}
        message={
          t("Are you sure you want to logout? You will need to login again to access your account.")
        }
        confirmText={isLogoutLoading ? t("Logging out...") : t("Logout")}
        cancelText={t("Cancel")}
        danger
      />
    </>
  );
}
