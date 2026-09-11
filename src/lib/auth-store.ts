const CREDS_KEY = "wl-panel-creds-v1";
const SESSION_KEY = "wl-panel-session-v1";
export const AUTH_EVENT = "wl-auth-updated";

export type PanelCredentials = {
  username: string;
  /** Contraseña en base64 — protección básica, no criptográfica */
  passwordHash: string;
};

export const DEFAULT_PANEL_USER = "wilson";
export const DEFAULT_PANEL_PASSWORD = "taller2026";

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function hashPassword(password: string) {
  if (typeof btoa === "undefined") return password;
  return btoa(unescape(encodeURIComponent(password)));
}

function defaultCreds(): PanelCredentials {
  return {
    username: DEFAULT_PANEL_USER,
    passwordHash: hashPassword(DEFAULT_PANEL_PASSWORD),
  };
}

export function readCredentials(): PanelCredentials {
  if (!canUseStorage()) return defaultCreds();
  try {
    const raw = localStorage.getItem(CREDS_KEY);
    if (!raw) {
      const creds = defaultCreds();
      localStorage.setItem(CREDS_KEY, JSON.stringify(creds));
      return creds;
    }
    const parsed = JSON.parse(raw) as PanelCredentials;
    if (!parsed.username || !parsed.passwordHash) return defaultCreds();
    return parsed;
  } catch {
    return defaultCreds();
  }
}

export function writeCredentials(username: string, password: string) {
  if (!canUseStorage()) return;
  const creds: PanelCredentials = {
    username: username.trim().toLowerCase(),
    passwordHash: hashPassword(password),
  };
  localStorage.setItem(CREDS_KEY, JSON.stringify(creds));
  window.dispatchEvent(new CustomEvent(AUTH_EVENT));
}

export function verifyLogin(username: string, password: string): boolean {
  const creds = readCredentials();
  return (
    username.trim().toLowerCase() === creds.username &&
    hashPassword(password) === creds.passwordHash
  );
}

export function isAuthenticated(): boolean {
  if (!canUseStorage()) return false;
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

export function setAuthenticated(value: boolean) {
  if (!canUseStorage()) return;
  if (value) sessionStorage.setItem(SESSION_KEY, "1");
  else sessionStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new CustomEvent(AUTH_EVENT));
}
