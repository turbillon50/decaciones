"use client";
import PageHeader from "@/components/PageHeader";
import Icon from "@/components/Icon";

const steps = [
  { n: 1, title: "Enciende tu bocina", text: "Préndela y déjala en modo de emparejar (casi siempre la luz parpadea en azul)." },
  { n: 2, title: "Conéctala desde tu teléfono", text: "Abre los Ajustes de tu teléfono → Bluetooth → toca el nombre de tu bocina. Cuando diga “Conectado”, la música de Decaciones saldrá por ella." },
];

export default function BluetoothPage() {
  return (
    <div>
      <PageHeader title="Conectar bocina" subtitle="Para escuchar fuerte y claro" />
      <div style={{ padding: "8px 22px" }}>
        <div className="glass float-in" style={{ borderRadius: 22, padding: 24, textAlign: "center", marginBottom: 20 }}>
          <div style={{ color: "var(--gold)" }}><Icon name="bluetooth" size={54} /></div>
          <p style={{ color: "var(--text-soft)", fontSize: "calc(1.05rem * var(--fz))", marginTop: 12, lineHeight: 1.5 }}>
            La bocina Bluetooth se conecta desde tu teléfono, no desde la app. Es muy fácil, solo sigue estos 2 pasos:
          </p>
        </div>
        <div style={{ display: "grid", gap: 16 }}>
          {steps.map((s) => (
            <div key={s.n} className="glass" style={{ borderRadius: 22, padding: 22, display: "flex", gap: 18, alignItems: "flex-start" }}>
              <div style={{ flex: "0 0 auto", width: 52, height: 52, borderRadius: "50%", background: "var(--gold)", color: "#1a1206", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "calc(1.5rem * var(--fz))" }}>{s.n}</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "calc(1.25rem * var(--fz))" }}>{s.title}</div>
                <div style={{ color: "var(--text-soft)", fontSize: "calc(1.05rem * var(--fz))", marginTop: 6, lineHeight: 1.5 }}>{s.text}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="glass" style={{ borderRadius: 18, padding: 18, marginTop: 18, display: "flex", gap: 12, alignItems: "center", color: "var(--text-soft)", fontSize: "calc(0.95rem * var(--fz))" }}>
          <Icon name="speaker" size={26} style={{ flex: "0 0 auto", color: "var(--gold)" }} />
          <span>Una vez conectada, no necesitas hacer nada más aquí. Solo dale play y disfruta.</span>
        </div>
      </div>
    </div>
  );
}
