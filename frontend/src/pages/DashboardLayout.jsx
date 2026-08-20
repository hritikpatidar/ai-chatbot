import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import ChatHeader from "../components/Chat/ChatHeader";
import AnimatedBackground from "../components/AnimatedBackground";

export default function DashboardLayout() {
  const location = useLocation();

  const { token, profileDetails } = useSelector(
    (state) => state?.authReducer?.AuthSlice,
  );

  const isAuthenticated = Boolean(token) && Boolean(profileDetails?._id);

  const isWelcomePage = location.pathname === "/";
  const isChatPage = location.pathname.startsWith("/c/");

  return (
    <div
      className={`
        relative
        flex
        ${isAuthenticated ? "h-screen" : "h-full"}
        w-full
        overflow-hidden
        bg-gray-50
        text-gray-900
        transition-colors
        duration-300
        dark:bg-[#0b0f17]
        dark:text-white
      `}
    >
      <AnimatedBackground />

      {isAuthenticated && (
        <div className="relative z-40 shrink-0">
          <Sidebar />
        </div>
      )}

      <main
        className="
          relative
          z-10
          flex
          h-full
          min-h-0
          min-w-0
          flex-1
          flex-col
          overflow-hidden
          bg-gray-50/80
          transition-colors
          duration-300
          dark:bg-[#0b0f17]/80
        "
      >
        {isAuthenticated && (
          <div className="relative z-50 shrink-0">
            <ChatHeader />
          </div>
        )}

        <div
          className={`
            min-h-0
            min-w-0
            flex-1
            w-full
            bg-transparent

            ${
              isWelcomePage
                ? "overflow-y-auto overscroll-contain"
                : isChatPage
                  ? "overflow-hidden"
                  : "overflow-y-auto"
            }

            ${
              isWelcomePage || isChatPage
                ? ""
                : "px-4 sm:px-6 lg:px-10 xl:px-15"
            }
          `}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}