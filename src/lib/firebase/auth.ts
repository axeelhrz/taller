import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
  type Unsubscribe,
  type User,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import {
  DEFAULT_PANEL_PASSWORD,
  DEFAULT_PANEL_USER,
} from "@/lib/auth-defaults";

const PROJECT_ID =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "wilson-4cfc2";

export function toPanelEmail(username: string) {
  const clean = username
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._+-]/g, "");
  return `${clean || "panel"}@${PROJECT_ID}.firebaseapp.com`;
}

export function usernameFromEmail(email: string | null | undefined) {
  if (!email) return DEFAULT_PANEL_USER;
  return email.split("@")[0] || DEFAULT_PANEL_USER;
}

export function listenAuth(
  onUser: (user: User | null) => void,
): Unsubscribe {
  return onAuthStateChanged(getFirebaseAuth(), onUser);
}

export async function loginWithUsername(username: string, password: string) {
  const auth = getFirebaseAuth();
  const email = toPanelEmail(username);

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  } catch (error) {
    const code =
      typeof error === "object" && error && "code" in error
        ? String((error as { code: string }).code)
        : "";

    const isDefault =
      username.trim().toLowerCase() === DEFAULT_PANEL_USER &&
      password === DEFAULT_PANEL_PASSWORD;

    if (
      isDefault &&
      (code === "auth/user-not-found" ||
        code === "auth/invalid-credential" ||
        code === "auth/invalid-email")
    ) {
      try {
        const created = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        return created.user;
      } catch (createError) {
        const createCode =
          typeof createError === "object" &&
          createError &&
          "code" in createError
            ? String((createError as { code: string }).code)
            : "";
        if (createCode === "auth/email-already-in-use") {
          const cred = await signInWithEmailAndPassword(auth, email, password);
          return cred.user;
        }
        throw createError;
      }
    }

    throw error;
  }
}

export async function logoutFirebase() {
  await signOut(getFirebaseAuth());
}

export async function updatePanelCredentials(
  currentPassword: string,
  nextUsername: string,
  nextPassword: string,
) {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user?.email) throw new Error("No hay sesión activa");

  // Reautenticar con la contraseña actual
  await signInWithEmailAndPassword(auth, user.email, currentPassword);

  const fresh = auth.currentUser;
  if (!fresh) throw new Error("No hay sesión activa");

  const nextEmail = toPanelEmail(nextUsername);
  if (nextEmail !== fresh.email) {
    await updateEmail(fresh, nextEmail);
  }
  await updatePassword(fresh, nextPassword);
}
