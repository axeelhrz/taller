import Link from "next/link";
import { workshopContact } from "@/lib/contact";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 py-12 sm:py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-2xl tracking-[0.08em] text-bone sm:text-3xl">
            Wilson Larrañaga
          </p>
          <p className="mt-2 max-w-xs text-sm text-mist">
            Taller mecánico con diagnóstico preciso y seguimiento transparente.
          </p>
          <p className="mt-3 flex flex-col gap-1 text-sm text-mist sm:block">
            <a
              href={`tel:${workshopContact.phoneTel}`}
              className="transition hover:text-signal"
            >
              {workshopContact.phoneDisplay}
            </a>
            <span className="hidden sm:inline"> · </span>
            <a
              href={workshopContact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-signal"
            >
              {workshopContact.addressLine}
            </a>
          </p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-mist">
          <a href="#servicios" className="transition hover:text-bone">
            Servicios
          </a>
          <a href="#proceso" className="transition hover:text-bone">
            Proceso
          </a>
          <a href="#ubicacion" className="transition hover:text-bone">
            Ubicación
          </a>
          <a href="#contacto" className="transition hover:text-bone">
            Contacto
          </a>
          <Link href="/panel" className="transition hover:text-signal">
            Panel
          </Link>
        </div>
        <p className="text-xs text-mist/70">
          © {new Date().getFullYear()} Wilson Larrañaga
        </p>
      </div>
    </footer>
  );
}
