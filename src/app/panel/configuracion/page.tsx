"use client";

import { FormEvent, useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import type { DaySchedule } from "@/lib/contact";
import {
  defaultFormSettings,
  type FormSettings,
} from "@/lib/site-settings";

export default function ConfiguracionPage() {
  const { contact, form, updateSettings } = useSiteSettings();
  const { username, changeCredentials } = useAuth();
  const { push } = useToast();

  const [phoneDisplay, setPhoneDisplay] = useState(contact.phoneDisplay);
  const [addressLine, setAddressLine] = useState(contact.addressLine);
  const [addressRegion, setAddressRegion] = useState(contact.addressRegion);
  const [postalCode, setPostalCode] = useState(contact.postalCode);
  const [lat, setLat] = useState(String(contact.lat));
  const [lng, setLng] = useState(String(contact.lng));
  const [schedule, setSchedule] = useState<DaySchedule[]>(contact.schedule);
  const [formDraft, setFormDraft] = useState<FormSettings>(form);

  const [newUser, setNewUser] = useState(username);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  useEffect(() => {
    setPhoneDisplay(contact.phoneDisplay);
    setAddressLine(contact.addressLine);
    setAddressRegion(contact.addressRegion);
    setPostalCode(contact.postalCode);
    setLat(String(contact.lat));
    setLng(String(contact.lng));
    setSchedule(contact.schedule);
    setFormDraft(form);
    setNewUser(username);
  }, [contact, form, username]);

  function updateDay(index: number, hours: string) {
    setSchedule((prev) =>
      prev.map((row, i) => (i === index ? { ...row, hours } : row)),
    );
  }

  function patchForm<K extends keyof FormSettings>(
    key: K,
    value: FormSettings[K],
  ) {
    setFormDraft((prev) => ({ ...prev, [key]: value }));
  }

  function updateService(index: number, value: string) {
    setFormDraft((prev) => ({
      ...prev,
      services: prev.services.map((s, i) => (i === index ? value : s)),
    }));
  }

  function addService() {
    setFormDraft((prev) => ({
      ...prev,
      services: [...prev.services, "Nuevo servicio"],
    }));
  }

  function removeService(index: number) {
    setFormDraft((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  }

  function saveAll(e: FormEvent) {
    e.preventDefault();
    const services = formDraft.services.map((s) => s.trim()).filter(Boolean);
    if (services.length === 0 && formDraft.askService) {
      push("Agregá al menos un tipo de trabajo");
      return;
    }

    updateSettings({
      phoneDisplay,
      addressLine,
      addressRegion,
      postalCode,
      lat: Number(lat) || contact.lat,
      lng: Number(lng) || contact.lng,
      schedule,
      form: { ...formDraft, services },
    });
    push("Configuración guardada");
  }

  function saveAccess(e: FormEvent) {
    e.preventDefault();
    if (!newUser.trim()) {
      push("El usuario no puede estar vacío");
      return;
    }
    if (newPass.length < 6) {
      push("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (newPass !== confirmPass) {
      push("Las contraseñas no coinciden");
      return;
    }
    changeCredentials(newUser, newPass);
    setNewPass("");
    setConfirmPass("");
    push("Usuario y contraseña actualizados");
  }

  return (
    <div className="space-y-10">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-signal">
          Panel
        </p>
        <h1 className="mt-1 font-display text-3xl text-bone sm:text-4xl">
          Configuración
        </h1>
        <p className="mt-2 max-w-xl text-sm text-mist">
          Editá datos del taller y el formulario del sitio. Los cambios se ven
          al instante en la web.
        </p>
      </header>

      <form onSubmit={saveAll} className="space-y-10">
        <section className="space-y-6 bg-[#10131a] p-5 sm:p-7">
          <h2 className="font-display text-2xl text-bone">Datos de contacto</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Teléfono"
              value={phoneDisplay}
              onChange={setPhoneDisplay}
              placeholder="099 668 172"
            />
            <Field
              label="Código postal"
              value={postalCode}
              onChange={setPostalCode}
              placeholder="11300"
            />
            <Field
              label="Dirección"
              value={addressLine}
              onChange={setAddressLine}
              placeholder="Bonpland 576"
              className="sm:col-span-2"
            />
            <Field
              label="Ciudad / región"
              value={addressRegion}
              onChange={setAddressRegion}
              placeholder="11300 Montevideo, Departamento de Montevideo"
              className="sm:col-span-2"
            />
            <Field label="Latitud (mapa)" value={lat} onChange={setLat} />
            <Field label="Longitud (mapa)" value={lng} onChange={setLng} />
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-bone">Horarios</h3>
            <div className="space-y-3">
              {schedule.map((row, i) => (
                <div
                  key={row.day}
                  className="grid gap-2 sm:grid-cols-[120px_1fr] sm:items-center"
                >
                  <label className="text-sm text-mist">{row.day}</label>
                  <input
                    value={row.hours}
                    onChange={(e) => updateDay(i, e.target.value)}
                    className="field"
                    placeholder="8:00 – 12:00 · 14:00 – 18:00 o Cerrado"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-6 bg-[#10131a] p-5 sm:p-7">
          <div>
            <h2 className="font-display text-2xl text-bone">
              Formulario del sitio
            </h2>
            <p className="mt-1 text-sm text-mist">
              Activá o desactivá pasos, cambiá textos y tipos de trabajo.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm text-mist">
              Texto introductorio
            </label>
            <textarea
              rows={3}
              value={formDraft.intro}
              onChange={(e) => patchForm("intro", e.target.value)}
              className="field resize-none"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Toggle
              label="Pedir vehículo"
              checked={formDraft.askVehicle}
              onChange={(v) => patchForm("askVehicle", v)}
            />
            <Toggle
              label="Pedir tipo de trabajo"
              checked={formDraft.askService}
              onChange={(v) => patchForm("askService", v)}
            />
            <Toggle
              label="Pedir detalle / problema"
              checked={formDraft.askNotes}
              onChange={(v) => patchForm("askNotes", v)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Título paso contacto"
              value={formDraft.stepContactTitle}
              onChange={(v) => patchForm("stepContactTitle", v)}
            />
            <Field
              label="Título paso vehículo"
              value={formDraft.stepVehicleTitle}
              onChange={(v) => patchForm("stepVehicleTitle", v)}
            />
            <Field
              label="Título paso detalle"
              value={formDraft.stepDetailTitle}
              onChange={(v) => patchForm("stepDetailTitle", v)}
            />
            <Field
              label="Texto del botón enviar"
              value={formDraft.submitLabel}
              onChange={(v) => patchForm("submitLabel", v)}
            />
            <Field
              label="Label nombre"
              value={formDraft.nameLabel}
              onChange={(v) => patchForm("nameLabel", v)}
            />
            <Field
              label="Placeholder nombre"
              value={formDraft.namePlaceholder}
              onChange={(v) => patchForm("namePlaceholder", v)}
            />
            <Field
              label="Label teléfono"
              value={formDraft.phoneLabel}
              onChange={(v) => patchForm("phoneLabel", v)}
            />
            <Field
              label="Placeholder teléfono"
              value={formDraft.phonePlaceholder}
              onChange={(v) => patchForm("phonePlaceholder", v)}
            />
            <Field
              label="Label vehículo"
              value={formDraft.vehicleLabel}
              onChange={(v) => patchForm("vehicleLabel", v)}
            />
            <Field
              label="Placeholder vehículo"
              value={formDraft.vehiclePlaceholder}
              onChange={(v) => patchForm("vehiclePlaceholder", v)}
            />
            <Field
              label="Label tipo de trabajo"
              value={formDraft.serviceLabel}
              onChange={(v) => patchForm("serviceLabel", v)}
            />
            <Field
              label="Label detalle"
              value={formDraft.notesLabel}
              onChange={(v) => patchForm("notesLabel", v)}
            />
            <Field
              label="Placeholder detalle"
              value={formDraft.notesPlaceholder}
              onChange={(v) => patchForm("notesPlaceholder", v)}
              className="sm:col-span-2"
            />
            <Field
              label="Título éxito"
              value={formDraft.successTitle}
              onChange={(v) => patchForm("successTitle", v)}
            />
            <Field
              label="Mensaje éxito"
              value={formDraft.successMessage}
              onChange={(v) => patchForm("successMessage", v)}
            />
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-medium text-bone">
                Tipos de trabajo
              </h3>
              <button
                type="button"
                onClick={addService}
                className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-signal transition hover:text-signal-dim"
              >
                <Plus className="size-3.5" />
                Agregar
              </button>
            </div>
            <div className="space-y-2">
              {formDraft.services.map((service, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={service}
                    onChange={(e) => updateService(i, e.target.value)}
                    className="field"
                  />
                  <button
                    type="button"
                    onClick={() => removeService(i)}
                    disabled={formDraft.services.length <= 1}
                    className="shrink-0 bg-white/[0.05] px-3 text-mist transition hover:bg-white/[0.1] hover:text-bone disabled:opacity-30"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setFormDraft(defaultFormSettings)}
              className="mt-4 text-xs text-mist underline-offset-4 transition hover:text-bone hover:underline"
            >
              Restaurar textos del formulario por defecto
            </button>
          </div>
        </section>

        <button
          type="submit"
          className="inline-flex items-center gap-2 bg-signal px-5 py-3 text-sm font-semibold text-ink transition hover:bg-signal-dim"
        >
          <Save className="size-4" />
          Guardar configuración
        </button>
      </form>

      <form onSubmit={saveAccess} className="space-y-6 bg-[#10131a] p-5 sm:p-7">
        <h2 className="font-display text-2xl text-bone">Acceso al panel</h2>
        <p className="text-sm text-mist">
          Cambiá el usuario y la contraseña para pasárselos a tu cliente.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Usuario"
            value={newUser}
            onChange={setNewUser}
            className="sm:col-span-2"
          />
          <Field
            label="Nueva contraseña"
            value={newPass}
            onChange={setNewPass}
            type="password"
          />
          <Field
            label="Confirmar contraseña"
            value={confirmPass}
            onChange={setConfirmPass}
            type="password"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-2 bg-white/[0.08] px-5 py-3 text-sm font-semibold text-bone transition hover:bg-white/[0.12]"
        >
          Actualizar acceso
        </button>
      </form>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 bg-white/[0.04] px-4 py-3">
      <span className="text-sm text-bone">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 accent-[#f0a202]"
      />
    </label>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm text-mist">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="field"
      />
    </div>
  );
}
