"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Clock3,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Chapter } from "@/components/landing/Chapter";
import { Reveal } from "@/components/ui/Reveal";
import { useSiteSettings } from "@/context/SiteSettingsContext";

const services = [
  {
    code: "01",
    title: "Diagnóstico real",
    tagline: "Antes de cambiar piezas, sabemos qué falla.",
    copy: "Escáner, pruebas en ruta y un informe claro: qué tiene, por qué, y qué conviene hacer primero.",
    includes: ["Lectura OBD", "Prueba de sensores", "Prioridad de reparación"],
    time: "45–90 min",
    badge: "El punto de partida",
  },
  {
    code: "02",
    title: "Service inteligente",
    tagline: "Mantenimiento según cómo usás el auto.",
    copy: "Aceite, filtros y revisiones alineadas al fabricante — y a tu kilometraje real, no a un paquete genérico.",
    includes: ["Aceite y filtros", "Revisión de fluidos", "Historial del vehículo"],
    time: "1–2 h",
    badge: "Más pedido",
  },
  {
    code: "03",
    title: "Frenos & tren delantero",
    tagline: "Seguridad que se siente al pedalear.",
    copy: "Medimos desgaste, te mostramos el estado y trabajamos con presupuesto cerrado. Sin sorpresas en la factura.",
    includes: ["Pastillas y discos", "Amortiguación", "Alineación"],
    time: "2–4 h",
    badge: "Seguridad",
  },
  {
    code: "04",
    title: "Motor & transmisión",
    tagline: "Reparaciones con seguimiento, no con misterio.",
    copy: "Desde un arreglo puntual hasta un trabajo mayor: te actualizamos el avance y los tiempos mientras está en el piso.",
    includes: ["Diagnóstico profundo", "Fotos del progreso", "Entrega con prueba"],
    time: "Según caso",
    badge: "Especialidad",
  },
  {
    code: "05",
    title: "Climatización",
    tagline: "Frío que rinde, no solo carga de gas.",
    copy: "Detectamos fugas, equilibramos el sistema y verificamos rendimiento en cabina antes de darlo por terminado.",
    includes: ["Detección de fugas", "Carga correcta", "Prueba de cabina"],
    time: "1–3 h",
    badge: "Confort",
  },
  {
    code: "06",
    title: "Pre-inspección",
    tagline: "Que la ITV no te agarre desprevenido.",
    copy: "Chequeo de luces, frenos, emisiones y puntos críticos. Corregimos lo urgente y te dejamos listo para pasar.",
    includes: ["Checklist completo", "Corrección prioritaria", "Consejo honesto"],
    time: "1–2 h",
    badge: "Tranquilidad",
  },
];

export function Services() {
  const { contact } = useSiteSettings();
  const [active, setActive] = useState(1);
  const current = services[active];

  return (
    <Chapter id="servicios">
      <div className="grid items-end gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <Reveal className="max-w-xl">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-signal">
            Bahías de trabajo
          </p>
          <h2 className="mt-3 font-display text-4xl leading-[0.92] text-bone sm:text-5xl md:text-7xl">
            Servicio
            <br />
            <span className="text-signal">con criterio</span>
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-mist md:text-lg">
            No adivinamos. Diagnosticamos, te explicamos y recién ahí
            intervenimos — con el mismo estándar en cada auto que entra.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="hidden lg:block">
          <div className="flex items-center justify-end gap-6 text-sm text-mist">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="size-4 text-signal" />
              Garantía 90 días
            </span>
            <span className="h-3 w-px bg-white/15" />
            <span className="inline-flex items-center gap-2">
              <Sparkles className="size-4 text-signal" />
              Presupuesto antes de tocar
            </span>
          </div>
        </Reveal>
      </div>

      <div className="mt-10 grid gap-6 sm:mt-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8">
        <Reveal className="order-1 lg:order-1">
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {services.map((service, index) => {
              const isActive = active === index;
              return (
                <li key={service.code}>
                  <button
                    type="button"
                    onMouseEnter={() => {
                      if (window.matchMedia("(hover: hover)").matches) {
                        setActive(index);
                      }
                    }}
                    onFocus={() => setActive(index)}
                    onClick={() => setActive(index)}
                    className={`group flex w-full items-center gap-3 py-3.5 text-left transition duration-300 sm:gap-4 sm:py-4 md:gap-5 md:py-5 ${
                      isActive ? "opacity-100" : "opacity-55 hover:opacity-90"
                    }`}
                  >
                    <span
                      className={`font-display text-xl tracking-wide transition sm:text-2xl md:text-3xl ${
                        isActive ? "text-signal" : "text-mist/50"
                      }`}
                    >
                      {service.code}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block font-display text-lg tracking-wide sm:text-xl md:text-2xl ${
                          isActive ? "text-bone" : "text-mist"
                        }`}
                      >
                        {service.title}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-mist/70 sm:text-sm">
                        {service.tagline}
                      </span>
                    </span>
                    <span
                      className={`size-2 shrink-0 rounded-full transition ${
                        isActive ? "scale-100 bg-signal" : "scale-75 bg-white/15"
                      }`}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </Reveal>

        <Reveal delay={0.08} className="order-2">
          <div className="relative overflow-hidden bg-[#10131a] p-5 sm:p-6 md:min-h-[480px] md:p-9">
            <div className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-signal/10 blur-3xl" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-signal/50 to-transparent" />

            <AnimatePresence mode="wait">
              <motion.div
                key={current.code}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex h-full flex-col"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-signal/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-signal">
                    {current.badge}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-mist">
                    <Clock3 className="size-3.5 text-signal" />
                    {current.time}
                  </span>
                </div>

                <p className="mt-5 font-display text-5xl leading-none text-signal/25 sm:mt-6 sm:text-6xl md:text-8xl">
                  {current.code}
                </p>

                <h3 className="mt-2 font-display text-3xl tracking-wide text-bone sm:text-4xl md:text-5xl">
                  {current.title}
                </h3>
                <p className="mt-2 text-base text-signal/90 sm:text-lg">
                  {current.tagline}
                </p>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-mist sm:mt-5 sm:text-base">
                  {current.copy}
                </p>

                <ul className="mt-6 flex flex-wrap gap-2 sm:mt-8">
                  {current.includes.map((item) => (
                    <li
                      key={item}
                      className="bg-white/[0.05] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-bone/85 sm:text-xs"
                    >
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-col gap-3 pt-2 sm:mt-auto sm:flex-row sm:flex-wrap sm:items-center sm:pt-10">
                  <a
                    href="#contacto"
                    className="inline-flex w-full items-center justify-center gap-2 bg-signal px-5 py-3 text-sm font-semibold text-ink transition hover:bg-signal-dim sm:w-auto"
                  >
                    Pedir este servicio
                    <ArrowUpRight className="size-4" />
                  </a>
                  <a
                    href={contact.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 px-3 py-3 text-sm font-medium text-mist transition hover:text-bone sm:w-auto sm:justify-start"
                  >
                    Consultar por WhatsApp
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </Chapter>
  );
}
