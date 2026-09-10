import type { ServiceRequest } from "./types";

const STORAGE_KEY = "wl-solicitudes-v1";
export const REQUESTS_EVENT = "wl-requests-updated";

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function readRequests(): ServiceRequest[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ServiceRequest[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeRequests(requests: ServiceRequest[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  window.dispatchEvent(new CustomEvent(REQUESTS_EVENT));
}

export function addServiceRequest(
  input: Omit<ServiceRequest, "id" | "createdAt" | "status" | "source">,
): ServiceRequest {
  const request: ServiceRequest = {
    id: `REQ-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    status: "nueva",
    source: "web",
    ...input,
  };
  const next = [request, ...readRequests()];
  writeRequests(next);
  return request;
}

export function updateServiceRequestStatus(
  id: string,
  status: ServiceRequest["status"],
) {
  const next = readRequests().map((r) => (r.id === id ? { ...r, status } : r));
  writeRequests(next);
  return next;
}

export function removeServiceRequest(id: string) {
  const next = readRequests().filter((r) => r.id !== id);
  writeRequests(next);
  return next;
}

export function formatRequestTime(iso: string) {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("es-UY", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Ahora";
  if (mins < 60) return `Hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return `Hace ${days} d`;
}
