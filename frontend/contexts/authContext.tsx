"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { AuthState, User } from "@/types/auth";
import { deleteCookie, getCookie } from "@/lib/cookies";
import { decrypt } from "@/lib/crypto";

const AuthContext = createContext<{
  auth: AuthState;
  login: (user: User) => void;
  logout: () => void;
}>({
  auth: { user: null, isAuthenticated: false },
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const getAuthData = () => {
    let authData = getCookie("auth_user") || "";
    if (authData && typeof authData == "string") {
      const decodedAuthData = JSON.parse(decrypt(authData));
      return decodedAuthData;
    }
    return null;
  };
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  const login = (user: User) => {
    setAuth({ user, isAuthenticated: true });
  };

  const logout = () => {
    deleteCookie("auth_user");
    deleteCookie("auth_token");
    window.location.assign("/");
    setAuth({ user: null, isAuthenticated: false });
  };

  useEffect(() => {
    let data = getAuthData();
    if (data) login(data);
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
