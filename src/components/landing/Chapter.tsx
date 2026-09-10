"use client";

import type { ReactNode } from "react";

/** Flujo continuo: sin cajas ni cortes de sección */
export function Chapter({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative z-10 scroll-mt-24 py-16 sm:scroll-mt-28 sm:py-24 md:py-32 ${className}`}
    >
      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        {children}
      </div>
    </section>
  );
}
