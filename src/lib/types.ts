export type OrderStatus =
  | "recibido"
  | "diagnostico"
  | "en_proceso"
  | "listo"
  | "entregado";

export type AppointmentStatus =
  | "pendiente"
  | "confirmada"
  | "completada"
  | "cancelada";

export type RequestStatus =
  | "nueva"
  | "contactado"
  | "agendada"
  | "descartada";

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicleCount: number;
}

export interface WorkOrder {
  id: string;
  clientName: string;
  vehicle: string;
  plate: string;
  service: string;
  status: OrderStatus;
  mechanic: string;
  createdAt: string;
  estimatedReady: string;
  total: number;
}

export interface Appointment {
  id: string;
  clientName: string;
  phone: string;
  vehicle: string;
  service: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes?: string;
}

export interface ServiceRequest {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  service: string;
  notes: string;
  createdAt: string;
  status: RequestStatus;
  source: "web";
}

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  nueva: "Nueva",
  contactado: "Contactado",
  agendada: "Agendada",
  descartada: "Descartada",
};
