import { statusLabels } from "@/lib/data";
import type { AppointmentStatus, OrderStatus } from "@/lib/types";

const orderStyles: Record<OrderStatus, string> = {
  recibido: "bg-steel-mid text-mist",
  diagnostico: "bg-warn/20 text-warn",
  en_proceso: "bg-signal/15 text-signal",
  listo: "bg-ok/20 text-ok",
  entregado: "bg-steel text-mist",
};

const appointmentStyles: Record<AppointmentStatus, string> = {
  pendiente: "bg-warn/20 text-warn",
  confirmada: "bg-signal/15 text-signal",
  completada: "bg-ok/20 text-ok",
  cancelada: "bg-danger/20 text-danger",
};

export function StatusBadge({
  status,
  kind = "order",
}: {
  status: OrderStatus | AppointmentStatus;
  kind?: "order" | "appointment";
}) {
  const styles =
    kind === "order"
      ? orderStyles[status as OrderStatus]
      : appointmentStyles[status as AppointmentStatus];

  return (
    <span
      className={`inline-flex px-2.5 py-1 text-xs font-medium uppercase tracking-wide ${styles}`}
    >
      {statusLabels[status]}
    </span>
  );
}
