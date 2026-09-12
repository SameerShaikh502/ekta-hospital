"use client";

import { useEffect, useState } from "react";

type HeaderProps = {
  onMenuClick: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
  const [role, setRole] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setRole(sessionStorage.getItem("UserRole") || "");
  }, []);

 const handleLogout = async () => {
  try {
    await fetch("/api/backend/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    sessionStorage.clear();
    localStorage.clear();

    window.location.replace("/login");
  }
};

  return (
    <header className="main-header">
      <div className="header-container">

        {/* LEFT */}
        <div className="header-brand">
          <span className="brand-text">MED CRM</span>

          <button
            type="button"
            className="sidebar-toggle"
            onClick={onMenuClick}
            aria-label="Toggle sidebar"
          >
            <i className="fa fa-bars" />
          </button>
        </div>

        {/* RIGHT */}
        <ul className="nav navbar-toolbar">
          <li className="dropdown dropdown-user">
            <button
              type="button"
              className="nav-link dropdown-toggle link"
              onClick={() => setOpen(!open)}
            >
              <img
                src="/assets/img/admin-avatar.png"
                alt="User"
              />

              {role && <span>{role}</span>}
            </button>

            {open && (
              <ul className="dropdown-menu dropdown-menu-right show">
                <li>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={handleLogout}
                  >
                    <i className="fa fa-power-off mr-1" />
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </li>
        </ul>

      </div>
    </header>
  );
}