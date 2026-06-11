"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/theme";
import { usePlayer } from "@/lib/player-store";
import { useToast } from "@/lib/toast";
import PageHeader from "@/components/PageHeader";
import Icon from "@/components/Icon";

export default function SettingsPage() {
  const router = useRouter();
  const { mode, setMode, textSize, setTextSize } = useTheme();
  const {
    sleepMinutes, startSleep, cancelSleep, spotifyActive,
    connectMode, connectAvailable, connectDevices,
    setPlaybackMode, refreshDevices, useConnectDevice,
  } = usePlayer();
  const { notify } = useToast();

  // Refresca dispositivos Spotify al abrir Ajustes (detecta el telefono con Spotify abierto).
  useEffect(() => { void refreshDevices(); }, [refreshDevices]);
  const sizes: { id: "normal" | "grande" | "enorme"; label: string }[] = [
    { id: "normal", label: "Normal" }, { id: "grande", label: "Grande" }, { id: "enorme", label: "Enorme" },
  ];
  const Row = ({ children }: { children: React.ReactNode }) => (
    <div className="glass" style={{ borderRadius: 20, padding: 18, marginBottom: 14 }}>{children}</div>
  );
  const Label = ({ icon, text }: { icon: any; text: string }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, fontWeight: 800, fontSize: "calc(1.2rem * var(--fz))" }}>
      <span style={{ color: "var(--gold)" }}><Icon name={icon} size={26} /></span>{text}
    </div>
  );
  const seg = (active: boolean) => ({ flex: 1, padding: "14px", borderRadius: 14, fontWeight: 700, fontSize: "calc(1rem * var(--fz))",
    background: active ? "var(--gold)" : "var(--surface-2)", color: active ? "#1a1206" : "var(--text)" });

  return (
    <div>
      <PageHeader title="Ajustes" subtitle="A tu medida" />
      <div style={{ padding: "8px 22px" }}>
        <Row>
          <Label icon={mode === "night" ? "moon" : "sun"} text="Apariencia" />
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setMode("night")} style={seg(mode === "night")}>🌙 Noche</button>
            <button onClick={() => setMode("day")} style={seg(mode === "day")}>☀️ Día</button>
          </div>
        </Row>
        <Row>
          <Label icon="list" text="Tamaño del texto" />
          <div style={{ display: "flex", gap: 10 }}>
            {sizes.map((s) => <button key={s.id} onClick={() => setTextSize(s.id)} style={seg(textSize === s.id)}>{s.label}</button>)}
          </div>
        </Row>
        <Row>
          <Label icon="timer" text="Temporizador de sueño" />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[15, 30, 45, 60].map((m) => (
              <button key={m} onClick={() => { startSleep(m); notify(`Se apagará en ${m} min`, "🌙"); }} style={{ ...seg(sleepMinutes === m), flex: "0 0 auto", minWidth: 80 }}>{m} min</button>
            ))}
            {sleepMinutes && <button onClick={() => { cancelSleep(); notify("Temporizador cancelado"); }} style={{ ...seg(false), flex: "0 0 auto" }}>Apagar</button>}
          </div>
        </Row>
        <Row>
          <Label icon="play" text="Spotify" />
          <div style={{ color: "var(--text-soft)", fontSize: "calc(0.95rem * var(--fz))", marginBottom: 12, lineHeight: 1.4 }}>
            {spotifyActive ? "Audio completo activado (cuenta Premium conectada)." : "Conecta tu cuenta Spotify Premium para escuchar canciones completas. Sin conexion suenan previews de 30s."}
          </div>
          <button onClick={() => { window.location.href = "/api/auth/spotify"; }} style={{ ...seg(true), width: "100%" }}>
            {spotifyActive ? "Reconectar Spotify" : "Iniciar sesion con Spotify"}
          </button>
        </Row>
        <Row>
          <Label icon="play" text="Reproducir en" />
          <div style={{ color: "var(--text-soft)", fontSize: "calc(0.95rem * var(--fz))", marginBottom: 12, lineHeight: 1.4 }}>
            {connectMode
              ? "Spotify Connect: controlas la app de Spotify de tu telefono (canciones completas)."
              : "Este dispositivo: suenan previews de 30s desde la app."}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setPlaybackMode("preview")} style={seg(!connectMode)}>Este dispositivo</button>
            <button onClick={() => setPlaybackMode("connect")} style={seg(connectMode)}>Spotify Connect</button>
          </div>
        </Row>
        <Row>
          <Label icon="bluetooth" text="Spotify Connect" />
          <div style={{ color: "var(--text-soft)", fontSize: "calc(0.95rem * var(--fz))", marginBottom: 12, lineHeight: 1.4 }}>
            {connectDevices.length > 0
              ? "Dispositivos detectados. Toca Usar para reproducir las canciones completas ahi."
              : "No detectamos dispositivos. Abre Spotify en tu telefono y vuelve a buscar."}
          </div>
          {connectDevices.map((d) => (
            <div key={d.id ?? d.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 14, background: "var(--surface-2)", marginBottom: 10 }}>
              <span style={{ color: "var(--gold)" }}><Icon name="play" size={22} /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: "calc(1rem * var(--fz))", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</div>
                <div style={{ color: "var(--text-soft)", fontSize: "calc(0.82rem * var(--fz))" }}>{d.type}{d.is_active ? " · activo" : ""}</div>
              </div>
              <button onClick={() => { useConnectDevice(d.id); }} style={{ ...seg(connectMode && connectDevices.length === 1), flex: "0 0 auto", padding: "10px 18px" }}>Usar</button>
            </div>
          ))}
          <button onClick={() => { void refreshDevices().then((ds) => notify(ds.length ? `${ds.length} dispositivo(s)` : "Abre Spotify en tu telefono", "🎧")); }} style={{ ...seg(false), width: "100%" }}>
            Buscar dispositivos
          </button>
          {!connectAvailable && (
            <div style={{ color: "var(--text-soft)", fontSize: "calc(0.82rem * var(--fz))", marginTop: 10, textAlign: "center" }}>
              Tip: tu telefono debe tener la sesion de Spotify de la casa abierta.
            </div>
          )}
        </Row>
        <button onClick={() => router.push("/bluetooth")} className="glass" style={{ width: "100%", borderRadius: 20, padding: 20, display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <span style={{ color: "var(--gold)" }}><Icon name="bluetooth" size={26} /></span>
          <span style={{ fontWeight: 800, fontSize: "calc(1.2rem * var(--fz))", flex: 1, textAlign: "left" }}>Conectar bocina Bluetooth</span>
          <Icon name="chevronRight" size={22} style={{ color: "var(--text-soft)" }} />
        </button>
        <button onClick={() => router.push("/radio")} className="glass" style={{ width: "100%", borderRadius: 20, padding: 20, display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ color: "var(--gold)" }}><Icon name="radio" size={26} /></span>
          <span style={{ fontWeight: 800, fontSize: "calc(1.2rem * var(--fz))", flex: 1, textAlign: "left" }}>Radio por década</span>
          <Icon name="chevronRight" size={22} style={{ color: "var(--text-soft)" }} />
        </button>
        <div style={{ textAlign: "center", color: "var(--text-soft)", fontSize: "calc(0.9rem * var(--fz))", marginTop: 26 }}>Decaciones · La música de tu vida</div>
      </div>
    </div>
  );
}
