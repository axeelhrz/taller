import {
  buildScheduleSummary,
  defaultSchedule,
  defaultWorkshopContact,
  toDirectionsUrl,
  toMapsUrl,
  toPhoneTel,
  toWhatsappUrl,
  type DaySchedule,
  type WorkshopContact,
} from "./contact";

export type FormSettings = {
  intro: string;
  stepContactTitle: string;
  stepVehicleTitle: string;
  stepDetailTitle: string;
  nameLabel: string;
  namePlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  vehicleLabel: string;
  vehiclePlaceholder: string;
  serviceLabel: string;
  services: string[];
  notesLabel: string;
  notesPlaceholder: string;
  askVehicle: boolean;
  askService: boolean;
  askNotes: boolean;
  submitLabel: string;
  successTitle: string;
  successMessage: string;
};

export type SiteSettingsInput = {
  phoneDisplay: string;
  addressLine: string;
  addressRegion: string;
  postalCode: string;
  lat: number;
  lng: number;
  schedule: DaySchedule[];
  form: FormSettings;
};

export type SiteSettings = {
  contact: WorkshopContact;
  form: FormSettings;
};

export const defaultFormSettings: FormSettings = {
  intro:
    "Contanos qué necesita el auto en unos pasos. Te confirmamos turno — o escribinos ahora si es urgente.",
  stepContactTitle: "¿Cómo te contactamos?",
  stepVehicleTitle: "¿Qué auto traés?",
  stepDetailTitle: "¿Qué le pasa?",
  nameLabel: "Tu nombre",
  namePlaceholder: "Ej. Ana Pérez",
  phoneLabel: "Teléfono / WhatsApp",
  phonePlaceholder: "099 000 000",
  vehicleLabel: "Marca, modelo y año",
  vehiclePlaceholder: "Ej. Toyota Corolla 2019",
  serviceLabel: "Tipo de trabajo",
  services: ["Diagnóstico", "Service", "Frenos", "Motor", "Aire", "Otro"],
  notesLabel: "Contanos el problema",
  notesPlaceholder: "Ruido al frenar, luz en el tablero, kilometraje...",
  askVehicle: true,
  askService: true,
  askNotes: true,
  submitLabel: "Enviar pedido",
  successTitle: "Pedido recibido",
  successMessage:
    "Ya está en el panel del taller. Te contactamos para confirmar.",
};

function hydrateForm(partial?: Partial<FormSettings>): FormSettings {
  const services =
    Array.isArray(partial?.services) && partial.services.length > 0
      ? partial.services.map((s) => s.trim()).filter(Boolean)
      : defaultFormSettings.services;

  return {
    ...defaultFormSettings,
    ...partial,
    services,
    askVehicle: partial?.askVehicle ?? defaultFormSettings.askVehicle,
    askService: partial?.askService ?? defaultFormSettings.askService,
    askNotes: partial?.askNotes ?? defaultFormSettings.askNotes,
  };
}

export function hydrateContact(
  input: Omit<SiteSettingsInput, "form">,
): WorkshopContact {
  const phoneDisplay =
    input.phoneDisplay.trim() || defaultWorkshopContact.phoneDisplay;
  const addressLine =
    input.addressLine.trim() || defaultWorkshopContact.addressLine;
  const addressRegion =
    input.addressRegion.trim() || defaultWorkshopContact.addressRegion;
  const schedule =
    input.schedule?.length === 7 ? input.schedule : defaultSchedule;

  return {
    phoneDisplay,
    phoneTel: toPhoneTel(phoneDisplay),
    whatsappUrl: toWhatsappUrl(phoneDisplay),
    addressLine,
    addressRegion,
    postalCode: input.postalCode.trim() || defaultWorkshopContact.postalCode,
    lat: Number.isFinite(input.lat) ? input.lat : defaultWorkshopContact.lat,
    lng: Number.isFinite(input.lng) ? input.lng : defaultWorkshopContact.lng,
    mapsUrl: toMapsUrl(addressLine, addressRegion),
    directionsUrl: toDirectionsUrl(addressLine, addressRegion),
    schedule,
    scheduleSummary: buildScheduleSummary(schedule),
  };
}

export function hydrateSettings(input: SiteSettingsInput): SiteSettings {
  return {
    contact: hydrateContact(input),
    form: hydrateForm(input.form),
  };
}

export function defaultSiteSettings(): SiteSettings {
  return {
    contact: defaultWorkshopContact,
    form: defaultFormSettings,
  };
}
