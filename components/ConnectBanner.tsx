"use client";
import { useEffect, useState } from "react";
import { usePlayer } from "@/lib/player-store";
import { useToast } from "@/lib/toast";

const sessionKey = "decaciones:connect-banner-shown";

function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  return /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.platform));
}

// Banner discreto, una vez por sesion, en movil modo preview: invita a usar
// Spotify Connect (canciones completas). Al tocarlo re-chequea dispositivos.
export default function ConnectBanner() {
  const { connectMode, refreshDevices, setPlaybackMode } = usePlayer();
  const { notify } = useToast();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isMobileDevice() || connectMode) return;
    let shown = false;
    try { shown = sessionStorage.getItem(sessionKey) === "1"; } catch {}
    if (shown) return;
    const t = setTimeout(() => setShow(true), 2500);
    return () => clearTimeout(t);
  }, [connectMode]);

  const dismiss = () => {
    setShow(false);
    try { sessionStorage.setItem(sessionKey, "1"); } catch {}
  };

  const tryConnect = () => {
    dismiss();
    void refreshDevices().then((devices) => {
      if (devices.length > 0) setPlaybackMode("connect");
      else notify("Abre Spotify en tu telefono primero", "🎧");
    });
  };

  if (!show || connectMode) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: 12, right: 12,
        bottom: "calc(78px + env(safe-area-inset-bottom) + 96px)",
        zIndex: 70,
        display: "flex", alignItems: "center", gap: 12,
        padding: "14px 16px", borderRadius: 18,
        background: "var(--surface-2)",
        boxShadow: "var(--shadow)",
        maxWidth: 696, margin: "0 auto",
      }}
    >
      <span style={{ fontSize: "1.4em" }}>🎧</span>
      <button
        onClick={tryConnect}
        style={{ flex: 1, textAlign: "left", fontSize: "calc(0.95rem * var(--fz))", fontWeight: 600, lineHeight: 1.35, color: "var(--text)", background: "transparent" }}
      >
        ¿Tienes Spotify? Abre la app y toca aqui para canciones completas
      </button>
      <button
        onClick={dismiss}
        aria-label="Cerrar"
        style={{ flex: "0 0 auto", width: 32, height: 32, borderRadius: 999, background: "var(--surface)", color: "var(--text-soft)", fontSize: "1.1rem", fontWeight: 700 }}
      >
        ×
      </button>
    </div>
  );
}
