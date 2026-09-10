"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarDays,
  CircleDollarSign,
  ClipboardList,
  Inbox,
  Phone,
  Sparkles,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { StatusBadge } from "@/components/panel/StatusBadge";
import { useRequests } from "@/context/RequestsContext";
import { useWorkshop } from "@/context/WorkshopContext";
import { formatMoney } from "@/lib/data";
import { relativeTime } from "@/lib/requests-store";
import { workshopContact } from "@/lib/contact";

export default function PanelDashboardPage() {
  const { orders, appointments, clients } = useWorkshop();
  const { requests, newCount } = useRequests();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(id);
  }, []);

  const activeOrders = orders.filter((o) => o.status !== "entregado");
  const upcoming = appointments.filter(
    (a) => a.status === "pendiente" || a.status === "confirmada",
  );
  const revenue = orders
    .filter((o) => o.status === "listo" || o.status === "entregado")
    .reduce((sum, o) => sum + o.total, 0);

  const latestRequests = useMemo(
    () => [...requests].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [requests],
  );

  const clock = new Intl.DateTimeFormat("es-UY", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(now);

  const stats = [
    {
      label: "Solicitudes nuevas",
      value: String(newCount),
      hint: "Desde el sitio web",
      icon: Inbox,
      href: "/panel/solicitudes",
      accent: true,
    },
    {
      label: "Órdenes activas",
      value: String(activeOrders.length),
      hint: "En el taller",
      icon: ClipboardList,
      href: "/panel/ordenes",
    },
    {
      label: "Citas abiertas",
      value: String(upcoming.length),
      hint: "Agenda",
      icon: CalendarDays,
      href: "/panel/citas",
    },
    {
      label: "Clientes",
      value: String(clients.length),
      hint: "Base actual",
      icon: Users,
      href: "/panel/clientes",
    },
  ];

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden border border-steel-mid bg-gradient-to-br from-steel via-ink-soft to-ink p-6 md:p-8"
      >
        <div className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-signal/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-10 size-56 rounded-full bg-signal/5 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-signal">
              <Sparkles className="size-3.5" />
              Centro de operaciones
            </p>
            <h1 className="mt-3 font-display text-3xl text-bone sm:text-4xl md:text-6xl">
              Panel Wilson Larrañaga
            </h1>
            <p className="mt-3 max-w-xl capitalize text-mist">{clock}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/panel/solicitudes"
              className="inline-flex items-center gap-2 bg-signal px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-signal-dim"
            >
              Ver solicitudes
              {newCount > 0 ? (
                <span className="bg-ink px-1.5 py-0.5 text-xs text-signal">
                  {newCount}
                </span>
              ) : null}
            </Link>
            <a
              href={workshopContact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-steel-mid px-4 py-2.5 text-sm text-bone transition hover:border-signal hover:text-signal"
            >
              <Phone className="size-4" />
              WhatsApp taller
            </a>
          </div>
        </div>

        {newCount > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mt-6 flex items-center gap-3 border border-signal/30 bg-signal/10 px-4 py-3 text-sm text-bone"
          >
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-signal opacity-60" />
              <span className="relative inline-flex size-2.5 rounded-full bg-signal" />
            </span>
            Tenés {newCount} solicitud{newCount === 1 ? "" : "es"} nueva
            {newCount === 1 ? "" : "s"} del sitio web.
            <Link
              href="/panel/solicitudes"
              className="ml-auto font-medium text-signal underline-offset-4 hover:underline"
            >
              Revisar ahora
            </Link>
          </motion.div>
        ) : null}
      </motion.section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.05 }}
            >
              <Link
                href={stat.href}
                className={`group block border p-5 transition ${
                  stat.accent
                    ? "border-signal/35 bg-signal/10 hover:border-signal/60"
                    : "border-steel-mid bg-ink-soft hover:border-signal/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-mist">{stat.label}</p>
                  <Icon
                    className={`size-4 ${stat.accent ? "text-signal" : "text-mist group-hover:text-signal"}`}
                  />
                </div>
                <p className="mt-3 font-display text-4xl text-bone">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-mist">{stat.hint}</p>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
        <section className="border border-steel-mid bg-ink-soft/80">
          <div className="flex items-center justify-between border-b border-steel-mid px-5 py-4">
            <div>
              <h2 className="font-display text-2xl text-bone">
                Inbox web en vivo
              </h2>
              <p className="text-sm text-mist">
                Solicitudes reales del formulario del sitio
              </p>
            </div>
            <Link
              href="/panel/solicitudes"
              className="inline-flex items-center gap-1 text-sm text-signal hover:underline"
            >
              Ver todas
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          <ul className="divide-y divide-steel-mid/80">
            <AnimatePresence initial={false}>
              {latestRequests.length === 0 ? (
                <li className="px-5 py-12 text-center text-sm text-mist">
                  Todavía no hay solicitudes. Cuando alguien complete el
                  formulario en el sitio, aparecen acá al instante.
                </li>
              ) : (
                latestRequests.slice(0, 6).map((req, i) => (
                  <motion.li
                    key={req.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex flex-col gap-3 px-5 py-4 transition hover:bg-steel/30 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-bone">{req.name}</p>
                        {req.status === "nueva" ? (
                          <span className="bg-signal px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink">
                            Nueva
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 truncate text-sm text-mist">
                        {req.service} · {req.vehicle}
                      </p>
                      <p className="mt-1 text-xs text-mist/80">
                        {req.id} · {relativeTime(req.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${req.phone.replace(/\s/g, "")}`}
                        className="border border-steel-mid px-3 py-1.5 text-xs text-bone transition hover:border-signal hover:text-signal"
                      >
                        {req.phone}
                      </a>
                      <Link
                        href="/panel/solicitudes"
                        className="text-xs font-medium text-signal hover:underline"
                      >
                        Abrir
                      </Link>
                    </div>
                  </motion.li>
                ))
              )}
            </AnimatePresence>
          </ul>
        </section>

        <div className="space-y-6">
          <section className="border border-steel-mid bg-ink-soft/80 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl text-bone">Facturación</h2>
              <CircleDollarSign className="size-4 text-signal" />
            </div>
            <p className="font-display text-4xl text-signal">
              {formatMoney(revenue)}
            </p>
            <p className="mt-2 text-sm text-mist">
              Órdenes listas o entregadas
            </p>
          </section>

          <section className="border border-steel-mid bg-ink-soft/80">
            <div className="flex items-center justify-between border-b border-steel-mid px-5 py-4">
              <h2 className="font-display text-2xl text-bone">Órdenes activas</h2>
              <Link
                href="/panel/ordenes"
                className="text-sm text-signal hover:underline"
              >
                Ver
              </Link>
            </div>
            <ul className="divide-y divide-steel-mid/80">
              {activeOrders.slice(0, 4).map((order) => (
                <li
                  key={order.id}
                  className="flex items-center justify-between gap-3 px-5 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-bone">{order.id}</p>
                    <p className="text-xs text-mist">{order.clientName}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
