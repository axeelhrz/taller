import type { Appointment, Client, WorkOrder } from "./types";

export const clients: Client[] = [
  {
    id: "c1",
    name: "María González",
    phone: "+598 99 123 456",
    email: "maria.g@email.com",
    vehicleCount: 2,
  },
  {
    id: "c2",
    name: "Carlos Pérez",
    phone: "+598 98 765 432",
    email: "cperez@email.com",
    vehicleCount: 1,
  },
  {
    id: "c3",
    name: "Ana Rodríguez",
    phone: "+598 91 222 333",
    email: "ana.r@email.com",
    vehicleCount: 1,
  },
  {
    id: "c4",
    name: "Luis Fernández",
    phone: "+598 94 555 666",
    email: "lfernandez@email.com",
    vehicleCount: 3,
  },
];

export const orders: WorkOrder[] = [
  {
    id: "OT-1042",
    clientName: "María González",
    vehicle: "Toyota Corolla 2019",
    plate: "ABC 1234",
    service: "Service completo + frenos",
    status: "en_proceso",
    mechanic: "Wilson",
    createdAt: "2026-09-08",
    estimatedReady: "2026-09-10",
    total: 18500,
  },
  {
    id: "OT-1041",
    clientName: "Carlos Pérez",
    vehicle: "VW Gol 2015",
    plate: "SJK 8821",
    service: "Diagnóstico motor",
    status: "diagnostico",
    mechanic: "Diego",
    createdAt: "2026-09-08",
    estimatedReady: "2026-09-09",
    total: 3200,
  },
  {
    id: "OT-1040",
    clientName: "Ana Rodríguez",
    vehicle: "Chevrolet Onix 2021",
    plate: "MNO 4410",
    service: "Cambio de aceite y filtros",
    status: "listo",
    mechanic: "Wilson",
    createdAt: "2026-09-07",
    estimatedReady: "2026-09-08",
    total: 4800,
  },
  {
    id: "OT-1039",
    clientName: "Luis Fernández",
    vehicle: "Ford Ranger 2018",
    plate: "XYZ 9901",
    service: "Suspensión delantera",
    status: "recibido",
    mechanic: "Diego",
    createdAt: "2026-09-09",
    estimatedReady: "2026-09-12",
    total: 24600,
  },
  {
    id: "OT-1038",
    clientName: "María González",
    vehicle: "Honda Civic 2016",
    plate: "QWE 2200",
    service: "Alineación y balanceo",
    status: "entregado",
    mechanic: "Wilson",
    createdAt: "2026-09-05",
    estimatedReady: "2026-09-05",
    total: 2900,
  },
];

export const appointments: Appointment[] = [
  {
    id: "a1",
    clientName: "Sofía Martínez",
    phone: "+598 99 888 777",
    vehicle: "Nissan Versa 2020",
    service: "Revisión pre-viaje",
    date: "2026-09-10",
    time: "09:30",
    status: "confirmada",
  },
  {
    id: "a2",
    clientName: "Pedro Álvarez",
    phone: "+598 92 111 000",
    vehicle: "Fiat Cronos 2022",
    service: "Ruido en frenos",
    date: "2026-09-10",
    time: "11:00",
    status: "pendiente",
    notes: "Cliente menciona chirrido al frenar",
  },
  {
    id: "a3",
    clientName: "Elena Castro",
    phone: "+598 95 444 555",
    vehicle: "Peugeot 208 2019",
    service: "Service 60.000 km",
    date: "2026-09-11",
    time: "10:00",
    status: "confirmada",
  },
  {
    id: "a4",
    clientName: "Jorge Silva",
    phone: "+598 97 333 222",
    vehicle: "Renault Sandero 2017",
    service: "Cambio de batería",
    date: "2026-09-09",
    time: "16:00",
    status: "completada",
  },
];

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
