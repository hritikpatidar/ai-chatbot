import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ChatHeader from "../components/Chat/ChatHeader";
import { motion } from "framer-motion";
import AnimatedBackground from "../components/AnimatedBackground";

export default function DashboardLayout() {
  const location = useLocation();

  const showHeader =
    location.pathname === "/" ||
    location.pathname.startsWith("/c/");

  return (
    <div
      className="
        relative
        flex
        h-screen
        w-full
        overflow-hidden
        bg-gray-50
        text-gray-900
        transition-colors
        duration-300
        dark:bg-[#0b0f17]
        dark:text-white
      "
    >
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Sidebar */}
      <div className="relative z-20 shrink-0">
        <Sidebar />
      </div>

      {/* Main Area */}
      <main
        className="
          relative
          z-10
          flex
          h-full
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
        {/* Header */}
          <div className="relative z-30 shrink-0">
            <ChatHeader />
          </div>

        {/* Page Content */}
        <div
          className={`
            h-full
            w-full
            overflow-y-auto
            bg-transparent
            transition-colors
            duration-300
            ${
              location.pathname.startsWith("/c/")
                ? ""
                : "px-15"
            }
          `}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
