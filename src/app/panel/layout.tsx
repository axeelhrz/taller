"use client";

import { Sidebar } from "@/components/panel/Sidebar";
import { WorkshopProvider } from "@/context/WorkshopContext";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
