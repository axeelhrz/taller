import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";
import {
  defaultFormSettings,
  defaultSiteSettings,
  hydrateSettings,
  type SiteSettings,
  type SiteSettingsInput,
} from "@/lib/site-settings";
import type {
  Appointment,
  Client,
  RequestStatus,
  ServiceRequest,
  WorkOrder,
} from "@/lib/types";

const SETTINGS_REF = () => doc(getDb(), "settings", "site");
const WORKSHOP_REF = () => doc(getDb(), "workshop", "main");
const REQUESTS_COL = () => collection(getDb(), "requests");

function parseSettings(data: Partial<SiteSettingsInput> | undefined): SiteSettings {
  if (!data) return defaultSiteSettings();
  return hydrateSettings({
    phoneDisplay:
      data.phoneDisplay ?? defaultSiteSettings().contact.phoneDisplay,
    addressLine: data.addressLine ?? defaultSiteSettings().contact.addressLine,
    addressRegion:
      data.addressRegion ?? defaultSiteSettings().contact.addressRegion,
    postalCode: data.postalCode ?? defaultSiteSettings().contact.postalCode,
    lat: data.lat ?? defaultSiteSettings().contact.lat,
    lng: data.lng ?? defaultSiteSettings().contact.lng,
    schedule: data.schedule ?? defaultSiteSettings().contact.schedule,
    form: { ...defaultFormSettings, ...(data.form ?? {}) },
  });
}

export function settingsToInput(settings: SiteSettings): SiteSettingsInput {
  return {
    phoneDisplay: settings.contact.phoneDisplay,
    addressLine: settings.contact.addressLine,
    addressRegion: settings.contact.addressRegion,
    postalCode: settings.contact.postalCode,
    lat: settings.contact.lat,
    lng: settings.contact.lng,
    schedule: settings.contact.schedule,
    form: settings.form,
  };
}

export function listenSettings(
  onData: (settings: SiteSettings) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const ref = SETTINGS_REF();

  void getDoc(ref)
    .then((snap) => {
      onData(parseSettings(snap.exists() ? (snap.data() as Partial<SiteSettingsInput>) : undefined));
    })
    .catch((err) => onError?.(err as Error));

  return onSnapshot(
    ref,
    (snap) => {
      onData(
        parseSettings(
          snap.exists() ? (snap.data() as Partial<SiteSettingsInput>) : undefined,
        ),
      );
    },
    (err) => onError?.(err),
  );
}

export async function saveSettingsToFirestore(input: SiteSettingsInput) {
  const hydrated = hydrateSettings(input);
  await setDoc(SETTINGS_REF(), settingsToInput(hydrated), { merge: true });
  return hydrated;
}

function mapRequests(
  docs: Array<{ id: string; data: () => Record<string, unknown> }>,
) {
  return docs.map((d) => {
    const data = d.data() as Omit<ServiceRequest, "id">;
    return { id: d.id, ...data } as ServiceRequest;
  });
}

export function listenRequests(
  onData: (requests: ServiceRequest[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const q = query(REQUESTS_COL(), orderBy("createdAt", "desc"));

  void getDocs(q)
    .then((snap) => onData(mapRequests(snap.docs)))
    .catch((err) => onError?.(err as Error));

  return onSnapshot(
    q,
    (snap) => onData(mapRequests(snap.docs)),
    (err) => onError?.(err),
  );
}

export async function createRequestInFirestore(
  input: Omit<ServiceRequest, "id" | "createdAt" | "status" | "source">,
) {
  const payload: Record<string, unknown> = {
    name: input.name,
    phone: input.phone,
    vehicle: input.vehicle,
    service: input.service,
    notes: input.notes,
    createdAt: new Date().toISOString(),
    status: "nueva",
    source: "web",
  };
  if (input.preferredDate) payload.preferredDate = input.preferredDate;
  if (input.preferredTime) payload.preferredTime = input.preferredTime;

  const ref = await addDoc(REQUESTS_COL(), payload);
  return { id: ref.id, ...payload } as ServiceRequest;
}

export async function updateRequestStatusInFirestore(
  id: string,
  status: RequestStatus,
) {
  await updateDoc(doc(getDb(), "requests", id), { status });
}

export async function deleteRequestInFirestore(id: string) {
  await deleteDoc(doc(getDb(), "requests", id));
}

export type WorkshopData = {
  clients: Client[];
  orders: WorkOrder[];
  appointments: Appointment[];
};

function parseWorkshop(data: Partial<WorkshopData> | undefined): WorkshopData {
  return {
    clients: data?.clients ?? [],
    orders: data?.orders ?? [],
    appointments: data?.appointments ?? [],
  };
}

export function listenWorkshop(
  onData: (data: WorkshopData) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const ref = WORKSHOP_REF();

  void getDoc(ref)
    .then((snap) => {
      onData(
        parseWorkshop(
          snap.exists() ? (snap.data() as Partial<WorkshopData>) : undefined,
        ),
      );
    })
    .catch((err) => onError?.(err as Error));

  return onSnapshot(
    ref,
    (snap) => {
      onData(
        parseWorkshop(
          snap.exists() ? (snap.data() as Partial<WorkshopData>) : undefined,
        ),
      );
    },
    (err) => onError?.(err),
  );
}

export async function saveWorkshopToFirestore(data: WorkshopData) {
  await setDoc(
    WORKSHOP_REF(),
    {
      clients: data.clients ?? [],
      orders: data.orders ?? [],
      appointments: data.appointments ?? [],
    },
    { merge: true },
  );
  return data;
}
