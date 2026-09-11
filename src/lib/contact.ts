export type DaySchedule = {
  day: string;
  hours: string;
};

export type WorkshopContact = {
  phoneDisplay: string;
  phoneTel: string;
  whatsappUrl: string;
  addressLine: string;
  addressRegion: string;
  postalCode: string;
  lat: number;
  lng: number;
  mapsUrl: string;
  directionsUrl: string;
  schedule: DaySchedule[];
  scheduleSummary: string;
};

/** Normaliza un celular uruguayo a E.164 (+598…) */
export function toPhoneTel(display: string): string {
  const digits = display.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("598")) return `+${digits}`;
  if (digits.startsWith("0")) return `+598${digits.slice(1)}`;
  return `+598${digits}`;
}

export function toWhatsappUrl(display: string): string {
  const tel = toPhoneTel(display).replace("+", "");
  return tel ? `https://wa.me/${tel}` : "https://wa.me/";
}

export function toMapsUrl(addressLine: string, region: string): string {
  const q = encodeURIComponent(`${addressLine}, ${region}`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export function toDirectionsUrl(addressLine: string, region: string): string {
  const q = encodeURIComponent(`${addressLine}, ${region}`);
  return `https://www.google.com/maps/dir/?api=1&destination=${q}`;
}

export function buildScheduleSummary(schedule: DaySchedule[]): string {
  const open = schedule.filter((d) => d.hours.toLowerCase() !== "cerrado");
  if (open.length === 0) return "Cerrado";
  const sameHours = open.every((d) => d.hours === open[0].hours);
  if (sameHours && open.length >= 5) {
    return `Lun–Vie ${open[0].hours}`;
  }
  return open.map((d) => `${d.day.slice(0, 3)} ${d.hours}`).join(" · ");
}

export const defaultSchedule: DaySchedule[] = [
  { day: "Lunes", hours: "8:00 – 12:00 · 14:00 – 18:00" },
  { day: "Martes", hours: "8:00 – 12:00 · 14:00 – 18:00" },
  { day: "Miércoles", hours: "8:00 – 12:00 · 14:00 – 18:00" },
  { day: "Jueves", hours: "8:00 – 12:00 · 14:00 – 18:00" },
  { day: "Viernes", hours: "8:00 – 12:00 · 14:00 – 18:00" },
  { day: "Sábado", hours: "Cerrado" },
  { day: "Domingo", hours: "Cerrado" },
];

export const defaultWorkshopContact: WorkshopContact = {
  phoneDisplay: "099 668 172",
  phoneTel: "+59899668172",
  whatsappUrl: "https://wa.me/59899668172",
  addressLine: "Bonpland 576",
  addressRegion: "11300 Montevideo, Departamento de Montevideo",
  postalCode: "11300",
  // Aprox. Bonpland ~598, Punta Carretas
  lat: -34.916295,
  lng: -56.159765,
  mapsUrl: toMapsUrl(
    "Bonpland 576",
    "11300 Montevideo, Departamento de Montevideo",
  ),
  directionsUrl: toDirectionsUrl(
    "Bonpland 576",
    "11300 Montevideo, Departamento de Montevideo",
  ),
  schedule: defaultSchedule,
  scheduleSummary: "Lun–Vie 8:00 – 12:00 · 14:00 – 18:00",
};

/** @deprecated Preferí useSiteSettings(); se mantiene por compatibilidad de imports. */
export const workshopContact = defaultWorkshopContact;
