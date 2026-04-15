import { createContext, useContext, useEffect, useState } from "react";

import {
  apiRequest,
  clearAdminToken,
  getAdminToken,
  setAdminToken,
} from "@/lib/api-client";
import type { AdminUser } from "@/lib/content-types";

interface AuthContextType {
  user: AdminUser | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      setLoading(false);
      return;
    }

    apiRequest<{ admin: AdminUser }>("/admin/me", { auth: true })
      .then(({ admin }) => setUser(admin))
      .catch(() => {
        clearAdminToken();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiRequest<{ token: string; admin: AdminUser }>(
        "/admin/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        },
      );

      setAdminToken(response.token);
      setUser(response.admin);
      return { error: null };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Login failed. Please try again.";
      return { error: new Error(message) };
    }
  };

  const signOut = async () => {
    clearAdminToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: Boolean(user),
        loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
