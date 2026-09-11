"use client";

import { FormEvent, useState } from "react";
import { Lock, Wrench } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function PanelLogin() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const ok = await login(username, password);
    if (!ok) {
      setError("Usuario o contraseña incorrectos");
      return;
    }
    setError("");
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-ink px-4">
      <div className="w-full max-w-md overflow-hidden bg-[#10131a]">
        <div className="pointer-events-none h-px bg-gradient-to-r from-transparent via-signal/45 to-transparent" />
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center bg-signal">
              <Wrench className="size-5 text-ink" strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-display text-xl tracking-wide text-bone">
                Wilson Larrañaga
              </p>
              <p className="text-xs text-mist">Acceso al panel</p>
            </div>
          </div>

          <h1 className="mt-8 font-display text-3xl text-bone">Iniciar sesión</h1>
          <p className="mt-2 text-sm text-mist">
            Ingresá con el usuario y la contraseña del taller.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-2 block text-sm text-mist" htmlFor="user">
                Usuario
              </label>
              <input
                id="user"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="field"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-mist" htmlFor="pass">
                Contraseña
              </label>
              <input
                id="pass"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field"
                required
              />
            </div>

            {error ? (
              <p className="text-sm text-red-400" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 bg-signal px-5 py-3.5 text-sm font-semibold text-ink transition hover:bg-signal-dim"
            >
              <Lock className="size-4" />
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
