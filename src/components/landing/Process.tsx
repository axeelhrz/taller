"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Chapter } from "@/components/landing/Chapter";
import { Reveal } from "@/components/ui/Reveal";

const steps = [
  {
    n: "01",
    phase: "Ingreso",
    title: "Te escuchamos",
    headline: "El auto habla. Nosotros traducimos.",
    copy: "Contanos qué sentís al manejar. Después corremos diagnóstico, contrastamos con lo que describís y te mostramos el hallazgo — en criollo, sin humo técnico.",
    outcomes: [
      "Registro del síntoma",
      "Scanner + pruebas",
      "Hallazgo explicado",
    ],
  },
  {
    n: "02",
    phase: "Acuerdo",
    title: "Presupuesto cerrado",
    headline: "Nada se toca sin tu OK.",
    copy: "Te pasamos costos, tiempos y alternativas. Vos elegís el plan. Recién cuando aprobás, el auto entra a bahía. Sin letras chicas.",
    outcomes: [
      "Costos por escrito",
      "Tiempo estimado",
      "Aprobación antes de intervenir",
    ],
  },
  {
    n: "03",
    phase: "Taller",
    title: "Trabajo con seguimiento",
    headline: "Sabés en qué va, siempre.",
    copy: "Mientras está en el piso, actualizamos el estado de la orden. Si aparece algo extra, te avisamos antes — no después en la factura.",
    outcomes: [
      "Estado de la orden",
      "Avisos si cambia el alcance",
      "Mismo estándar en cada paso",
    ],
  },
  {
    n: "04",
    phase: "Salida",
    title: "Entrega probada",
    headline: "No se va hasta que rinda en ruta.",
    copy: "Probamos el trabajo, te devolvemos el auto y cerramos con garantía escrita de 90 días. Si algo no cierra, lo resolvemos.",
    outcomes: [
      "Prueba en ruta",
      "Garantía 90 días",
      "Entrega con checklist",
    ],
  },
];

export function Process() {
  const [active, setActive] = useState(0);
  const current = steps[active];

  return (
    <Chapter id="proceso">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-16">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-signal">
            Método Wilson
          </p>
          <h2 className="mt-3 font-display text-4xl leading-[0.92] text-bone sm:text-5xl md:text-7xl">
            Del ingreso
            <br />
            <span className="text-signal">a la entrega</span>
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-mist md:text-lg">
            Un proceso simple para que nunca te quedes a ciegas: qué tiene, qué
            cuesta, cómo va y cuándo sale.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          {/* Timeline selector */}
          <div className="relative">
            <div className="absolute left-0 right-0 top-[18px] hidden h-px bg-white/10 md:block" />
            <div
              className="absolute left-0 top-[18px] hidden h-px bg-signal transition-all duration-500 md:block"
              style={{ width: `${(active / (steps.length - 1)) * 100}%` }}
            />
            <ol className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-2">
              {steps.map((step, index) => {
                const isActive = active === index;
                const done = index <= active;
                return (
                  <li key={step.n}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(index)}
                      onFocus={() => setActive(index)}
                      onClick={() => setActive(index)}
                      className="group relative w-full pt-0 text-left md:pt-10"
                    >
                      <span
                        className={`relative z-10 mb-3 hidden size-2.5 rounded-full transition md:block ${
                          done ? "bg-signal" : "bg-white/20"
                        } ${isActive ? "ring-4 ring-signal/25" : ""}`}
                      />
                      <span
                        className={`font-display text-sm tracking-wide transition ${
                          isActive ? "text-signal" : "text-mist/50"
                        }`}
                      >
                        {step.n}
                      </span>
                      <span
                        className={`mt-1 block text-sm font-medium transition ${
                          isActive ? "text-bone" : "text-mist/70"
                        }`}
                      >
                        {step.phase}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.12} className="mt-12">
        <div className="relative overflow-hidden bg-[#10131a]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-signal/45 to-transparent" />
          <div className="pointer-events-none absolute -left-20 top-1/2 size-72 -translate-y-1/2 rounded-full bg-signal/10 blur-3xl" />

          <AnimatePresence mode="wait">
            <motion.div
              key={current.n}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-8 p-6 md:grid-cols-[0.7fr_1.3fr] md:gap-12 md:p-10"
            >
              <div>
                <p className="font-display text-7xl leading-none text-signal/30 md:text-8xl">
                  {current.n}
                </p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-signal">
                  {current.phase}
                </p>
                <h3 className="mt-2 font-display text-3xl tracking-wide text-bone md:text-4xl">
                  {current.title}
                </h3>
              </div>

              <div className="flex flex-col justify-center">
                <p className="font-display text-2xl leading-snug text-bone md:text-3xl">
                  {current.headline}
                </p>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-mist md:text-lg">
                  {current.copy}
                </p>
                <ul className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-3">
                  {current.outcomes.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 bg-white/[0.04] px-3 py-3 text-sm text-bone/90"
                    >
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-signal" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>
    </Chapter>
  );
}
