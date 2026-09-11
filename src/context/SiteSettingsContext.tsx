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
  SETTINGS_EVENT,
  defaultSiteSettings,
  readSiteSettings,
  writeSiteSettings,
  type FormSettings,
  type SiteSettings,
  type SiteSettingsInput,
} from "@/lib/site-settings";
import type { WorkshopContact } from "@/lib/contact";

type SiteSettingsContextValue = {
  contact: WorkshopContact;
  form: FormSettings;
  ready: boolean;
  updateSettings: (input: SiteSettingsInput) => void;
  refresh: () => void;
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

  const refresh = useCallback(() => {
    setSettings(readSiteSettings());
  }, []);

  useEffect(() => {
    refresh();
    setReady(true);
    const onUpdate = () => refresh();
    window.addEventListener(SETTINGS_EVENT, onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener(SETTINGS_EVENT, onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, [refresh]);

  const updateSettings = useCallback((input: SiteSettingsInput) => {
    setSettings(writeSiteSettings(input));
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
