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
  useRef,
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
  updateAppointment: (
    id: string,
    patch: Partial<Pick<Appointment, "date" | "time" | "status" | "notes">>,
  ) => Promise<void>;
  removeAppointment: (id: string) => Promise<void>;
  /** Guarda cita + cliente en una sola escritura (evita pisar datos). */
  scheduleRequest: (input: {
    clientName: string;
    phone: string;
    vehicle: string;
    service: string;
    notes?: string;
    date?: string;
    time?: string;
  }) => Promise<void>;
};

const WorkshopContext = createContext<WorkshopContextValue | null>(null);

const empty: WorkshopData = {
  clients: [],
  orders: [],
  appointments: [],
};

export function WorkshopProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<WorkshopData>(empty);
  const [ready, setReady] = useState(false);
  const dataRef = useRef<WorkshopData>(empty);

  useEffect(() => {
    const unsub = listenWorkshop(
      (next) => {
        dataRef.current = next;
        setData(next);
        setReady(true);
      },
      () => setReady(true),
    );
    return () => unsub();
  }, []);

  const persist = useCallback(
    async (updater: (prev: WorkshopData) => WorkshopData) => {
      const next = updater(dataRef.current);
      dataRef.current = next;
      setData(next);
      await saveWorkshopToFirestore(next);
    },
    [],
  );

  const addClient = useCallback(
    async (
      input: Omit<Client, "id" | "vehicleCount"> & { vehicleCount?: number },
    ) => {
      await persist((prev) => ({
        ...prev,
        clients: [
          {
            id: `c${Date.now()}`,
            vehicleCount: input.vehicleCount ?? 1,
            ...input,
          },
          ...prev.clients,
        ],
      }));
    },
    [persist],
  );

  const addOrder = useCallback(
    async (
      input: Omit<WorkOrder, "id" | "createdAt" | "status"> & {
        status?: OrderStatus;
      },
    ) => {
      await persist((prev) => ({
        ...prev,
        orders: [
          {
            id: `OT-${Date.now().toString().slice(-4)}`,
            createdAt: new Date().toISOString().slice(0, 10),
            status: input.status ?? "recibido",
            ...input,
          },
          ...prev.orders,
        ],
      }));
    },
    [persist],
  );

  const updateOrderStatus = useCallback(
    async (id: string, status: OrderStatus) => {
      await persist((prev) => ({
        ...prev,
        orders: prev.orders.map((order) =>
          order.id === id ? { ...order, status } : order,
        ),
      }));
    },
    [persist],
  );

  const addAppointment = useCallback(
    async (
      input: Omit<Appointment, "id" | "status"> & {
        status?: AppointmentStatus;
      },
    ) => {
      await persist((prev) => ({
        ...prev,
        appointments: [
          {
            id: `a${Date.now()}`,
            status: input.status ?? "pendiente",
            ...input,
          },
          ...prev.appointments,
        ],
      }));
    },
    [persist],
  );

  const updateAppointmentStatus = useCallback(
    async (id: string, status: AppointmentStatus) => {
      await persist((prev) => ({
        ...prev,
        appointments: prev.appointments.map((apt) =>
          apt.id === id ? { ...apt, status } : apt,
        ),
      }));
    },
    [persist],
  );

  const updateAppointment = useCallback(
    async (
      id: string,
      patch: Partial<Pick<Appointment, "date" | "time" | "status" | "notes">>,
    ) => {
      await persist((prev) => ({
        ...prev,
        appointments: prev.appointments.map((apt) =>
          apt.id === id ? { ...apt, ...patch } : apt,
        ),
      }));
    },
    [persist],
  );

  const removeAppointment = useCallback(
    async (id: string) => {
      await persist((prev) => ({
        ...prev,
        appointments: prev.appointments.filter((apt) => apt.id !== id),
      }));
    },
    [persist],
  );

  const scheduleRequest = useCallback(
    async (input: {
      clientName: string;
      phone: string;
      vehicle: string;
      service: string;
      notes?: string;
      date?: string;
      time?: string;
    }) => {
      const today = new Date().toISOString().slice(0, 10);
      await persist((prev) => ({
        ...prev,
        appointments: [
          {
            id: `a${Date.now()}`,
            clientName: input.clientName,
            phone: input.phone,
            vehicle: input.vehicle,
            service: input.service,
            date: input.date || today,
            time: input.time || "10:00",
            notes: input.notes,
            status: "pendiente",
          },
          ...prev.appointments,
        ],
        clients: [
          {
            id: `c${Date.now()}`,
            name: input.clientName,
            phone: input.phone,
            email: "",
            vehicleCount: 1,
          },
          ...prev.clients,
        ],
      }));
    },
    [persist],
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
      updateAppointment,
      removeAppointment,
      scheduleRequest,
    }),
    [
      data,
      ready,
      addClient,
      addOrder,
      updateOrderStatus,
      addAppointment,
      updateAppointmentStatus,
      updateAppointment,
      removeAppointment,
      scheduleRequest,
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
