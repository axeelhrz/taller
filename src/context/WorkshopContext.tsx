"use client";

import {
  appointments as seedAppointments,
  clients as seedClients,
  orders as seedOrders,
} from "@/lib/data";
import type {
  Appointment,
  AppointmentStatus,
  Client,
  OrderStatus,
  WorkOrder,
} from "@/lib/types";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type WorkshopContextValue = {
  clients: Client[];
  orders: WorkOrder[];
  appointments: Appointment[];
  addClient: (input: Omit<Client, "id" | "vehicleCount"> & { vehicleCount?: number }) => void;
  addOrder: (
    input: Omit<WorkOrder, "id" | "createdAt" | "status"> & {
      status?: OrderStatus;
    },
  ) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  addAppointment: (
    input: Omit<Appointment, "id" | "status"> & { status?: AppointmentStatus },
  ) => void;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
};

const WorkshopContext = createContext<WorkshopContextValue | null>(null);

export function WorkshopProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState(seedClients);
  const [orders, setOrders] = useState(seedOrders);
  const [appointments, setAppointments] = useState(seedAppointments);

  const addClient = useCallback(
    (input: Omit<Client, "id" | "vehicleCount"> & { vehicleCount?: number }) => {
      setClients((prev) => [
        {
          id: `c${Date.now()}`,
          vehicleCount: input.vehicleCount ?? 1,
          ...input,
        },
        ...prev,
      ]);
    },
    [],
  );

  const addOrder = useCallback(
    (
      input: Omit<WorkOrder, "id" | "createdAt" | "status"> & {
        status?: OrderStatus;
      },
    ) => {
      const nextId = `OT-${1043 + Math.floor(Math.random() * 80)}`;
      setOrders((prev) => [
        {
          id: nextId,
          createdAt: new Date().toISOString().slice(0, 10),
          status: input.status ?? "recibido",
          ...input,
        },
        ...prev,
      ]);
    },
    [],
  );

  const updateOrderStatus = useCallback((id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order)),
    );
  }, []);

  const addAppointment = useCallback(
    (
      input: Omit<Appointment, "id" | "status"> & {
        status?: AppointmentStatus;
      },
    ) => {
      setAppointments((prev) => [
        {
          id: `a${Date.now()}`,
          status: input.status ?? "pendiente",
          ...input,
        },
        ...prev,
      ]);
    },
    [],
  );

  const updateAppointmentStatus = useCallback(
    (id: string, status: AppointmentStatus) => {
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? { ...apt, status } : apt)),
      );
    },
    [],
  );

  const value = useMemo(
    () => ({
      clients,
      orders,
      appointments,
      addClient,
      addOrder,
      updateOrderStatus,
      addAppointment,
      updateAppointmentStatus,
    }),
    [
      clients,
      orders,
      appointments,
      addClient,
      addOrder,
      updateOrderStatus,
      addAppointment,
      updateAppointmentStatus,
    ],
  );

  return (
    <WorkshopContext.Provider value={value}>{children}</WorkshopContext.Provider>
  );
}

export function useWorkshop() {
  const ctx = useContext(WorkshopContext);
  if (!ctx) throw new Error("useWorkshop must be used within WorkshopProvider");
  return ctx;
}
