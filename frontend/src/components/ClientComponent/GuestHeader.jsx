import { useState } from "react";
import { Menu, X, LogIn, MessageCircle, Moon, Sun, Bot } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useSelector } from "react-redux";

export default function GuestHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const { logo, setLogo } = useState("");
  const {
    messages,
    newMessageLoading,
    isSendDisable,
    clientConfig,
    clientConfigLoading,
    clientConfigError,
  } = useSelector((store) => store.chatSlice);
  debugger;
  const chatbotName = `${clientConfig?.businessName || "AI"} Assistant`;

  const handleLogin = () => {
    setIsMenuOpen(false);
    onLogin?.();
  };

  const handleNewChat = () => {
    setIsMenuOpen(false);
    onNewChat?.();
  };

  return (
    <header
      className="
        sticky top-0 z-40
        w-full
        border-b
        border-gray-200/80
        bg-white/90
        backdrop-blur-xl
        dark:border-white/10
        dark:bg-[#0f131a]/90
      "
    >
      <div
        className="
          mx-auto
          flex
          h-16
          w-full
          max-w-7xl
          items-center
          justify-between
          px-4
          sm:px-6
          lg:px-8
        "
      >
        {/* =================================================
            LOGO / BUSINESS NAME
        ================================================= */}

        <button
          type="button"
          onClick={handleNewChat}
          className="
            flex
            min-w-0
            items-center
            gap-2.5
            rounded-xl
            outline-none
          "
        >
          {/* Logo */}
          {logo ? (
            <img
              src={logo}
              alt={chatbotName}
              className="
                h-9
                w-9
                shrink-0
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
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-blue-600
                text-white
                shadow-sm
                dark:bg-blue-500
              "
            >
              <Bot size={19} />
            </div>
          )}

          {/* Business name */}
          <div className="min-w-0 text-left">
            <p
              className="
                max-w-40
                truncate
                text-sm
                font-semibold
                text-gray-900
                dark:text-white
                sm:max-w-55
              "
            >
              {chatbotName}
            </p>

            <p
              className="
                hidden
                text-[10px]
                text-gray-400
                dark:text-gray-500
                sm:block
              "
            >
              Your trusted business assistant
            </p>
          </div>
        </button>

        {/* =================================================
            DESKTOP ACTIONS
        ================================================= */}

        <div className="hidden items-center gap-2 sm:flex">
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

          {/* Login */}
          {/* <button
            type="button"
            onClick={handleLogin}
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-blue-600
              px-4
              py-2.5
              text-xs
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-blue-700
              active:scale-[0.98]
              dark:bg-blue-500
              dark:hover:bg-blue-600
            "
          >
            <LogIn size={15} />
            Login
          </button> */}
        </div>

        {/* =================================================
            MOBILE ACTIONS
        ================================================= */}

        <div className="flex items-center gap-1 sm:hidden">
          {/* Theme */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              text-gray-600
              transition
              hover:bg-gray-100
              dark:text-gray-300
              dark:hover:bg-white/5
            "
          >
            {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Menu */}
          {/* <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Open menu"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              text-gray-700
              transition
              hover:bg-gray-100
              dark:text-gray-300
              dark:hover:bg-white/5
            "
          >
            {isMenuOpen ? <X size={19} /> : <Menu size={19} />}
          </button> */}
        </div>
      </div>

      {/* =================================================
          MOBILE MENU
      ================================================= */}

      {isMenuOpen && (
        <div
          className="
            border-t
            border-gray-200
            bg-white
            px-4
            py-3
            sm:hidden
            dark:border-white/10
            dark:bg-[#11151d]
          "
        >
          <div className="space-y-1.5">
            {/* New Chat */}
            <button
              type="button"
              onClick={handleNewChat}
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
                font-medium
                text-gray-700
                transition
                hover:bg-gray-100
                dark:text-gray-300
                dark:hover:bg-white/5
              "
            >
              <MessageCircle size={17} />
              New Chat
            </button>

            {/* Login */}
            <button
              type="button"
              onClick={handleLogin}
              className="
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-blue-600
                px-4
                py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-blue-700
                dark:bg-blue-500
                dark:hover:bg-blue-600
              "
            >
              <LogIn size={16} />
              Login
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
