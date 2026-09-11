"use client";

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
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  listenWorkshop,
  saveWorkshopToFirestore,
  type WorkshopData,
} from "@/lib/firebase/data";

type WorkshopContextValue = {
  clients: Client[];
  orders: WorkOrder[];
  appointments: Appointment[];
  ready: boolean;
  addClient: (
    input: Omit<Client, "id" | "vehicleCount"> & { vehicleCount?: number },
  ) => Promise<void>;
  addOrder: (
    input: Omit<WorkOrder, "id" | "createdAt" | "status"> & {
      status?: OrderStatus;
    },
  ) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  addAppointment: (
    input: Omit<Appointment, "id" | "status"> & { status?: AppointmentStatus },
  ) => Promise<void>;
  updateAppointmentStatus: (
    id: string,
    status: AppointmentStatus,
  ) => Promise<void>;
};

const WorkshopContext = createContext<WorkshopContextValue | null>(null);

export function WorkshopProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<WorkshopData>({
    clients: [],
    orders: [],
    appointments: [],
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = listenWorkshop(
      (next) => {
        setData(next);
        setReady(true);
      },
      () => setReady(true),
    );
    return () => unsub();
  }, []);

  const persist = useCallback(async (next: WorkshopData) => {
    await saveWorkshopToFirestore(next);
    setData(next);
  }, []);

  const addClient = useCallback(
    async (
      input: Omit<Client, "id" | "vehicleCount"> & { vehicleCount?: number },
    ) => {
      await persist({
        ...data,
        clients: [
          {
            id: `c${Date.now()}`,
            vehicleCount: input.vehicleCount ?? 1,
            ...input,
          },
          ...data.clients,
        ],
      });
    },
    [data, persist],
  );

  const addOrder = useCallback(
    async (
      input: Omit<WorkOrder, "id" | "createdAt" | "status"> & {
        status?: OrderStatus;
      },
    ) => {
      await persist({
        ...data,
        orders: [
          {
            id: `OT-${Date.now().toString().slice(-4)}`,
            createdAt: new Date().toISOString().slice(0, 10),
            status: input.status ?? "recibido",
            ...input,
          },
          ...data.orders,
        ],
      });
    },
    [data, persist],
  );

  const updateOrderStatus = useCallback(
    async (id: string, status: OrderStatus) => {
      await persist({
        ...data,
        orders: data.orders.map((order) =>
          order.id === id ? { ...order, status } : order,
        ),
      });
    },
    [data, persist],
  );

  const addAppointment = useCallback(
    async (
      input: Omit<Appointment, "id" | "status"> & {
        status?: AppointmentStatus;
      },
    ) => {
      await persist({
        ...data,
        appointments: [
          {
            id: `a${Date.now()}`,
            status: input.status ?? "pendiente",
            ...input,
          },
          ...data.appointments,
        ],
      });
    },
    [data, persist],
  );

  const updateAppointmentStatus = useCallback(
    async (id: string, status: AppointmentStatus) => {
      await persist({
        ...data,
        appointments: data.appointments.map((apt) =>
          apt.id === id ? { ...apt, status } : apt,
        ),
      });
    },
    [data, persist],
  );

  const value = useMemo(
    () => ({
      clients: data.clients,
      orders: data.orders,
      appointments: data.appointments,
      ready,
      addClient,
      addOrder,
      updateOrderStatus,
      addAppointment,
      updateAppointmentStatus,
    }),
    [
      data,
      ready,
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
