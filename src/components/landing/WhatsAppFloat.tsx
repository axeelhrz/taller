"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { workshopContact } from "@/lib/contact";

export function WhatsAppFloat() {
  return (
    <motion.a
      href={workshopContact.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      initial={{ opacity: 0, scale: 0.8, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.4 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-50 flex items-center gap-2 bg-[#25D366] px-3.5 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition hover:bg-[#1ebe57] sm:right-5 sm:px-4 md:bottom-[max(1.75rem,env(safe-area-inset-bottom))] md:right-7"
    >
      <span className="relative flex size-5 items-center justify-center">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-white/40 opacity-60" />
        <MessageCircle className="relative size-5" fill="currentColor" />
      </span>
      <span className="hidden sm:inline">WhatsApp</span>
    </motion.a>
  );
}
