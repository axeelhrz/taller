"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { StatusBadge } from "@/components/panel/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { useWorkshop } from "@/context/WorkshopContext";
import { formatMoney, statusLabels } from "@/lib/data";
import type { OrderStatus } from "@/lib/types";

const filters: Array<{ id: "all" | OrderStatus; label: string }> = [
  { id: "all", label: "Todas" },
  { id: "recibido", label: "Recibido" },
  { id: "diagnostico", label: "Diagnóstico" },
  { id: "en_proceso", label: "En proceso" },
  { id: "listo", label: "Listo" },
  { id: "entregado", label: "Entregado" },
];

const orderStatuses: OrderStatus[] = [
  "recibido",
  "diagnostico",
  "en_proceso",
  "listo",
  "entregado",
];

export default function OrdenesPage() {
  const { orders, addOrder, updateOrderStatus } = useWorkshop();
  const { push } = useToast();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const matchesFilter = filter === "all" || order.status === filter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        order.id.toLowerCase().includes(q) ||
        order.clientName.toLowerCase().includes(q) ||
        order.plate.toLowerCase().includes(q) ||
        order.service.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [filter, orders, query]);

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    await addOrder({
      clientName: String(data.get("clientName") || ""),
      vehicle: String(data.get("vehicle") || ""),
      plate: String(data.get("plate") || ""),
      service: String(data.get("service") || ""),
      mechanic: String(data.get("mechanic") || "Wilson"),
      estimatedReady: String(data.get("estimatedReady") || ""),
      total: Number(data.get("total") || 0),
    });
    setOpen(false);
    push("Orden de trabajo creada");
  }

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-signal">
            Taller
          </p>
          <h1 className="mt-1 font-display text-3xl text-bone sm:text-4xl">
            Órdenes de trabajo
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn-primary px-4 py-2.5 text-sm"
        >
          Nueva orden
        </button>
      </header>

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mist" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por cliente, placa u orden…"
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

      <div className="overflow-hidden border border-steel-mid">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-steel text-mist">
              <tr>
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Cliente / vehículo</th>
                <th className="px-4 py-3 font-medium">Servicio</th>
                <th className="px-4 py-3 font-medium">Mecánico</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {filtered.map((order) => (
                  <motion.tr
                    key={order.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-t border-steel-mid/80 hover:bg-steel/40"
                  >
                    <td className="px-4 py-3 font-medium text-bone">
                      {order.id}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-bone">{order.clientName}</p>
                      <p className="text-xs text-mist">
                        {order.vehicle} · {order.plate}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-mist">{order.service}</td>
                    <td className="px-4 py-3 text-mist">{order.mechanic}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-2">
                        <StatusBadge status={order.status} />
                        <select
                          value={order.status}
                          onChange={(e) => {
                            const status = e.target.value as OrderStatus;
                            void updateOrderStatus(order.id, status).then(() =>
                              push(
                                `${order.id} → ${statusLabels[status]}`,
                                "info",
                              ),
                            );
                          }}
                          className="field max-w-[150px] py-1.5 text-xs"
                        >
                          {orderStatuses.map((status) => (
                            <option key={status} value={status}>
                              {statusLabels[status]}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-bone">
                      {formatMoney(order.total)}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {filtered.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-mist">
            No hay órdenes con ese filtro.
          </p>
        ) : null}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Nueva orden">
        <form onSubmit={handleCreate} className="space-y-4">
          <Field name="clientName" label="Cliente" required />
          <Field name="vehicle" label="Vehículo" required />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="plate" label="Patente" required />
            <Field name="mechanic" label="Mecánico" defaultValue="Wilson" />
          </div>
          <Field name="service" label="Servicio" required />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="estimatedReady" label="Entrega estimada" type="date" />
            <Field name="total" label="Total (UYU)" type="number" required />
          </div>
          <button type="submit" className="btn-primary mt-2 w-full py-3 text-sm">
            Crear orden
          </button>
        </form>
      </Modal>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  defaultValue,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-mist">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="field"
      />
    </div>
  );
}
