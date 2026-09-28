"use client";

import { useEffect, useState } from "react";
import { menuItems } from "./Menu";
import { useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

type NavbarProps = {
  onMenuClick: () => void;
};

type User = {
  username: string;
  role: string;
};

function Navbar({ onMenuClick }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const activeMenu = menuItems.find((item) => {
    return location.pathname === item.href;
  });

  const pageTitle = activeMenu?.label ?? "Dashboard";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Gagal membaca data user:", error);
      }
    }
  }, []);

  const handleLogout = async () => {
    const sessionId = localStorage.getItem("sessionId");

    try {
      if (sessionId) {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/logout`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-session-id": sessionId,
            },
          },
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Gagal logout");
        }
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      localStorage.removeItem("sessionId");

      navigate("/", { replace: true });
    }
  };

  const username = user?.username ?? "User";
  const role = user?.role ?? "User";

  return (
    <div>
      <header className="fixed left-0 right-0 top-0 z-10 h-16 border-b bg-slate-100 dark:border-gray-800 dark:bg-gray-900 md:left-56">
        <div className="flex h-full items-center justify-between px-4 md:px-6">
          {/* Left */}
          <div className="flex items-center gap-3">
            {/* Hamburger Mobile */}
            <button
              type="button"
              onClick={onMenuClick}
              className="rounded-lg p-2 hover:bg-gray-100 md:hidden dark:text-white"
              aria-label="Open menu"
            >
              ☰
            </button>

            <h2 className="text-lg font-semibold dark:text-white">
              {pageTitle}
            </h2>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Profile */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-200 dark:hover:bg-gray-800 transition cursor-pointer"
              >
                {/* Avatar */}
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 font-medium text-gray-700">
                  {username.charAt(0).toUpperCase()}
                </div>

                {/* User Info */}
                <div className="hidden text-left md:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {username.charAt(0).toUpperCase() +
                      username.slice(1).toLowerCase()}
                  </p>

                  <p className="text-xs text-gray-500 dark:text-gray-300">
                    {role}
                  </p>
                </div>
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border bg-white p-2 shadow-lg">
                  {/* User Info Mobile */}
                  <div className="border-b px-3 py-2 md:hidden">
                    <p className="text-sm font-medium text-gray-900">
                      {username.charAt(0).toUpperCase() +
                        username.slice(1).toLowerCase()}
                    </p>

                    <p className="text-xs text-gray-500">{role}</p>
                  </div>

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-1 flex w-full items-center rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition cursor-pointer font-medium"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Navbar;
