"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { workshopContact } from "@/lib/contact";

const links = [
  { href: "#servicios", label: "Servicios" },
  { href: "#proceso", label: "Proceso" },
  { href: "#taller", label: "El taller" },
  { href: "#ubicacion", label: "Ubicación" },
  { href: "#contacto", label: "Contacto" },
];

export function PublicNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = links
      .map((l) => document.querySelector(l.href))
      .filter(Boolean) as Element[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: [0.1, 0.35, 0.6] },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-4 md:px-6 md:pt-4">
      <motion.nav
        animate={{
          backgroundColor: scrolled
            ? "rgba(12, 14, 18, 0.62)"
            : "rgba(12, 14, 18, 0.38)",
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="nav-shell mx-auto flex max-w-6xl items-center justify-between gap-2 px-2.5 py-2 sm:gap-4 sm:px-3 sm:py-2.5 md:px-5 md:py-3"
      >
        {/* Logo industrial */}
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-2.5 sm:gap-3"
          onClick={() => setOpen(false)}
        >
          <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden bg-signal sm:size-10">
            <span className="absolute inset-x-0 top-0 h-px bg-white/40" />
            <span className="font-display text-base tracking-[0.08em] text-ink sm:text-lg">
              WL
            </span>
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-ink/20" />
          </span>
          <span className="hidden min-w-0 leading-none sm:block">
            <span className="block truncate font-display text-[1.05rem] tracking-[0.1em] text-bone transition group-hover:text-signal sm:text-[1.15rem] md:text-[1.25rem]">
              Wilson Larrañaga
            </span>
            <span className="mt-1 hidden text-[10px] font-medium uppercase tracking-[0.28em] text-mist md:block">
              Taller mecánico
            </span>
          </span>
        </Link>

        {/* Links — desde lg para no apretar en tablet */}
        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 lg:flex">
          {links.map((link) => {
            const isActive = active === link.href;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`relative px-2.5 py-2 text-[13px] font-medium tracking-wide transition xl:px-3 ${
                    isActive
                      ? "text-bone"
                      : "text-mist/85 hover:text-bone"
                  }`}
                >
                  {link.label}
                  {isActive ? (
                    <motion.span
                      layoutId="nav-line"
                      className="absolute inset-x-2.5 -bottom-0.5 h-[2px] bg-signal xl:inset-x-3"
                      transition={{
                        type: "spring",
                        stiffness: 480,
                        damping: 36,
                      }}
                    />
                  ) : null}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Acciones */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <a
            href={`tel:${workshopContact.phoneTel}`}
            className="hidden items-center gap-2 bg-white/[0.06] px-3 py-2 text-xs font-medium text-mist transition hover:bg-white/[0.1] hover:text-bone xl:inline-flex"
          >
            <Phone className="size-3.5 text-signal" />
            {workshopContact.phoneDisplay}
          </a>
          <a
            href="#contacto"
            className="hidden items-center gap-2 bg-signal px-3.5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink transition hover:bg-signal-dim sm:inline-flex md:px-4"
          >
            Reservar
            <span aria-hidden className="text-ink/50">
              →
            </span>
          </a>
          <Link
            href="/panel"
            className="hidden text-xs font-medium uppercase tracking-[0.16em] text-mist/70 transition hover:text-signal xl:inline"
          >
            Panel
          </Link>
          <button
            type="button"
            className="bg-white/[0.06] p-2.5 text-bone transition hover:bg-white/[0.1] hover:text-signal lg:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
            className="nav-shell mx-auto mt-2 max-h-[min(80svh,560px)] max-w-6xl overflow-y-auto lg:hidden"
            style={{ backgroundColor: "rgba(12, 14, 18, 0.88)" }}
          >
            <ul className="p-2">
              {links.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between px-4 py-3.5 text-base transition ${
                      active === link.href
                        ? "bg-signal/10 text-signal"
                        : "text-bone hover:bg-white/[0.04]"
                    }`}
                  >
                    {link.label}
                    <span className="font-display text-sm text-mist/40">
                      0{i + 1}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="grid grid-cols-2 gap-2 border-t border-white/5 p-3 sm:grid-cols-3">
              <a
                href={`tel:${workshopContact.phoneTel}`}
                className="inline-flex items-center justify-center gap-2 bg-white/[0.06] py-3 text-sm text-bone"
              >
                <Phone className="size-4 text-signal" />
                Llamar
              </a>
              <a
                href="#contacto"
                onClick={() => setOpen(false)}
                className="btn-primary inline-flex items-center justify-center py-3 text-sm"
              >
                Reservar
              </a>
              <Link
                href="/panel"
                onClick={() => setOpen(false)}
                className="col-span-2 inline-flex items-center justify-center bg-white/[0.06] py-3 text-sm text-mist sm:col-span-1"
              >
                Panel
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
