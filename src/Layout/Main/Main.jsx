import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const Main = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setIsMobile(true);
        setCollapsed(true); // start collapsed on mobile
      } else {
        setIsMobile(false);
        setCollapsed(false); // expanded on desktop
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen w-full flex bg-baseBg overflow-hidden relative">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
      />

      {/* Overlay on mobile */}
      {isMobile && !collapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30"
          onClick={() => setCollapsed(true)}
        ></div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col transition-all duration-300 overflow-hidden border-l border-primary">
        {/* Header */}
        <Header
          toggleSidebar={() => setCollapsed(!collapsed)}
          isMobile={isMobile}
        />

        {/* Page Content */}
        <div className="flex-1 mt-6 overflow-y-auto overflow-x-hidden bg-baseBg rounded-md">
          <div className="w-full p-7 pt-0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
