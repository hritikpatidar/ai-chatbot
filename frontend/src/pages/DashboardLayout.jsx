import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import Sidebar from "../components/Sidebar";
import ChatHeader from "../components/Chat/ChatHeader";
import GuestHeader from "../components/ClientComponent/GuestHeader";
import AnimatedBackground from "../components/AnimatedBackground";

export default function DashboardLayout() {
  const location = useLocation();

  const { token, profileDetails } = useSelector(
    (state) => state?.authReducer?.AuthSlice,
  );

  const isAuthenticated =
    Boolean(token) && Boolean(profileDetails?._id);

  const isWelcomePage = location.pathname === "/";
  const isChatPage = location.pathname.startsWith("/c/");

  return (
    <div
      className="
        relative
        flex
        h-dvh
        min-h-0
        w-full
        overflow-hidden
        bg-gray-50
        text-gray-900
        dark:bg-[#0b0f17]
        dark:text-white
      "
    >
      <AnimatedBackground />

      {isAuthenticated && (
        <aside className="relative z-40 flex min-h-0 shrink-0">
          <Sidebar />
        </aside>
      )}

      <main
        className="
          relative
          z-10
          flex
          min-h-0
          min-w-0
          flex-1
          flex-col
          overflow-hidden
        "
      >
        {/* Authenticated Header */}
        {isAuthenticated ? (
          <header className="relative z-50 shrink-0">
            <ChatHeader />
          </header>
        ) : (
          /* Guest Header */
          <header className="relative z-50 shrink-0">
            <GuestHeader />
          </header>
        )}

        {/* Content */}
        <div
          className={`
            min-h-0
            min-w-0
            flex-1
            w-full

            ${
              isChatPage
                ? "overflow-hidden"
                : isWelcomePage
                  ? "overflow-y-auto"
                  : "overflow-y-auto"
            }
          `}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}