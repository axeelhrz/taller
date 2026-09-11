import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  addDoc,
  updateDoc,
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
  return onSnapshot(
    SETTINGS_REF(),
    (snap) => {
      if (!snap.exists()) {
        onData(defaultSiteSettings());
        return;
      }
      const data = snap.data() as Partial<SiteSettingsInput>;
      onData(
        hydrateSettings({
          phoneDisplay:
            data.phoneDisplay ?? defaultSiteSettings().contact.phoneDisplay,
          addressLine:
            data.addressLine ?? defaultSiteSettings().contact.addressLine,
          addressRegion:
            data.addressRegion ?? defaultSiteSettings().contact.addressRegion,
          postalCode:
            data.postalCode ?? defaultSiteSettings().contact.postalCode,
          lat: data.lat ?? defaultSiteSettings().contact.lat,
          lng: data.lng ?? defaultSiteSettings().contact.lng,
          schedule: data.schedule ?? defaultSiteSettings().contact.schedule,
          form: { ...defaultFormSettings, ...(data.form ?? {}) },
        }),
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

export function listenRequests(
  onData: (requests: ServiceRequest[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const q = query(REQUESTS_COL(), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => {
      const requests = snap.docs.map((d) => {
        const data = d.data() as Omit<ServiceRequest, "id">;
        return { id: d.id, ...data } as ServiceRequest;
      });
      onData(requests);
    },
    (err) => onError?.(err),
  );
}

export async function createRequestInFirestore(
  input: Omit<ServiceRequest, "id" | "createdAt" | "status" | "source">,
) {
  const payload: Omit<ServiceRequest, "id"> = {
    ...input,
    createdAt: new Date().toISOString(),
    status: "nueva",
    source: "web",
  };
  const ref = await addDoc(REQUESTS_COL(), payload);
  return { id: ref.id, ...payload } as ServiceRequest;
}

export async function updateRequestStatusInFirestore(
  id: string,
  status: RequestStatus,
) {
  await updateDoc(doc(getDb(), "requests", id), { status });
}

export type WorkshopData = {
  clients: Client[];
  orders: WorkOrder[];
  appointments: Appointment[];
};

export function listenWorkshop(
  onData: (data: WorkshopData) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    WORKSHOP_REF(),
    (snap) => {
      if (!snap.exists()) {
        onData({ clients: [], orders: [], appointments: [] });
        return;
      }
      const data = snap.data() as Partial<WorkshopData>;
      onData({
        clients: data.clients ?? [],
        orders: data.orders ?? [],
        appointments: data.appointments ?? [],
      });
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
