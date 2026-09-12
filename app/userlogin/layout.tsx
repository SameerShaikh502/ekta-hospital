"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function UserLoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div
      className={`fixed-navbar has-animation page-wrapper ${
        sidebarCollapsed ? "sidebar-is-collapsed" : ""
      }`}
    >
      <Header
        onMenuClick={() => {
          setSidebarCollapsed((prev) => !prev);
        }}
      />

      <Sidebar collapsed={sidebarCollapsed} />

      <div
        className={`content-wrapper ${
          sidebarCollapsed ? "content-expanded" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}