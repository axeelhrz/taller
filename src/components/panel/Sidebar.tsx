"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  Inbox,
  LayoutDashboard,
  Users,
  Wrench,
} from "lucide-react";
import { useRequests } from "@/context/RequestsContext";

const nav = [
  { href: "/panel", label: "Resumen", icon: LayoutDashboard, exact: true },
  { href: "/panel/solicitudes", label: "Solicitudes", icon: Inbox },
  { href: "/panel/ordenes", label: "Órdenes", icon: ClipboardList },
  { href: "/panel/clientes", label: "Clientes", icon: Users },
  { href: "/panel/citas", label: "Citas", icon: CalendarDays },
];

export function Sidebar() {
  const pathname = usePathname();
  const { newCount } = useRequests();

  return (
    <aside className="sticky top-0 z-30 flex w-full flex-col border-b border-steel-mid bg-ink-soft/95 backdrop-blur lg:h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between gap-3 border-b border-steel-mid px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center bg-signal">
            <Wrench className="size-4 text-ink" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-base leading-none tracking-wide text-bone sm:text-lg">
              Wilson Larrañaga
            </p>
            <p className="mt-1 text-xs text-mist">Centro de operaciones</p>
          </div>
        </div>
        <Link
          href="/"
          className="shrink-0 text-xs text-mist transition hover:text-bone lg:hidden"
        >
          Sitio
        </Link>
      </div>

      <nav className="scrollbar-none relative flex gap-1 overflow-x-auto px-2 py-2 sm:px-3 sm:py-3 lg:flex-1 lg:flex-col lg:overflow-visible">
        {nav.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          const showBadge = item.href === "/panel/solicitudes" && newCount > 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex shrink-0 items-center gap-2 px-3 py-2.5 text-sm font-medium transition sm:gap-3 ${
                active ? "text-signal" : "text-mist hover:text-bone"
              }`}
            >
              {active ? (
                <motion.span
                  layoutId="panel-nav"
                  className="absolute inset-0 bg-steel"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              ) : null}
              <Icon className="relative z-10 size-4 shrink-0" />
              <span className="relative z-10 whitespace-nowrap">{item.label}</span>
              {showBadge ? (
                <span className="relative z-10 flex min-w-5 items-center justify-center bg-signal px-1.5 py-0.5 text-[10px] font-bold text-ink">
                  {newCount}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="hidden border-t border-steel-mid p-4 lg:block">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-mist transition hover:text-bone"
        >
          <ArrowLeft className="size-4" />
          Volver al sitio
        </Link>
      </div>
    </aside>
  );
}
