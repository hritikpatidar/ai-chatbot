import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ChatHeader from "../components/Chat/ChatHeader";
import { motion } from "framer-motion";
import AnimatedBackground from "../components/AnimatedBackground";

export default function DashboardLayout() {
  const location = useLocation();

  const showHeader =
    location.pathname === "/" || location.pathname.startsWith("/c/");

  return (
    <div className="flex h-screen bg-[#0b0f17] text-white">
      <AnimatedBackground />
      <Sidebar />
      <main className="flex-1 flex flex-col items-center relative z-10">
        {/* {showHeader && <ChatHeader />} */}
        <ChatHeader />

        <div className={`h-full overflow-y-auto w-full ${location.pathname.startsWith("/c/") && "pt-15"}`}>
          <Outlet />
        </div>
        
        {/* <div className="flex-1 overflow-hidden w-full pt-15">
          <Outlet />
        </div> */}
      </main>
    </div>
  );
}
