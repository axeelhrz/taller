"use client";

import { animate, useInView, useMotionValue, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

type Props = {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  formatter?: (n: number) => string;
};

export function CountUp({
  value,
  suffix = "",
  prefix = "",
  duration = 1.4,
  className,
  formatter,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      if (ref.current) {
        ref.current.textContent = `${prefix}${
          formatter ? formatter(value) : value
        }${suffix}`;
      }
      return;
    }

    const controls = animate(motionValue, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        if (!ref.current) return;
        const n = Math.round(latest);
        ref.current.textContent = `${prefix}${
          formatter ? formatter(n) : n
        }${suffix}`;
      },
    });

    return () => controls.stop();
  }, [duration, formatter, inView, motionValue, prefix, reduce, suffix, value]);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
