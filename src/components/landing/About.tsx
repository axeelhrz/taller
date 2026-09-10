"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Chapter } from "@/components/landing/Chapter";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";

const principles = [
  {
    n: "01",
    title: "Sin letra chica",
    copy: "Te decimos qué necesita el auto, por qué, y el costo — antes de tocar una tuerca.",
  },
  {
    n: "02",
    title: "Mano de obra seria",
    copy: "Herramientas actuales, repuestos de calidad y el mismo cuidado en cada orden.",
  },
  {
    n: "03",
    title: "Compromiso escrito",
    copy: "Salís con prueba en ruta y garantía de 90 días. Si algo no cierra, lo resolvemos.",
  },
];

const stats = [
  {
    value: 15,
    suffix: "+",
    label: "Años en el oficio",
    hint: "Criterio ganado en el piso",
  },
  {
    value: 800,
    suffix: "+",
    label: "Órdenes al año",
    hint: "Ritmo real de taller",
  },
  {
    value: 90,
    suffix: " días",
    label: "Garantía",
    hint: "Por escrito, siempre",
  },
];

export function About() {
  return (
    <Chapter id="taller">
      <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-signal">
              El taller
            </p>
            <h2 className="mt-3 font-display text-4xl leading-[0.92] text-bone sm:text-5xl md:text-7xl">
              Oficio
              <br />
              <span className="text-signal">que se nota</span>
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-mist md:text-xl">
              Wilson Larrañaga no es un mostrador que cotiza y desaparece. Acá
              te explicamos el problema, el plan y el precio — y después
              ejecutamos con el auto como si fuera propio.
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <ul className="mt-10 divide-y divide-white/8 border-y border-white/8">
              {principles.map((item) => (
                <li
                  key={item.n}
                  className="grid grid-cols-[auto_1fr] gap-4 py-5 md:gap-6"
                >
                  <span className="font-display text-xl text-signal/70">
                    {item.n}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl tracking-wide text-bone">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-mist md:text-base">
                      {item.copy}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.16}>
            <a
              href="#contacto"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-signal transition hover:text-bone"
            >
              Hablar con el taller
              <ArrowUpRight className="size-4" />
            </a>
          </Reveal>
        </div>

        <div className="flex flex-col gap-4">
          <Reveal>
            <div className="relative aspect-[4/5] min-h-[280px] overflow-hidden md:aspect-[3/4]">
              <Image
                src="https://images.unsplash.com/photo-1625047509248-ec889cbff17f?auto=format&fit=crop&w=1200&q=80"
                alt="Mecánico trabajando en motor de vehículo"
                fill
                className="object-cover transition duration-[1.2s] hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-signal/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-signal">
                  En el piso
                </p>
                <p className="mt-2 max-w-xs font-display text-2xl leading-tight text-bone md:text-3xl">
                  Cada orden con seguimiento. Cada entrega con prueba.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="grid grid-cols-3 gap-px bg-white/10">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-ink px-2 py-4 sm:px-3 sm:py-5 md:px-4 md:py-6"
                >
                  <dt className="text-[9px] uppercase tracking-[0.12em] text-mist sm:text-[10px] sm:tracking-[0.16em]">
                    {stat.label}
                  </dt>
                  <dd className="mt-2 font-display text-2xl text-signal sm:text-3xl md:text-4xl">
                    <CountUp value={stat.value} suffix={stat.suffix} />
                  </dd>
                  <p className="mt-1 hidden text-xs text-mist/70 sm:block">
                    {stat.hint}
                  </p>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </Chapter>
  );
}
