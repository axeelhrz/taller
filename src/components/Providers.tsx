"use client";

import { ToastProvider } from "@/components/ui/Toast";
import { AuthProvider } from "@/context/AuthContext";
import { RequestsProvider } from "@/context/RequestsContext";
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <SiteSettingsProvider>
        <AuthProvider>
          <RequestsProvider>{children}</RequestsProvider>
        </AuthProvider>
      </SiteSettingsProvider>
    </ToastProvider>
  );
}
