"use client";
import { motion } from "framer-motion";
import { decades } from "@/data/music";
import { usePlayer } from "@/lib/player-store";
import { useToast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Icon from "@/components/Icon";

export default function RadioPage() {
  const { playTrack } = usePlayer();
  const { notify } = useToast();
  const router = useRouter();
  const tune = (id: string) => {
    const d = decades.find((x) => x.id === id)!;
    const shuffled = [...d.tracks].sort(() => Math.random() - 0.5);
    playTrack(shuffled[0], shuffled);
    notify(`Sintonizando Radio ${d.label}`, "📻");
    router.push("/player");
  };
  return (
    <div>
      <PageHeader title="Radio por década" subtitle="Pon una estación y déjala sonar sin parar" />
      <div style={{ padding: "8px 22px", display: "grid", gap: 16 }}>
        {decades.map((d) => (
          <motion.button key={d.id} whileTap={{ scale: 0.97 }} onClick={() => tune(d.id)}
            style={{ position: "relative", height: 150, borderRadius: "var(--radius)", overflow: "hidden", boxShadow: "var(--shadow)", textAlign: "left" }}>
            <img src={d.image} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,0.78), rgba(0,0,0,0.15))" }} />
            <div style={{ position: "absolute", left: 22, top: "50%", transform: "translateY(-50%)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--gold-2)", fontWeight: 700, fontSize: "calc(0.85rem * var(--fz))" }}>
                <span className="pulse-soft" style={{ display: "inline-flex" }}><Icon name="radio" size={20} /></span> EN VIVO
              </div>
              <div style={{ color: "#fff", fontWeight: 900, fontSize: "calc(2rem * var(--fz))", lineHeight: 1 }}>Radio {d.label}</div>
              <div style={{ color: "rgba(255,255,255,0.82)", fontSize: "calc(0.95rem * var(--fz))", marginTop: 4 }}>{d.years}</div>
            </div>
            <div style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", width: 64, height: 64, borderRadius: "50%", background: "var(--gold)", color: "#1a1206", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="play" size={30} />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
