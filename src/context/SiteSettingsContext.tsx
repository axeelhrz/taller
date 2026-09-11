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
  defaultSiteSettings,
  type FormSettings,
  type SiteSettings,
  type SiteSettingsInput,
} from "@/lib/site-settings";
import type { WorkshopContact } from "@/lib/contact";
import {
  listenSettings,
  saveSettingsToFirestore,
} from "@/lib/firebase/data";
import { initAnalytics } from "@/lib/firebase/client";

type SiteSettingsContextValue = {
  contact: WorkshopContact;
  form: FormSettings;
  ready: boolean;
  updateSettings: (input: SiteSettingsInput) => Promise<void>;
  refresh: () => Promise<void>;
};

const SiteSettingsContext = createContext<SiteSettingsContextValue | null>(
  null,
);

export function SiteSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void initAnalytics();

    const unsub = listenSettings(
      (next) => {
        setSettings(next);
        setReady(true);
      },
      () => setReady(true),
    );
    return () => unsub();
  }, []);

  const updateSettings = useCallback(async (input: SiteSettingsInput) => {
    const next = await saveSettingsToFirestore(input);
    setSettings(next);
  }, []);

  const refresh = useCallback(async () => {
    // onSnapshot keeps data live; no-op for compatibility
  }, []);

  const value = useMemo(
    () => ({
      contact: settings.contact,
      form: settings.form,
      ready,
      updateSettings,
      refresh,
    }),
    [settings, ready, updateSettings, refresh],
  );

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) {
    throw new Error("useSiteSettings must be used within SiteSettingsProvider");
  }
  return ctx;
}
