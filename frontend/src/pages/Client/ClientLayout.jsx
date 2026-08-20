import { useState } from "react";
import { Outlet } from "react-router-dom";

import AnimatedBackground from "../../components/AnimatedBackground";
import ClientHeader from "../../components/ClientComponent/ClientHeader";
import ClientSidebar from "../../components/ClientComponent/ClientSidebar";

export default function ClientLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div
      className="
        relative
        flex
        min-h-screen
        w-full
        overflow-hidden
        bg-gray-50
        text-gray-900
        dark:bg-[#0b0f17]
        dark:text-white
      "
    >
      {/* Background */}
      {/* <AnimatedBackground /> */}

      {/* Sidebar */}
      <ClientSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main */}
      <main
        className="
          relative
          z-10
          flex
          h-screen
          min-w-0
          flex-1
          flex-col
          lg:ml-65
        "
      >
        {/* Fixed Header */}
        <div
          className="
            sticky
            top-0
            z-50
            shrink-0
          "
        >
          <ClientHeader onMenuClick={() => setMobileOpen(true)} />
        </div>

        {/* Only Page Content Scroll */}
        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
          "
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
