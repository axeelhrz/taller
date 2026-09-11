"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DEFAULT_PANEL_USER } from "@/lib/auth-defaults";
import {
  listenAuth,
  loginWithUsername,
  logoutFirebase,
  updatePanelCredentials,
  usernameFromEmail,
} from "@/lib/firebase/auth";

type AuthContextValue = {
  ready: boolean;
  authenticated: boolean;
  username: string;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  changeCredentials: (
    username: string,
    password: string,
    currentPassword: string,
  ) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuth] = useState(false);
  const [username, setUsername] = useState(DEFAULT_PANEL_USER);

  useEffect(() => {
    const unsub = listenAuth((user) => {
      setAuth(Boolean(user));
      setUsername(usernameFromEmail(user?.email));
      setReady(true);
    });
    return () => unsub();
  }, []);

  const login = useCallback(async (user: string, password: string) => {
    try {
      const logged = await loginWithUsername(user, password);
      setAuth(true);
      setUsername(usernameFromEmail(logged.email));
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    await logoutFirebase();
    setAuth(false);
  }, []);

  const changeCredentials = useCallback(
    async (user: string, password: string, currentPassword: string) => {
      await updatePanelCredentials(currentPassword, user, password);
      await logoutFirebase();
      setAuth(false);
      setUsername(user.trim().toLowerCase());
    },
    [],
  );

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
