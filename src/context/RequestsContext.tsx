"use client";

import {
  REQUESTS_EVENT,
  addServiceRequest,
  readRequests,
  updateServiceRequestStatus,
} from "@/lib/requests-store";
import type { RequestStatus, ServiceRequest } from "@/lib/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type RequestsContextValue = {
  requests: ServiceRequest[];
  newCount: number;
  submitRequest: (
    input: Omit<ServiceRequest, "id" | "createdAt" | "status" | "source">,
  ) => ServiceRequest;
  setRequestStatus: (id: string, status: RequestStatus) => void;
  refresh: () => void;
};

const RequestsContext = createContext<RequestsContextValue | null>(null);

export function RequestsProvider({ children }: { children: React.ReactNode }) {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setRequests(readRequests());
  }, []);

  useEffect(() => {
    refresh();
    setReady(true);

    const onUpdate = () => refresh();
    window.addEventListener(REQUESTS_EVENT, onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener(REQUESTS_EVENT, onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, [refresh]);

  const submitRequest = useCallback(
    (input: Omit<ServiceRequest, "id" | "createdAt" | "status" | "source">) => {
      const created = addServiceRequest(input);
      refresh();
      return created;
    },
    [refresh],
  );

  const setRequestStatus = useCallback(
    (id: string, status: RequestStatus) => {
      updateServiceRequestStatus(id, status);
      refresh();
    },
    [refresh],
  );

  const newCount = useMemo(
    () => requests.filter((r) => r.status === "nueva").length,
    [requests],
  );

  const value = useMemo(
    () => ({
      requests: ready ? requests : [],
      newCount: ready ? newCount : 0,
      submitRequest,
      setRequestStatus,
      refresh,
    }),
    [ready, requests, newCount, submitRequest, setRequestStatus, refresh],
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

/** Safe hook for pages that may or may not have the provider */
export function useRequestsOptional() {
  return useContext(RequestsContext);
}
