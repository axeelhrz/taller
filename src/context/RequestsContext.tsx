"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createRequestInFirestore,
  deleteRequestInFirestore,
  listenRequests,
  updateRequestStatusInFirestore,
} from "@/lib/firebase/data";
import type { RequestStatus, ServiceRequest } from "@/lib/types";

type RequestsContextValue = {
  requests: ServiceRequest[];
  newCount: number;
  ready: boolean;
  submitRequest: (
    input: Omit<ServiceRequest, "id" | "createdAt" | "status" | "source">,
  ) => Promise<ServiceRequest>;
  setRequestStatus: (id: string, status: RequestStatus) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
};

const RequestsContext = createContext<RequestsContextValue | null>(null);

export function RequestsProvider({ children }: { children: React.ReactNode }) {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = listenRequests(
      (next) => {
        setRequests(next);
        setReady(true);
      },
      () => {
        setRequests([]);
        setReady(true);
      },
    );
    return () => unsub();
  }, []);

  const submitRequest = useCallback(
    async (
      input: Omit<ServiceRequest, "id" | "createdAt" | "status" | "source">,
    ) => {
      return createRequestInFirestore(input);
    },
    [],
  );

  const setRequestStatus = useCallback(
    async (id: string, status: RequestStatus) => {
      await updateRequestStatusInFirestore(id, status);
    },
    [],
  );

  const deleteRequest = useCallback(async (id: string) => {
    await deleteRequestInFirestore(id);
  }, []);

  const refresh = useCallback(async () => undefined, []);

  const newCount = useMemo(
    () => requests.filter((r) => r.status === "nueva").length,
    [requests],
  );

  const value = useMemo(
    () => ({
      requests: ready ? requests : [],
      newCount: ready ? newCount : 0,
      ready,
      submitRequest,
      setRequestStatus,
      deleteRequest,
      refresh,
    }),
    [
      ready,
      requests,
      newCount,
      submitRequest,
      setRequestStatus,
      deleteRequest,
      refresh,
    ],
  );

  return (
    <RequestsContext.Provider value={value}>{children}</RequestsContext.Provider>
  );
}

export function useRequests() {
  const ctx = useContext(RequestsContext);
  if (!ctx) throw new Error("useRequests must be used within RequestsProvider");
  return ctx;
}

export function useRequestsOptional() {
  return useContext(RequestsContext);
}
