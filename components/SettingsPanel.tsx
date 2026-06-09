"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { CheckCircle2, LogOut, Music, Palette, RotateCw } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

type Mode = "user" | "preloaded" | "none";

const STATUS: Record<Mode, { dot: string; label: string }> = {
  user: { dot: "var(--teal)", label: "En vivo" },
  preloaded: { dot: "var(--primary)", label: "Precargada" },
  none: { dot: "var(--muted)", label: "Sin conexion" },
};

const card = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

export function SettingsPanel({
  mode,
  detail,
}: {
  mode: Mode;
  detail: string;
}) {
  const isConnected = mode === "user";
  const status = STATUS[mode];
  const [clearing, setClearing] = useState(false);

  async function clearCache() {
    setClearing(true);
    try {
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      if ("serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));
      }
    } finally {
      window.location.reload();
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.1, delayChildren: 0.05 }}
      className="space-y-5"
    >
      {/* Conexion */}
      <motion.section
        variants={card}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="metal-panel rounded-3xl p-6 sm:p-7"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-readout text-xs font-bold uppercase tracking-[0.3em] text-muted">
            Conexion
          </h2>
          <span className="inline-flex items-center gap-2 font-readout text-[0.7rem] uppercase tracking-[0.2em] text-foreground/80">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: status.dot, boxShadow: `0 0 10px ${status.dot}` }}
            />
            {status.label}
          </span>
        </div>
        <p className="mt-4 text-base leading-7 text-foreground/90">{detail}</p>
        <div className="mt-5">
          {isConnected ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="inline-flex items-center justify-center gap-2.5 rounded-full border border-teal/30 bg-teal/10 px-6 py-3 text-sm font-bold text-teal">
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                Spotify conectado
              </div>
              <a
                href="/api/auth/spotify/disconnect"
                className="metal-button inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3 text-sm font-bold text-primary"
              >
                <LogOut className="h-5 w-5" aria-hidden="true" />
                Desconectar
              </a>
            </div>
          ) : (
            <a
              href="/api/auth/spotify"
              className="metal-button inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3 text-sm font-bold text-primary"
            >
              <Music className="h-5 w-5" aria-hidden="true" />
              {mode === "preloaded" ? "Conectar mi Spotify" : "Conectar Spotify"}
            </a>
          )}
        </div>
      </motion.section>

      {/* Apariencia */}
      <motion.section
        variants={card}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="metal-panel flex items-center justify-between rounded-3xl p-6 sm:p-7"
      >
        <div>
          <h2 className="flex items-center gap-2 font-readout text-xs font-bold uppercase tracking-[0.3em] text-muted">
            <Palette className="h-4 w-4" aria-hidden="true" />
            Apariencia
          </h2>
          <p className="mt-2 text-sm text-foreground/80">Modo dia o noche.</p>
        </div>
        <ThemeToggle />
      </motion.section>

      {/* Mantenimiento */}
      <motion.section
        variants={card}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="metal-panel flex items-center justify-between gap-4 rounded-3xl p-6 sm:p-7"
      >
        <div>
          <h2 className="font-readout text-xs font-bold uppercase tracking-[0.3em] text-muted">
            Mantenimiento
          </h2>
          <p className="mt-2 text-sm text-foreground/80">
            Vacia el cache y recarga la rockola.
          </p>
        </div>
        <button
          type="button"
          onClick={clearCache}
          disabled={clearing}
          className="metal-button inline-flex shrink-0 items-center justify-center gap-2.5 rounded-full px-5 py-3 text-sm font-bold text-primary disabled:opacity-60"
        >
          <RotateCw
            className={`h-5 w-5 ${clearing ? "animate-spin" : ""}`}
            aria-hidden="true"
          />
          {clearing ? "Recargando…" : "Refrescar"}
        </button>
      </motion.section>

      <motion.p
        variants={card}
        className="pt-2 text-center font-readout text-[0.7rem] uppercase tracking-[0.3em] text-muted/70"
      >
        Decaciones · rockola personal
      </motion.p>
    </motion.div>
  );
}
