import type { Appointment, Client, WorkOrder } from "./types";

/** Empieza vacío: el panel solo muestra lo que cargue el taller o llegue del sitio. */
export const clients: Client[] = [];

export const orders: WorkOrder[] = [];

export const appointments: Appointment[] = [];

export const statusLabels: Record<string, string> = {
  recibido: "Recibido",
  diagnostico: "Diagnóstico",
  en_proceso: "En proceso",
  listo: "Listo",
  entregado: "Entregado",
  pendiente: "Pendiente",
  confirmada: "Confirmada",
  completada: "Completada",
  cancelada: "Cancelada",
};

export function formatMoney(amount: number) {
  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "UYU",
    maximumFractionDigits: 0,
  }).format(amount);
}
