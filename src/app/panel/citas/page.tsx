"use client";

import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { StatusBadge } from "@/components/panel/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { useWorkshop } from "@/context/WorkshopContext";
import { statusLabels } from "@/lib/data";
import type { AppointmentStatus } from "@/lib/types";

const aptStatuses: AppointmentStatus[] = [
  "pendiente",
  "confirmada",
  "completada",
  "cancelada",
];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function CitasPage() {
  const {
    appointments,
    addAppointment,
    updateAppointmentStatus,
    updateAppointment,
    removeAppointment,
  } = useWorkshop();
  const { push } = useToast();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | AppointmentStatus>("all");
  const [dateFilter, setDateFilter] = useState("");

  const filtered = useMemo(() => {
    return appointments
      .filter((a) => (filter === "all" ? true : a.status === filter))
      .filter((a) => (dateFilter ? a.date === dateFilter : true))
      .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  }, [appointments, filter, dateFilter]);

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    await addAppointment({
      clientName: String(data.get("clientName") || ""),
      phone: String(data.get("phone") || ""),
      vehicle: String(data.get("vehicle") || ""),
      service: String(data.get("service") || ""),
      date: String(data.get("date") || ""),
      time: String(data.get("time") || ""),
      notes: String(data.get("notes") || "") || undefined,
    });
    setOpen(false);
    push("Cita agendada");
  }

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-signal">
            Agenda
          </p>
          <h1 className="mt-1 font-display text-3xl text-bone sm:text-4xl">
            Citas
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn-primary px-4 py-2.5 text-sm"
        >
          Nueva cita
        </button>
      </header>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["all", "Todas"],
              ["pendiente", "Pendiente"],
              ["confirmada", "Confirmada"],
              ["completada", "Completada"],
              ["cancelada", "Cancelada"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wide transition ${
                filter === id
                  ? "bg-signal text-ink"
                  : "bg-steel text-mist hover:text-bone"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs uppercase tracking-wide text-mist">
            Fecha
          </label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="field max-w-[180px] py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => setDateFilter(todayISO())}
            className="px-3 py-2 text-xs text-mist transition hover:text-signal"
          >
            Hoy
          </button>
          {dateFilter ? (
            <button
              type="button"
              onClick={() => setDateFilter("")}
              className="px-3 py-2 text-xs text-mist transition hover:text-bone"
            >
              Ver todas
            </button>
          ) : null}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((apt, i) => (
          <motion.article
            key={apt.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="panel-surface flex flex-col gap-4 p-5"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-medium text-bone">
                  {apt.clientName}
                </h2>
                <p className="mt-1 text-sm text-mist">
                  {apt.vehicle} · {apt.service}
                </p>
                <p className="mt-1 text-xs text-mist">{apt.phone}</p>
                {apt.notes ? (
                  <p className="mt-2 text-sm italic text-mist/80">{apt.notes}</p>
                ) : null}
              </div>
              <div className="flex flex-col items-start gap-2 sm:items-end">
                <StatusBadge status={apt.status} kind="appointment" />
                <select
                  value={apt.status}
                  onChange={(e) => {
                    const status = e.target.value as AppointmentStatus;
                    void updateAppointmentStatus(apt.id, status).then(() =>
                      push(`Cita → ${statusLabels[status]}`, "info"),
                    );
                  }}
                  className="field max-w-[160px] py-1.5 text-xs"
                >
                  {aptStatuses.map((status) => (
                    <option key={status} value={status}>
                      {statusLabels[status]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-3 border-t border-steel-mid pt-4 sm:grid-cols-[1fr_1fr_auto]">
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-wide text-mist">
                  Fecha
                </label>
                <input
                  type="date"
                  value={apt.date}
                  onChange={(e) => {
                    void updateAppointment(apt.id, { date: e.target.value }).then(
                      () => push("Fecha actualizada", "info"),
                    );
                  }}
                  className="field py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-wide text-mist">
                  Hora
                </label>
                <input
                  type="time"
                  value={apt.time}
                  onChange={(e) => {
                    void updateAppointment(apt.id, { time: e.target.value }).then(
                      () => push("Hora actualizada", "info"),
                    );
                  }}
                  className="field py-2 text-sm"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => {
                    const ok = window.confirm(
                      `¿Eliminar la cita de ${apt.clientName}?`,
                    );
                    if (!ok) return;
                    void removeAppointment(apt.id).then(() =>
                      push("Cita eliminada"),
                    );
                  }}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm text-mist transition hover:text-danger"
                >
                  <Trash2 className="size-4" />
                  Eliminar
                </button>
              </div>
            </div>
          </motion.article>
        ))}
        {filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-mist">
            No hay citas
            {dateFilter ? " en esa fecha" : " en este estado"}.
          </p>
        ) : null}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Nueva cita">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-mist">Cliente</label>
            <input name="clientName" required className="field" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-mist">Teléfono</label>
            <input name="phone" required className="field" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-mist">Vehículo</label>
            <input name="vehicle" required className="field" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-mist">Servicio</label>
            <input name="service" required className="field" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-mist">Fecha</label>
              <input
                name="date"
                type="date"
                required
                defaultValue={todayISO()}
                className="field"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-mist">Hora</label>
              <input
                name="time"
                type="time"
                required
                defaultValue="10:00"
                className="field"
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm text-mist">Notas</label>
            <textarea name="notes" rows={3} className="field resize-none" />
          </div>
          <button type="submit" className="btn-primary w-full py-3 text-sm">
            Agendar
          </button>
        </form>
      </Modal>
    </div>
  );
}
