"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type ToastKind = "success" | "info";

type ToastItem = {
  id: string;
  message: string;
  kind: ToastKind;
};

type ToastContextValue = {
  push: (message: string, kind?: ToastKind) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback((message: string, kind: ToastKind = "success") => {
    const id = crypto.randomUUID();
    setItems((prev) => [...prev, { id, message, kind }]);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[60] flex w-[min(100%-2rem,22rem)] flex-col gap-2">
        <AnimatePresence>
          {items.map((toast) => {
            const Icon = toast.kind === "success" ? CheckCircle2 : Info;
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 16, x: 12 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: 8, x: 12 }}
                className="pointer-events-auto flex items-start gap-3 border border-steel-mid bg-ink-soft/95 px-4 py-3 shadow-xl backdrop-blur"
              >
                <Icon className="mt-0.5 size-4 shrink-0 text-signal" />
                <p className="flex-1 text-sm text-bone">{toast.message}</p>
                <button
                  type="button"
                  className="text-mist hover:text-bone"
                  onClick={() =>
                    setItems((prev) => prev.filter((t) => t.id !== toast.id))
                  }
                >
                  <X className="size-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
