"use client";

import { motion } from "framer-motion";
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

export default function CitasPage() {
  const { appointments, addAppointment, updateAppointmentStatus } =
    useWorkshop();
  const { push } = useToast();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | AppointmentStatus>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return appointments;
    return appointments.filter((a) => a.status === filter);
  }, [appointments, filter]);

  function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    addAppointment({
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
          <h1 className="mt-1 font-display text-3xl text-bone sm:text-4xl">Citas</h1>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn-primary px-4 py-2.5 text-sm"
        >
          Nueva cita
        </button>
      </header>

      <div className="mb-5 flex flex-wrap gap-2">
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

      <div className="space-y-3">
        {filtered.map((apt, i) => (
          <motion.article
            key={apt.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="panel-surface flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex gap-5">
              <div className="min-w-[72px] border-r border-steel-mid pr-5 text-center">
                <p className="font-display text-3xl text-signal">
                  {apt.time.split(":")[0]}
                </p>
                <p className="text-xs text-mist">{apt.time}</p>
                <p className="mt-1 text-xs text-mist">{apt.date}</p>
              </div>
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
            </div>
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <StatusBadge status={apt.status} kind="appointment" />
              <select
                value={apt.status}
                onChange={(e) => {
                  const status = e.target.value as AppointmentStatus;
                  updateAppointmentStatus(apt.id, status);
                  push(`Cita → ${statusLabels[status]}`, "info");
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
          </motion.article>
        ))}
        {filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-mist">
            No hay citas en este estado.
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
              <input name="date" type="date" required className="field" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-mist">Hora</label>
              <input name="time" type="time" required className="field" />
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
