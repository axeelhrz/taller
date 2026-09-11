"use client";

import { PanelLogin } from "@/components/panel/PanelLogin";
import { Sidebar } from "@/components/panel/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { WorkshopProvider } from "@/context/WorkshopContext";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ready, authenticated } = useAuth();

  if (!ready) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-ink text-sm text-mist">
        Cargando…
      </div>
    );
  }

  if (!authenticated) {
    return <PanelLogin />;
  }

  return (
    <WorkshopProvider>
      <div className="flex min-h-svh flex-col bg-ink lg:flex-row">
        <Sidebar />
        <div className="min-w-0 flex-1 overflow-x-clip overflow-y-auto">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-5 sm:py-8 md:px-8">
            {children}
          </div>
        </div>
      </div>
    </WorkshopProvider>
  );
}
