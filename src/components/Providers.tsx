"use client";

import { ToastProvider } from "@/components/ui/Toast";
import { RequestsProvider } from "@/context/RequestsContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <RequestsProvider>{children}</RequestsProvider>
    </ToastProvider>
  );
}
