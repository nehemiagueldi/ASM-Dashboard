import { useEffect, useState } from "react";

import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

function AuthGuard({ children }: Props) {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const sessionId = localStorage.getItem("sessionId");

      if (!sessionId) {
        setChecking(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/me`,
          {
            headers: {
              "x-session-id": sessionId,
            },
          },
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          localStorage.removeItem("sessionId");
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("user");

          setAuthenticated(false);
          return;
        }

        localStorage.setItem("user", JSON.stringify(result.data));

        localStorage.setItem("isLoggedIn", "true");

        setAuthenticated(true);
      } catch (error) {
        console.error("Auth check error:", error);

        setAuthenticated(false);
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, []);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-gray-950">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Checking authentication...
        </p>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default AuthGuard;
