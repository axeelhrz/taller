"use client";

import dynamic from "next/dynamic";
import {
  Clock3,
  Copy,
  ExternalLink,
  MapPin,
  Navigation,
  Phone,
  Check,
} from "lucide-react";
import { useState } from "react";
import { Chapter } from "@/components/landing/Chapter";
import { Reveal } from "@/components/ui/Reveal";
import { useSiteSettings } from "@/context/SiteSettingsContext";

const WorkshopMap = dynamic(() => import("./WorkshopMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[420px] items-center justify-center bg-[#10131a] text-sm text-mist">
      Cargando mapa…
    </div>
  ),
});

export function Location() {
  const { contact } = useSiteSettings();
  const [copied, setCopied] = useState(false);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(
        `${contact.addressLine}, ${contact.addressRegion}`,
      );
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  }

  return (
    <Chapter id="ubicacion">
      <div className="grid items-end gap-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-signal">
            Ubicación
          </p>
          <h2 className="mt-3 font-display text-4xl leading-[0.92] text-bone sm:text-5xl md:text-7xl">
            Encontrá
            <br />
            <span className="text-signal">el taller</span>
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-mist md:text-lg">
            Estamos en Montevideo. Pedí indicaciones, copiá la dirección o
            escribinos antes de venir — te orientamos sin vueltas.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="lg:justify-self-end">
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <a
              href={contact.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 bg-signal px-5 py-3 text-sm font-semibold text-ink transition hover:bg-signal-dim sm:w-auto"
            >
              <Navigation className="size-4" />
              Indicaciones
            </a>
            <a
              href={contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 bg-white/[0.06] px-5 py-3 text-sm font-medium text-bone transition hover:bg-white/[0.1] sm:w-auto"
            >
              Avisar que voy
            </a>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="mt-12">
        <div className="relative overflow-hidden bg-[#10131a]">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-signal/45 to-transparent" />

          <div className="grid lg:grid-cols-[0.95fr_1.25fr]">
            <div className="relative z-30 flex flex-col justify-between gap-8 border-b border-white/5 p-6 md:p-9 lg:border-b-0 lg:border-r lg:border-white/5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-signal">
                  Dirección
                </p>
                <div className="mt-3 flex flex-wrap items-end gap-3">
                  <p className="font-display text-3xl tracking-wide text-bone sm:text-4xl md:text-5xl">
                    {contact.addressLine}
                  </p>
                  <button
                    type="button"
                    onClick={copyAddress}
                    className="mb-1.5 inline-flex items-center gap-1.5 bg-white/[0.06] px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] text-mist transition hover:bg-white/[0.1] hover:text-bone"
                  >
                    {copied ? (
                      <>
                        <Check className="size-3.5 text-signal" />
                        Copiado
                      </>
                    ) : (
                      <>
                        <MapPin className="size-3.5" />
                        Copiar
                      </>
                    )}
                  </button>
                </div>
                <p className="mt-3 text-mist">{contact.addressRegion}</p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-signal">
                    <Phone className="size-3.5" />
                    Contacto
                  </p>
                  <a
                    href={`tel:${contact.phoneTel}`}
                    className="mt-3 block font-display text-2xl text-bone transition hover:text-signal"
                  >
                    {contact.phoneDisplay}
                  </a>
                  <a
                    href={contact.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm text-mist underline-offset-4 transition hover:text-signal hover:underline"
                  >
                    WhatsApp directo
                  </a>
                </div>

                <div>
                  <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-signal">
                    <Clock3 className="size-3.5" />
                    Horario
                  </p>
                  <ul className="mt-3 space-y-2">
                    {contact.schedule.map((row) => (
                      <li
                        key={row.day}
                        className="flex items-baseline justify-between gap-3 text-sm"
                      >
                        <span className="text-mist">{row.day}</span>
                        <span
                          className={
                            row.hours.toLowerCase() === "cerrado"
                              ? "text-mist/50"
                              : "text-right font-medium text-bone"
                          }
                        >
                          {row.hours}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <a
                href={contact.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-2 text-sm font-medium text-mist transition hover:text-signal"
              >
                Abrir en Google Maps
                <ExternalLink className="size-3.5" />
              </a>
            </div>

            <div className="relative h-[300px] sm:h-[400px] lg:h-full lg:min-h-[520px]">
              <WorkshopMap lat={contact.lat} lng={contact.lng} />
              <div className="pointer-events-none absolute inset-x-0 top-0 z-[450] h-16 bg-gradient-to-b from-[#10131a]/80 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[450] h-16 bg-gradient-to-t from-[#10131a]/70 to-transparent" />
            </div>
          </div>
        </div>
      </Reveal>
    </Chapter>
  );
}
