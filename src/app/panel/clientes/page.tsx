"use client";

import { motion } from "framer-motion";
import { Car, Mail, Phone, Search } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { useWorkshop } from "@/context/WorkshopContext";

export default function ClientesPage() {
  const { clients, addClient } = useWorkshop();
  const { push } = useToast();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q),
    );
  }, [clients, query]);

  function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    addClient({
      name: String(data.get("name") || ""),
      phone: String(data.get("phone") || ""),
      email: String(data.get("email") || ""),
      vehicleCount: Number(data.get("vehicleCount") || 1),
    });
    setOpen(false);
    push("Cliente agregado");
  }

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-signal">Base</p>
          <h1 className="mt-1 font-display text-3xl text-bone sm:text-4xl">Clientes</h1>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn-primary px-4 py-2.5 text-sm"
        >
          Nuevo cliente
        </button>
      </header>

      <div className="relative mb-6 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mist" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar cliente…"
          className="field pl-10"
        />
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {filtered.map((client, i) => (
          <motion.li
            key={client.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="panel-surface p-5"
          >
            <h2 className="font-display text-2xl text-bone">{client.name}</h2>
            <ul className="mt-4 space-y-2 text-sm text-mist">
              <li className="flex items-center gap-2">
                <Phone className="size-3.5 text-signal" />
                {client.phone}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-3.5 text-signal" />
                {client.email}
              </li>
              <li className="flex items-center gap-2">
                <Car className="size-3.5 text-signal" />
                {client.vehicleCount} vehículo
                {client.vehicleCount === 1 ? "" : "s"}
              </li>
            </ul>
          </motion.li>
        ))}
      </ul>

      <Modal open={open} onClose={() => setOpen(false)} title="Nuevo cliente">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-mist">Nombre</label>
            <input name="name" required className="field" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-mist">Teléfono</label>
            <input name="phone" required className="field" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-mist">Email</label>
            <input name="email" type="email" required className="field" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-mist">Vehículos</label>
            <input
              name="vehicleCount"
              type="number"
              min={1}
              defaultValue={1}
              className="field"
            />
          </div>
          <button type="submit" className="btn-primary w-full py-3 text-sm">
            Guardar cliente
          </button>
        </form>
      </Modal>
    </div>
  );
}
