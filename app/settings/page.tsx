"use client";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/theme";
import { usePlayer } from "@/lib/player-store";
import { useToast } from "@/lib/toast";
import PageHeader from "@/components/PageHeader";
import Icon from "@/components/Icon";

export default function SettingsPage() {
  const router = useRouter();
  const { mode, setMode, textSize, setTextSize } = useTheme();
  const { sleepMinutes, startSleep, cancelSleep } = usePlayer();
  const { notify } = useToast();

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
          <Label icon="play" text="Reproduccion" />
          <div style={{ color: "var(--text-soft)", fontSize: "calc(0.95rem * var(--fz))", lineHeight: 1.4 }}>
            Las canciones suenan completas y con video, directo desde YouTube. No necesitas iniciar sesion ni instalar nada.
          </div>
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
