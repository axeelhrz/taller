"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import { useRef } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 20 });
  const sy = useSpring(my, { stiffness: 40, damping: 20 });
  const imgX = useTransform(sx, [-0.5, 0.5], ["-2%", "2%"]);
  const imgY = useTransform(sy, [-0.5, 0.5], ["-1.5%", "1.5%"]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Solo se atenúa un poco; la imagen vive DENTRO del hero y se va con él
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.12]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55, 0.9], [1, 0.85, 0]);

  return (
    <section
      ref={ref}
      id="inicio"
      className="relative z-10 min-h-[100svh] overflow-hidden"
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        mx.set((e.clientX - rect.left) / rect.width - 0.5);
        my.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
    >
      {/* Imagen solo en el hero: al salir de esta zona, desaparece de verdad */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-[-4%]"
          style={{ x: imgX, y: imgY, scale: imageScale }}
        >
          <Image
            src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=2400&q=80"
            alt="Interior de taller mecánico"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/35 to-ink/45" />
        <div className="hero-dissolve absolute inset-0" />
      </div>

      <div className="relative z-10 flex min-h-[100svh] items-end">
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="mx-auto w-full max-w-6xl px-4 pb-24 pt-28 sm:px-6 sm:pb-28 sm:pt-36 md:pb-36"
        >
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4 text-[11px] font-medium uppercase tracking-[0.28em] text-signal sm:mb-5 sm:text-xs"
          >
            Taller mecánico
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.15, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[clamp(3rem,14vw,9rem)] leading-[0.86] text-bone"
          >
            Wilson
            <br />
            <span className="text-signal">Larrañaga</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.18 }}
            className="mt-5 max-w-md text-base text-mist/90 sm:mt-7 sm:text-lg md:text-xl"
          >
            Diagnóstico preciso, mano de obra honesta y tu auto de vuelta en
            ruta.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center"
          >
            <MagneticButton
              href="#contacto"
              className="btn-primary w-full px-6 py-3.5 text-sm sm:w-auto"
            >
              Reservar turno
              <ArrowDownRight className="size-4" />
            </MagneticButton>
            <MagneticButton
              href="#servicios"
              className="w-full border border-white/15 bg-ink/30 px-6 py-3.5 text-sm font-medium text-bone backdrop-blur-md transition hover:border-signal hover:text-signal sm:w-auto"
            >
              Seguir bajando
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1.2 }}
            className="mt-10 flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-mist sm:mt-16 sm:text-xs"
          >
            <span className="h-px w-8 bg-signal/70 sm:w-10" />
            Scroll
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
