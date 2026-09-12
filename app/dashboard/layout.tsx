"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const userId = sessionStorage.getItem("UserId");

      if (!userId) {
        sessionStorage.clear();

        router.replace("/login");
        return;
      }

      setCheckingAuth(false);
    };

    checkAuth();
  }, [router]);

 
  if (checkingAuth) {
    return null;
  }

  return (
   <div
      className={`fixed-navbar has-animation page-wrapper ${
        sidebarCollapsed ? "sidebar-is-collapsed" : ""
      }`}
    >
      <Header
        onMenuClick={() =>
          setSidebarCollapsed((prev) => !prev)
        }
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