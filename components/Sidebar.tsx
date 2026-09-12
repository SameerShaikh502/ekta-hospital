"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Menu = {
  MenuId: number;
  MenuName: string;
};

type SubMenu = {
  Menuid: number | string;
  SubMenuName: string;
  Pagename: string;
};

type MenuResponse = {
  IsSuccess?: boolean;
  Data?: {
    Table?: unknown[];
    Table1?: Menu[];
    Table2?: SubMenu[];
  };
};

type SidebarProps = {
  collapsed: boolean;
};

export default function Sidebar({ collapsed }: SidebarProps) {
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  const [menus, setMenus] = useState<Menu[]>([]);
  const [subMenus, setSubMenus] = useState<SubMenu[]>([]);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  // Mobile par sidebar hamesha collapsed rahega
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const isCollapsed = collapsed || isMobile;

  useEffect(() => {
    const storedUserName =
      sessionStorage.getItem("UserName") || "";

    const storedUserRole =
      sessionStorage.getItem("UserRole") || "";

    setUserName(storedUserName);
    setRole(storedUserRole);

    apiFetch<MenuResponse>("UserLogin/Getmenuinfobyuser")
      .then((response) => {
        const user = response.Data?.Table?.[0] as
          | {
              Id?: number;
              UserName?: string;
              Role?: string;
            }
          | undefined;

        if (user) {
          setUserName(user.UserName || storedUserName);
          setRole(user.Role || storedUserRole);

          if (user.UserName) {
            sessionStorage.setItem(
              "UserName",
              user.UserName
            );
          }

          if (user.Role) {
            sessionStorage.setItem(
              "UserRole",
              user.Role
            );
          }
        }

        setMenus(response.Data?.Table1 || []);
        setSubMenus(response.Data?.Table2 || []);
      })
      .catch((error) => {
        console.error("Error loading menu:", error);
      });
  }, []);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    menuId: number
  ) => {
    event.preventDefault();

    const isCurrentlyOpen = openMenu === menuId;

    setOpenMenu(isCurrentlyOpen ? null : menuId);
  };

  return (
    <nav
      className={`side-navbar ${
        isCollapsed ? "sidebar-collapsed" : ""
      }`}
    >
      {/* USER INFO */}

      <div className="side-menu-user">
        <div className="user-profile">
          <div className="user-avatar">
            <img
              src="/assets/img/admin-avatar.png"
              alt="User"
            />
          </div>

          {!isCollapsed && (
            <div className="user-info">
              <div className="user-role">
                {role || "User"}
              </div>

              <div className="user-name">
                {userName || "User"}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SIDEBAR MENU */}

      <ul
        className="side-menu metismenu"
        id="dynamicMenu"
      >
        {/* Dashboard */}

        <li>
          <Link
            href="/dashboard"
            title={isCollapsed ? "Dashboard" : undefined}
          >
            <i className="sidebar-item-icon fa fa-th-large" />

            {!isCollapsed && (
              <span className="nav-label">
                Dashboard
              </span>
            )}
          </Link>
        </li>

        {/* Features */}

        {!isCollapsed && (
          <li className="heading">
            FEATURES
          </li>
        )}

        {menus.map((menu) => {
          const children = subMenus.filter(
            (item) =>
              String(item.Menuid) ===
              String(menu.MenuId)
          );

          if (!children.length) {
            return null;
          }

          const isOpen = openMenu === menu.MenuId;

          return (
            <li
              className={`menu-item ${
                isOpen ? "open" : ""
              }`}
              key={menu.MenuId}
            >
              {/* MENU BUTTON */}

              <a
                href="#"
                className="menu-toggle"
                onClick={(event) =>
                  handleMenuClick(
                    event,
                    menu.MenuId
                  )
                }
                title={
                  isCollapsed
                    ? menu.MenuName
                    : undefined
                }
              >
                <i className="sidebar-item-icon fa fa-bookmark" />

                {!isCollapsed && (
                  <>
                    <span className="nav-label">
                      {menu.MenuName}
                    </span>

                    <i
                      className={`fa fa-angle-left arrow ${
                        isOpen ? "rotate" : ""
                      }`}
                    />
                  </>
                )}
              </a>

              {/* NORMAL SUBMENU */}

              {!isCollapsed && (
                <ul
                  className="nav-2-level submenu"
                  style={{
                    display: isOpen
                      ? "block"
                      : "none",
                  }}
                >
                  {children.map((child) => (
                    <li
                      key={`${menu.MenuId}-${child.Pagename}`}
                    >
                      <Link
                        href={`/userlogin/${child.Pagename}`}
                      >
                        {child.SubMenuName}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {/* COLLAPSED POPUP */}

              {isCollapsed && isOpen && (
                <div
                  className="collapsed-submenu"
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                >
                  <div className="collapsed-submenu-title">
                    {menu.MenuName}
                  </div>

                  {children.map((child) => (
                    <Link
                      key={`${menu.MenuId}-${child.Pagename}`}
                      href={`/userlogin/${child.Pagename}`}
                      className="collapsed-submenu-link"
                      onClick={() =>
                        setOpenMenu(null)
                      }
                    >
                      {child.SubMenuName}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
