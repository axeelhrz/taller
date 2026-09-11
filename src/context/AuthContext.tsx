"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AUTH_EVENT,
  isAuthenticated,
  readCredentials,
  setAuthenticated,
  verifyLogin,
  writeCredentials,
} from "@/lib/auth-store";

type AuthContextValue = {
  ready: boolean;
  authenticated: boolean;
  username: string;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  changeCredentials: (username: string, password: string) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuth] = useState(false);
  const [username, setUsername] = useState("wilson");

  const refresh = useCallback(() => {
    setAuth(isAuthenticated());
    setUsername(readCredentials().username);
  }, []);

  useEffect(() => {
    refresh();
    setReady(true);
    const onUpdate = () => refresh();
    window.addEventListener(AUTH_EVENT, onUpdate);
    return () => window.removeEventListener(AUTH_EVENT, onUpdate);
  }, [refresh]);

  const login = useCallback((user: string, password: string) => {
    const ok = verifyLogin(user, password);
    if (ok) {
      setAuthenticated(true);
      setAuth(true);
      setUsername(readCredentials().username);
    }
    return ok;
  }, []);

  const logout = useCallback(() => {
    setAuthenticated(false);
    setAuth(false);
  }, []);

  const changeCredentials = useCallback((user: string, password: string) => {
    writeCredentials(user, password);
    setUsername(user.trim().toLowerCase());
  }, []);

  const value = useMemo(
    () => ({
      ready,
      authenticated,
      username,
      login,
      logout,
      changeCredentials,
    }),
    [ready, authenticated, username, login, logout, changeCredentials],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
