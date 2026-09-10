"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronLeft,
  MessageCircle,
  Phone,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { Chapter } from "@/components/landing/Chapter";
import { Reveal } from "@/components/ui/Reveal";
import { useToast } from "@/components/ui/Toast";
import { useRequests } from "@/context/RequestsContext";
import { workshopContact } from "@/lib/contact";

const services = [
  "Diagnóstico",
  "Service",
  "Frenos",
  "Motor",
  "Aire",
  "Otro",
];

const stepMeta = [
  { label: "Datos", title: "¿Cómo te contactamos?" },
  { label: "Vehículo", title: "¿Qué auto traés?" },
  { label: "Detalle", title: "¿Qué le pasa?" },
];

export function Contact() {
  const { submitRequest } = useRequests();
  const { push } = useToast();
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    vehicle: "",
    service: "",
    notes: "",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function canNext() {
    if (step === 0) return form.name.trim().length > 1 && form.phone.trim().length > 6;
    if (step === 1) return form.vehicle.trim().length > 2 && !!form.service;
    return true;
  }

  function resetForm() {
    setSent(false);
    setRequestId("");
    setStep(0);
    setForm({
      name: "",
      phone: "",
      vehicle: "",
      service: "",
      notes: "",
    });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (step < 2) {
      if (canNext()) setStep((s) => s + 1);
      return;
    }

    const created = submitRequest({
      name: form.name.trim(),
      phone: form.phone.trim(),
      vehicle: form.vehicle.trim(),
      service: form.service,
      notes: form.notes.trim(),
    });
    setRequestId(created.id);
    setSent(true);
    push("Solicitud enviada al panel del taller");
  }

  return (
    <Chapter id="contacto">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.2fr] lg:gap-16">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-signal">
            Contacto
          </p>
          <h2 className="mt-3 font-display text-4xl leading-[0.92] text-bone sm:text-5xl md:text-7xl">
            Reservá
            <br />
            <span className="text-signal">tu bahía</span>
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-mist md:text-lg">
            Contanos qué necesita el auto en 3 pasos. Te confirmamos turno — o
            escribinos ahora si es urgente.
          </p>

          <div className="mt-10 space-y-3">
            <a
              href={workshopContact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-4 bg-[#10131a] px-5 py-4 transition hover:bg-[#151922]"
            >
              <span className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center bg-signal/15 text-signal">
                  <MessageCircle className="size-5" />
                </span>
                <span>
                  <span className="block text-xs uppercase tracking-[0.16em] text-mist">
                    Respuesta rápida
                  </span>
                  <span className="font-medium text-bone">WhatsApp</span>
                </span>
              </span>
              <ArrowUpRight className="size-4 text-signal" />
            </a>

            <a
              href={`tel:${workshopContact.phoneTel}`}
              className="flex items-center justify-between gap-4 bg-[#10131a] px-5 py-4 transition hover:bg-[#151922]"
            >
              <span className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center bg-signal/15 text-signal">
                  <Phone className="size-5" />
                </span>
                <span>
                  <span className="block text-xs uppercase tracking-[0.16em] text-mist">
                    Llamar al taller
                  </span>
                  <span className="font-display text-xl tracking-wide text-bone">
                    {workshopContact.phoneDisplay}
                  </span>
                </span>
              </span>
              <ArrowUpRight className="size-4 text-mist" />
            </a>
          </div>

          <p className="mt-6 text-sm text-mist/70">
            Lun–Vie 8–18 · Sáb 8–13 · {workshopContact.plusCode}
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="relative overflow-hidden bg-[#10131a]">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-signal/45 to-transparent" />

            {sent ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex min-h-[420px] flex-col justify-center p-6 md:p-9"
              >
                <CheckCircle2 className="size-10 text-signal" />
                <h3 className="mt-5 font-display text-4xl text-bone">
                  Pedido recibido
                </h3>
                <p className="mt-3 max-w-md text-mist">
                  Gracias, {form.name.split(" ")[0] || "cliente"}. Ya está en el
                  panel del taller
                  {requestId ? (
                    <>
                      {" "}
                      como{" "}
                      <span className="font-medium text-signal">{requestId}</span>
                    </>
                  ) : null}
                  . Te contactamos para confirmar.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={workshopContact.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-signal px-5 py-3 text-sm font-semibold text-ink transition hover:bg-signal-dim"
                  >
                    Seguir por WhatsApp
                    <ArrowUpRight className="size-4" />
                  </a>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-3 text-sm text-mist transition hover:text-bone"
                  >
                    Enviar otra
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="p-5 sm:p-6 md:p-9">
                {/* Progress */}
                <div className="mb-6 sm:mb-8">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    {stepMeta.map((meta, i) => (
                      <button
                        key={meta.label}
                        type="button"
                        onClick={() => i < step && setStep(i)}
                        className={`min-w-0 flex-1 text-left text-[10px] font-semibold uppercase tracking-[0.12em] transition sm:text-[11px] sm:tracking-[0.16em] ${
                          i === step
                            ? "text-signal"
                            : i < step
                              ? "text-bone"
                              : "text-mist/40"
                        }`}
                      >
                        <span className="sm:hidden">0{i + 1}</span>
                        <span className="hidden sm:inline">
                          0{i + 1} · {meta.label}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="h-px w-full bg-white/10">
                    <motion.div
                      className="h-px bg-signal"
                      animate={{ width: `${((step + 1) / 3) * 100}%` }}
                      transition={{ duration: 0.35 }}
                    />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="min-h-[240px] sm:min-h-[260px]"
                  >
                    <h3 className="font-display text-2xl tracking-wide text-bone sm:text-3xl">
                      {stepMeta[step].title}
                    </h3>

                    {step === 0 ? (
                      <div className="mt-6 space-y-4">
                        <Field
                          label="Tu nombre"
                          placeholder="Ej. Ana Pérez"
                          value={form.name}
                          onChange={(v) => update("name", v)}
                          required
                        />
                        <Field
                          label="Teléfono / WhatsApp"
                          type="tel"
                          placeholder="099 000 000"
                          value={form.phone}
                          onChange={(v) => update("phone", v)}
                          required
                        />
                      </div>
                    ) : null}

                    {step === 1 ? (
                      <div className="mt-6 space-y-5">
                        <Field
                          label="Marca, modelo y año"
                          placeholder="Ej. Toyota Corolla 2019"
                          value={form.vehicle}
                          onChange={(v) => update("vehicle", v)}
                          required
                        />
                        <div>
                          <p className="mb-3 text-sm text-mist">Tipo de trabajo</p>
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {services.map((s) => {
                              const selected = form.service === s;
                              return (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => update("service", s)}
                                  className={`px-3 py-3 text-left text-sm transition ${
                                    selected
                                      ? "bg-signal text-ink"
                                      : "bg-white/[0.05] text-mist hover:bg-white/[0.08] hover:text-bone"
                                  }`}
                                >
                                  {s}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {step === 2 ? (
                      <div className="mt-6 space-y-5">
                        <div>
                          <label
                            htmlFor="notes"
                            className="mb-2 block text-sm text-mist"
                          >
                            Contanos el problema
                          </label>
                          <textarea
                            id="notes"
                            rows={4}
                            value={form.notes}
                            onChange={(e) => update("notes", e.target.value)}
                            className="field resize-none"
                            placeholder="Ruido al frenar, luz en el tablero, kilometraje..."
                          />
                        </div>
                        <div className="bg-white/[0.04] p-4 text-sm">
                          <p className="text-[10px] uppercase tracking-[0.16em] text-signal">
                            Resumen
                          </p>
                          <p className="mt-2 text-bone">
                            {form.name} · {form.phone}
                          </p>
                          <p className="mt-1 text-mist">
                            {form.vehicle} · {form.service}
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </motion.div>
                </AnimatePresence>

                <div className="mt-6 flex flex-col-reverse gap-3 border-t border-white/5 pt-5 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:pt-6">
                  <button
                    type="button"
                    disabled={step === 0}
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    className="inline-flex items-center justify-center gap-1 py-2 text-sm text-mist transition enabled:hover:text-bone disabled:opacity-25 sm:justify-start"
                  >
                    <ChevronLeft className="size-4" />
                    Atrás
                  </button>
                  <button
                    type="submit"
                    disabled={!canNext()}
                    className="inline-flex w-full items-center justify-center gap-2 bg-signal px-6 py-3.5 text-sm font-semibold text-ink transition hover:bg-signal-dim disabled:cursor-not-allowed disabled:opacity-35 sm:w-auto"
                  >
                    {step === 2 ? "Enviar pedido" : "Siguiente"}
                    <ArrowUpRight className="size-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </Chapter>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-mist">{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="field"
      />
    </div>
  );
}
