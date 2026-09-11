"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronLeft,
  MessageCircle,
  Phone,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { Chapter } from "@/components/landing/Chapter";
import { Reveal } from "@/components/ui/Reveal";
import { useToast } from "@/components/ui/Toast";
import { useRequests } from "@/context/RequestsContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";

type StepId = "contact" | "vehicle" | "detail";

export function Contact() {
  const { contact, form } = useSiteSettings();
  const { submitRequest } = useRequests();
  const { push } = useToast();
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [values, setValues] = useState({
    name: "",
    phone: "",
    vehicle: "",
    service: "",
    notes: "",
  });

  const steps = useMemo(() => {
    const list: Array<{ id: StepId; label: string; title: string }> = [
      { id: "contact", label: "Datos", title: form.stepContactTitle },
    ];
    if (form.askVehicle || form.askService) {
      list.push({
        id: "vehicle",
        label: "Vehículo",
        title: form.stepVehicleTitle,
      });
    }
    if (form.askNotes) {
      list.push({
        id: "detail",
        label: "Detalle",
        title: form.stepDetailTitle,
      });
    }
    return list;
  }, [form]);

  const current = steps[Math.min(step, steps.length - 1)];

  function update<K extends keyof typeof values>(key: K, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function canNext() {
    if (!current) return false;
    if (current.id === "contact") {
      return values.name.trim().length > 1 && values.phone.trim().length > 6;
    }
    if (current.id === "vehicle") {
      if (form.askVehicle && values.vehicle.trim().length < 3) return false;
      if (form.askService && !values.service) return false;
      return true;
    }
    return true;
  }

  function resetForm() {
    setSent(false);
    setRequestId("");
    setStep(0);
    setValues({
      name: "",
      phone: "",
      vehicle: "",
      service: "",
      notes: "",
    });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canNext()) return;

    if (step < steps.length - 1) {
      setStep((s) => s + 1);
      return;
    }

    const created = submitRequest({
      name: values.name.trim(),
      phone: values.phone.trim(),
      vehicle: form.askVehicle ? values.vehicle.trim() : "",
      service: form.askService ? values.service : "Consulta",
      notes: form.askNotes ? values.notes.trim() : "",
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
            {form.intro}
          </p>

          <div className="mt-10 space-y-3">
            <a
              href={contact.whatsappUrl}
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
              href={`tel:${contact.phoneTel}`}
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
                    {contact.phoneDisplay}
                  </span>
                </span>
              </span>
              <ArrowUpRight className="size-4 text-mist" />
            </a>
          </div>

          <p className="mt-6 text-sm text-mist/70">
            {contact.scheduleSummary} · {contact.addressLine}
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
                  {form.successTitle}
                </h3>
                <p className="mt-3 max-w-md text-mist">
                  Gracias, {values.name.split(" ")[0] || "cliente"}.{" "}
                  {form.successMessage}
                  {requestId ? (
                    <>
                      {" "}
                      Código:{" "}
                      <span className="font-medium text-signal">{requestId}</span>
                    </>
                  ) : null}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={contact.whatsappUrl}
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
                {steps.length > 1 ? (
                  <div className="mb-6 sm:mb-8">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      {steps.map((meta, i) => (
                        <button
                          key={meta.id}
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
                        animate={{
                          width: `${((step + 1) / steps.length) * 100}%`,
                        }}
                        transition={{ duration: 0.35 }}
                      />
                    </div>
                  </div>
                ) : null}

                <AnimatePresence mode="wait">
                  <motion.div
                    key={current?.id ?? "step"}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="min-h-[240px] sm:min-h-[260px]"
                  >
                    <h3 className="font-display text-2xl tracking-wide text-bone sm:text-3xl">
                      {current?.title}
                    </h3>

                    {current?.id === "contact" ? (
                      <div className="mt-6 space-y-4">
                        <Field
                          label={form.nameLabel}
                          placeholder={form.namePlaceholder}
                          value={values.name}
                          onChange={(v) => update("name", v)}
                          required
                        />
                        <Field
                          label={form.phoneLabel}
                          type="tel"
                          placeholder={form.phonePlaceholder}
                          value={values.phone}
                          onChange={(v) => update("phone", v)}
                          required
                        />
                      </div>
                    ) : null}

                    {current?.id === "vehicle" ? (
                      <div className="mt-6 space-y-5">
                        {form.askVehicle ? (
                          <Field
                            label={form.vehicleLabel}
                            placeholder={form.vehiclePlaceholder}
                            value={values.vehicle}
                            onChange={(v) => update("vehicle", v)}
                            required
                          />
                        ) : null}
                        {form.askService ? (
                          <div>
                            <p className="mb-3 text-sm text-mist">
                              {form.serviceLabel}
                            </p>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                              {form.services.map((s) => {
                                const selected = values.service === s;
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
                        ) : null}
                      </div>
                    ) : null}

                    {current?.id === "detail" ? (
                      <div className="mt-6 space-y-5">
                        <div>
                          <label
                            htmlFor="notes"
                            className="mb-2 block text-sm text-mist"
                          >
                            {form.notesLabel}
                          </label>
                          <textarea
                            id="notes"
                            rows={4}
                            value={values.notes}
                            onChange={(e) => update("notes", e.target.value)}
                            className="field resize-none"
                            placeholder={form.notesPlaceholder}
                          />
                        </div>
                        <div className="bg-white/[0.04] p-4 text-sm">
                          <p className="text-[10px] uppercase tracking-[0.16em] text-signal">
                            Resumen
                          </p>
                          <p className="mt-2 text-bone">
                            {values.name} · {values.phone}
                          </p>
                          {(values.vehicle || values.service) && (
                            <p className="mt-1 text-mist">
                              {[values.vehicle, values.service]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                          )}
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
                    {step === steps.length - 1 ? form.submitLabel : "Siguiente"}
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
