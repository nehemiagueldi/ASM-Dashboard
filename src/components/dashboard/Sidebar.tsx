"use client";

import { useLocation, Link } from "react-router-dom";
import { useState } from "react";
import { menuItems } from "./Menu";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (label: string) => {
    setOpenMenu((current) => (current === label ? null : label));
  };

  return (
    <>
      {/* Overlay Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen w-56
          border-r bg-slate-100 dark:border-gray-800 dark:bg-gray-900
          transition-transform duration-300
          md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b px-6 dark:border-gray-800 dark:bg-gray-900">
          <h1 className="text-xl font-bold dark:text-white">ASM Dashboard</h1>
        </div>

        {/* Menu */}
        <nav className="p-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              // =========================
              // MENU DENGAN CHILDREN
              // =========================

              if (item.children) {
                const isChildActive = item.children.some(
                  (child) =>
                    location.pathname === child.href ||
                    location.pathname.startsWith(`${child.href}/`),
                );

                const isOpenMenu = openMenu === item.label;

                return (
                  <div key={item.label}>
                    {/* Parent */}
                    <button
                      type="button"
                      onClick={() => toggleMenu(item.label)}
                      className={`
                        flex w-full items-center justify-between
                        rounded-lg px-3 py-2 text-sm
                        transition cursor-pointer
                        ${
                          isChildActive
                            ? "bg-slate-200 font-semibold text-black dark:bg-gray-800 dark:text-white"
                            : "text-gray-600 hover:bg-slate-200 hover:text-black dark:hover:bg-gray-800 dark:text-white dark:hover:text-white"
                        }
                      `}
                    >
                      <span>{item.label}</span>

                      <span
                        className={`
                          text-xs transition-transform
                          ${isOpenMenu ? "rotate-180" : ""}
                        `}
                      >
                        ▼
                      </span>
                    </button>

                    {/* Children */}
                    {isOpenMenu && (
                      <div className="mt-1 ml-3 space-y-1 border-l pl-3 transition dark:border-white">
                        {item.children.map((child) => {
                          const isActive = location.pathname === child.href;

                          return (
                            <Link
                              key={child.href}
                              to={child.href}
                              onClick={onClose}
                              className={`
                                block rounded-lg px-3 py-2 text-sm
                                transition
                                ${
                                  isActive
                                    ? "bg-slate-200 font-semibold text-black dark:bg-gray-800 dark:text-white"
                                    : "text-gray-500 hover:bg-slate-200 hover:text-black dark:hover:bg-gray-800 dark:text-white dark:hover:text-white"
                                }
                              `}
                            >
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              // =========================
              // MENU BIASA
              // =========================

              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className={`
                    block rounded-lg px-3 py-2 text-sm
                    transition
                    ${
                      isActive
                        ? "bg-slate-200 font-semibold text-black dark:bg-gray-800 dark:text-white"
                        : "text-gray-600 hover:bg-slate-200 hover:text-black dark:hover:bg-gray-800 dark:text-white dark:hover:text-white"
                    }
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
