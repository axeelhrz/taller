"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarPlus,
  Inbox,
  MessageCircle,
  Phone,
  Search,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useRequests } from "@/context/RequestsContext";
import { useWorkshop } from "@/context/WorkshopContext";
import { useToast } from "@/components/ui/Toast";
import {
  formatRequestTime,
  relativeTime,
} from "@/lib/requests-store";
import {
  REQUEST_STATUS_LABELS,
  type RequestStatus,
} from "@/lib/types";

const filters: Array<{ id: "all" | RequestStatus; label: string }> = [
  { id: "all", label: "Todas" },
  { id: "nueva", label: "Nuevas" },
  { id: "contactado", label: "Contactadas" },
  { id: "agendada", label: "Agendadas" },
  { id: "descartada", label: "Descartadas" },
];

const statusStyles: Record<RequestStatus, string> = {
  nueva: "bg-signal text-ink",
  contactado: "bg-warn/20 text-warn",
  agendada: "bg-ok/20 text-ok",
  descartada: "bg-steel text-mist",
};

export default function SolicitudesPage() {
  const { requests, setRequestStatus, deleteRequest, newCount } = useRequests();
  const { scheduleRequest } = useWorkshop();
  const { push } = useToast();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | RequestStatus>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [scheduling, setScheduling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return requests.filter((r) => {
      const matchesFilter = filter === "all" || r.status === filter;
      const matchesQuery =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q) ||
        r.vehicle.toLowerCase().includes(q) ||
        r.service.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query, requests]);

  const selected =
    filtered.find((r) => r.id === selectedId) ?? filtered[0] ?? null;

  async function mark(status: RequestStatus) {
    if (!selected) return;
    await setRequestStatus(selected.id, status);
    push(`Solicitud ${selected.id} → ${REQUEST_STATUS_LABELS[status]}`);
  }

  async function scheduleFromRequest() {
    if (!selected || scheduling) return;
    setScheduling(true);
    try {
      await scheduleRequest({
        clientName: selected.name,
        phone: selected.phone,
        vehicle: selected.vehicle,
        service: selected.service,
        notes: selected.notes || `Desde ${selected.id}`,
        date: selected.preferredDate,
        time: selected.preferredTime,
      });
      await setRequestStatus(selected.id, "agendada");
      push("Cita creada desde la solicitud");
    } catch {
      push("No se pudo crear la cita. Probá de nuevo.");
    } finally {
      setScheduling(false);
    }
  }

  async function removeRequest() {
    if (!selected || deleting) return;
    const ok = window.confirm(
      `¿Eliminar por completo la solicitud de ${selected.name}?`,
    );
    if (!ok) return;
    setDeleting(true);
    try {
      await deleteRequest(selected.id);
      setSelectedId(null);
      push("Solicitud eliminada");
    } catch {
      push("No se pudo eliminar");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-signal">
            Sitio web
          </p>
          <h1 className="mt-1 font-display text-3xl text-bone sm:text-4xl md:text-5xl">
            Solicitudes
          </h1>
          <p className="mt-2 text-mist">
            Pedidos reales del formulario de contacto
            {newCount > 0 ? ` · ${newCount} sin atender` : ""}.
          </p>
        </div>
        <div className="flex items-center gap-2 border border-steel-mid bg-ink-soft px-4 py-2 text-sm text-mist">
          <Inbox className="size-4 text-signal" />
          {requests.length} total
        </div>
      </header>

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mist" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, teléfono, servicio…"
            className="field pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wide transition ${
                filter === item.id
                  ? "bg-signal text-ink"
                  : "bg-steel text-mist hover:text-bone"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.05fr]">
        <div className="border border-steel-mid bg-ink-soft/70">
          <AnimatePresence initial={false} mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-5 py-16 text-center text-sm text-mist"
              >
                No hay solicitudes con ese filtro. Probá enviar una desde la
                web.
              </motion.div>
            ) : (
              <ul className="divide-y divide-steel-mid/80">
                {filtered.map((req) => {
                  const active = selected?.id === req.id;
                  return (
                    <motion.li key={req.id} layout>
                      <button
                        type="button"
                        onClick={() => setSelectedId(req.id)}
                        className={`w-full px-4 py-4 text-left transition ${
                          active
                            ? "bg-signal/10"
                            : "hover:bg-steel/40"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-medium text-bone">
                              {req.name}
                            </p>
                            <p className="mt-1 truncate text-sm text-mist">
                              {req.service} · {req.vehicle}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${statusStyles[req.status]}`}
                          >
                            {REQUEST_STATUS_LABELS[req.status]}
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-mist/80">
                          {relativeTime(req.createdAt)} · {req.id}
                        </p>
                      </button>
                    </motion.li>
                  );
                })}
              </ul>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {selected ? (
            <motion.article
              key={selected.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="border border-steel-mid bg-ink-soft p-5 md:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-signal">
                    {selected.id}
                  </p>
                  <h2 className="mt-1 font-display text-3xl text-bone">
                    {selected.name}
                  </h2>
                  <p className="mt-1 text-sm text-mist">
                    {formatRequestTime(selected.createdAt)}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${statusStyles[selected.status]}`}
                >
                  {REQUEST_STATUS_LABELS[selected.status]}
                </span>
              </div>

              <dl className="mt-6 grid gap-4 border-y border-steel-mid py-5 sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-mist">
                    Teléfono
                  </dt>
                  <dd className="mt-1 text-bone">{selected.phone}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-mist">
                    Servicio
                  </dt>
                  <dd className="mt-1 text-bone">{selected.service}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs uppercase tracking-wide text-mist">
                    Vehículo
                  </dt>
                  <dd className="mt-1 text-bone">{selected.vehicle}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs uppercase tracking-wide text-mist">
                    Fecha preferida
                  </dt>
                  <dd className="mt-1 text-bone">
                    {selected.preferredDate
                      ? `${selected.preferredDate}${selected.preferredTime ? ` · ${selected.preferredTime}` : ""}`
                      : "Sin fecha indicada"}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs uppercase tracking-wide text-mist">
                    Detalle
                  </dt>
                  <dd className="mt-1 text-mist">
                    {selected.notes || "Sin notas adicionales."}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-wrap gap-2">
                <a
                  href={`tel:${selected.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 border border-steel-mid px-3 py-2 text-sm text-bone transition hover:border-signal hover:text-signal"
                >
                  <Phone className="size-4" />
                  Llamar
                </a>
                <a
                  href={`https://wa.me/598${selected.phone.replace(/\D/g, "").replace(/^0/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-steel-mid px-3 py-2 text-sm text-bone transition hover:border-signal hover:text-signal"
                >
                  <MessageCircle className="size-4" />
                  WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => mark("contactado")}
                  className="border border-steel-mid px-3 py-2 text-sm text-bone transition hover:border-signal hover:text-signal"
                >
                  Marcar contactado
                </button>
                <button
                  type="button"
                  onClick={scheduleFromRequest}
                  disabled={scheduling}
                  className="btn-primary inline-flex items-center gap-2 px-3 py-2 text-sm disabled:opacity-50"
                >
                  <CalendarPlus className="size-4" />
                  {scheduling ? "Creando…" : "Crear cita"}
                </button>
                <button
                  type="button"
                  onClick={() => mark("descartada")}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm text-mist transition hover:text-danger"
                >
                  Descartar
                </button>
                <button
                  type="button"
                  onClick={removeRequest}
                  disabled={deleting}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm text-danger transition hover:bg-danger/10 disabled:opacity-50"
                >
                  <Trash2 className="size-4" />
                  {deleting ? "Eliminando…" : "Eliminar"}
                </button>
              </div>
            </motion.article>
          ) : (
            <motion.div
              key="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex min-h-[320px] items-center justify-center border border-dashed border-steel-mid text-sm text-mist"
            >
              Seleccioná una solicitud para ver el detalle
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
